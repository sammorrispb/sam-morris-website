import { beforeEach, describe, expect, it } from "vitest";

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "correct-horse-battery-staple";
});

function makeRequest(body: unknown) {
  return new Request("https://www.sammorrispb.com/api/admin/auth", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/admin/auth", () => {
  it("returns 200 success for the correct password", async () => {
    const { POST } = await import("@/app/api/admin/auth/route");
    const res = await POST(makeRequest({ password: "correct-horse-battery-staple" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });

  it("returns 401 for an incorrect password", async () => {
    const { POST } = await import("@/app/api/admin/auth/route");
    const res = await POST(makeRequest({ password: "wrong" }));
    expect(res.status).toBe(401);
  });

  it("returns 401 for missing password field", async () => {
    const { POST } = await import("@/app/api/admin/auth/route");
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it("returns 400 for non-JSON body", async () => {
    const { POST } = await import("@/app/api/admin/auth/route");
    const res = await POST(makeRequest("not json"));
    expect(res.status).toBe(400);
  });

  it("rejects empty password even if env happens to be empty (no-bypass)", async () => {
    process.env.ADMIN_PASSWORD = "";
    const { POST } = await import("@/app/api/admin/auth/route");
    const res = await POST(makeRequest({ password: "" }));
    expect(res.status).toBe(401);
  });
});
