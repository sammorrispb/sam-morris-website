"use client";

export type AnalyticsEventMap = {
  cta_click: {
    label: string;
    page: string;
    section: string;
    destination?: string;
  };
  lead_form: {
    action: "started" | "submitted" | "error";
    interest?: string;
    page: string;
  };
  external_link: {
    label: string;
    url: string;
    page: string;
  };
  scroll_depth: {
    depth: 25 | 50 | 75 | 100;
    page: string;
  };
  quiz_started: { page: string };
  quiz_completed: { result: string; page: string };
};

const VISITOR_COOKIE = "ld_visitor";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;

function generateVisitorId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const pair = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${VISITOR_MAX_AGE}; Path=/; SameSite=Lax`;
}

export function getOrCreateVisitorId(): string {
  const existing = readCookie(VISITOR_COOKIE);
  if (existing) return existing;
  const id = generateVisitorId();
  writeCookie(VISITOR_COOKIE, id);
  return id;
}

/**
 * Form-hidden-input / JSON-body friendly visitor id accessor.
 *
 * Use this when constructing the body (or hidden input) for a form that
 * POSTs to a lead handler so the server can forward `visitor_id` to the
 * Hub funnel ingest. Without this, `funnel_events_external.visitor_id`
 * lands NULL and the event is permanently unlinkable to a profile.
 *
 * On the server (during SSR) the cookie isn't available and we return
 * an empty string — callers should tolerate that (the POST will still
 * succeed; the event just won't carry a visitor id, same as today).
 */
export function getVisitorIdForForm(): string {
  if (typeof document === "undefined") return "";
  return getOrCreateVisitorId();
}

export function trackEvent<K extends keyof AnalyticsEventMap>(
  name: K,
  props: AnalyticsEventMap[K],
  marketingRefOverride?: string,
): void {
  // The Hub funnel ingest endpoint was retired on 2026-05-02.
  // trackEvent is preserved as a no-op so existing call sites still
  // compile; visitor cookie helpers above are still used for ld_pid
  // handoff to family sites that ARE still live (NGA, MoCoPB, Tournaments).
  void name;
  void props;
  void marketingRefOverride;
}
