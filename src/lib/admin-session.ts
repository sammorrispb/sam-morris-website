// Admin session auth for the /admin dashboard.
//
// Replaces the previous model where the raw ADMIN_PASSWORD was echoed back to
// the client, stored in sessionStorage, and replayed as a Bearer token on every
// /api/admin/* request (a static, non-expiring, brute-forceable credential with
// no rate limiting). Now: the password is checked constant-time at login only,
// behind a per-IP lockout, and the browser gets a short-lived HMAC-signed,
// HttpOnly session cookie that the routes verify. The password never leaves the
// server after login and is never readable by client JS.

import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "sm_admin_session";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

/** Signing key for session tokens. A dedicated secret if set, else ADMIN_PASSWORD
 *  so the feature needs no new env var (rotating the password then invalidates
 *  live sessions, which is acceptable). */
function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

/** Mint a signed session token carrying only an expiry. */
export function createSessionToken(now: number = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ exp: now + SESSION_TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Verify a session token's signature (constant-time) and expiry. */
export function verifySessionToken(token: string | undefined | null, now: number = Date.now()): boolean {
  if (!token || !sessionSecret()) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const provided = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(payload));
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > now;
  } catch {
    return false;
  }
}

/** Constant-time password check against ADMIN_PASSWORD. */
export function checkAdminPassword(input: string | undefined | null): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  // Length difference short-circuits (timingSafeEqual throws on unequal length);
  // a length side-channel on a secret password is not a meaningful leak.
  return a.length === b.length && timingSafeEqual(a, b);
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq > 0 && part.slice(0, eq) === name) return decodeURIComponent(part.slice(eq + 1));
  }
  return undefined;
}

/** True iff the request carries a valid, unexpired admin session cookie. */
export function requireAdminSession(request: Request): boolean {
  return verifySessionToken(readCookie(request, ADMIN_COOKIE_NAME));
}

// ── Per-IP login lockout ──────────────────────────────────────────────────
// In-memory and per-serverless-instance (resets on deploy / varies across
// instances) — same documented tradeoff as the public-form rate limiters.
// It still turns an unthrottled edge-brute-force into a slow one.
export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

const failures = new Map<string, { count: number; first: number }>();

export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0]!.trim() || "unknown";
}

export function isLockedOut(ip: string, now: number = Date.now()): boolean {
  const rec = failures.get(ip);
  if (!rec) return false;
  if (now - rec.first > LOCKOUT_WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return rec.count >= MAX_FAILED_LOGINS;
}

export function recordFailedLogin(ip: string, now: number = Date.now()): void {
  const rec = failures.get(ip);
  if (!rec || now - rec.first > LOCKOUT_WINDOW_MS) failures.set(ip, { count: 1, first: now });
  else rec.count += 1;
}

export function clearFailedLogins(ip: string): void {
  failures.delete(ip);
}
