"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CONTACT, INTEREST_OPTIONS, EVENT_TYPES, FREDERICK_VENUE } from "@/lib/constants";
import { trackEvent, getVisitorIdForForm, getUtm } from "@/lib/funnelClient";

// Frederick is sanctioned for private lessons only, so the location select
// stays hidden for every other interest.
const LOCATION_INTERESTS = new Set(["Private Lesson"]);
const MOCO_LOCATION = "Montgomery County / DC area — Sam comes to your court";

function matchInterestFromParam(param: string | null): string {
  if (!param) return "";
  const normalized = param.toLowerCase().replace(/[-_]/g, " ").trim();
  return (
    INTEREST_OPTIONS.find((opt) => opt.toLowerCase() === normalized) ??
    INTEREST_OPTIONS.find((opt) => opt.toLowerCase().includes(normalized)) ??
    ""
  );
}

export function LeadForm({
  heading = "Ready to play?",
  page = "unknown",
  lockedInterest,
  eventTypeRequired = false,
}: {
  heading?: string;
  page?: string;
  lockedInterest?: string;
  eventTypeRequired?: boolean;
}) {
  const [form, setForm] = useState(() => {
    // Read ?interest=… from the URL once at mount. window is unavailable
    // during the SSR pre-render of this Client Component; in that pass we
    // fall back to "" and the value lands on client hydration.
    const urlInterest =
      typeof window !== "undefined"
        ? matchInterestFromParam(
            new URLSearchParams(window.location.search).get("interest"),
          )
        : "";
    return {
      name: "",
      email: "",
      interest: lockedInterest ?? urlInterest,
      location: "",
      notes: "",
      event_type: "",
    };
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formStarted = useRef(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === "error") setStatus("idle");
    if (!formStarted.current) {
      formStarted.current = true;
      trackEvent("lead_form", { action: "started", page });
      trackEvent("lead_form_started", { interest: form.interest || undefined, page });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const utm = getUtm();
      const pageUrl =
        typeof window !== "undefined" ? window.location.pathname : page;
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          visitor_id: getVisitorIdForForm(),
          utm,
          page: pageUrl,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to submit");
      trackEvent("lead_form", { action: "submitted", interest: form.interest, page });
      trackEvent("lead_form_submitted", { interest: form.interest, page });
      setStatus("sent");
      setForm({
        name: "",
        email: "",
        interest: lockedInterest ?? "",
        location: "",
        notes: "",
        event_type: "",
      });
    } catch {
      trackEvent("lead_form", { action: "error", page });
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="glass-card-amber rounded-2xl p-8 text-center max-w-lg mx-auto"
      >
        <div className="text-accent-lime text-5xl mb-4">✓</div>
        <h3 className="font-heading font-bold text-2xl mb-3">You&apos;re in.</h3>
        <p className="text-text-muted mb-2">
          Check your email for a personal note from Sam.
        </p>
        <p className="text-text-muted text-sm mb-6">
          Replies typically within 24 hours.
        </p>
        <Link
          href="/programs"
          className="inline-block font-heading font-semibold py-3 px-7 rounded-full btn-gradient text-sm"
        >
          Explore Programs
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-7 md:p-8 max-w-lg mx-auto space-y-4 transition-all"
    >
      <h3 className="font-heading font-bold text-2xl mb-1">{heading}</h3>
      <p className="text-text-muted text-sm">
        Quick note from Sam in your inbox within a day.
      </p>

      <input
        type="text"
        placeholder="Your name"
        aria-label="Your name"
        required
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-accent-blue focus:outline-none transition-colors"
      />

      <input
        type="email"
        placeholder="Your email"
        aria-label="Your email"
        required
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-accent-blue focus:outline-none transition-colors"
      />

      {lockedInterest ? (
        <input type="hidden" name="interest" value={lockedInterest} />
      ) : (
        <select
          required
          aria-label="What are you interested in?"
          value={form.interest}
          onChange={(e) => updateField("interest", e.target.value)}
          className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
        >
          <option value="" disabled>What are you interested in?</option>
          {INTEREST_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {LOCATION_INTERESTS.has(form.interest) && (
        <select
          aria-label="Where would you like to train?"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
        >
          <option value="">Where would you like to train? (optional)</option>
          <option value={MOCO_LOCATION}>{MOCO_LOCATION}</option>
          <option value={FREDERICK_VENUE.label}>{FREDERICK_VENUE.label}</option>
        </select>
      )}

      {eventTypeRequired && (
        <select
          required
          aria-label="Event type"
          value={form.event_type}
          onChange={(e) => updateField("event_type", e.target.value)}
          className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
        >
          <option value="" disabled>Event type</option>
          {EVENT_TYPES.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      <textarea
        placeholder="Anything else? Skill level, preferred court, group size, days/times that work…"
        aria-label="Notes — skill, court, availability, group size"
        value={form.notes}
        onChange={(e) => updateField("notes", e.target.value)}
        rows={4}
        maxLength={1000}
        className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-accent-blue focus:outline-none transition-colors resize-none"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full font-heading font-semibold py-3.5 rounded-full btn-gradient disabled:opacity-50 text-base"
      >
        {status === "sending" ? "Sending..." : "Let's Go →"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-accent-pink text-sm text-center">
          Something went wrong. Try again, email{" "}
          <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>,
          or call{" "}
          <a href={`tel:${CONTACT.phone.replace(/-/g, "")}`} className="underline">{CONTACT.phone}</a>.
        </p>
      )}
    </form>
  );
}
