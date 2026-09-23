"use client";

import { useState } from "react";
import { TIME_SLOT_OPTIONS } from "@/lib/lessons";

export function CounterForm({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");
  const [dateLabel, setDateLabel] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/lessons/counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, date, time, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Suggestion failed");
      setDateLabel(data.dateLabel ?? "");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return (
      <div className="pt-2 border-t border-white/10">
        <p className="text-accent-lime font-heading font-semibold">
          Suggestion sent!
        </p>
        <p className="text-text-muted text-sm mt-1">
          Sam will take a look{dateLabel ? ` at ${dateLabel}` : ""} and send
          you a new confirm link if it works.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-text-muted text-sm underline underline-offset-2 hover:text-text-primary transition-colors"
      >
        That time doesn&apos;t work? Suggest a different time
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-4 border-t border-white/10 space-y-3 text-left"
    >
      <p className="font-heading font-semibold text-sm">
        Suggest a different time
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1">
            Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-navy border border-white/10 rounded-lg px-3 py-2.5 text-text-primary text-sm focus:border-accent-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1">
            Time (ET)
          </label>
          <select
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-navy border border-white/10 rounded-lg px-3 py-2.5 text-text-primary text-sm focus:border-accent-blue focus:outline-none"
          >
            <option value="" disabled>
              Select
            </option>
            {TIME_SLOT_OPTIONS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1">
          Note for Sam (optional)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. anytime after 6 works for me"
          maxLength={500}
          className="w-full bg-navy border border-white/10 rounded-lg px-3 py-2.5 text-text-primary text-sm focus:border-accent-blue focus:outline-none"
        />
      </div>
      {state === "error" && (
        <p role="alert" className="text-accent-pink text-sm">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={state === "loading"}
          className="flex-1 text-white font-heading font-semibold py-2.5 rounded-lg btn-gradient disabled:opacity-50 text-sm"
        >
          {state === "loading" ? "Sending..." : "Send suggestion"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2.5 rounded-lg border border-white/10 text-text-muted text-sm hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
