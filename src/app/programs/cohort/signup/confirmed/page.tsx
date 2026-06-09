import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/waiver/cohort-content";

export const metadata: Metadata = {
  title: "Cohort Signup Received — Coach Sam Pickleball",
  robots: { index: false, follow: false },
};

export default function CohortConfirmedPage() {
  return (
    <main className="min-h-screen py-24 px-6 flex items-center">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow mb-4">Signup received</p>
        <h1 className="font-heading font-black text-4xl md:text-5xl mb-5 leading-tight">
          You&apos;re on the list.
        </h1>
        <p className="text-text-muted text-lg leading-relaxed mb-8">
          Your waiver is on file. Coach Sam confirms your spot and sends an
          invoice once the cohort is set — you&apos;ll hear from him within 24
          hours with the start date, court location, roster, and the tournament
          we&apos;re pointing at.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/programs/cohort"
            className="inline-flex items-center justify-center font-heading font-semibold px-7 py-3.5 rounded-full btn-gradient text-base"
          >
            Back to cohort details
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-7 py-3.5 rounded-full text-base"
          >
            Email Coach Sam
          </a>
        </div>
      </div>
    </main>
  );
}
