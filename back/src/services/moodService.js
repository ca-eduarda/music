const moodProfiles = [
  {
    keywords: ["happy", "energetic", "excited", "good", "uplifted", "great"],
    playlist: {
      name: "Good Vibes",
      url: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC"
    },
    message:
      "Love that energy! I picked a playlist to keep your vibe high."
  },
  {
    keywords: ["sad", "tired", "down", "bad", "low", "upset"],
    playlist: {
      name: "Soft & Calm",
      url: "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1"
    },
    message:
      "I understand how you feel. Here is a calmer playlist to keep you company."
  },
  {
    keywords: ["focused", "studying", "concentrated", "working", "focus"],
    playlist: {
      name: "Deep Focus",
      url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ"
    },
    message:
      "Focus mode on. I chose a playlist to help your concentration."
  }
];

const fallbackProfile = {
  playlist: {
    name: "Mood Booster",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0"
  },
  message:
    "Thanks for sharing your mood. I chose a versatile playlist for your moment."
};

function normalizeMood(input) {
  return String(input || "")
    .trim()
    .toLowerCase();
}

function getRecommendationByMood(moodText) {
  const normalizedMood = normalizeMood(moodText);

  const profile = moodProfiles.find((item) =>
    item.keywords.some((keyword) => normalizedMood.includes(keyword))
  );

  return {
    mood: normalizedMood,
    friendlyMessage: (profile || fallbackProfile).message,
    playlist: (profile || fallbackProfile).playlist
  };
}

module.exports = {
  getRecommendationByMood
};
