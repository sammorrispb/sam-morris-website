import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { PAGE_PHOTOS, getPagePhoto, selectArticlePhoto } from "@/lib/page-photos";

const routes = ["/", "/about", "/contact", "/programs", "/programs/coaching", "/programs/cohort", "/programs/events", "/programs/pickl-park", "/blog", "/quiz", "/programs/cohort/signup", "/programs/cohort/signup/confirmed", "/lessons/confirm"];
const articles = ["frederick-beginner-pickleball-clinic-guide", "how-to-start-playing-pickleball-beginner-guide", "5-mistakes-new-pickleball-players-make", "first-pickleball-tournament-guide", "4-0-vs-3-5-discipline", "3-0-to-3-5-jump-three-shots", "open-play-3-0-plateau"];

describe("editorial photo coverage", () => {
  it("gives every public page and currently published article a distinct original", () => {
    const photos = [...routes, ...articles.map(slug => `/blog/${slug}`)].map(route => getPagePhoto(route));
    expect(photos.every(Boolean)).toBe(true);
    expect(new Set(photos.map(photo => photo?.sourceSha256)).size).toBe(20);
  });
  it("does not assign other pages' pictures to missing or private URLs", () => {
    for (const route of ["", "/unknown", "/admin", "/lessons/confirm?token=private", "/blog/new-post"]) expect(getPagePhoto(route)).toBeUndefined();
    expect(selectArticlePhoto("new-post", null)).toEqual({ kind: "missing" });
  });
  it("keeps an authored article cover ahead of the curated fallback", () => {
    expect(selectArticlePhoto(articles[0], "https://example.com/authored.jpg")).toEqual({ kind: "authored", src: "https://example.com/authored.jpg" });
    expect(selectArticlePhoto(articles[0], null).kind).toBe("curated");
  });
  it("ships correctly sized, metadata-free assets with truthful descriptions and provenance", async () => {
    for (const photo of Object.values(PAGE_PHOTOS)) {
      const path = `public${photo.src}`;
      expect(existsSync(path)).toBe(true);
      const bytes = readFileSync(path);
      const metadata = await sharp(bytes).metadata();
      expect([metadata.width, metadata.height]).toEqual([photo.width, photo.height]);
      expect(metadata.exif).toBeUndefined();
      expect(metadata.iptc).toBeUndefined();
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(photo.assetSha256);
      expect(photo.alt.length).toBeGreaterThan(20);
      expect(photo.alt).not.toMatch(/Dill Dinkers|CourtReserve|family|clinic at|tournament winner/i);
      expect(photo.provenance).toContain("existing Sam-owned");
      expect(photo.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });
});
