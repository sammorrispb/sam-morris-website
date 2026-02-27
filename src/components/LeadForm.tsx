"use client";

import { useState } from "react";
import { INTEREST_OPTIONS } from "@/lib/constants";

export function LeadForm({ heading = "Ready to Play?" }: { heading?: string }) {
  const [form, setForm] = useState({ name: "", email: "", interest: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStatus("sent");
      setForm({ name: "", email: "", interest: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-navy-light glow-border rounded-2xl p-8 text-center max-w-lg mx-auto">
        <div className="text-accent-lime text-4xl mb-4">✓</div>
        <h3 className="font-heading font-bold text-xl mb-2">You&apos;re in!</h3>
        <p className="text-text-muted">
          Thanks for reaching out. Sam will get back to you shortly.
        </p>
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
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-accent-blue focus:outline-none transition-colors"
      />

      <input
        type="email"
        placeholder="Your email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-accent-blue focus:outline-none transition-colors"
      />

      <select
        required
        value={form.interest}
        onChange={(e) => setForm({ ...form, interest: e.target.value })}
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
        className="w-full text-white font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
      >
        {status === "sending" ? "Sending..." : "Let's Go"}
      </button>

      {status === "error" && (
        <p className="text-accent-pink text-sm text-center">
          Something went wrong. Try again or email sam.morris2131@gmail.com directly.
        </p>
      )}
    </form>
  );
}
