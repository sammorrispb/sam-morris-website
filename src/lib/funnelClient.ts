"use client";

export type AnalyticsEventMap = {
  page_view: {
    referrer?: string;
  };
  cta_click: {
    label: string;
    page?: string;
    section?: string;
    destination?: string;
  };
  lead_form: {
    action: "started" | "submitted" | "error";
    interest?: string;
    page: string;
  };
  lead_form_started: {
    interest?: string;
    page?: string;
  };
  lead_form_submitted: {
    interest?: string;
    page?: string;
  };
  external_link: {
    label: string;
    url: string;
    page?: string;
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
const UTM_STORAGE_KEY = "ld_utm";
const BUSINESS = "coaching" as const;

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
 * On the server (during SSR) the cookie isn't available and we return
 * an empty string — callers should tolerate that (the POST will still
 * succeed; the event just won't carry a visitor id).
 */
export function getVisitorIdForForm(): string {
  if (typeof document === "undefined") return "";
  return getOrCreateVisitorId();
}

/* ------------------------------ UTM capture ------------------------------ */

export type CapturedUtm = {
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
  ref?: string;
};

function readSessionUtm(): CapturedUtm {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as CapturedUtm) : {};
  } catch {
    return {};
  }
}

function writeSessionUtm(utm: CapturedUtm): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // sessionStorage may be unavailable (privacy mode) — silent no-op.
  }
}

/**
 * Capture utm_source / utm_campaign / utm_medium / ref from the current URL
 * into sessionStorage on first landing. Idempotent — does NOT overwrite an
 * existing stash unless the new URL carries non-empty params (e.g. a fresh
 * campaign click later in the same session).
 *
 * After capture, strips the params from the URL via history.replaceState so
 * the address bar stays clean. This is purely cosmetic; the canonical link
 * still works (sessionStorage already holds the value).
 */
export function captureUtm(): void {
  if (typeof window === "undefined") return;

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return;
  }

  const fromUrl: CapturedUtm = {};
  const utmSource = params.get("utm_source");
  const utmCampaign = params.get("utm_campaign");
  const utmMedium = params.get("utm_medium");
  const utmContent = params.get("utm_content");
  const ref = params.get("ref");
  if (utmSource) fromUrl.utm_source = utmSource;
  if (utmCampaign) fromUrl.utm_campaign = utmCampaign;
  if (utmMedium) fromUrl.utm_medium = utmMedium;
  if (utmContent) fromUrl.utm_content = utmContent;
  if (ref) fromUrl.ref = ref;

  // Nothing to capture from URL — bail (don't touch existing stash).
  if (Object.keys(fromUrl).length === 0) return;

  const existing = readSessionUtm();
  // Merge: new non-empty values win (lets later campaigns refine attribution).
  const merged: CapturedUtm = { ...existing, ...fromUrl };
  writeSessionUtm(merged);

  // Strip the captured params from the URL for cleaner sharing.
  try {
    let mutated = false;
    for (const key of ["utm_source", "utm_campaign", "utm_medium", "utm_content", "ref"]) {
      if (params.has(key)) {
        params.delete(key);
        mutated = true;
      }
    }
    if (mutated) {
      const qs = params.toString();
      const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", next);
    }
  } catch {
    // history API unavailable — fine, sessionStorage already holds the value.
  }
}

/** Returns the stashed UTM object (or {} if none / SSR). */
export function getUtm(): CapturedUtm {
  return readSessionUtm();
}

/* ------------------------------ trackEvent ------------------------------- */

const ANALYTICS_ENDPOINT = "/api/analytics";

/**
 * Fire-and-forget analytics POST. Always resolves; failures never throw.
 *
 * Routes through the same-origin /api/analytics proxy so the OB ingest token
 * stays server-side. Uses sendBeacon when available (so events fire reliably
 * during navigation / page unload), else falls back to fetch with keepalive.
 */
export function trackEvent<K extends keyof AnalyticsEventMap>(
  name: K,
  props: AnalyticsEventMap[K],
  // Kept for backward compatibility with familyMarketingRef call sites.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _marketingRefOverride?: string,
): void {
  if (typeof window === "undefined") return;

  try {
    const visitorId = getOrCreateVisitorId();
    const utm = getUtm();
    const page =
      typeof window !== "undefined" && window.location
        ? window.location.pathname
        : undefined;

    const body = JSON.stringify({
      event_name: name,
      props: {
        ...props,
        visitor_id: visitorId,
        business: BUSINESS,
        ...utm,
      },
      page,
    });

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      try {
        const blob = new Blob([body], { type: "application/json" });
        const ok = navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
        if (ok) return;
      } catch {
        // fall through to fetch
      }
    }

    void fetch(ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow — analytics must never break the page */
    });
  } catch {
    /* swallow — analytics must never break the page */
  }
}
