import nodemailer from "nodemailer";
import { CONTACT } from "./constants";

type EmailResult = { success: true } | { success: false; error: string };

let transporter: nodemailer.Transporter | null = null;

/**
 * True when both Gmail SMTP credentials are present. Note this only checks
 * that the env vars are set — an invalid/expired app password (or one with a
 * trailing newline) still passes here but fails at send time.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  cc?: string
): Promise<EmailResult> {
  const t = getTransporter();
  if (!t) {
    // Loud on purpose: a missing GMAIL_USER/GMAIL_APP_PASSWORD means every
    // confirmation and notification silently drops. Surface it at error level.
    console.error(
      `sendEmail skipped — GMAIL_USER/GMAIL_APP_PASSWORD not configured (to: ${to})`
    );
    return { success: false, error: "Email not configured" };
  }

  try {
    await t.sendMail({
      from: `"Sam Morris" <${process.env.GMAIL_USER}>`,
      to,
      cc,
      subject,
      text,
    });
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown email error";
    console.error("sendEmail failed:", msg);
    return { success: false, error: msg };
  }
}

export async function notifySam(
  subject: string,
  text: string
): Promise<EmailResult> {
  return sendEmail(CONTACT.email, subject, text);
}
