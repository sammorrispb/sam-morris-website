import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notionDataSourcesQuery = vi.fn();
const notionPagesUpdate = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: class {
    dataSources = { query: notionDataSourcesQuery };
    pages = { update: notionPagesUpdate };
  },
}));

function makeGet(token: string | null, qs = "") {
  const url = `https://www.sammorrispb.com/api/admin/leads${qs ? `?${qs}` : ""}`;
  const headers = new Headers();
  if (token !== null) headers.set("Authorization", `Bearer ${token}`);
  return new Request(url, { headers });
}

function makePatch(token: string | null, body: unknown) {
  const headers = new Headers({ "content-type": "application/json" });
  if (token !== null) headers.set("Authorization", `Bearer ${token}`);
  return new Request("https://www.sammorrispb.com/api/admin/leads", {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.ADMIN_PASSWORD = "admintest";
  process.env.NOTION_API_KEY = "secret_notion";
  process.env.NOTION_LEADS_DB_ID = "db_leads";
  notionDataSourcesQuery.mockResolvedValue({
    results: [],
    has_more: false,
    next_cursor: null,
  });
  notionPagesUpdate.mockResolvedValue({});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/admin/leads", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const { GET } = await import("@/app/api/admin/leads/route");
    const res = await GET(makeGet(null));
    expect(res.status).toBe(401);
    expect(notionDataSourcesQuery).not.toHaveBeenCalled();
  });

  it("returns 401 when token does not match ADMIN_PASSWORD", async () => {
    const { GET } = await import("@/app/api/admin/leads/route");
    const res = await GET(makeGet("not-the-password"));
    expect(res.status).toBe(401);
  });

  it("returns 500 when Notion env is not configured", async () => {
    delete process.env.NOTION_API_KEY;
    const { GET } = await import("@/app/api/admin/leads/route");
    const res = await GET(makeGet("admintest"));
    expect(res.status).toBe(500);
  });

  it("computes stats: recent (last 7d), paid, attention flags", async () => {
    const today = new Date();
    const threeDaysAgo = new Date(today.getTime() - 3 * 86400000).toISOString();
    const tenDaysAgo = new Date(today.getTime() - 10 * 86400000).toISOString();
    notionDataSourcesQuery.mockResolvedValueOnce({
      results: [
        {
          properties: {
            Interest: { select: { name: "Coaching" } },
            Status: { select: { name: "Paid" } },
            "Date Submitted": { date: { start: threeDaysAgo } },
            "Email Sent": { checkbox: false },
          },
        },
        {
          properties: {
            Interest: { select: { name: "Events" } },
            Status: { select: { name: "New" } },
            "Date Submitted": { date: { start: tenDaysAgo } },
            "Email Sent": { checkbox: true },
          },
        },
      ],
      has_more: false,
      next_cursor: null,
    });
    notionDataSourcesQuery.mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
    });
    const { GET } = await import("@/app/api/admin/leads/route");
    const res = await GET(makeGet("admintest"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.total).toBe(2);
    expect(json.recentCount).toBe(1); // only threeDaysAgo within 7d
    expect(json.paidCount).toBe(1);
    // Both rows flag: Paid+!emailSent (row 1) AND New+>2d-old (row 2)
    expect(json.attentionCount).toBe(2);
    expect(json.interestBreakdown).toEqual([
      { interest: "Coaching", count: 1 },
      { interest: "Events", count: 1 },
    ]);
  });

  it("passes search + status filters to Notion as combined conditions", async () => {
    const { GET } = await import("@/app/api/admin/leads/route");
    await GET(
      makeGet("admintest", "search=ann&status=Paid&interest=Coaching&pageSize=10"),
    );
    // First call = stats (no filter); second = leads (with filter)
    const leadsCall = notionDataSourcesQuery.mock.calls[1][0];
    expect(leadsCall.page_size).toBe(10);
    // 3 conditions: status, interest, search (pageSize is not a filter)
    expect(leadsCall.filter.and).toHaveLength(3);
  });

  it("clamps pageSize between 10 and 100", async () => {
    const { GET } = await import("@/app/api/admin/leads/route");
    await GET(makeGet("admintest", "pageSize=1"));
    expect(notionDataSourcesQuery.mock.calls.at(-1)?.[0].page_size).toBe(10);
    notionDataSourcesQuery.mockClear();
    notionDataSourcesQuery.mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
    });
    notionDataSourcesQuery.mockResolvedValueOnce({
      results: [],
      has_more: false,
      next_cursor: null,
    });
    await GET(makeGet("admintest", "pageSize=999"));
    expect(notionDataSourcesQuery.mock.calls.at(-1)?.[0].page_size).toBe(100);
  });
});

describe("PATCH /api/admin/leads", () => {
  it("returns 401 without bearer token", async () => {
    const { PATCH } = await import("@/app/api/admin/leads/route");
    const res = await PATCH(makePatch(null, { pageId: "p", status: "Paid" }));
    expect(res.status).toBe(401);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("rejects invalid status values", async () => {
    const { PATCH } = await import("@/app/api/admin/leads/route");
    const res = await PATCH(
      makePatch("admintest", { pageId: "p", status: "Bogus" }),
    );
    expect(res.status).toBe(400);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
  });

  it("rejects missing pageId", async () => {
    const { PATCH } = await import("@/app/api/admin/leads/route");
    const res = await PATCH(makePatch("admintest", { status: "Paid" }));
    expect(res.status).toBe(400);
  });

  it("updates status when authorized and payload valid", async () => {
    const { PATCH } = await import("@/app/api/admin/leads/route");
    const res = await PATCH(
      makePatch("admintest", { pageId: "abc", status: "Contacted" }),
    );
    expect(res.status).toBe(200);
    expect(notionPagesUpdate).toHaveBeenCalledWith({
      page_id: "abc",
      properties: { Status: { select: { name: "Contacted" } } },
    });
  });
});
