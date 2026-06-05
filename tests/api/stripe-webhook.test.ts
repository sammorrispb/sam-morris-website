import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const constructEventMock = vi.fn();
const notionPagesCreate = vi.fn();
const notionDataSourcesQuery = vi.fn();
const sendEmailMock = vi.fn();
const notifySamMock = vi.fn();
const generateEmailDraftMock = vi.fn(() => "Welcome body");
const createCoachingClientMock = vi.fn();
const upsertCommunityPlayerMock = vi.fn();

vi.mock("stripe", () => {
  class Stripe {
    webhooks = { constructEvent: constructEventMock };
  }
  return { default: Stripe };
});

vi.mock("@notionhq/client", () => ({
  Client: class {
    pages = { create: notionPagesCreate, update: vi.fn() };
    dataSources = { query: notionDataSourcesQuery };
  },
}));

vi.mock("@/lib/email", () => ({
  sendEmail: sendEmailMock,
  notifySam: notifySamMock,
}));

vi.mock("@/lib/emailTemplates", () => ({
  generateEmailDraft: generateEmailDraftMock,
}));

vi.mock("@/lib/coaching-crm", () => ({
  createCoachingClient: createCoachingClientMock,
}));

vi.mock("@/lib/supabase-community", () => ({
  upsertCommunityPlayer: upsertCommunityPlayerMock,
}));

function checkoutEvent(
  overrides: Partial<{
    amount_total: number;
    email: string;
    name: string;
    phone: string | null;
  }> = {},
) {
  return {
    id: "evt_test_1",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_1",
        customer_details: {
          email: overrides.email ?? "buyer@example.com",
          name: overrides.name ?? "Buyer One",
          phone: overrides.phone ?? null,
        },
        amount_total: overrides.amount_total ?? 13000,
      },
    },
  };
}

