import type { MetadataRoute } from "next";

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

export default function sitemap(): MetadataRoute.Sitemap {
  // Checkout timestamps do not establish when page content changed.
  // Omit lastModified until these pages have verified content-update dates.
  return ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
