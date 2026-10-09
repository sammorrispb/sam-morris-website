import registry from "@/data/page-photos.json";

export type PhotoFrame = "court" | "portrait" | "fieldnote" | "ticket";
export interface PagePhotoAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  frame: PhotoFrame;
  placement: string;
  sourceFile: string;
  sourceSha256: string;
  assetSha256: string;
  provenance: string;
  bytes: number;
}

export const PAGE_PHOTOS = registry as Record<string, PagePhotoAsset>;

/** Editorial routes only. Never pass query strings or private lesson tokens. */
export function getPagePhoto(route: string): PagePhotoAsset | undefined {
  return Object.hasOwn(PAGE_PHOTOS, route) ? PAGE_PHOTOS[route] : undefined;
}

export function selectArticlePhoto(slug: string, authoredCover: string | null):
  | { kind: "authored"; src: string }
  | { kind: "curated"; photo: PagePhotoAsset }
  | { kind: "missing" } {
  if (authoredCover) return { kind: "authored", src: authoredCover };
  const photo = getPagePhoto(`/blog/${slug}`);
  return photo ? { kind: "curated", photo } : { kind: "missing" };
}
