import type { MetadataRoute } from "next";

const BASE_URL = "https://www.sammorrispb.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/programs`,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/locations`,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/locations/rockville`,
      lastModified: "2026-03-24",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/locations/north-bethesda`,
      lastModified: "2026-03-24",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programs/hub`,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programs/leagues`,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programs/open-play`,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programs/coached-open-play`,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programs/coaching`,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programs/youth`,
      lastModified: "2026-03-24",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: "2026-03-24",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: "2026-03-24",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
