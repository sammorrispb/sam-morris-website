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
import { PRICING } from "../src/lib/coaching";
import { COACH_REQUEST_URL, FREDERICK_VENUE } from "../src/lib/constants";

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
    // FAQPage intentionally NOT expected on "/": the simplified landing no longer
    // renders FAQ-equivalent visible content, and Google's FAQPage policy only
    // permits the markup where the answers are visible. It lives on
    // /programs/coaching, which still shows them.
    expectedJsonLdTypes: ["Person", "Organization"],
  },
  {
    url: "/about",
    canonical: `${CANONICAL_HOST}/about`,
    expectedJsonLdTypes: ["BreadcrumbList", "ProfilePage", "Person", "Organization"],
  },
  {
    url: "/contact",
    canonical: `${CANONICAL_HOST}/contact`,
    expectedJsonLdTypes: ["BreadcrumbList", "Person", "Organization"],
  },
  {
    url: "/programs/coaching",
    canonical: `${CANONICAL_HOST}/programs/coaching`,
    expectedJsonLdTypes: ["BreadcrumbList", "Service", "FAQPage", "Person", "Organization"],
  },
  {
    url: "/programs/pickl-park",
    canonical: `${CANONICAL_HOST}/programs/pickl-park`,
    expectedJsonLdTypes: ["BreadcrumbList", "FAQPage", "Person", "Organization"],
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

  for (const route of ROUTES) {
    it(`${route.url} keeps distinct coach, business and academy identities without a manufactured facility`, async () => {
      const $ = cheerio.load(await (await fetch(`${BASE}${route.url}`)).text());
      const blocks = jsonLdBlocks($);
      const people = blocks.filter((node) => node["@type"] === "Person");
      expect(people).toHaveLength(1);
      const person = people[0];
      expect(person["@id"]).toBe(`${CANONICAL_HOST}/#person`);
      expect(person.description).toMatch(/The Pickl Park in Frederick/);
      expect(person.description).toMatch(/ages 6–16/);
      expect(person.affiliation).toEqual({
        "@type": "SportsOrganization", "@id": "https://nextgenpbacademy.com/#organization",
        name: "Next Gen Pickleball Academy", url: "https://nextgenpbacademy.com",
      });
      const organizations = blocks.filter((node) => node["@type"] === "Organization");
      expect(organizations).toHaveLength(1);
      const org = organizations[0];
      expect(org["@id"]).toBe(`${CANONICAL_HOST}/#organization`);
      expect(org.founder).toEqual({ "@id": `${CANONICAL_HOST}/#person` });
      expect(org.description).toMatch(/The Pickl Park in Frederick/);
      expect(org).not.toHaveProperty("location");
      expect(org).not.toHaveProperty("geo");
      expect(org).not.toHaveProperty("hasOfferCatalog");
      for (const entity of [person, org]) {
        const profiles = entity.sameAs as string[];
        expect(profiles).toContain("https://instagram.com/sammorris.pb");
        expect(profiles.some((profile) => /(?:nextgenpbacademy|linkanddink)\.com/.test(profile))).toBe(false);
      }
      const mapsProfile = "https://www.google.com/maps/place/Sam+Morris+Pickleball+Coaching/data=!4m2!3m1!1s0x0:0x38cdd944077fe2e";
      expect(org.sameAs).toContain(mapsProfile);
      expect(person.sameAs).not.toContain(mapsProfile);
      const raw = JSON.stringify(blocks);
      expect(raw).not.toContain("SportsActivityLocation");
      expect(raw).not.toContain("#location");
      expect(raw).not.toContain("39.1532");
      expect(raw).not.toContain("-77.0697");
    });
  }
});

