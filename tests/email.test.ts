import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONTACT } from "../src/lib/constants";

const mocks = vi.hoisted(() => ({ createTransport: vi.fn(), sendMail: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport: mocks.createTransport } }));

beforeEach(() => {
  vi.resetModules();
  mocks.createTransport.mockReset().mockReturnValue({ sendMail: mocks.sendMail });
  mocks.sendMail.mockReset().mockResolvedValue({ messageId: "synthetic-message" });
  vi.stubEnv("GMAIL_USER", "coach@example.invalid");
  vi.stubEnv("GMAIL_APP_PASSWORD", "synthetic-password");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("website email adapter", () => {
  it("does not construct or send a transport without complete configuration", async () => {
    vi.stubEnv("GMAIL_APP_PASSWORD", "");
    const email = await import("../src/lib/email");
    expect(email.isEmailConfigured()).toBe(false);
    expect(await email.sendEmail("player@example.invalid", "Synthetic", "Body")).toEqual({ success: false, error: "Email not configured" });
    expect(mocks.createTransport).not.toHaveBeenCalled();
    expect(mocks.sendMail).not.toHaveBeenCalled();
  });

  it("retains secure Gmail SMTP options, the requested recipients and transport reuse", async () => {
    const email = await import("../src/lib/email");
    expect(email.isEmailConfigured()).toBe(true);
    expect(await email.sendEmail("player@example.invalid", "Synthetic", "Body", "copy@example.invalid")).toEqual({ success: true });
    expect(mocks.createTransport).toHaveBeenCalledExactlyOnceWith({
      host: "smtp.gmail.com", port: 465, secure: true,
      auth: { user: "coach@example.invalid", pass: "synthetic-password" },
    });
    expect(mocks.sendMail).toHaveBeenCalledExactlyOnceWith({
      from: '"Sam Morris" <coach@example.invalid>', to: "player@example.invalid",
      cc: "copy@example.invalid", subject: "Synthetic", text: "Body",
    });
    await email.sendEmail("second@example.invalid", "Second synthetic", "Body");
    expect(mocks.createTransport).toHaveBeenCalledTimes(1);
  });

  it("preserves a structured failure when the transport rejects", async () => {
    mocks.sendMail.mockRejectedValue(new Error("Synthetic transport refusal"));
    const email = await import("../src/lib/email");
    expect(await email.sendEmail("player@example.invalid", "Synthetic", "Body")).toEqual({ success: false, error: "Synthetic transport refusal" });
  });

  it("keeps owner notifications addressed to the configured public contact", async () => {
    const email = await import("../src/lib/email");
    expect(await email.notifySam("Synthetic owner notice", "Body")).toEqual({ success: true });
    expect(mocks.sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: CONTACT.email, subject: "Synthetic owner notice", cc: undefined }));
  });
});
