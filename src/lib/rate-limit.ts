// Minimal in-memory per-IP rate limiter for unauthenticated endpoints.
//
// The public lead/cohort forms each send an email to a request-controlled
// address from Coach Sam's sending domain, with no throttle — an attacker can
// loop one to email-bomb a third party (and pollute the CRM) while damaging the
// domain's sender reputation. This caps that.
//
// In-memory and per-serverless-instance: the window resets on deploy and is not
// shared across instances, so the real-world cap is looser than the nominal one.
// That is an accepted tradeoff (a shared store would need Redis); it still turns
// an unbounded abuse loop into a bounded one per instance.

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  opts: RateLimitOptions,
  now: number = Date.now()
): { ok: boolean; retryAfterMs: number } {
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.reset) {
    buckets.set(key, { count: 1, reset: now + opts.windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  if (bucket.count >= opts.max) {
    return { ok: false, retryAfterMs: bucket.reset - now };
  }
  bucket.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

/** First hop of an X-Forwarded-For header, or "unknown". */
export function clientIpFrom(forwardedFor: string | null | undefined): string {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

/** Test-only: clear all buckets between cases. */
export function __resetRateLimit(): void {
  buckets.clear();
}
