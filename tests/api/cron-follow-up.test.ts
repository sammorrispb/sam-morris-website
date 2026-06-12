import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notionDataSourcesQuery = vi.fn();
const notionPagesUpdate = vi.fn();
const notifySamMock = vi.fn();
const sendEmailMock = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: class {
    dataSources = { query: notionDataSourcesQuery };
    pages = { update: notionPagesUpdate };
  },
}));
vi.mock("@/lib/email", () => ({
  notifySam: notifySamMock,
  sendEmail: sendEmailMock,
}));

function makeRequest(authToken: string | null, query: string = "") {
  const headers = new Headers();
  if (authToken !== null) headers.set("Authorization", `Bearer ${authToken}`);
  return new Request(`https://www.sammorrispb.com/api/cron/follow-up${query}`, {
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

// A lead row as the phase-1 drip query sees it (Status=New, Email Sent=true,
// Drip Opted Out=false, Drip Step<3 — the filter is mocked, so the shape is
// what matters).
function dripPage(
  overrides: Partial<{
    id: string;
    name: string;
    email: string;
    interest: string;
    dripStep: number;
    submittedDaysAgo: number;
    lastDripSent: string | null;
  }> = {},
) {
  const submittedDaysAgo = overrides.submittedDaysAgo ?? 3;
  return {
    id: overrides.id ?? "page-1",
    properties: {
      Name: { title: [{ plain_text: overrides.name ?? "Dana" }] },
      Email: { email: overrides.email ?? "dana@example.com" },
      Interest: { select: { name: overrides.interest ?? "Free Evaluation" } },
      Status: { select: { name: "New" } },
      "Drip Step": { number: overrides.dripStep ?? 0 },
      "Date Submitted": {
        date: { start: new Date(Date.now() - submittedDaysAgo * 86400000).toISOString() },
      },
      "Last Drip At":
        overrides.lastDripSent !== undefined && overrides.lastDripSent !== null
          ? { date: { start: overrides.lastDripSent } }
          : { date: null },
    },
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  notifySamMock.mockResolvedValue({ success: true });
  sendEmailMock.mockResolvedValue({ success: true });
  notionDataSourcesQuery.mockResolvedValue({ results: [] });
  notionPagesUpdate.mockResolvedValue({});
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
    notionDataSourcesQuery
      .mockResolvedValueOnce({ results: [] }) // phase 1: drip query
      .mockResolvedValueOnce({
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
    // Call 0 is the phase-1 drip query; call 1 is the stale-nag query.
    expect(notionDataSourcesQuery).toHaveBeenCalledTimes(2);
    const filter = notionDataSourcesQuery.mock.calls[1][0].filter;
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

describe("GET /api/cron/follow-up — drip phase", () => {
  it("claims the step in Notion BEFORE sending the drip email", async () => {
    notionDataSourcesQuery
      .mockResolvedValueOnce({ results: [dripPage({ submittedDaysAgo: 3, dripStep: 0 })] })
      .mockResolvedValueOnce({ results: [] });
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(res.status).toBe(200);

    expect(notionPagesUpdate).toHaveBeenCalledTimes(1);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    // Claim-then-send ordering — update must precede send.
    expect(notionPagesUpdate.mock.invocationCallOrder[0]).toBeLessThan(
      sendEmailMock.mock.invocationCallOrder[0],
    );
    const updateArgs = notionPagesUpdate.mock.calls[0][0];
    expect(updateArgs.page_id).toBe("page-1");
    expect(updateArgs.properties["Drip Step"]).toEqual({ number: 1 });
    expect(updateArgs.properties["Last Drip At"].date.start).toBe(
      new Date().toISOString().slice(0, 10),
    );
    const [to, subject, body] = sendEmailMock.mock.calls[0];
    expect(to).toBe("dana@example.com");
    expect(subject).toBeTruthy();
    expect(body).toContain("/api/drip/unsubscribe?id=page-1&sig=");

    const json = await res.json();
    expect(json.drip).toMatchObject({ sent: 1, failed: 0 });
  });

  it("skips a lead whose next step is not yet due", async () => {
    notionDataSourcesQuery
      .mockResolvedValueOnce({ results: [dripPage({ submittedDaysAgo: 1, dripStep: 0 })] })
      .mockResolvedValueOnce({ results: [] });
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(notionPagesUpdate).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
    const json = await res.json();
    expect(json.drip.rows[0].action).toBe("skipped_not_due");
  });

  it("skips a lead already dripped today (UTC date compare)", async () => {
    const todayUtc = new Date().toISOString().slice(0, 10);
    notionDataSourcesQuery
      .mockResolvedValueOnce({
        results: [dripPage({ submittedDaysAgo: 6, dripStep: 1, lastDripSent: todayUtc })],
      })
      .mockResolvedValueOnce({ results: [] });
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(notionPagesUpdate).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
    const json = await res.json();
    expect(json.drip.rows[0].action).toBe("skipped_sent_today");
  });

  it("skips + flags a lead older than 14 days without sending", async () => {
    notionDataSourcesQuery
      .mockResolvedValueOnce({ results: [dripPage({ submittedDaysAgo: 20, dripStep: 0 })] })
      .mockResolvedValueOnce({ results: [] });
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(notionPagesUpdate).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
    const json = await res.json();
    expect(json.drip.agedOut).toBe(1);
    expect(json.drip.rows[0].action).toBe("skipped_aged_out");
  });

  it("?dry=1 computes candidates with zero sends and zero Notion updates", async () => {
    notionDataSourcesQuery
      .mockResolvedValueOnce({ results: [dripPage({ submittedDaysAgo: 3, dripStep: 0 })] })
      .mockResolvedValueOnce({ results: [] });
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz", "?dry=1"));
    expect(res.status).toBe(200);
    expect(notionPagesUpdate).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
    const json = await res.json();
    expect(json.drip.dryRun).toBe(true);
    expect(json.drip.sent).toBe(0);
    expect(json.drip.rows[0]).toMatchObject({
      action: "dry_run_candidate",
      email: "dana@example.com",
      step: 1,
    });
  });

  it("on send failure: notifies Sam, keeps the step claimed, continues", async () => {
    notionDataSourcesQuery
      .mockResolvedValueOnce({
        results: [
          dripPage({ id: "page-fail", submittedDaysAgo: 3, dripStep: 0, email: "fail@example.com" }),
          dripPage({ id: "page-ok", submittedDaysAgo: 3, dripStep: 0, email: "ok@example.com" }),
        ],
      })
      .mockResolvedValueOnce({ results: [] });
    sendEmailMock
      .mockResolvedValueOnce({ success: false, error: "smtp down" })
      .mockResolvedValueOnce({ success: true });
    const { GET } = await import("@/app/api/cron/follow-up/route");
    const res = await GET(makeRequest("cron-secret-xyz"));
    expect(res.status).toBe(200);

    // Step stays incremented for the failed lead (claim is never rolled back)
    const failedUpdate = notionPagesUpdate.mock.calls.find(
      (c) => c[0].page_id === "page-fail",
    );
    expect(failedUpdate?.[0].properties["Drip Step"]).toEqual({ number: 1 });
    // Sam was told about the failure
    expect(notifySamMock).toHaveBeenCalledWith(
      expect.stringMatching(/Drip step 1 send failed/),
      expect.stringContaining("fail@example.com"),
    );
    // ...and the loop continued to the second lead
    const json = await res.json();
    expect(json.drip).toMatchObject({ sent: 1, failed: 1 });
  });
});
