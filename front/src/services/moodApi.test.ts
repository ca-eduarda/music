import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchMoodRecommendation } from "./moodApi";

describe("fetchMoodRecommendation", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("fails with timeout message when request hangs", async () => {
    globalThis.fetch = vi.fn((_url, options?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        options?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The operation was aborted.", "AbortError"));
        });
      });
    }) as typeof fetch;

    const recommendationPromise = fetchMoodRecommendation("happy");
    const timeoutAssertion = expect(recommendationPromise).rejects.toThrow(
      "The request is taking too long. Please try again in a moment."
    );

    await vi.advanceTimersByTimeAsync(10001);
    await timeoutAssertion;
  });
});
