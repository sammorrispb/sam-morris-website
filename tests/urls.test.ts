import { describe, it, expect } from "vitest";
import { coachBookingUrl } from "@/lib/urls";
import { COACH_BOOKING_URL } from "@/lib/constants";

describe("coachBookingUrl", () => {
  it("preserves the base booking URL origin and path", () => {
    const base = new URL(COACH_BOOKING_URL);
    const url = new URL(coachBookingUrl("home_hero"));
    expect(url.origin).toBe(base.origin);
    expect(url.pathname).toBe(base.pathname);
  });

  it("stamps all four UTM params", () => {
    const url = new URL(coachBookingUrl("home_hero"));
    expect(url.searchParams.get("utm_source")).toBe("sammorrispb");
    expect(url.searchParams.get("utm_medium")).toBe("website");
    expect(url.searchParams.get("utm_campaign")).toBe("eval_cta");
    expect(url.searchParams.get("utm_content")).toBe("home_hero");
  });

  it("passes the content string through verbatim", () => {
    for (const content of ["nav_header_cta", "quiz_result_advanced_beginner", "footer_tagline_strip"]) {
      expect(new URL(coachBookingUrl(content)).searchParams.get("utm_content")).toBe(content);
    }
  });

  it("never produces a double question mark", () => {
    const result = coachBookingUrl("programs_card");
    expect(result.match(/\?/g)?.length).toBe(1);
    expect(result).not.toContain("??");
  });

  it("merges with existing query params instead of appending a second query string", () => {
    // COACH_BOOKING_URL has no params today, but the helper must stay safe
    // if one is ever added — assert the output parses as a single valid URL
    // whose params include the UTMs plus any pre-existing ones.
    const result = coachBookingUrl("edge_case");
    const url = new URL(result);
    const base = new URL(COACH_BOOKING_URL);
    for (const [key, value] of base.searchParams) {
      expect(url.searchParams.get(key)).toBe(value);
    }
    expect(url.searchParams.get("utm_content")).toBe("edge_case");
  });

  it("url-encodes unsafe characters in content", () => {
    const url = new URL(coachBookingUrl("a b&c"));
    expect(url.searchParams.get("utm_content")).toBe("a b&c");
  });
});
