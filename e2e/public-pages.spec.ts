import { test, expect, type Page } from "@playwright/test";

/**
 * Public-page brand + smoke e2e. For every public marketing route, assert the
 * page renders, the reclaimed Coach Sam tagline anchors the footer, the
 * primary Free-Evaluation CTA is reachable, and NO banned brand phrase shows
 * up in the rendered DOM. This is the in-browser counterpart to the
 * source-level guardrails in tests/brand/.
 */

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/programs",
  "/programs/coaching",
  "/programs/cohort",
  "/programs/events",
  "/evaluation",
  "/quiz",
  "/contact",
];

// Phrases that must never appear in visible rendered copy.
const BANNED_VISIBLE = [/better than yesterday/i, /director of programming/i];

async function visibleText(page: Page): Promise<string> {
  return (await page.locator("body").innerText()).toLowerCase();
}

for (const route of PUBLIC_ROUTES) {
  test.describe(`public page ${route}`, () => {
    test("renders, anchors the tagline, exposes the eval CTA, no banned copy", async ({
      page,
    }) => {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.status(), `${route} HTTP status`).toBeLessThan(400);

      // Page actually rendered content (at least one heading).
      await expect(page.locator("h1, h2").first()).toBeVisible();

      // Reclaimed Coach Sam tagline lives in the footer on every page.
      await expect(
        page.getByText(/Helping families grow through sport/i).first(),
      ).toBeVisible();

      // Primary funnel CTA is always reachable from the nav.
      await expect(
        page.getByRole("link", { name: /free evaluation/i }).first(),
      ).toBeVisible();

      // No banned brand phrase in the rendered DOM.
      const text = await visibleText(page);
      for (const banned of BANNED_VISIBLE) {
        expect(banned.test(text), `${route} contains banned phrase ${banned}`).toBe(
          false,
        );
      }
    });
  });
}

test.describe("home hero", () => {
  test("leads with the reclaimed tagline and the SEO headline", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/Helping families grow through sport — one rally at a time/i).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: /Montgomery County/i }),
    ).toBeVisible();
  });
});

test.describe("about page", () => {
  test("shows verifiable credentials, not the DD title or unverified founder count", async ({
    page,
  }) => {
    await page.goto("/about");
    const text = await visibleText(page);
    expect(text).not.toContain("director of programming");
    expect(text).not.toContain("three-time founder");
    // The real credential stack is present.
    await expect(page.getByText(/M\.S\. Coaching/i).first()).toBeVisible();
  });
});
