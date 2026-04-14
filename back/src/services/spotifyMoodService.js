const { detectMoodIntent, getFallbackRecommendation } = require("./moodService");

let tokenCache = {
  accessToken: null,
  expiresAt: 0
};

function hasSpotifyCredentials() {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET
  );
}

async function getSpotifyAccessToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials"
    })
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to get Spotify access token.");
  }

  const tokenPayload = await tokenResponse.json();
  tokenCache = {
    accessToken: tokenPayload.access_token,
    expiresAt: Date.now() + tokenPayload.expires_in * 1000 - 60_000
  };

  return tokenCache.accessToken;
}

async function searchSpotifyPlaylists(query, accessToken) {
  const params = new URLSearchParams({
    q: query,
    type: "playlist",
    limit: "5",
    market: "US"
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify search failed for query: ${query}`);
  }

  const payload = await response.json();
  return payload?.playlists?.items || [];
}

function mapPlaylist(playlist, reason) {
  return {
    name: playlist?.name || "Spotify Playlist",
    url: playlist?.external_urls?.spotify || "",
    reason,
    thumbnailUrl: playlist?.images?.[0]?.url || ""
  };
}

function dedupePlaylists(playlists, maxItems) {
  const seen = new Set();
  const result = [];

  for (const item of playlists) {
    if (!item.url || seen.has(item.url)) {
      continue;
    }
    seen.add(item.url);
    result.push(item);
    if (result.length >= maxItems) {
      break;
    }
  }

  return result;
}

async function getRecommendationByMoodWithSpotify(moodText) {
  const fallbackRecommendation = getFallbackRecommendation(moodText);

  if (!hasSpotifyCredentials()) {
    return fallbackRecommendation;
  }

  try {
    const intent = detectMoodIntent(moodText);
    const queries = intent?.searchTerms || fallbackRecommendation.playlists.map(
      (item) => item.reason.replace("Search term: ", "")
    );

    const accessToken = await getSpotifyAccessToken();
    const searchResults = await Promise.all(
      queries.map((query) => searchSpotifyPlaylists(query, accessToken))
    );

    const flattened = searchResults.flatMap((items, idx) =>
      items.map((playlist) =>
        mapPlaylist(
          playlist,
          `Matched by "${queries[idx]}" based on your mood keywords.`
        )
      )
    );

    const playlists = dedupePlaylists(flattened, 9);
    if (!playlists.length) {
      return fallbackRecommendation;
    }

    return {
      mood: fallbackRecommendation.mood,
      friendlyMessage:
        intent?.friendlyMessage ||
        "Here are Spotify playlists selected from your mood keywords.",
      playlists,
      source: "spotify"
    };
  } catch (_error) {
    return fallbackRecommendation;
  }
}

module.exports = {
  getRecommendationByMoodWithSpotify
};
