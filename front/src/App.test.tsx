import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { fetchMoodRecommendation } from "@/services/moodApi";
import type { MoodRecommendation } from "@/types/mood";

vi.mock("@/services/moodApi", () => ({
  fetchMoodRecommendation: vi.fn()
}));

function createDeferred() {
  let resolve: (value: MoodRecommendation) => void;
  let reject: (reason?: unknown) => void;

  const promise = new Promise<MoodRecommendation>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve: resolve!,
    reject: reject!
  };
}

describe("App mood form flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("goes from input to loading to result", async () => {
    const deferred = createDeferred();
    vi.mocked(fetchMoodRecommendation).mockReturnValueOnce(deferred.promise);

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
    vi.mocked(fetchMoodRecommendation).mockReturnValueOnce(deferred.promise);

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

  it("shows error when backend returns invalid payload", async () => {
    vi.mocked(fetchMoodRecommendation).mockRejectedValueOnce(
      new Error("Received an invalid response from backend.")
    );

    render(<App />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(
        "Example: I feel calm, creative and a little nostalgic."
      ),
      "happy"
    );
    await user.click(screen.getByRole("button", { name: "Generate playlists" }));

    await waitFor(() => {
      expect(
        screen.getByText("Received an invalid response from backend.")
      ).toBeInTheDocument();
    });
  });
});
