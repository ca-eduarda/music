require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const {
  getRecommendationByMoodWithSpotify
} = require("./services/spotifyMoodService");

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_FRONTEND_ORIGIN = "http://localhost:5173";
const MAX_MOOD_LENGTH = Number(process.env.MOOD_MAX_LENGTH) || 280;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || DEFAULT_FRONTEND_ORIGIN)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const moodLimiter = rateLimit({
  windowMs: Number(process.env.MOOD_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.MOOD_RATE_LIMIT_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a moment and try again."
  }
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS policy."));
    }
  })
);
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "10kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "music-backend" });
});

app.post("/api/mood", moodLimiter, async (req, res) => {
  const { mood } = req.body || {};

  if (!mood || typeof mood !== "string") {
    return res.status(400).json({
      error: "The 'mood' field is required and must be a string."
    });
  }

  const normalizedMood = mood.trim();
  if (!normalizedMood) {
    return res.status(400).json({
      error: "The 'mood' field cannot be empty."
    });
  }

  if (normalizedMood.length > MAX_MOOD_LENGTH) {
    return res.status(400).json({
      error: `The 'mood' field cannot exceed ${MAX_MOOD_LENGTH} characters.`
    });
  }

  const recommendation = await getRecommendationByMoodWithSpotify(normalizedMood);
  return res.status(200).json(recommendation);
});

app.use((error, _req, res, next) => {
  if (error.message === "Origin not allowed by CORS policy.") {
    return res.status(403).json({ error: error.message });
  }

  return next(error);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
