/**
 * SEO regression suite.
 *
 * Boots the Next.js production server once, fetches every key route, and
 * asserts the SEO contract Sam committed to during the 2026-05-24 audit:
 *
 *   - title ≤ 60 chars
 *   - description ≤ 160 chars
 *   - canonical present + self-referential
 *   - og:url present + matches canonical
 *   - exactly one <h1>
 *   - all JSON-LD blocks parse + contain expected @type
 *   - sitemap.xml includes /programs/coaching
 *
 * Requires the project to be built first (`next build`); the npm script
 * `test:seo` chains build + vitest run so CI can do it in one shot.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import * as cheerio from "cheerio";

const PORT = process.env.SEO_TEST_PORT
  ? Number(process.env.SEO_TEST_PORT)
  : 3100;
const BASE = `http://127.0.0.1:${PORT}`;
const CANONICAL_HOST = "https://www.sammorrispb.com";

// Routes covered by the audit. Each row is (url path, canonical path on the
// production domain). Most are self-referential; the home page canonical
// uses a trailing slash to match the og:url spec we shipped.
// Next.js' Metadata API normalizes the home canonical/og:url by stripping
// the trailing slash before serializing into <link>/<meta>, so we accept
// either "https://www.sammorrispb.com" or ".../" for the root route.
const ROUTES: {
  url: string;
  canonical: string;
  acceptableCanonicals?: string[];
  expectedJsonLdTypes: string[];
}[] = [
  {
    url: "/",
    canonical: `${CANONICAL_HOST}/`,
    acceptableCanonicals: [`${CANONICAL_HOST}/`, CANONICAL_HOST],
    expectedJsonLdTypes: ["Person", "SportsActivityLocation", "Organization", "FAQPage"],
  },
  {
    url: "/about",
    canonical: `${CANONICAL_HOST}/about`,
    expectedJsonLdTypes: ["BreadcrumbList", "ProfilePage", "VideoObject", "Person", "SportsActivityLocation", "Organization"],
  },
  {
    url: "/contact",
    canonical: `${CANONICAL_HOST}/contact`,
    expectedJsonLdTypes: ["BreadcrumbList", "Person", "SportsActivityLocation", "Organization"],
  },
  {
    url: "/programs/coaching",
    canonical: `${CANONICAL_HOST}/programs/coaching`,
    expectedJsonLdTypes: ["BreadcrumbList", "Service", "FAQPage", "Person", "SportsActivityLocation", "Organization"],
  },
];

let server: ChildProcess | null = null;

async function waitForServer(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`, { method: "HEAD" });
      if (res.status < 500) return;
    } catch {
      // server not up yet
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Next server never came up on ${BASE}`);
}

beforeAll(async () => {
  // Assumes the caller already ran `next build`. We spawn `next start` on
  // a dedicated test port so the suite doesn't collide with `npm run dev`.
  server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production" },
  });
  server.stderr?.on("data", (chunk) => {
    // Surface server errors in the test log to aid debugging.
    process.stderr.write(`[next start] ${chunk}`);
  });
  await waitForServer();
}, 120_000);

afterAll(() => {
  if (server && !server.killed) {
    server.kill("SIGTERM");
  }
});

describe("sitemap.xml", () => {
  it("includes /programs/coaching (key commercial page)", async () => {
    const res = await fetch(`${BASE}/sitemap.xml`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain(`${CANONICAL_HOST}/programs/coaching`);
  });

  it("lists every audited route", async () => {
    const res = await fetch(`${BASE}/sitemap.xml`);
    const body = await res.text();
    for (const route of ROUTES) {
      // Sitemap entries use absolute URLs; home is BASE without trailing /.
      const expected =
        route.url === "/" ? CANONICAL_HOST : `${CANONICAL_HOST}${route.url}`;
      expect(body).toContain(expected);
    }
  });
});

describe.each(ROUTES)("SEO contract: $url", ({ url, canonical, acceptableCanonicals, expectedJsonLdTypes }) => {
  const accepts = acceptableCanonicals ?? [canonical];
  let $: cheerio.CheerioAPI;

  beforeAll(async () => {
    const res = await fetch(`${BASE}${url}`, {
      redirect: "manual",
      headers: { "user-agent": "vitest-seo-suite" },
    });
    expect(res.status, `HTTP ${res.status} for ${url}`).toBe(200);
    const html = await res.text();
    $ = cheerio.load(html);
  });

  it("title is ≤60 chars and non-empty", () => {
    const title = $("title").first().text().trim();
    expect(title.length).toBeGreaterThan(0);
    expect(title.length, `title too long: "${title}" (${title.length} chars)`).toBeLessThanOrEqual(60);
  });

  it("meta description is ≤160 chars and non-empty", () => {
    const desc = $('meta[name="description"]').attr("content")?.trim() ?? "";
    expect(desc.length, "description missing").toBeGreaterThan(0);
    expect(
      desc.length,
      `description too long: "${desc}" (${desc.length} chars)`,
    ).toBeLessThanOrEqual(160);
  });

  it("canonical link is present and self-referential", () => {
    const href = $('link[rel="canonical"]').attr("href")?.trim() ?? "";
    expect(accepts, `canonical was "${href}", expected one of ${accepts.join(", ")}`).toContain(href);
  });

  it("og:url is present and matches canonical", () => {
    const ogUrl = $('meta[property="og:url"]').attr("content")?.trim() ?? "";
    const canonicalHref = $('link[rel="canonical"]').attr("href")?.trim() ?? "";
    expect(accepts, `og:url was "${ogUrl}", expected one of ${accepts.join(", ")}`).toContain(ogUrl);
    // og:url and canonical should agree (audit's headline gripe on home).
    expect(ogUrl).toBe(canonicalHref);
  });

  it("renders exactly one <h1>", () => {
    const count = $("h1").length;
    expect(count, `expected 1 h1, found ${count}`).toBe(1);
  });

  it("all JSON-LD blocks parse + include the expected @type set", () => {
    const blocks = $('script[type="application/ld+json"]');
    expect(blocks.length, "no JSON-LD blocks").toBeGreaterThan(0);

    const types = new Set<string>();
    blocks.each((_, el) => {
      const raw = $(el).contents().text();
      let parsed: unknown;
      expect(() => (parsed = JSON.parse(raw)), `invalid JSON-LD on ${url}`).not.toThrow();
      collectTypes(parsed, types);
    });

    for (const expected of expectedJsonLdTypes) {
      expect(
        types.has(expected),
        `expected JSON-LD @type "${expected}" on ${url}; saw ${[...types].join(", ")}`,
      ).toBe(true);
    }
  });
});

describe("sitewide JSON-LD hygiene", () => {
  it("FAQPage JSON-LD does NOT appear on /about (Google policy: only pages with visible FAQ)", async () => {
    const res = await fetch(`${BASE}/about`);
    const $ = cheerio.load(await res.text());
    const types = new Set<string>();
    $('script[type="application/ld+json"]').each((_, el) => {
      collectTypes(JSON.parse($(el).contents().text()), types);
    });
    expect(types.has("FAQPage")).toBe(false);
  });

  it("FAQPage JSON-LD does NOT appear on /contact", async () => {
    const res = await fetch(`${BASE}/contact`);
    const $ = cheerio.load(await res.text());
    const types = new Set<string>();
    $('script[type="application/ld+json"]').each((_, el) => {
      collectTypes(JSON.parse($(el).contents().text()), types);
    });
    expect(types.has("FAQPage")).toBe(false);
  });

  it("SportsActivityLocation JSON-LD carries a geo block", async () => {
    const res = await fetch(`${BASE}/`);
    const $ = cheerio.load(await res.text());
    let found: { latitude: number; longitude: number } | null = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      const obj = JSON.parse($(el).contents().text());
      if (obj?.["@type"] === "SportsActivityLocation" && obj?.geo) {
        found = {
          latitude: Number(obj.geo.latitude),
          longitude: Number(obj.geo.longitude),
        };
      }
    });
    expect(found, "SportsActivityLocation.geo missing").not.toBeNull();
    expect(found!.latitude).toBeCloseTo(39.1532, 3);
    expect(found!.longitude).toBeCloseTo(-77.0697, 3);
  });
});

/**
 * Recursively collect every `@type` value out of a JSON-LD payload (objects
 * or arrays). Handles the `@type: ["a","b"]` form and nested entities.
 */
function collectTypes(node: unknown, out: Set<string>): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) collectTypes(item, out);
    return;
  }
  const obj = node as Record<string, unknown>;
  const t = obj["@type"];
  if (typeof t === "string") out.add(t);
  else if (Array.isArray(t)) for (const v of t) if (typeof v === "string") out.add(v);
  for (const v of Object.values(obj)) collectTypes(v, out);
}
