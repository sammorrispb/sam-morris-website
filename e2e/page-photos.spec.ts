import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const evidence = process.env.PHOTO_REVIEW_DIR ?? "test-results/photo-review";
const routes = ["/", "/about", "/contact", "/programs", "/programs/coaching", "/programs/cohort", "/programs/events", "/programs/pickl-park", "/blog", "/quiz", "/programs/cohort/signup", "/programs/cohort/signup/confirmed"];

for (const width of [375, 1280]) {
  test(`all public photography decodes and preserves actions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const results = [];
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      const photo = page.locator(`[data-page-photo="${route}"]`);
      await expect(photo).toHaveCount(1);
      await photo.scrollIntoViewIfNeeded();
      await expect(photo.locator("img")).toBeVisible();
      await expect.poll(() => photo.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const metrics = await photo.evaluate(figure => {
        const img = figure.querySelector("img")!;
        const rect = figure.getBoundingClientRect();
        return { left: rect.left, right: rect.right, image: img.getAttribute("src"), alt: img.alt, width: img.naturalWidth, height: img.naturalHeight };
      });
      expect(metrics.left).toBeGreaterThanOrEqual(0);
      expect(metrics.right).toBeLessThanOrEqual(width);
      await expect(page.getByRole("link", { name: /request a lesson/i }).first()).toBeVisible();
      if (route === "/programs/cohort/signup") {
        const order = await page.evaluate(() => !!(document.querySelector("form")!.compareDocumentPosition(document.querySelector("[data-page-photo]")!) & Node.DOCUMENT_POSITION_FOLLOWING));
        expect(order).toBe(true);
      }
      if (route === "/programs/cohort/signup/confirmed") {
        await expect(page.getByRole("heading", {name: "You're on the list."})).toBeVisible();
        await expect(page.getByRole("link", { name: "Back to cohort details" })).toBeVisible();
      }
      mkdirSync(evidence, { recursive: true });
      if (["/", "/about", "/programs/coaching", "/programs/events", "/contact", "/programs/cohort/signup/confirmed"].includes(route)) {
        await page.locator("h1").scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${evidence}/${route.replaceAll("/", "-") || "home"}-${width}.png` });
      }
      results.push({ route, status: response?.status(), ...metrics, overflow: false });
    }
    await page.goto("/lessons/confirm");
    await expect(page.getByRole("heading", {name: "Link not found"})).toBeVisible();
    await expect(page.locator("[data-page-photo]")).toHaveCount(0);
    writeFileSync(`${evidence}/browser-${width}.json`, JSON.stringify(results, null, 2));
  });
}
