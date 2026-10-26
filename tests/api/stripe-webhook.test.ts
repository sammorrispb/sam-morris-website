import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";
import { POST } from "@/app/api/stripe/webhook/route";

const offlineStripe = new Stripe("sk_test_offline");
const secret = "whsec_offline_payment_ownership";
const fetchMock = vi.fn(() => { throw new Error("Payment review must not make external calls"); });

function request(type = "checkout.session.completed", metadata: Record<string, string> = {}, options: { signature?: string; paid?: boolean } = {}) {
  const body = JSON.stringify({ id: "evt_synthetic", object: "event", type, data: { object: {
    id: "cs_synthetic", object: "checkout.session", mode: "payment", payment_status: options.paid === false ? "unpaid" : "paid",
    amount_total: 13000, customer_details: { email: "buyer@example.com", name: "Synthetic Buyer" }, metadata,
  } } });
  return new Request("https://www.sammorrispb.com/api/stripe/webhook", { method: "POST", body, headers: {
    "stripe-signature": options.signature ?? offlineStripe.webhooks.generateTestHeaderString({ payload: body, secret }),
  } });
}

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_offline");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", secret);
  vi.stubEnv("NOTION_API_KEY", "test_notion_unused");
  vi.stubEnv("NOTION_LEADS_DB_ID", "test_unused");
  vi.stubEnv("NOTION_COACHING_CLIENTS_DB_ID", "test_unused");
  vi.stubEnv("NOTION_COACHING_SKILLS_DB_ID", "test_unused");
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("payment ownership and retired fulfillment", () => {
  it("rejects unsigned requests before any downstream work", async () => {
    const response = await POST(new Request("https://example.com/api/stripe/webhook", { method: "POST", body: "{}" }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a signature for a different secret", async () => {
    const response = await POST(request("checkout.session.completed", {}, { signature: "t=1,v1=invalid" }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  for (const key of ["STRIPE_WEBHOOK_SECRET", "STRIPE_SECRET_KEY"]) {
    it(`fails closed if ${key} is missing`, async () => {
      vi.stubEnv(key, "");
      const response = await POST(request());
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  }

  it("ignores unrelated event types", async () => {
    const response = await POST(request("invoice.paid", { payment_owner: "sam_website" }));
    expect(await response.json()).toMatchObject({ received: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  for (const owner of ["coach_os", "nga_site", "p3", "unrecognized", ""]) {
    it(`does not fulfill ${owner || "empty"} owned purchases`, async () => {
      const response = await POST(request("checkout.session.completed", { payment_owner: owner }));
      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ skipped: "payment_not_owned" });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  }

  const legacyMetadata: Record<string, string>[] = [{}, { rsvp_id: "synthetic" }, { coach_os_attendee_id: "synthetic" }, { kind: "lesson" }, { session_id: "synthetic" }];
  for (const metadata of legacyMetadata) {
    it(`ignores untagged legacy checkout ${JSON.stringify(metadata)}`, async () => {
      const response = await POST(request("checkout.session.completed", metadata));
      expect(await response.json()).toMatchObject({ skipped: "payment_not_owned" });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  }

  it("acknowledges exact own-tagged payment for manual review without creating clients, hours or email", async () => {
    const response = await POST(request("checkout.session.completed", { payment_owner: "sam_website" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ skipped: "manual_review_required" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not fulfill repeated or concurrent own-tagged deliveries", async () => {
    const responses = await Promise.all(Array.from({ length: 3 }, () => POST(request("checkout.session.completed", { payment_owner: "sam_website" }))));
    for (const response of responses) expect(await response.json()).toMatchObject({ skipped: "manual_review_required" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not treat an unpaid checkout as a completed payment", async () => {
    const response = await POST(request("checkout.session.completed", { payment_owner: "sam_website" }, { paid: false }));
    expect(await response.json()).toMatchObject({ skipped: "not_paid" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
