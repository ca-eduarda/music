import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchMoodRecommendation } from "./moodApi";

describe("fetchMoodRecommendation", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it("fails with timeout message when request hangs", async () => {
    global.fetch = vi.fn((_url, options) => {
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener("abort", () => {
          const abortError = new Error("The operation was aborted.");
          abortError.name = "AbortError";
          reject(abortError);
        });
      });
    });

    const recommendationPromise = fetchMoodRecommendation("happy");
    const timeoutAssertion = expect(recommendationPromise).rejects.toThrow(
      "The request is taking too long. Please try again in a moment."
    );

    await vi.advanceTimersByTimeAsync(10001);
    await timeoutAssertion;
  });
});
