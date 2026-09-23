/**
 * Coaching pricing — the single source of truth.
 *
 * Brand guardrail (tests/brand/brand-copy.test.ts): this is the ONLY file
 * that may contain literal dollar amounts. All user-facing copy interpolates
 * from PRICING instead of hard-coding a price.
 */
export const PRICING = {
  /** USD per hour for private or group lessons (up to 4 players), plus court fee. */
  lessonPerHourUsd: 50,
} as const;
