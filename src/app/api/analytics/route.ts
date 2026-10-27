import { after, NextResponse } from "next/server";

export const maxDuration = 30;

/**
 * Server-side proxy to the Open Brain analytics-ingest edge function.
 *
 * Keeps the ingest token out of the browser. Always returns 204 on success,
 * never blocks the page; analytics failures are logged and swallowed.
 *
 * Required env vars:
 *   OPEN_BRAIN_ANALYTICS_URL — full URL to the analytics-ingest edge function
 *   LEAD_INGEST_TOKEN        — shared secret (same token as leads-ingest)
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const url = process.env.OPEN_BRAIN_ANALYTICS_URL;
  const token = process.env.LEAD_INGEST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[analytics] skipped — env vars missing");
    }
    return new NextResponse(null, { status: 204 });
  }

  // Register post-response work with Vercel's invocation lifecycle. A detached
  // promise can be suspended as soon as the 204 response is returned.
  after(async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lead-ingest-token": token,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        console.error("[analytics] upstream rejected event", { status: res.status });
      }
      await res.body?.cancel();
    } catch (err) {
      const reason = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")
        ? "timeout"
        : "network";
      console.error("[analytics] forwarding failed", { reason });
    }
  });

  return new NextResponse(null, { status: 204 });
}
