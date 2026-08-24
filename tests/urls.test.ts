import { describe, it, expect } from "vitest";
import { coachRequestUrl, familySiteUrl } from "@/lib/urls";
import { COACH_REQUEST_URL } from "@/lib/constants";

describe("familySiteUrl", () => {
  it("defaults to footer attribution (existing call sites unchanged)", () => {
    const url = new URL(familySiteUrl("nga"));
    expect(url.origin).toBe("https://nextgenpbacademy.com");
    expect(url.pathname).toBe("/");
    expect(url.searchParams.get("utm_source")).toBe("sammorrispb");
    expect(url.searchParams.get("utm_medium")).toBe("cross_family_nav");
    expect(url.searchParams.get("utm_campaign")).toBe("family_reciprocal");
    expect(url.searchParams.get("utm_content")).toBe("footer_nga");
    expect(url.searchParams.get("ref")).toBe("sammorrispb_footer_nga");
  });

  it("deep-links to a path on the destination site", () => {
    const url = new URL(familySiteUrl("nga", "/fall"));
    expect(url.origin).toBe("https://nextgenpbacademy.com");
    expect(url.pathname).toBe("/fall");
  });

  it("honors campaign/content overrides without touching source or ref", () => {
    const url = new URL(
      familySiteUrl("nga", "/fall", {
        campaign: "nga_fall_2026",
        content: "programs_academy",
      }),
    );
    expect(url.searchParams.get("utm_campaign")).toBe("nga_fall_2026");
    expect(url.searchParams.get("utm_content")).toBe("programs_academy");
    expect(url.searchParams.get("utm_source")).toBe("sammorrispb");
    expect(url.searchParams.get("ref")).toBe("sammorrispb_footer_nga");
  });
});

describe("coachBookingUrl", () => {
  it("preserves the base request URL origin and path", () => {
    const base = new URL(COACH_REQUEST_URL);
    const url = new URL(coachRequestUrl("home_hero"));
    expect(url.origin).toBe(base.origin);
    expect(url.pathname).toBe(base.pathname);
  });

  it("stamps all four UTM params", () => {
    const url = new URL(coachRequestUrl("home_hero"));
    expect(url.searchParams.get("utm_source")).toBe("sammorrispb");
    expect(url.searchParams.get("utm_medium")).toBe("website");
    expect(url.searchParams.get("utm_campaign")).toBe("lesson_cta");
    expect(url.searchParams.get("utm_content")).toBe("home_hero");
  });

  it("passes the content string through verbatim", () => {
    for (const content of ["nav_header_cta", "quiz_result_advanced_beginner", "footer_tagline_strip"]) {
      expect(new URL(coachRequestUrl(content)).searchParams.get("utm_content")).toBe(content);
    }
  });

  it("never produces a double question mark", () => {
    const result = coachRequestUrl("programs_card");
    expect(result.match(/\?/g)?.length).toBe(1);
    expect(result).not.toContain("??");
  });

  it("merges with existing query params instead of appending a second query string", () => {
    // COACH_REQUEST_URL has no params today, but the helper must stay safe
    // if one is ever added — assert the output parses as a single valid URL
    // whose params include the UTMs plus any pre-existing ones.
    const result = coachRequestUrl("edge_case");
    const url = new URL(result);
    const base = new URL(COACH_REQUEST_URL);
    for (const [key, value] of base.searchParams) {
      expect(url.searchParams.get(key)).toBe(value);
    }
    expect(url.searchParams.get("utm_content")).toBe("edge_case");
  });

  it("url-encodes unsafe characters in content", () => {
    const url = new URL(coachRequestUrl("a b&c"));
    expect(url.searchParams.get("utm_content")).toBe("a b&c");
  });
});
