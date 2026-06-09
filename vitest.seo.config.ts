import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Dedicated config for the SEO regression suite. The default `vitest.config.ts`
 * EXCLUDES tests/seo.spec.ts (so the fast unit pass skips the heavy real-server
 * boot); this config includes only that file. Driven by `npm run test:seo`,
 * which runs `next build` first.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(here, "src"),
    },
  },
  test: {
    include: ["tests/seo.spec.ts"],
    testTimeout: 60_000,
    hookTimeout: 120_000,
    fileParallelism: false,
  },
});