function makeRequest(body: string, sig: string | null) {
  const headers = new Headers();
  if (sig) headers.set("stripe-signature", sig);
  return new Request("https://www.sammorrispb.com/api/stripe/webhook", {
    method: "POST",
    headers,
    body,
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  generateEmailDraftMock.mockReturnValue("Welcome body");
  notionDataSourcesQuery.mockResolvedValue({ results: [] });
  notionPagesCreate.mockResolvedValue({ id: "page_1" });
  createCoachingClientMock.mockResolvedValue({
    skipped: false,
    clientPageId: "cc_1",
    skillCount: 0,
  });
  sendEmailMock.mockResolvedValue({ success: true });
  notifySamMock.mockResolvedValue(undefined);
  upsertCommunityPlayerMock.mockResolvedValue({ ok: true, playerId: "cp_1" });
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.NOTION_API_KEY = "secret_notion";
  process.env.NOTION_LEADS_DB_ID = "db_leads";
  process.env.NOTION_COACHING_CLIENTS_DB_ID = "db_clients";
  process.env.NOTION_COACHING_SKILLS_DB_ID = "db_skills";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/stripe/webhook", () => {
  it("rejects requests with no stripe-signature header", async () => {
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("{}", null));
    expect(res.status).toBe(400);
    expect(constructEventMock).not.toHaveBeenCalled();
  });

  it("rejects when STRIPE_WEBHOOK_SECRET is unset", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("{}", "sig_abc"));
    expect(res.status).toBe(400);
    expect(constructEventMock).not.toHaveBeenCalled();
  });

  it("returns 400 when stripe.webhooks.constructEvent throws", async () => {
    constructEventMock.mockImplementation(() => {
      throw new Error("bad signature");
    });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("payload", "sig_bad"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("bad signature");
    expect(notionPagesCreate).not.toHaveBeenCalled();
  });

  it("ignores non-checkout events (acks 200 without side effects)", async () => {
    constructEventMock.mockReturnValue({
      id: "evt_payment_intent",
      type: "payment_intent.succeeded",
      data: { object: {} },
    });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("payload", "sig_ok"));
    expect(res.status).toBe(200);
    expect(notionPagesCreate).not.toHaveBeenCalled();
    expect(notifySamMock).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("on duplicate Paid lead within last hour, skips Notion lead creation and acks 200", async () => {
    constructEventMock.mockReturnValue(checkoutEvent());
    notionDataSourcesQuery.mockResolvedValue({ results: [{ id: "dup" }] });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("payload", "sig_ok"));
    expect(res.status).toBe(200);
    expect(notionPagesCreate).not.toHaveBeenCalled();
  });

  it("happy path: creates lead, creates coaching client, notifies Sam, sends welcome", async () => {
    constructEventMock.mockReturnValue(checkoutEvent({ amount_total: 40000 }));
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("payload", "sig_ok"));
    expect(res.status).toBe(200);
    expect(notionPagesCreate).toHaveBeenCalledTimes(1);
    expect(createCoachingClientMock).toHaveBeenCalledTimes(1);
    const crmCall = createCoachingClientMock.mock.calls[0];
    expect(crmCall[3]).toMatchObject({
      email: "buyer@example.com",
      hoursPurchased: 4, // 4-Hour Package mapping
      source: "Stripe",
    });
    expect(notifySamMock).toHaveBeenCalledTimes(1);
    expect(notifySamMock.mock.calls[0][0]).toContain("4-Hour Package");
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock.mock.calls[0][0]).toBe("buyer@example.com");
  });

  it("downstream failures (Notion/CRM/email) never propagate — webhook still returns 200", async () => {
    constructEventMock.mockReturnValue(checkoutEvent());
    notionPagesCreate.mockRejectedValue(new Error("notion down"));
    createCoachingClientMock.mockRejectedValue(new Error("crm down"));
    notifySamMock.mockRejectedValue(new Error("smtp down"));
    sendEmailMock.mockRejectedValue(new Error("smtp down"));
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("payload", "sig_ok"));
    expect(res.status).toBe(200);
  });

  it("$130 single lesson maps to 1 hour purchased", async () => {
    constructEventMock.mockReturnValue(checkoutEvent({ amount_total: 13000 }));
    const { POST } = await import("@/app/api/stripe/webhook/route");
    await POST(makeRequest("payload", "sig_ok"));
    expect(createCoachingClientMock.mock.calls[0][3]).toMatchObject({
      hoursPurchased: 1,
    });
    // Custom amount (e.g. $150 Play-In) maps to 0 hours on coaching CRM
    constructEventMock.mockReturnValue(checkoutEvent({ amount_total: 15000 }));
    const { POST: POST2 } = await import("@/app/api/stripe/webhook/route");
    await POST2(makeRequest("payload", "sig_ok"));
    expect(createCoachingClientMock.mock.calls[1][3]).toMatchObject({
      hoursPurchased: 0,
    });
  });

  it("upserts the buyer into the L&D community spine with email/phone/name", async () => {
    constructEventMock.mockReturnValue(
      checkoutEvent({ email: "lessons@example.com", name: "Pat Buyer", phone: "+13015551234" }),
    );
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("payload", "sig_ok"));
    expect(res.status).toBe(200);
    expect(upsertCommunityPlayerMock).toHaveBeenCalledTimes(1);
    expect(upsertCommunityPlayerMock.mock.calls[0][0]).toMatchObject({
      name: "Pat Buyer",
      email: "lessons@example.com",
      phone: "+13015551234",
      raw: { source: "coach_sam_stripe", stripe_session_id: "cs_test_1", product: "Single Lesson" },
    });
  });

  it("spine upsert failure never propagates — webhook still returns 200", async () => {
    constructEventMock.mockReturnValue(checkoutEvent());
    upsertCommunityPlayerMock.mockRejectedValue(new Error("spine down"));
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(makeRequest("payload", "sig_ok"));
    expect(res.status).toBe(200);
  });
});
