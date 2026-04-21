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

export type FamilyDest = "linkanddink" | "nga" | "mocopb" | "tournaments";

const FAMILY_BASES: Record<FamilyDest, string> = {
  linkanddink: "https://linkanddink.com",
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
  // Every family site now reads ?ref= on landing — Hub via captureUtmParams(),
  // NGA/mocopb/tournaments via their funnelClient.ts captureUtmParams
  // equivalents. Stamp the richer marketing_ref on every dest so the
  // destination site records the exact origin → dest pair, not just the
  // utm_source. (Was linkanddink-only; extended 2026-04-20 post-P12.)
  url.searchParams.set("ref", familyMarketingRef(dest));
  // Cross-domain visitor handoff: stamp ld_pid=<ld_visitor cookie> so the
  // destination (Hub/NGA/MoCoPB) can adopt the same visitor_id and keep
  // funnel events linked across domains. SSR-safe and fail-open.
  const ldPid = readLdVisitorCookie();
  if (ldPid) {
    url.searchParams.set("ld_pid", ldPid);
  }
  return url.toString();
}
