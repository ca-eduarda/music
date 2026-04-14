import { API_BASE_URL } from "@/lib/appConfig";

const BACKEND_CONNECTION_ERROR =
  "Could not connect to backend. Check VITE_API_URL and make sure the backend is running.";

export async function fetchMoodRecommendation(mood) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/mood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error || "Something went wrong.");
    }

    return payload;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(BACKEND_CONNECTION_ERROR);
    }

    throw error;
  }
}