describe("Frederick coaching discovery", () => {
  it("home metadata names both areas and qualifies Frederick with The Pickl Park", async () => {
    const $ = cheerio.load(await (await fetch(`${BASE}/`)).text());
    expect($("title").text()).toMatch(/Montgomery.*Frederick/i);
    expect($("title").text()).toMatch(/pickleball lessons/i);
    const description = $('meta[name="description"]').attr("content") ?? "";
    expect(description).toMatch(/Montgomery County, MD/);
    expect(description).toMatch(/The Pickl Park in Frederick/);
    expect(description).toMatch(/adult clinics/);
    expect($("h1").text()).toMatch(/Montgomery County.*Frederick, MD/);
    expect($('a[href="/programs/pickl-park"]').length).toBeGreaterThan(0);
  });

  it("the Frederick page describes lessons and clinics without claiming a DUPR assessment", async () => {
    const $ = cheerio.load(await (await fetch(`${BASE}/programs/pickl-park`)).text());
    expect($("title").text()).toMatch(/Frederick.*Pickleball Lessons.*Clinics/i);
    const description = $('meta[name="description"]').attr("content") ?? "";
    expect(description).toMatch(/private pickleball lessons/i);
    expect(description).toMatch(/group clinics/i);
    expect(description).toMatch(/skills assessments/i);
    expect(description).toMatch(/The Pickl Park in Frederick, MD/);
    expect(description).not.toMatch(/DUPR/i);
  });

  for (const route of ["/", "/programs/pickl-park"]) {
    it(`${route} social cards match its own title and description`, async () => {
      const $ = cheerio.load(await (await fetch(`${BASE}${route}`)).text());
      const title = $("title").text();
      const description = $('meta[name="description"]').attr("content");
      expect($('meta[property="og:title"]').attr("content")).toBe(title);
      expect($('meta[name="twitter:title"]').attr("content")).toBe(title);
      expect($('meta[property="og:description"]').attr("content")).toBe(description);
      expect($('meta[name="twitter:description"]').attr("content")).toBe(description);
      expect($('meta[name="twitter:image"]').attr("content")).toBe(
        $('meta[property="og:image"]').attr("content"),
      );
    });
  }
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


describe("coach relationships and preserved visitor journeys", () => {
  it("About refers to the coach and welcomes beginners with program-specific eligibility", async () => {
    const $ = cheerio.load(await (await fetch(`${BASE}/about`)).text());
    const blocks = jsonLdBlocks($);
    const profile = blocks.find((node) => node["@type"] === "ProfilePage");
    expect(profile?.mainEntity).toEqual({ "@type": "Person", "@id": `${CANONICAL_HOST}/#person`, name: "Sam Morris" });
    expect(blocks.some((node) => node["@type"] === "VideoObject")).toBe(false);
    $("script").remove();
    const text = $("body").text().replace(/\s+/g, " ");
    expect(text).toContain("Fall 2025");
    expect(text).toContain("I co-founded NGA with Amine Lahlou");
    expect(text).toContain("kids ages 6–16");
    expect(text).toContain("from first-time players to competitive juniors");
    expect(text).toContain("each program’s ages and levels");
    expect(text).not.toMatch(/ages 8[–-]16|who can rally|private bridge|Current focus/);
    expect($("a[href]").toArray().some((el) => ($(el).attr("href") ?? "").includes("nextgenpbacademy.com"))).toBe(true);
    expect($("a[href]").toArray().some((el) => ($(el).attr("href") ?? "").includes("youtube.com/@sammorris.pb8"))).toBe(true);
  });

  it("coaching Service refers to Sam while keeping prices and lesson requests", async () => {
    const $ = cheerio.load(await (await fetch(`${BASE}/programs/coaching`)).text());
    const service = jsonLdBlocks($).find((node) => node["@type"] === "Service");
    expect(service?.["@id"]).toBe(`${CANONICAL_HOST}/programs/coaching#service`);
    expect(service?.provider).toEqual({ "@type": "Person", "@id": `${CANONICAL_HOST}/#person`, name: "Sam Morris" });
    expect(service?.offers).toEqual([
      { "@type": "Offer", name: "Single Private Lesson", description: "1 hour of 1-on-1 coaching", price: String(PRICING.lessonPerHourUsd), priceCurrency: "USD" },
      { "@type": "Offer", name: "Group Lesson (2+ players)", description: "Small-group coaching for 2 to 4 players", price: String(PRICING.lessonPerHourUsd), priceCurrency: "USD" },
      { "@type": "Offer", name: "3+1 Play-In Special", description: "2-hour play-in session — 3 students plus Sam in the lineup" },
    ]);
    $("script").remove();
    expect($("body").text()).toContain(`$${PRICING.lessonPerHourUsd}`);
    expect($("a[href]").toArray().some((el) => ($(el).attr("href") ?? "").startsWith(COACH_REQUEST_URL))).toBe(true);
    expect($("body").text()).toContain("The Pickl Park");
  });

  it("the real Frederick venue retains its address and venue-owned registration links", async () => {
    const $ = cheerio.load(await (await fetch(`${BASE}/programs/pickl-park`)).text());
    $("script").remove();
    expect($("body").text()).toContain(FREDERICK_VENUE.street);
    expect($("body").text()).toContain(FREDERICK_VENUE.zip);
    expect($("a[href]").toArray().some((el) => ($(el).attr("href") ?? "") === FREDERICK_VENUE.clinicsUrl)).toBe(true);
  });
});

function jsonLdBlocks($: cheerio.CheerioAPI): Record<string, unknown>[] {
  return $('script[type="application/ld+json"]').toArray().map((el) => JSON.parse($(el).contents().text()));
}
