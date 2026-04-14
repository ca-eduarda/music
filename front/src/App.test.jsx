import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { fetchMoodRecommendation } from "@/services/moodApi";

vi.mock("@/services/moodApi", () => ({
  fetchMoodRecommendation: vi.fn(),
}));

function createDeferred() {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe("App mood form flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("goes from input to loading to result", async () => {
    const deferred = createDeferred();
    fetchMoodRecommendation.mockReturnValueOnce(deferred.promise);

    render(<App />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(
        "Example: I feel calm, creative and a little nostalgic."
      ),
      "  calm and focused  "
    );
    await user.click(screen.getByRole("button", { name: "Generate playlists" }));

    expect(fetchMoodRecommendation).toHaveBeenCalledWith("calm and focused");
    expect(screen.getByText("Preparing your music vibe...")).toBeInTheDocument();

    deferred.resolve({
      mood: "calm and focused",
      friendlyMessage: "Playlist selection ready.",
      playlists: [
        {
          name: "Focus Flow",
          reason: "Matched by your mood",
          url: "https://open.spotify.com/playlist/focus-flow"
        }
      ],
      source: "spotify"
    });

    await waitFor(() => {
      expect(screen.getByText("Your playlist grid is ready")).toBeInTheDocument();
    });
  });

  it("goes from input to loading to error", async () => {
    const deferred = createDeferred();
    fetchMoodRecommendation.mockReturnValueOnce(deferred.promise);

    render(<App />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(
        "Example: I feel calm, creative and a little nostalgic."
      ),
      "anxious"
    );
    await user.click(screen.getByRole("button", { name: "Generate playlists" }));

    expect(screen.getByText("Preparing your music vibe...")).toBeInTheDocument();

    deferred.reject(new Error("Backend unavailable"));

    await waitFor(() => {
      expect(screen.getByText("Backend unavailable")).toBeInTheDocument();
    });
  });
});
