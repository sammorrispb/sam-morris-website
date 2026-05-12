const MARKETING_REF = "sammorrispb";
const UTM_SOURCE = "sammorrispb";

export type FamilyDest = "nga" | "mocopb";

const FAMILY_BASES: Record<FamilyDest, string> = {
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
  url.searchParams.set("ref", familyMarketingRef(dest));
  return url.toString();
}

export { MARKETING_REF, UTM_SOURCE };
