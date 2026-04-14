const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("./server");

test("GET /health returns service status", async () => {
  const app = createApp();

  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    status: "ok",
    service: "music-backend"
  });
});

test("POST /api/mood returns recommendation on success", async () => {
  const captured = [];
  const mockRecommendation = {
    mood: "calm",
    friendlyMessage: "Here are playlists for your mood.",
    playlists: [],
    source: "spotify"
  };
  const app = createApp({
    getRecommendationByMoodWithSpotify: async (mood) => {
      captured.push(mood);
      return mockRecommendation;
    }
  });

  const response = await request(app)
    .post("/api/mood")
    .send({ mood: "  calm and focused  " });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, mockRecommendation);
  assert.deepEqual(captured, ["calm and focused"]);
});

test("POST /api/mood returns 400 when mood is missing", async () => {
  const app = createApp();

  const response = await request(app).post("/api/mood").send({});

  assert.equal(response.status, 400);
  assert.equal(
    response.body.error,
    "The 'mood' field is required and must be a string."
  );
});

test("POST /api/mood returns 400 when mood is empty", async () => {
  const app = createApp();

  const response = await request(app).post("/api/mood").send({ mood: "   " });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "The 'mood' field cannot be empty.");
});

test("POST /api/mood returns 429 when rate limit is exceeded", async () => {
  const app = createApp({
    rateLimitMax: 2,
    rateLimitWindowMs: 60_000,
    getRecommendationByMoodWithSpotify: async () => ({
      mood: "test",
      friendlyMessage: "ok",
      playlists: [],
      source: "spotify"
    })
  });

  await request(app).post("/api/mood").send({ mood: "happy" }).expect(200);
  await request(app).post("/api/mood").send({ mood: "happy" }).expect(200);
  const response = await request(app).post("/api/mood").send({ mood: "happy" });

  assert.equal(response.status, 429);
  assert.equal(
    response.body.error,
    "Too many requests. Please wait a moment and try again."
  );
});

test("POST /api/mood returns 500 when recommendation service fails", async () => {
  const app = createApp({
    getRecommendationByMoodWithSpotify: async () => {
      throw new Error("Unexpected service failure");
    }
  });

  const response = await request(app).post("/api/mood").send({ mood: "happy" });

  assert.equal(response.status, 500);
  assert.equal(
    response.body.error,
    "Could not generate a recommendation right now. Please try again."
  );
});

test("CORS allows FRONTEND_ORIGIN configured with trailing slash", async () => {
  const app = createApp({
    frontendOrigin: "https://music-moods.vercel.app/"
  });

  const response = await request(app)
    .post("/api/mood")
    .set("Origin", "https://music-moods.vercel.app")
    .send({ mood: "happy" });

  assert.notEqual(response.status, 403);
});
