export interface MoodIntent {
  id: string;
  keywords: string[];
  friendlyMessage: string;
  searchTerms: string[];
}

export interface PlaylistItem {
  name: string;
  url: string;
  reason: string;
  thumbnailUrl?: string;
}

export interface MoodRecommendation {
  mood: string;
  friendlyMessage: string;
  playlists: PlaylistItem[];
  source: "spotify" | "fallback" | string;
}

export function normalizeMood(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase();
}

export function buildSpotifySearchUrl(query: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}

const moodIntents: MoodIntent[] = [
  {
    id: "happy",
    keywords: ["happy", "excited", "great", "good", "upbeat", "joy"],
    friendlyMessage:
      "You sound upbeat. I picked energetic playlists to keep your vibe high.",
    searchTerms: ["happy hits", "feel good pop", "upbeat playlist"]
  },
  {
    id: "calm",
    keywords: ["sad", "tired", "down", "anxious", "calm", "chill"],
    friendlyMessage:
      "I hear you. I selected calmer playlists for a smoother mood.",
    searchTerms: ["calm vibes", "chill acoustic", "soft chill playlist"]
  },
  {
    id: "focus",
    keywords: ["focus", "study", "work", "coding", "concentrate"],
    friendlyMessage:
      "Focus mode on. Here are playlists designed to help concentration.",
    searchTerms: ["deep focus", "study beats", "instrumental focus"]
  },
  {
    id: "workout",
    keywords: ["gym", "workout", "run", "training", "energy"],
    friendlyMessage:
      "Let's boost your energy. I selected high-tempo workout playlists.",
    searchTerms: ["workout mix", "running music", "gym motivation"]
  }
];

export function detectMoodIntent(moodText: string) {
  const normalizedMood = normalizeMood(moodText);
  return (
    moodIntents.find((intent) =>
      intent.keywords.some((keyword) => normalizedMood.includes(keyword))
    ) || null
  );
}

export function getFallbackRecommendation(moodText: string): MoodRecommendation {
  const normalizedMood = normalizeMood(moodText);
  const intent = detectMoodIntent(normalizedMood);
  const safeMood = normalizedMood || "any mood";
  const searchTerms = intent?.searchTerms || [
    `${safeMood} mood mix`,
    `${safeMood} top songs`,
    `${safeMood} new music`
  ];

  return {
    mood: normalizedMood,
    friendlyMessage:
      intent?.friendlyMessage ||
      "I prepared Spotify recommendations based on your mood keywords.",
    playlists: searchTerms.map((term, index) => ({
      name: `Mood Search ${index + 1}`,
      url: buildSpotifySearchUrl(term),
      reason: `Search term: ${term}`
    })),
    source: "fallback"
  };
}
