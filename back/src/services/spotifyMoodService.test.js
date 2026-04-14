const test = require("node:test");
const assert = require("node:assert/strict");

const { getRecommendationByMoodWithSpotify } = require("./spotifyMoodService");

test("returns fallback recommendation when Spotify API fails", async () => {
  const originalFetch = global.fetch;
  const originalClientId = process.env.SPOTIFY_CLIENT_ID;
  const originalClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  process.env.SPOTIFY_CLIENT_ID = "fake_client_id";
  process.env.SPOTIFY_CLIENT_SECRET = "fake_client_secret";
  global.fetch = async () => ({
    ok: false,
    json: async () => ({})
  });

  try {
    const response = await getRecommendationByMoodWithSpotify("happy");

    assert.equal(response.source, "fallback");
    assert.equal(Array.isArray(response.playlists), true);
    assert.equal(response.playlists.length > 0, true);
  } finally {
    global.fetch = originalFetch;
    process.env.SPOTIFY_CLIENT_ID = originalClientId;
    process.env.SPOTIFY_CLIENT_SECRET = originalClientSecret;
  }
});
