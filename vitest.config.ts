import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(here, "src"),
    },
  },
  test: {
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    // seo.spec.ts boots a real Next.js production server and only works
    // after `next build`. The `test:seo` script chains build + that file
    // explicitly; the default `test` run skips it so unit tests can be
    // fast on every CI/PR.
    exclude: ["node_modules/**", "tests/seo.spec.ts"],
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
