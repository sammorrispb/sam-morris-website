import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.sammorrispb.com";

/**
 * Resolve the on-disk file mtime for the given app-router page so each
 * sitemap entry gets a real per-page lastmod instead of one shared
 * build-time stamp. Falls back to the current date if the file is missing
 * (e.g. dynamic route stubs) so the sitemap never breaks the build.
 *
 * `routePath` is the URL path ('' for root, '/about', '/programs/coaching').
 * The matching source file is `src/app/<routePath>/page.tsx`.
 */
function pageMtime(routePath: string): Date {
  const rel = routePath === "" ? "" : routePath.replace(/^\//, "");
  const sourceFile = path.join(
    process.cwd(),
    "src",
    "app",
    rel,
    "page.tsx",
  );
  try {
    return fs.statSync(sourceFile).mtime;
  } catch {
    return new Date();
  }
}

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
  { path: "/evaluation", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/quiz", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: pageMtime(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
