/**
 * Testimonials must reflect Sam's CURRENT offerings (private coaching + youth
 * academy). DD-era open-play / league / community testimonials and the
 * Rockville/North Bethesda location tags were removed in the 2026-06-09 review.
 */
import { describe, expect, it } from "vitest";
import {
  TESTIMONIALS,
  getTestimonialsByProgram,
  getAggregateRating,
} from "@/lib/testimonials";

describe("testimonials", () => {
  it("only feature current programs (coaching + youth)", () => {
    const programs = new Set(TESTIMONIALS.map((t) => t.program));
    expect([...programs].sort()).toEqual(["coaching", "youth"]);
  });

  it("carry no DD-era location tags", () => {
    for (const t of TESTIMONIALS) {
      expect(t, `testimonial ${t.id} still has a location tag`).not.toHaveProperty(
        "location",
      );
    }
  });

  it("expose a balanced set (>=3 coaching, >=3 youth)", () => {
    expect(getTestimonialsByProgram("coaching").length).toBeGreaterThanOrEqual(3);
    expect(getTestimonialsByProgram("youth").length).toBeGreaterThanOrEqual(3);
  });

  it("aggregate rating reflects exactly the listed testimonials", () => {
    const agg = getAggregateRating();
    expect(agg.reviewCount).toBe(TESTIMONIALS.length);
    expect(Number(agg.ratingValue)).toBeGreaterThan(0);
    expect(Number(agg.ratingValue)).toBeLessThanOrEqual(agg.bestRating);
  });
});
