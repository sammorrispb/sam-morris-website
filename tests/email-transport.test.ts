import { describe, expect, it } from "vitest";
import nodemailer from "nodemailer";
import { domainToASCII } from "node:url";

// Stream transport composes a real MIME message without DNS, SMTP or credentials.
const transport = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
  newline: "unix",
});

describe("Nodemailer transport compatibility and recipient isolation", () => {
  // GHSA-2g53-87p2-4qq8: preserve the domain a WHATWG/UTS-46
  // validator checked, including capital sigma before a numeric suffix.
  it.each(["to", "cc", "bcc"] as const)(
    "uses the canonical Unicode domain in the %s envelope",
    async (field) => {
      const domain = "ΠΑΣ1.example.invalid";
      const info = await transport.sendMail({
        from: "coach@example.invalid",
        [field]: `player@${domain}`,
        subject: "Synthetic Unicode recipient regression",
        text: "Offline composition only.",
      });
      expect(info.envelope.to).toEqual([`player@${domainToASCII(domain)}`]);
    },
  );

  // GHSA-3q53-mvfw-q9v8: whitespace or a comment before a dot must
  // not redirect delivery to the truncated, unintended domain.
  describe.each(["to", "cc", "bcc"] as const)("%s domain boundaries", (field) => {
    it.each([
      "player@untrusted.example.invalid .approved.example.invalid",
      "Player <player@untrusted.example.invalid(note).approved.example.invalid>",
    ])("retains the full domain for %s", async (address) => {
      const info = await transport.sendMail({
        from: "coach@example.invalid",
        [field]: address,
        subject: "Synthetic domain boundary regression",
        text: "Offline composition only.",
      });
      expect(info.envelope.to).toEqual([
        "player@untrusted.example.invalid.approved.example.invalid",
      ]);
    });
  });

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
