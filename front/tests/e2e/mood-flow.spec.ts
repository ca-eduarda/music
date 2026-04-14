import { expect, test } from "@playwright/test";

test.describe("Mood form E2E flow", () => {
  test("submits mood and renders recommendations", async ({ page }) => {
    await page.route("**/api/mood", async (route) => {
      const method = route.request().method();

      if (method === "OPTIONS") {
        await route.fulfill({ status: 204 });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          mood: "happy",
          friendlyMessage: "Playlist selection ready.",
          playlists: [
            {
              name: "Focus Flow",
              reason: "Matched by your mood",
              url: "https://open.spotify.com/playlist/focus-flow",
              thumbnailUrl: ""
            }
          ],
          source: "spotify"
        })
      });
    });

    await page.goto("/");
    await page.getByLabel("Describe your mood").fill("happy and focused");
    await page.getByRole("button", { name: "Generate playlists" }).click();

    await expect(
      page.getByRole("heading", { name: "Your playlist grid is ready" })
    ).toBeVisible();
    await expect(page.getByText("Playlist selection ready.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Open on Spotify" })).toBeVisible();
  });

  test("shows API error message and returns to input", async ({ page }) => {
    await page.route("**/api/mood", async (route) => {
      const method = route.request().method();

      if (method === "OPTIONS") {
        await route.fulfill({ status: 204 });
        return;
      }

      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Backend unavailable"
        })
      });
    });

    await page.goto("/");
    await page.getByLabel("Describe your mood").fill("anxious");
    await page.getByRole("button", { name: "Generate playlists" }).click();

    await expect(page.getByText("Backend unavailable")).toBeVisible();
    await expect(page.getByLabel("Describe your mood")).toBeVisible();
  });
});
