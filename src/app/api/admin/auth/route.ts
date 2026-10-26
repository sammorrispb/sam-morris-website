import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  checkAdminPassword,
  clearFailedLogins,
  clientIp,
  createSessionToken,
  isLockedOut,
  recordFailedLogin,
  requireAdminSession,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

function setSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}

// Login: constant-time password check behind a per-IP lockout; on success set a
// short-lived HttpOnly session cookie. The password is never returned.
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isLockedOut(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (typeof password !== "string" || !checkAdminPassword(password)) {
    recordFailedLogin(ip);
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  clearFailedLogins(ip);
  return setSessionCookie(NextResponse.json({ success: true }));
}

// Session check — lets the client learn whether it is already authed without
// reading the HttpOnly cookie.
export async function GET(request: Request) {
  if (!requireAdminSession(request)) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }
  return NextResponse.json({ authed: true });
}

// Logout — clear the session cookie.
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
