import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBlogPost } from "@/lib/blog";
import BlogPostPage from "@/app/blog/[slug]/page";
import { PAGE_PHOTOS } from "@/lib/page-photos";

vi.mock("@/lib/blog", () => ({ getBlogPost: vi.fn(), getBlogPosts: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("not found"); } }));
vi.stubGlobal("React", React);

const post = (slug: string, coverImage: string | null = null) => ({ id: "public-article", slug, title: "Practice with purpose", date: "2026-10-08", tags: ["Coaching"], excerpt: "A public coaching article.", blocks: [], coverImage });

beforeEach(() => vi.clearAllMocks());
describe("published article photography", () => {
  it("renders each current article with its own described image after its title", async () => {
    for (const [route, photo] of Object.entries(PAGE_PHOTOS).filter(([route]) => route.startsWith("/blog/"))) {
      const slug = route.slice(6);
      vi.mocked(getBlogPost).mockResolvedValue(post(slug));
      const html = renderToStaticMarkup(await BlogPostPage({params: Promise.resolve({slug})}));
      expect(html).toContain(`data-page-photo="${route}"`);
      expect(html).toContain(photo.alt);
      expect(html.indexOf("</header>")).toBeLessThan(html.indexOf("data-page-photo="));
      expect(html).toContain("See Coaching Options");
    }
  });
  it("preserves a Notion-authored cover and the post content flow", async () => {
    vi.mocked(getBlogPost).mockResolvedValue(post("frederick-beginner-pickleball-clinic-guide", "https://example.com/authored.jpg"));
    const html = renderToStaticMarkup(await BlogPostPage({params: Promise.resolve({slug: "frederick-beginner-pickleball-clinic-guide"})}));
    expect(html).toContain('src="https://example.com/authored.jpg"');
    expect(html).not.toContain("data-page-photo=");
  });
  it("reports a missing new assignment without silently borrowing a photo", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(getBlogPost).mockResolvedValue(post("new-article"));
    const html = renderToStaticMarkup(await BlogPostPage({params: Promise.resolve({slug: "new-article"})}));
    expect(html).not.toContain("data-page-photo=");
    expect(warn).toHaveBeenCalledWith("Article needs an editorial photo: new-article");
    warn.mockRestore();
  });
  it("does not decorate an unavailable article", async () => {
    vi.mocked(getBlogPost).mockResolvedValue(null);
    await expect(BlogPostPage({params: Promise.resolve({slug: "unavailable"})})).rejects.toThrow("not found");
  });
});
