import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config for the public marketing site. Boots a production build of the
 * Next.js app and drives it in a real browser. Kept separate from the vitest
 * unit/SEO suites (those live under tests/; Playwright only looks in e2e/).
 */
const PORT = Number(process.env.E2E_PORT ?? 3210);
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : [["list"]],
  use: {
    baseURL: BASE,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // CI-safe: build then start. reuseExistingServer lets local iteration
    // attach to an already-running `next start` instead of rebuilding.
    command: `npm run build && npx next start -p ${PORT}`,
    url: BASE,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
