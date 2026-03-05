"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT, INTEREST_OPTIONS } from "@/lib/constants";

export function LeadForm({ heading = "Ready to Play?" }: { heading?: string }) {
  const [form, setForm] = useState({ name: "", email: "", interest: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStatus("sent");
      setForm({ name: "", email: "", interest: "" });
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  if (status === "sent") {
    return (
      <div role="status" aria-live="polite" className="bg-navy-light glow-border rounded-2xl p-8 text-center max-w-lg mx-auto">
        <div className="text-accent-lime text-4xl mb-4">✓</div>
        <h3 className="font-heading font-bold text-xl mb-2">You&apos;re in!</h3>
        <p className="text-text-muted mb-2">
          Check your email for a personal message from Sam.
        </p>
        <p className="text-text-muted text-sm mb-6">
          Sam typically responds within 24 hours.
        </p>
        <Link
          href="/programs"
          className="inline-block text-white font-heading font-semibold py-2.5 px-6 rounded-lg btn-gradient"
        >
          Explore Programs
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-navy-light glow-border glow-border-hover rounded-2xl p-8 max-w-lg mx-auto space-y-4 transition-all"
    >
      <h3 className="font-heading font-bold text-2xl text-center">{heading}</h3>

      <input
        type="text"
        placeholder="Your name"
        aria-label="Your name"
        required
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-accent-blue focus:outline-none transition-colors"
      />

      <input
        type="email"
        placeholder="Your email"
        aria-label="Your email"
        required
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-accent-blue focus:outline-none transition-colors"
      />

      <select
        required
        aria-label="What are you interested in?"
        value={form.interest}
        onChange={(e) => updateField("interest", e.target.value)}
        className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
      >
        <option value="" disabled>What are you interested in?</option>
        {INTEREST_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full text-white font-heading font-semibold py-3 rounded-lg btn-gradient disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Let's Go"}
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
