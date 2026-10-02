import { test, expect, type Page } from "@playwright/test";

/**
 * Public-page brand + smoke e2e. For every public marketing route, assert the
 * page renders, the reclaimed Coach Sam tagline anchors the footer, the
 * primary Request-a-Lesson CTA is reachable, and NO banned brand phrase shows
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
  "/programs/pickl-park",
  "/quiz",
  "/contact",
];

// Phrases that must never appear in visible rendered copy.
const BANNED_VISIBLE = [
  /better than yesterday/i,
  /director of programming/i,
  // Retired 2026-08-24 — the offer is gone, so it must not render anywhere.
  /free[\s-]*(30[\s-]*minute\s+)?(skill\s+|pickleball\s+)?eval/i,
];

async function visibleText(page: Page): Promise<string> {
  return (await page.locator("body").innerText()).toLowerCase();
}

for (const route of PUBLIC_ROUTES) {
  test.describe(`public page ${route}`, () => {
    test("renders, anchors the tagline, exposes the lesson CTA, no banned copy", async ({
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
        page.getByRole("link", { name: /request a lesson/i }).first(),
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

test.describe("Frederick coaching discovery", () => {
  for (const width of [375, 1280]) {
    test(`the homepage leads to Frederick classes at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await page.goto("/");
      const hero = page.locator("section").first();
      await expect(hero.getByRole("heading", { level: 1 })).toContainText("Frederick, MD");
      await expect(hero).toContainText("adult clinics at");
      const link = hero.getByRole("link", { name: "The Pickl Park", exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", "/programs/pickl-park");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await link.click();
      await expect(page).toHaveURL(/\/programs\/pickl-park$/);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Pickleball classes");
      await expect(page.getByText("Coach Sam · Frederick, MD")).toBeVisible();
      await expect(page.getByRole("link", { name: "See dates & register", exact: true }).first()).toHaveAttribute(
        "href", "https://thepicklpark.podplay.app/community/events?type=Clinics",
      );
      await expect(page.getByRole("link", { name: "Request a private lesson", exact: true })).toHaveAttribute(
        "href", /^https:\/\/coach\.sammorrispb\.com\/book\/private-lesson\?/,
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
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
