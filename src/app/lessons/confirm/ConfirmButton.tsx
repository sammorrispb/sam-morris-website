"use client";

import { useState } from "react";

export function ConfirmButton({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleConfirm() {
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/lessons/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Confirmation failed");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return (
      <div className="space-y-2">
        <p className="text-accent-lime font-heading font-semibold text-lg">
          You&apos;re booked!
        </p>
        <p className="text-text-muted text-sm">
          Your invoice and calendar invite are on the way. See you on court.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleConfirm}
        disabled={state === "loading"}
        className="w-full text-white font-heading font-semibold py-3 rounded-lg btn-gradient disabled:opacity-50"
      >
        {state === "loading" ? "Confirming..." : "Confirm booking"}
      </button>
      {state === "error" && (
        <p role="alert" className="text-accent-pink text-sm">
          {error}{" "}
          <button onClick={handleConfirm} className="underline">
            Try again
          </button>
        </p>
      )}
    </div>
  );
}
