import fs from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sitemap, { revalidate } from "@/app/sitemap";
import { getBlogPosts, type BlogPost } from "@/lib/blog";

vi.mock("@/lib/blog", () => ({ getBlogPosts: vi.fn() }));

beforeEach(() => {
  vi.mocked(getBlogPosts).mockResolvedValue([]);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("sitemap content-update dates", () => {
  it("preserves the ten canonical public routes", async () => {
    const paths = [
      "",
      "/programs",
      "/programs/coaching",
      "/programs/cohort",
      "/programs/events",
      "/programs/pickl-park",
      "/contact",
      "/about",
      "/blog",
      "/quiz",
    ];
    expect((await sitemap()).map((entry) => entry.url)).toEqual(
      paths.map((path) => `https://www.sammorrispb.com${path}`),
    );
  });

  it("does not claim a content update when checkout timestamps change", async () => {
    const snapshot = fs.statSync(new URL("../src/app/sitemap.ts", import.meta.url));
    let mtime = new Date("2026-10-02T12:00:00Z");
    vi.spyOn(fs, "statSync").mockImplementation(() => {
      const stats = Object.create(snapshot) as fs.Stats;
      stats.mtime = mtime;
      return stats;
    });

    const first = await sitemap();
    mtime = new Date("2026-10-03T12:00:00Z");
    const next = await sitemap();

    expect(next).toEqual(first);
    for (const entry of next) expect(entry.lastModified).toBeUndefined();
  });

  it("preserves discovery without inventing dates when source files are unavailable", async () => {
    vi.spyOn(fs, "statSync").mockImplementation(() => {
      throw new Error("Source files unavailable in this deployment");
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-02T12:00:00Z"));
    const first = await sitemap();
    vi.setSystemTime(new Date("2026-10-03T12:00:00Z"));
    const next = await sitemap();

    expect(next).toEqual(first);
    expect(next).toHaveLength(10);
    for (const entry of next) expect(entry.lastModified).toBeUndefined();
  });
});

function post(slug: string, date = "2026-05-04"): BlogPost {
  return { id: slug, slug, title: "Published article", date, tags: [], coverImage: null, excerpt: "Article excerpt" };
}

describe("published blog discovery", () => {
  it("includes articles from the same published reader as the blog", async () => {
    vi.mocked(getBlogPosts).mockResolvedValue([post("first-game"), post("frederick-clinics")]);
    const entries = await sitemap();
    expect(getBlogPosts).toHaveBeenCalled();
    expect(entries.map((entry) => entry.url)).toEqual(expect.arrayContaining([
      "https://www.sammorrispb.com/blog/first-game",
      "https://www.sammorrispb.com/blog/frederick-clinics",
    ]));
    expect(entries).toHaveLength(12);
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  });

  it("refreshes published discovery on the same cadence as the blog", () => {
    expect(revalidate).toBe(300);
  });

  it("reflects the published reader's current result without keeping withdrawn posts", async () => {
    vi.mocked(getBlogPosts).mockResolvedValueOnce([post("old-post")]).mockResolvedValueOnce([post("new-post")]);
    expect((await sitemap()).map((entry) => entry.url)).toContain("https://www.sammorrispb.com/blog/old-post");
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://www.sammorrispb.com/blog/new-post");
    expect(urls).not.toContain("https://www.sammorrispb.com/blog/old-post");
  });

  it("deduplicates CMS slugs and keeps malformed paths out of the sitemap", async () => {
    vi.mocked(getBlogPosts).mockResolvedValue([
      post("valid-post"), post("valid-post"), post(""), post(" "), post(" padded "),
      post("."), post(".."), post("../admin"), post("nested/article"),
      post("article?preview=1"), post("article#fragment"), post("bad\\path"), post("bad\npath"),
    ]);
    const entries = await sitemap();
    expect(entries).toHaveLength(11);
    expect(entries.at(-1)?.url).toBe("https://www.sammorrispb.com/blog/valid-post");
    for (const entry of entries) {
      const url = new URL(entry.url);
      expect(url.origin).toBe("https://www.sammorrispb.com");
      expect(url.search).toBe("");
      expect(url.hash).toBe("");
    }
  });

  it("encodes a single slug segment and does not use publication dates as update dates", async () => {
    vi.mocked(getBlogPosts).mockResolvedValue([post("café drills", "not-a-date"), post("a%20b", "")]);
    const entries = (await sitemap()).slice(10);
    expect(entries.map((entry) => entry.url)).toEqual([
      "https://www.sammorrispb.com/blog/caf%C3%A9%20drills",
      "https://www.sammorrispb.com/blog/a%2520b",
    ]);
    for (const entry of entries) expect(entry.lastModified).toBeUndefined();
  });
});
