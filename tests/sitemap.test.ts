import fs from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("sitemap content-update dates", () => {
  it("preserves the ten canonical public routes", () => {
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
    expect(sitemap().map((entry) => entry.url)).toEqual(
      paths.map((path) => `https://www.sammorrispb.com${path}`),
    );
  });

  it("does not claim a content update when checkout timestamps change", () => {
    const snapshot = fs.statSync(new URL("../src/app/sitemap.ts", import.meta.url));
    let mtime = new Date("2026-10-02T12:00:00Z");
    vi.spyOn(fs, "statSync").mockImplementation(() => {
      const stats = Object.create(snapshot) as fs.Stats;
      stats.mtime = mtime;
      return stats;
    });

    const first = sitemap();
    mtime = new Date("2026-10-03T12:00:00Z");
    const next = sitemap();

    expect(next).toEqual(first);
    for (const entry of next) expect(entry.lastModified).toBeUndefined();
  });

  it("preserves discovery without inventing dates when source files are unavailable", () => {
    vi.spyOn(fs, "statSync").mockImplementation(() => {
      throw new Error("Source files unavailable in this deployment");
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-02T12:00:00Z"));
    const first = sitemap();
    vi.setSystemTime(new Date("2026-10-03T12:00:00Z"));
    const next = sitemap();

    expect(next).toEqual(first);
    expect(next).toHaveLength(10);
    for (const entry of next) expect(entry.lastModified).toBeUndefined();
  });
});
