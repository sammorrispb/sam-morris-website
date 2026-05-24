import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    // The SEO tests boot a real Next.js production server in beforeAll,
    // which dwarfs the default 5s per-test budget. 60s gives the build +
    // boot + per-route fetch headroom on cold runs.
    testTimeout: 60_000,
    hookTimeout: 120_000,
    // Run files serially so we don't spin up multiple Next servers fighting
    // over :3100.
    fileParallelism: false,
  },
});
