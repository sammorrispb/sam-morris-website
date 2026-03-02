import nodemailer from "nodemailer";
import { CONTACT } from "./constants";

type EmailResult = { success: true } | { success: false; error: string };

let transporter: nodemailer.Transporter | null = null;

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
  text: string
): Promise<EmailResult> {
  const t = getTransporter();
  if (!t) return { success: false, error: "Email not configured" };

  try {
    await t.sendMail({
      from: `"Sam Morris" <${process.env.GMAIL_USER}>`,
      to,
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
