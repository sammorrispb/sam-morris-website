import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

function makeRequest(body: unknown) {
  return new Request("https://www.sammorrispb.com/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
  process.env.OPEN_BRAIN_ANALYTICS_URL = "https://ob.example.com/ingest";
  process.env.LEAD_INGEST_TOKEN = "ingest-secret";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/analytics", () => {
  it("returns 204 on malformed JSON without proxying", async () => {
    const { POST } = await import("@/app/api/analytics/route");
    const res = await POST(makeRequest("not json"));
    expect(res.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 204 when env vars are missing (silent skip)", async () => {
    delete process.env.OPEN_BRAIN_ANALYTICS_URL;
    const { POST } = await import("@/app/api/analytics/route");
    const res = await POST(makeRequest({ type: "cta_click" }));
    expect(res.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 204 immediately and proxies to OB with the ingest token", async () => {
    let fetchResolve: (v: Response) => void = () => {};
    const fetchPromise = new Promise<Response>((r) => (fetchResolve = r));
    fetchMock.mockReturnValueOnce(fetchPromise);
    const { POST } = await import("@/app/api/analytics/route");
    const res = await POST(makeRequest({ type: "cta_click", target: "buy" }));
    expect(res.status).toBe(204);
    // Fire-and-forget started but hasn't resolved yet
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://ob.example.com/ingest");
    expect(init.method).toBe("POST");
    expect(init.headers["x-lead-ingest-token"]).toBe("ingest-secret");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ type: "cta_click", target: "buy" });
    fetchResolve(new Response("ok", { status: 200 }));
    await fetchPromise;
  });

  it("swallows downstream fetch failures (does not throw)", async () => {
    fetchMock.mockRejectedValueOnce(new Error("connection refused"));
    const { POST } = await import("@/app/api/analytics/route");
    const res = await POST(makeRequest({ type: "any" }));
    expect(res.status).toBe(204);
  });
});
