import { COACH_BOOKING_URL } from "@/lib/constants";

const MARKETING_REF = "sammorrispb";
const UTM_SOURCE = "sammorrispb";

export type FamilyDest = "nga" | "ld";

const FAMILY_BASES: Record<FamilyDest, string> = {
  nga: "https://nextgenpbacademy.com",
  ld: "https://linkanddink.com",
};

export function familyMarketingRef(dest: FamilyDest): string {
  return `sammorrispb_footer_${dest}`;
}

export function familySiteUrl(
  dest: FamilyDest,
  path: string = "/",
  opts?: { campaign?: string; content?: string },
): string {
  const url = new URL(path, FAMILY_BASES[dest]);
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", "cross_family_nav");
  url.searchParams.set("utm_campaign", opts?.campaign ?? "family_reciprocal");
  url.searchParams.set("utm_content", opts?.content ?? `footer_${dest}`);
  url.searchParams.set("ref", familyMarketingRef(dest));
  return url.toString();
}

/**
 * Stamp the coach.sammorrispb.com free-evaluation booking link with UTM
 * params so eval bookings attribute back to the page/section that drove
 * the click. `content` should be "<page>_<section>" (e.g. "home_hero"),
 * matching the page/section strings used in TrackedLink eventProps.
 */
export function coachBookingUrl(content: string): string {
  const url = new URL(COACH_BOOKING_URL);
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", "eval_cta");
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export { MARKETING_REF, UTM_SOURCE };
