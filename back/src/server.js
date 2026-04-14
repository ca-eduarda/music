require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const {
  getRecommendationByMoodWithSpotify
} = require("./services/spotifyMoodService");

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/+$/, "");
}

function createApp(options = {}) {
  const app = express();
  const DEFAULT_FRONTEND_ORIGIN = "http://localhost:5173";
  const isProduction = process.env.NODE_ENV === "production";
  const configuredFrontendOrigin =
    options.frontendOrigin || process.env.FRONTEND_ORIGIN;
  if (isProduction && !configuredFrontendOrigin) {
    throw new Error("FRONTEND_ORIGIN must be set in production.");
  }

  const config = {
    frontendOrigin: configuredFrontendOrigin || DEFAULT_FRONTEND_ORIGIN,
    maxMoodLength: Number(options.maxMoodLength || process.env.MOOD_MAX_LENGTH) || 280,
    rateLimitWindowMs:
      Number(options.rateLimitWindowMs || process.env.MOOD_RATE_LIMIT_WINDOW_MS) ||
      15 * 60 * 1000,
    rateLimitMax: Number(options.rateLimitMax || process.env.MOOD_RATE_LIMIT_MAX) || 30,
    jsonBodyLimit: options.jsonBodyLimit || process.env.JSON_BODY_LIMIT || "10kb"
  };
  const recommendationService =
    options.getRecommendationByMoodWithSpotify || getRecommendationByMoodWithSpotify;

  const allowedOrigins = config.frontendOrigin
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  const moodLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too many requests. Please wait a moment and try again."
    }
  });

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
          return callback(null, true);
        }

        return callback(new Error("Origin not allowed by CORS policy."));
      }
    })
  );
  app.use(
    morgan(process.env.LOG_FORMAT || "dev", {
      skip(req) {
        return req.path === "/health";
      }
    })
  );
  app.use(express.json({ limit: config.jsonBodyLimit }));

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

    if (normalizedMood.length > config.maxMoodLength) {
      return res.status(400).json({
        error: `The 'mood' field cannot exceed ${config.maxMoodLength} characters.`
      });
    }

    try {
      const recommendation = await recommendationService(normalizedMood);
      return res.status(200).json(recommendation);
    } catch (_error) {
      return res.status(500).json({
        error: "Could not generate a recommendation right now. Please try again."
      });
    }
  });

  app.use((error, _req, res, next) => {
    if (error.message === "Origin not allowed by CORS policy.") {
      return res.status(403).json({ error: error.message });
    }
    return next(error);
  });

  app.use((_error, _req, res, _next) => {
    return res.status(500).json({ error: "Internal server error." });
  });

  return app;
}

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

module.exports = {
  createApp
};
