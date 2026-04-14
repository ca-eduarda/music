function normalizeMood(input) {
  return String(input || "")
    .trim()
    .toLowerCase();
}

function buildSpotifySearchUrl(query) {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}

function getFallbackRecommendation(moodText) {
  const normalizedMood = normalizeMood(moodText);
  const safeMood = normalizedMood || "any mood";

  return {
    mood: normalizedMood,
    friendlyMessage:
      "I could not generate AI suggestions right now, so I prepared quick Spotify searches based on your mood.",
    playlists: [
      {
        name: "Mood Match Mix",
        url: buildSpotifySearchUrl(`${safeMood} mood mix`),
        reason: "A broad match for the mood you described."
      },
      {
        name: "Top Songs for Your Mood",
        url: buildSpotifySearchUrl(`${safeMood} top songs`),
        reason: "Popular tracks related to your current vibe."
      },
      {
        name: "Fresh Picks",
        url: buildSpotifySearchUrl(`${safeMood} new music`),
        reason: "New discoveries inspired by your mood."
      }
    ],
    source: "fallback"
  };
}

module.exports = {
  normalizeMood,
  buildSpotifySearchUrl,
  getFallbackRecommendation
};
