import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notionPagesUpdate = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: class {
    pages = { update: notionPagesUpdate };
  },
}));

function makeRequest(params: Record<string, string>) {
  const url = new URL("https://www.sammorrispb.com/api/drip/unsubscribe");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new Request(url);
}

beforeEach(() => {
  vi.resetAllMocks();
  notionPagesUpdate.mockResolvedValue({});
  process.env.CRON_SECRET = "cron-secret-xyz";
  delete process.env.DRIP_SECRET;
  process.env.NOTION_API_KEY = "secret_notion";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/drip/unsubscribe", () => {
  it("flips Drip Opted Out and returns a 200 HTML confirmation for a valid sig", async () => {
    const { unsubscribeSig } = await import("@/lib/drip");
    const { GET } = await import("@/app/api/drip/unsubscribe/route");
    const res = await GET(makeRequest({ id: "page-123", sig: unsubscribeSig("page-123") }));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/html");
    const html = await res.text();
    expect(html).toContain("You're all set");

    expect(notionPagesUpdate).toHaveBeenCalledTimes(1);
    expect(notionPagesUpdate.mock.calls[0][0]).toMatchObject({
      page_id: "page-123",
      properties: { "Drip Opted Out": { checkbox: true } },
    });
  });

  it("returns 400 and never calls Notion on an invalid sig", async () => {
    const { GET } = await import("@/app/api/drip/unsubscribe/route");
    const res = await GET(makeRequest({ id: "page-123", sig: "deadbeef".repeat(8) }));
    expect(res.status).toBe(400);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 and never calls Notion when id or sig is missing", async () => {
    const { GET } = await import("@/app/api/drip/unsubscribe/route");
    expect((await GET(makeRequest({ id: "page-123" }))).status).toBe(400);
    expect((await GET(makeRequest({ sig: "abc" }))).status).toBe(400);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 on a sig signed with the wrong secret (no Notion call)", async () => {
    const { unsubscribeSig } = await import("@/lib/drip");
    const wrongSig = (() => {
      const prev = process.env.CRON_SECRET;
      process.env.CRON_SECRET = "some-other-secret";
      const s = unsubscribeSig("page-123");
      process.env.CRON_SECRET = prev;
      return s;
    })();
    const { GET } = await import("@/app/api/drip/unsubscribe/route");
    const res = await GET(makeRequest({ id: "page-123", sig: wrongSig }));
    expect(res.status).toBe(400);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });
});
