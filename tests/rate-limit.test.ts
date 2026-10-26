import { afterEach, describe, expect, it } from "vitest";
import { __resetRateLimit, clientIpFrom, rateLimit } from "@/lib/rate-limit";

afterEach(() => __resetRateLimit());

describe("rateLimit", () => {
  it("allows up to max within the window, then blocks", () => {
    const opts = { max: 3, windowMs: 1000 };
    expect(rateLimit("k", opts, 0).ok).toBe(true);
    expect(rateLimit("k", opts, 0).ok).toBe(true);
    expect(rateLimit("k", opts, 0).ok).toBe(true);
    const blocked = rateLimit("k", opts, 0);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBe(1000);
  });

  it("resets after the window elapses", () => {
    const opts = { max: 1, windowMs: 1000 };
    expect(rateLimit("k", opts, 0).ok).toBe(true);
    expect(rateLimit("k", opts, 500).ok).toBe(false);
    expect(rateLimit("k", opts, 1000).ok).toBe(true);
  });

  it("buckets are per-key (per-IP)", () => {
    const opts = { max: 1, windowMs: 1000 };
    expect(rateLimit("a", opts, 0).ok).toBe(true);
    expect(rateLimit("b", opts, 0).ok).toBe(true);
    expect(rateLimit("a", opts, 0).ok).toBe(false);
  });
});

describe("clientIpFrom", () => {
  it("takes the first XFF hop, falls back to unknown", () => {
    expect(clientIpFrom("1.2.3.4, 5.6.7.8")).toBe("1.2.3.4");
    expect(clientIpFrom(null)).toBe("unknown");
    expect(clientIpFrom("")).toBe("unknown");
  });
});
