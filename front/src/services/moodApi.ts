import { API_BASE_URL } from "@/lib/appConfig";
import type { MoodRecommendation } from "@/types/mood";

const BACKEND_CONNECTION_ERROR =
  "Could not connect to backend. Check VITE_API_URL and make sure the backend is running.";
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 10000;
const BACKEND_TIMEOUT_ERROR =
  "The request is taking too long. Please try again in a moment.";

function isMoodRecommendation(payload: unknown): payload is MoodRecommendation {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as MoodRecommendation;
  return (
    typeof candidate.friendlyMessage === "string" &&
    typeof candidate.mood === "string" &&
    typeof candidate.source === "string" &&
    Array.isArray(candidate.playlists)
  );
}

export async function fetchMoodRecommendation(mood: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/mood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mood }),
      signal: controller.signal
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? String(payload.error)
          : "Something went wrong.";
      throw new Error(message);
    }

    if (!isMoodRecommendation(payload)) {
      throw new Error("Received an invalid response from backend.");
    }

    return payload;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "AbortError"
    ) {
      throw new Error(BACKEND_TIMEOUT_ERROR);
    }

    if (error instanceof TypeError) {
      throw new Error(BACKEND_CONNECTION_ERROR);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
