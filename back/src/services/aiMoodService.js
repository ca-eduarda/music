const OpenAI = require("openai");
const {
  normalizeMood,
  buildSpotifySearchUrl,
  getFallbackRecommendation
} = require("./moodService");

let openaiClient = null;

function getOpenAIClient() {
  if (openaiClient) {
    return openaiClient;
  }

  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return openaiClient;
}

function parseModelJson(content) {
  if (!content) {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch (_error) {
    return null;
  }
}

function normalizePlaylists(playlists) {
  if (!Array.isArray(playlists)) {
    return [];
  }

  return playlists
    .map((item) => {
      const name = String(item?.name || "").trim();
      const reason = String(item?.reason || "").trim();
      const searchQuery = String(item?.searchQuery || "").trim();
      if (!name || !searchQuery) {
        return null;
      }

      return {
        name,
        reason:
          reason ||
          "Suggested by AI based on your current mood and music intent.",
        url: buildSpotifySearchUrl(searchQuery)
      };
    })
    .filter(Boolean)
    .slice(0, 5);
}

async function getRecommendationByMoodWithAI(moodText) {
  const fallbackRecommendation = getFallbackRecommendation(moodText);

  if (!process.env.OPENAI_API_KEY) {
    return fallbackRecommendation;
  }

  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a music recommendation assistant. Return ONLY valid JSON with keys: friendlyMessage (string) and playlists (array of 3 objects). Each playlist object must contain: name (string), searchQuery (string for Spotify search), reason (string). Keep friendlyMessage short and warm."
        },
        {
          role: "user",
          content: `User mood: "${moodText}"`
        }
      ]
    });

    const content = completion?.choices?.[0]?.message?.content;
    const parsed = parseModelJson(content);
    if (!parsed || !parsed.friendlyMessage || !Array.isArray(parsed.playlists)) {
      return fallbackRecommendation;
    }

    const playlists = normalizePlaylists(parsed.playlists);
    if (!playlists.length) {
      return fallbackRecommendation;
    }

    return {
      mood: normalizeMood(moodText),
      friendlyMessage: String(parsed.friendlyMessage).trim(),
      playlists,
      source: "ai"
    };
  } catch (_error) {
    return fallbackRecommendation;
  }
}

module.exports = {
  getRecommendationByMoodWithAI
};
