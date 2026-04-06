"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ_QUESTIONS, QUIZ_RESULTS, calculateResult } from "@/lib/quiz";
import { track } from "@vercel/analytics";

export function QuizClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const isEmailStep = step === totalQuestions;
  const showResult = resultKey !== null;
  const result = resultKey ? QUIZ_RESULTS[resultKey] : null;

  function handleStart() {
    setStarted(true);
    track("quiz", { action: "started", page: "/quiz" });
  }

  function handleAnswer(points: number) {
    const newAnswers = [...answers, points];
    setAnswers(newAnswers);
    setStep(step + 1);
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const key = calculateResult(answers);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          interest: `Quiz Result: ${QUIZ_RESULTS[key].level} (${QUIZ_RESULTS[key].dupr})`,
        }),
      });
    } catch {
      // Lead capture is best-effort
    }

    setResultKey(key);
    setSubmitting(false);
    track("quiz", { action: "completed", result: key, page: "/quiz" });
  }

  // Intro screen
  if (!started) {
    return (
      <div className="text-center max-w-lg mx-auto">
        <div className="text-6xl mb-6">🏓</div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-4">
          Find out where you stand
        </h2>
        <p className="text-text-muted mb-8 leading-relaxed">
          Answer 6 quick questions about your pickleball game. We&apos;ll tell you your
          estimated skill level and recommend the perfect programs to help you improve.
        </p>
        <button
          onClick={handleStart}
          className="btn-gradient px-8 py-3 rounded-lg text-white font-bold text-lg"
        >
          Take the Quiz
        </button>
        <p className="text-text-muted text-xs mt-4">Takes about 1 minute</p>
      </div>
    );
  }

  // Result screen
  if (showResult && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
            {result.dupr} DUPR
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            You&apos;re a{result.level === "Advanced" || result.level === "Intermediate" ? "n" : ""} {result.level} Player
          </h2>
          <p className="text-text-muted leading-relaxed max-w-lg mx-auto">
            {result.description}
          </p>
        </div>

        <h3 className="text-xl font-heading font-semibold text-text-primary mb-6 text-center">
          Recommended Programs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {result.programs.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="glow-border rounded-xl p-5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
            >
              <h4 className="font-heading font-semibold text-text-primary group-hover:text-accent-blue transition-colors text-sm">
                {p.title}
              </h4>
              <p className="mt-1.5 text-text-muted text-xs leading-relaxed">
                {p.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="btn-gradient px-8 py-3 rounded-lg text-white font-bold inline-block"
          >
            Book a Free Evaluation
          </Link>
          <p className="text-text-muted text-xs mt-3">
            Get a personalized assessment from Coach Sam
          </p>
        </div>
      </div>
    );
  }

  // Email capture step
  if (isEmailStep) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
          Almost there!
        </h2>
        <p className="text-text-muted mb-8">
          Enter your name and email to see your personalized results and program recommendations.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-gradient px-8 py-3 rounded-lg text-white font-bold disabled:opacity-50"
          >
            {submitting ? "Loading..." : "See My Results"}
          </button>
        </form>
        <p className="text-text-muted text-xs mt-4">
          We&apos;ll send you personalized tips based on your level. No spam.
        </p>
      </div>
    );
  }

  // Question step
  const question = QUIZ_QUESTIONS[step];

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>Question {step + 1} of {totalQuestions}</span>
          <span>{Math.round(((step + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-heading font-bold text-text-primary mb-6">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt.points)}
            className="w-full text-left px-5 py-4 rounded-xl border border-white/10 hover:border-accent-blue/50 hover:bg-white/[0.03] transition-all text-text-primary text-sm leading-relaxed"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={handleBack}
          className="mt-6 text-text-muted hover:text-text-primary text-sm transition-colors"
        >
          &larr; Back
        </button>
      )}
    </div>
  );
}
