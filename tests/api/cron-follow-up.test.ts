import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notionDataSourcesQuery = vi.fn();
const notifySamMock = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: class {
    dataSources = { query: notionDataSourcesQuery };
  },
}));
vi.mock("@/lib/email", () => ({
  notifySam: notifySamMock,
}));

function makeRequest(authToken: string | null) {
  const headers = new Headers();
  if (authToken !== null) headers.set("Authorization", `Bearer ${authToken}`);
  return new Request("https://www.sammorrispb.com/api/cron/follow-up", {
    headers,
  });
}

function stalePage(
  overrides: Partial<{
    name: string;
    email: string;
    interest: string;
    status: string;
    submitted: string;
  }> = {},
) {
  return {
    properties: {
      Name: { title: [{ plain_text: overrides.name ?? "Pat" }] },
      Email: { email: overrides.email ?? "pat@example.com" },
      Interest: { select: { name: overrides.interest ?? "Coaching" } },
      Status: { select: { name: overrides.status ?? "Paid" } },
      "Date Submitted": {
        date: {
          start:
            overrides.submitted ?? new Date(Date.now() - 5 * 86400000).toISOString(),
        },
      },
    },
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  notifySamMock.mockResolvedValue(undefined);
  notionDataSourcesQuery.mockResolvedValue({ results: [] });
  process.env.CRON_SECRET = "cron-secret-xyz";
  process.env.NOTION_API_KEY = "secret_notion";
  process.env.NOTION_LEADS_DB_ID = "db_leads";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/cron/follow-up", () => {
  it("returns 401 when Authorization is missing", async () => {
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest(null));
    expect(res.status).toBe(401);
    expect(notionDataSourcesQuery).not.toHaveBeenCalled();
  });

  it("returns 401 when token does not match CRON_SECRET", async () => {
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("wrong"));
    expect(res.status).toBe(401);
  });

  it("returns 500 when Notion env unconfigured", async () => {
    delete process.env.NOTION_API_KEY;
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(res.status).toBe(500);
  });

  it("returns 'No stale leads' with count 0 when query returns empty", async () => {
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ message: "No stale leads", count: 0 });
    expect(notifySamMock).not.toHaveBeenCalled();
  });

  it("sends notifySam with stale-lead summary when results exist", async () => {
    notionDataSourcesQuery.mockResolvedValueOnce({
      results: [stalePage({ name: "Alice" }), stalePage({ name: "Bob" })],
    });
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(res.status).toBe(200);
    expect(notifySamMock).toHaveBeenCalledTimes(1);
    const [subject, body] = notifySamMock.mock.calls[0];
    expect(subject).toMatch(/2 stale leads/);
    expect(body).toContain("Alice");
    expect(body).toContain("Bob");
    expect(await res.json()).toMatchObject({ message: "Reminder sent", count: 2 });
  });

  it("filter targets the three stale-bucket disjuncts", async () => {
    const { GET } = await import("@/app/api/cron/follow-up/route");
    await GET(makeRequest("cron-secret-xyz"));
    expect(notionDataSourcesQuery).toHaveBeenCalledTimes(1);
    const filter = notionDataSourcesQuery.mock.calls[0][0].filter;
    expect(filter.or).toHaveLength(3);
  });

  it("returns 500 with error message on Notion failure", async () => {
    notionDataSourcesQuery.mockRejectedValueOnce(new Error("notion 503"));
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: "notion 503" });
  });
});
