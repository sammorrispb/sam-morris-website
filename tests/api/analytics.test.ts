import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();
const lifecycle = vi.hoisted(() => ({ callbacks: [] as Array<() => Promise<void>> }));

vi.mock("next/server", async (importOriginal) => {
  const original = await importOriginal<typeof import("next/server")>();
  return { ...original, after: (callback: () => Promise<void>) => lifecycle.callbacks.push(callback) };
});

function makeRequest(body: unknown) {
  return new Request("https://www.sammorrispb.com/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  lifecycle.callbacks.length = 0;
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

  it("returns 204 and registers forwarding with the response lifecycle", async () => {
    let fetchResolve: (v: Response) => void = () => {};
    const fetchPromise = new Promise<Response>((r) => (fetchResolve = r));
    fetchMock.mockReturnValueOnce(fetchPromise);
    const { POST } = await import("@/app/api/analytics/route");
    const res = await POST(makeRequest({ type: "cta_click", target: "buy" }));
    expect(res.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(lifecycle.callbacks).toHaveLength(1);
    const forwarding = lifecycle.callbacks[0]();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://ob.example.com/ingest");
    expect(init.method).toBe("POST");
    expect(init.headers["x-lead-ingest-token"]).toBe("ingest-secret");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ type: "cta_click", target: "buy" });
    fetchResolve(new Response("ok", { status: 200 }));
    await forwarding;
  });

  it("swallows downstream fetch failures (does not throw)", async () => {
    fetchMock.mockRejectedValueOnce(new Error("connection refused"));
    const { POST } = await import("@/app/api/analytics/route");
    const res = await POST(makeRequest({ type: "any" }));
    expect(res.status).toBe(204);
    await expect(lifecycle.callbacks[0]()).resolves.toBeUndefined();
  });

  it("allows bounded cold-start headroom and releases the upstream response body", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    const response = new Response("{\"ok\":true,\"inserted\":1}");
    const cancel = vi.spyOn(response.body!, "cancel");
    fetchMock.mockResolvedValueOnce(response);
    const { POST, maxDuration } = await import("@/app/api/analytics/route");
    await POST(makeRequest({ event_name: "synthetic_test" }));
    await lifecycle.callbacks[0]();
    expect(maxDuration).toBe(30);
    expect(timeout).toHaveBeenCalledWith(15_000);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("logs only a status for upstream refusal and never echoes its body", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce(new Response("private upstream payload ingest-secret", { status: 401 }));
    const { POST } = await import("@/app/api/analytics/route");
    await POST(makeRequest({ event_name: "synthetic_test" }));
    await lifecycle.callbacks[0]();
    expect(logged).toHaveBeenCalledWith("[analytics] upstream rejected event", { status: 401 });
    expect(JSON.stringify(logged.mock.calls)).not.toMatch(/private|ingest-secret/);
  });
});
