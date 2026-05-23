/**
 * Shared types + constants for the cohort signup form. Lives in a sibling
 * file (not in actions.ts) because Next.js 16 "use server" files only allow
 * async function exports — any const/type export crashes the bundle.
 */

export type CohortSignupResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; error: string; field?: string };

export type CohortSignupInput = {
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  liability_consent: boolean;
  media_consent: boolean;
  sms_consent: boolean;
  other_coach: boolean;
  notes?: string;
};

export function computeIsMinor(dob: string): boolean {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age < 18;
}

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}
