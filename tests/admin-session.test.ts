import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ADMIN_COOKIE_NAME,
  MAX_FAILED_LOGINS,
  SESSION_TTL_MS,
  checkAdminPassword,
  clearFailedLogins,
  clientIp,
  createSessionToken,
  isLockedOut,
  recordFailedLogin,
  requireAdminSession,
  verifySessionToken,
} from "@/lib/admin-session";

const ORIG = process.env.ADMIN_PASSWORD;
beforeEach(() => {
  process.env.ADMIN_PASSWORD = "correct horse battery staple";
});
afterEach(() => {
  process.env.ADMIN_PASSWORD = ORIG;
});

function req(headers: Record<string, string>): Request {
  return new Request("https://x/", { headers });
}

describe("session token", () => {
  it("round-trips a freshly minted token", () => {
    expect(verifySessionToken(createSessionToken())).toBe(true);
  });
  it("rejects empty / malformed tokens", () => {
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken("")).toBe(false);
    expect(verifySessionToken("nodot")).toBe(false);
  });
  it("rejects a tampered signature", () => {
    const t = createSessionToken();
    const tampered = t.slice(0, -2) + (t.endsWith("aa") ? "bb" : "aa");
    expect(verifySessionToken(tampered)).toBe(false);
  });
  it("rejects a tampered payload (signature no longer matches)", () => {
    const [, sig] = createSessionToken().split(".");
    const forged = Buffer.from(JSON.stringify({ exp: Date.now() + 1e9 })).toString("base64url");
    expect(verifySessionToken(`${forged}.${sig}`)).toBe(false);
  });
  it("rejects an expired token", () => {
    const past = Date.now() - SESSION_TTL_MS - 1000;
    expect(verifySessionToken(createSessionToken(past))).toBe(false);
  });
  it("cannot be verified once the signing secret changes", () => {
    const t = createSessionToken();
    process.env.ADMIN_PASSWORD = "a different password";
    expect(verifySessionToken(t)).toBe(false);
  });
});

describe("checkAdminPassword", () => {
  it("accepts the exact password", () => {
    expect(checkAdminPassword("correct horse battery staple")).toBe(true);
  });
  it("rejects wrong, empty, and prefix passwords", () => {
    expect(checkAdminPassword("wrong")).toBe(false);
    expect(checkAdminPassword("")).toBe(false);
    expect(checkAdminPassword(undefined)).toBe(false);
    expect(checkAdminPassword("correct horse battery stapl")).toBe(false);
  });
  it("rejects everything when ADMIN_PASSWORD is unset", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(checkAdminPassword("anything")).toBe(false);
  });
});

describe("requireAdminSession reads the cookie", () => {
  it("accepts a request carrying a valid session cookie", () => {
    const token = createSessionToken();
    expect(requireAdminSession(req({ cookie: `${ADMIN_COOKIE_NAME}=${token}` }))).toBe(true);
  });
  it("rejects a request with no cookie or a junk cookie", () => {
    expect(requireAdminSession(req({}))).toBe(false);
    expect(requireAdminSession(req({ cookie: `${ADMIN_COOKIE_NAME}=garbage` }))).toBe(false);
    expect(requireAdminSession(req({ cookie: "other=1" }))).toBe(false);
  });
});

describe("login lockout", () => {
  const ip = "203.0.113.7";
  beforeEach(() => clearFailedLogins(ip));

  it("locks out after MAX_FAILED_LOGINS and clears on success", () => {
    expect(isLockedOut(ip)).toBe(false);
    for (let i = 0; i < MAX_FAILED_LOGINS; i++) recordFailedLogin(ip);
    expect(isLockedOut(ip)).toBe(true);
    clearFailedLogins(ip);
    expect(isLockedOut(ip)).toBe(false);
  });
  it("forgets failures after the window elapses", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < MAX_FAILED_LOGINS; i++) recordFailedLogin(ip, t0);
    expect(isLockedOut(ip, t0)).toBe(true);
    expect(isLockedOut(ip, t0 + 16 * 60 * 1000)).toBe(false);
  });
  it("extracts the client IP from x-forwarded-for", () => {
    expect(clientIp(req({ "x-forwarded-for": "198.51.100.9, 10.0.0.1" }))).toBe("198.51.100.9");
    expect(clientIp(req({}))).toBe("unknown");
  });
});
