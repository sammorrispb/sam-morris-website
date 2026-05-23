"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  LIABILITY_HEADING,
  LIABILITY_BODY,
  MEDIA_HEADING,
  MEDIA_BODY,
  REFUND_HEADING,
  REFUND_BODY,
  PROGRAM_NAME,
  SUPPORT_EMAIL,
} from "@/lib/waiver/cohort-content";
import { PRICING } from "@/lib/coaching";
import { computeIsMinor } from "./state";
import { submitCohortSignup } from "./actions";

export default function CohortSignupPage() {
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isMinor = dob ? computeIsMinor(dob) : false;

  function handleSubmit(formData: FormData) {
    setError(null);
    setErrorField(null);
    startTransition(async () => {
      const result = await submitCohortSignup(formData);
      if (result.ok) {
        window.location.href = result.redirectUrl;
      } else {
        setError(result.error);
        setErrorField(result.field ?? null);
      }
    });
  }

  function errClass(field: string): string {
    return errorField === field
      ? "border-accent-pink focus:border-accent-pink"
      : "border-white/10 focus:border-accent-blue";
  }

  return (
    <main className="min-h-screen py-20 px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <Link
            href="/programs/cohort"
            className="text-text-muted hover:text-accent-blue text-sm inline-flex items-center gap-2"
          >
            ← Back to cohort details
          </Link>
        </div>

        <h1 className="font-heading font-black text-4xl md:text-5xl mb-3 leading-tight">
          Reserve your spot
        </h1>
        <p className="text-text-muted text-lg mb-10">
          {PROGRAM_NAME} · ${PRICING.cohortTotal} · {PRICING.cohortWeeks}{" "}
          weeks · {PRICING.cohortPlayers} players per cohort
        </p>

        <form action={handleSubmit} className="space-y-8">
          {/* Participant */}
          <fieldset className="space-y-4">
            <legend className="font-heading font-bold text-xl mb-3">
              Participant
            </legend>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="full_name">
                Full name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${errClass("full_name")} outline-none transition-colors`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${errClass("email")} outline-none transition-colors`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="phone">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="(301) 555-0142"
                required
                className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${errClass("phone")} outline-none transition-colors`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="dob">
                Date of birth *
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${errClass("dob")} outline-none transition-colors`}
              />
              <p className="text-text-muted text-xs mt-2">
                Used to determine if a parent/guardian signature is required.
              </p>
            </div>
          </fieldset>

          {/* Parent/guardian — minors only */}
          {isMinor && (
            <fieldset className="space-y-4 glass-card-amber rounded-2xl p-6">
              <legend className="font-heading font-bold text-xl mb-1">
                Parent / guardian
              </legend>
              <p className="text-text-muted text-sm mb-3">
                Required because the participant is under 18.
              </p>

              <div>
                <label className="block text-sm font-semibold mb-2" htmlFor="parent_name">
                  Parent/guardian name *
                </label>
                <input
                  type="text"
                  id="parent_name"
                  name="parent_name"
                  required={isMinor}
                  className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${errClass("parent_name")} outline-none transition-colors`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" htmlFor="parent_email">
                  Parent/guardian email *
                </label>
                <input
                  type="email"
                  id="parent_email"
                  name="parent_email"
                  required={isMinor}
                  className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${errClass("parent_email")} outline-none transition-colors`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" htmlFor="parent_phone">
                  Parent/guardian phone *
                </label>
                <input
                  type="tel"
                  id="parent_phone"
                  name="parent_phone"
                  required={isMinor}
                  className={`w-full px-4 py-3 rounded-lg bg-navy-light border ${errClass("parent_phone")} outline-none transition-colors`}
                />
              </div>
            </fieldset>
          )}

          {/* Waiver: liability */}
          <fieldset className="space-y-4">
            <legend className="font-heading font-bold text-xl mb-3">
              {LIABILITY_HEADING}
            </legend>
            <div className="text-text-muted text-sm leading-relaxed space-y-3">
              {LIABILITY_BODY.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="liability_consent"
                required
                className="mt-1 h-5 w-5 accent-accent-blue shrink-0"
              />
              <span className="text-sm">
                I have read and agree to the release of liability and assumption
                of risk above. *
              </span>
            </label>
          </fieldset>

          {/* Waiver: media */}
          <fieldset className="space-y-4">
            <legend className="font-heading font-bold text-xl mb-3">
              {MEDIA_HEADING}
            </legend>
            <div className="text-text-muted text-sm leading-relaxed space-y-3">
              {MEDIA_BODY.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="media_consent"
                required
                className="mt-1 h-5 w-5 accent-accent-blue shrink-0"
              />
              <span className="text-sm">
                I grant the photo, audio, video, and likeness release above. *
              </span>
            </label>
          </fieldset>

          {/* SMS opt-in */}
          <fieldset className="space-y-4">
            <legend className="font-heading font-bold text-xl mb-3">
              Text message updates (optional)
            </legend>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="sms_consent"
                className="mt-1 h-5 w-5 accent-accent-blue shrink-0"
              />
              <span className="text-sm text-text-muted leading-relaxed">
                Send me SMS reminders for cohort sessions and tournament
                logistics. Up to 6 messages per cohort. Msg & data rates may
                apply. Reply STOP to unsubscribe.
              </span>
            </label>
          </fieldset>

          {/* Other-coach disclosure */}
          <fieldset className="space-y-4">
            <legend className="font-heading font-bold text-xl mb-3">
              Current coaching
            </legend>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="other_coach"
                className="mt-1 h-5 w-5 accent-accent-blue shrink-0"
              />
              <span className="text-sm text-text-muted leading-relaxed">
                I currently train regularly with another pickleball coach.
              </span>
            </label>
            <p className="text-text-muted text-xs">
              We&apos;ll reach out before the cohort starts to make sure this
              fits cleanly alongside your existing coaching relationship.
            </p>
          </fieldset>

          {/* Notes */}
          <fieldset>
            <legend className="font-heading font-bold text-xl mb-3">
              Anything we should know? (optional)
            </legend>
            <textarea
              name="notes"
              rows={3}
              maxLength={500}
              placeholder="Skill level, prior experience, scheduling constraints, etc."
              className="w-full px-4 py-3 rounded-lg bg-navy-light border border-white/10 focus:border-accent-blue outline-none transition-colors"
            />
          </fieldset>

          {/* Refund policy disclosure */}
          <fieldset className="glass-card rounded-xl p-6">
            <legend className="font-heading font-bold text-lg mb-3 px-2">
              {REFUND_HEADING}
            </legend>
            <ul className="text-text-muted text-sm leading-relaxed space-y-2 list-disc pl-5">
              {REFUND_BODY.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </fieldset>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-accent-pink/40 bg-accent-pink/10 p-4 text-sm text-accent-pink">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full font-heading font-semibold px-6 py-4 rounded-full btn-gradient text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Saving waiver…"
                : `Continue to Payment → $${PRICING.cohortTotal}`}
            </button>
            <p className="text-text-muted text-xs mt-3 text-center">
              You&apos;ll be redirected to Stripe to complete payment. Your spot
              is reserved once payment clears.
            </p>
          </div>
        </form>

        <p className="text-text-muted text-xs mt-10 text-center">
          Questions? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent-blue hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}
