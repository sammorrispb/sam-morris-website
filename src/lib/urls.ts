const MARKETING_REF = "sammorrispb";
const UTM_SOURCE = "sammorrispb";

export type FamilyDest = "nga" | "mocopb" | "tournaments";

const FAMILY_BASES: Record<FamilyDest, string> = {
  nga: "https://nextgenpbacademy.com",
  mocopb: "https://mocopb.com",
  tournaments: "https://tournamentwebsite.vercel.app",
};

const LD_VISITOR_COOKIE = "ld_visitor";

export function familyMarketingRef(dest: FamilyDest): string {
  return `sammorrispb_footer_${dest}`;
}

/**
 * SSR-safe read of the ld_visitor cookie. Returns null when document is
 * undefined (server) or the cookie is missing/unreadable. Fail-open: never
 * throws so that URL construction is not blocked by cookie access errors.
 */
function readLdVisitorCookie(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const pair = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LD_VISITOR_COOKIE}=`));
    if (!pair) return null;
    return decodeURIComponent(pair.slice(LD_VISITOR_COOKIE.length + 1)) || null;
  } catch {
    return null;
  }
}

export function familySiteUrl(dest: FamilyDest, path: string = "/"): string {
  const url = new URL(path, FAMILY_BASES[dest]);
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", "cross_family_nav");
  url.searchParams.set("utm_campaign", "family_reciprocal");
  url.searchParams.set("utm_content", `footer_${dest}`);
  // Every family site reads ?ref= on landing for marketing_ref attribution.
  url.searchParams.set("ref", familyMarketingRef(dest));
  // Cross-domain visitor handoff: stamp ld_pid=<ld_visitor cookie> so the
  // destination (NGA/MoCoPB/tournaments) can adopt the same visitor_id and
  // keep funnel events linked across domains. SSR-safe and fail-open.
  const ldPid = readLdVisitorCookie();
  if (ldPid) {
    url.searchParams.set("ld_pid", ldPid);
  }
  return url.toString();
}

export { MARKETING_REF, UTM_SOURCE };
