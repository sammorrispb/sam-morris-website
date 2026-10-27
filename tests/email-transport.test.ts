import { describe, expect, it } from "vitest";
import nodemailer from "nodemailer";

// Stream transport composes a real MIME message without DNS, SMTP or credentials.
const transport = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
  newline: "unix",
});

describe("Nodemailer transport compatibility and recipient isolation", () => {
  it("preserves the intended To/Cc envelope and plain-text message", async () => {
    const info = await transport.sendMail({
      from: '"Coach Sam" <coach@example.invalid>',
      to: '"Player" <player@example.invalid>',
      cc: '"Copy" <copy@example.invalid>',
      subject: "Synthetic lesson confirmation",
      text: "Synthetic confirmation only. No booking or email was sent.",
    });
    expect(info.envelope).toEqual({
      from: "coach@example.invalid",
      to: ["player@example.invalid", "copy@example.invalid"],
    });
    expect(Buffer.isBuffer(info.message)).toBe(true);
    expect(info.message.toString()).toContain("Synthetic lesson confirmation");
    expect(info.message.toString()).toContain("Synthetic confirmation only.");
  });

  // GHSA-8c8m-p3m8-cjg8 and GHSA-m943-m63m-w62w: text inside a
  // nested comment or quoted group label must never become an SMTP recipient.
  it.each([
    "Player (one(two) <extra@example.invalid>) <player@example.invalid>",
    "Team: (a; <extra@example.invalid>) <player@example.invalid>;",
    'Team: "a;" "<extra@example.invalid>" <player@example.invalid>;',
  ])("does not deliver to an address embedded in display text: %s", async (to) => {
    const info = await transport.sendMail({
      from: "coach@example.invalid",
      to,
      subject: "Synthetic parser regression",
      text: "Synthetic input only.",
    });
    expect(info.envelope.to).toEqual(["player@example.invalid"]);
  });
});
