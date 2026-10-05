import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";

// Match the blog's refresh interval so newly published posts become discoverable.
export const revalidate = 300;

const BASE_URL = "https://www.sammorrispb.com";

interface RouteSpec {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

const ROUTES: RouteSpec[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/programs", changeFrequency: "weekly", priority: 0.9 },
  { path: "/programs/coaching", changeFrequency: "weekly", priority: 0.8 },
  { path: "/programs/cohort", changeFrequency: "monthly", priority: 0.7 },
  { path: "/programs/events", changeFrequency: "monthly", priority: 0.8 },
  { path: "/programs/pickl-park", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/quiz", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Checkout timestamps do not establish when page content changed.
  // Omit lastModified until these pages have verified content-update dates.
  const routes: MetadataRoute.Sitemap = ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // The existing reader selects Published posts and returns [] if CMS access
  // is unavailable. Only a single slug segment belongs under /blog.
  const posts = await getBlogPosts();
  const seen = new Set<string>();
  for (const { slug } of posts) {
    const hasControlCharacter = Array.from(slug).some((char) => {
      const code = char.charCodeAt(0);
      return code < 32 || code === 127;
    });
    if (!slug || slug !== slug.trim() || slug === "." || slug === ".." ||
        /[\/\\?#]/.test(slug) || hasControlCharacter || seen.has(slug)) continue;
    seen.add(slug);
    routes.push({
      url: `${BASE_URL}/blog/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  return routes;
}
