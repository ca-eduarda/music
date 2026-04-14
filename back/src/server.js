require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  getRecommendationByMoodWithSpotify
} = require("./services/spotifyMoodService");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "music-backend" });
});

app.post("/api/mood", async (req, res) => {
  const { mood } = req.body || {};

  if (!mood || typeof mood !== "string") {
    return res.status(400).json({
      error: "The 'mood' field is required and must be a string."
    });
  }

  const recommendation = await getRecommendationByMoodWithSpotify(mood);
  return res.status(200).json(recommendation);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
