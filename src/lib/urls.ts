const MARKETING_REF = "sammorrispb";
const UTM_SOURCE = "sammorrispb";

export function hubUrl(
  path: string = "/",
  extraParams: Record<string, string> = {},
): string {
  const url = new URL(path, "https://linkanddink.com");
  url.searchParams.set("ref", MARKETING_REF);
  for (const [k, v] of Object.entries(extraParams)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

export function crUrl(target: string): string {
  const url = new URL(target);
  url.searchParams.set("utm_source", UTM_SOURCE);
  return url.toString();
}

export type FamilyDest = "linkanddink" | "nga" | "mocopb";

const FAMILY_BASES: Record<FamilyDest, string> = {
  linkanddink: "https://linkanddink.com",
  nga: "https://nextgenpbacademy.com",
  mocopb: "https://mocopb.com",
};

export function familyMarketingRef(dest: FamilyDest): string {
  return `sammorrispb_footer_${dest}`;
}

export function familySiteUrl(dest: FamilyDest, path: string = "/"): string {
  const url = new URL(path, FAMILY_BASES[dest]);
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", "cross_family_nav");
  url.searchParams.set("utm_campaign", "family_reciprocal");
  url.searchParams.set("utm_content", `footer_${dest}`);
  // Hub reads ?ref= via captureUtmParams() — stamp the richer marketing_ref.
  if (dest === "linkanddink") {
    url.searchParams.set("ref", familyMarketingRef(dest));
  }
  return url.toString();
}
