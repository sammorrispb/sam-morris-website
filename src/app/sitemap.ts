import { getAllPosts } from "@/lib/blog";
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.sammorrispb.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/programs`, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
    ...posts,
  ];
}
