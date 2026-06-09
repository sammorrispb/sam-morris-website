import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BackToTop } from "@/components/BackToTop";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { COHORT_POOL_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "4-Week Training Cohorts — Coach Sam | DMV Pickleball",
  description: `Small-group, 4-week pickleball cohorts with Coach Sam. 4 players, 4 weeks, one all-in price. Ends with paired entry into a local tournament. Surfaced by Link & Dink.`,
  keywords: [
    "pickleball cohort Montgomery County",
    "pickleball training series Maryland",
    "small group pickleball lessons DMV",
    "youth pickleball cohort",
    "pickleball tournament prep",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/cohort" },
  openGraph: {
    title: "4-Week Training Cohorts — Coach Sam Pickleball",
    description: `4 players, 4 weeks, one all-in price. Ends at a local tournament.`,
    url: "https://www.sammorrispb.com/programs/cohort",
    images: [
      {
        url: `/og?title=4-Week%20Cohorts&subtitle=4%20players%20%C2%B7%204%20weeks%20%C2%B7%20one%20tournament`,
        width: 1200,
        height: 630,
        alt: "Coach Sam 4-Week Training Cohorts",
      },
    ],
  },
};

const PILLARS = [
  {
    title: "Same 4 players, 4 weeks",
    body: "Real chemistry, real reps. No drop-in shuffle, no waiting your turn. Everyone gets coached every session.",
  },
  {
    title: "Recorded sessions",
    body: "Audio, photo, and video captured every session. Used for between-week coaching review, social-media instructional clips, and Coach Up training. Youth footage never publicly tagged with names.",
  },
  {
    title: "Ends at a real tournament",
    body: "Week 4 pairs you with a cohort partner and enters you into the next local tournament from the L&D tournament radar. Cohort training, real-game finish.",
  },
  {
    title: "Level + age grouped",
    body: "We sort cohorts so you train with players at your level. Youth and adult cohorts run separately. Mixed-gender by default; gendered cohorts once volume allows.",
  },
];

const FAQS = [
  {
    q: "Who is this for?",
    a: "Players who want to commit to real improvement and have a tournament to point at. Strong fit for intermediate players climbing toward 3.5-4.0, and youth players ready for their first competitive event.",
  },
  {
    q: "What's the schedule?",
    a: "New cohorts start on the first Saturday (Walter Johnson HS, Bethesda, 6:30-7:30 PM) and first Sunday (Gaithersburg HS, 6:30-7:30 PM) of each month, right after Coach Sam's drop-in sessions. Cohorts run 4 consecutive weekends from start. Email for the next start date.",
  },
  {
    q: "What if I miss a session?",
    a: "Cohorts run on a fixed calendar — there are no make-ups. Plan to be at all 4 sessions. If Coach Sam cancels a session (weather, conflict), you get a make-up or a prorated refund.",
  },
  {
    q: "Refunds?",
    a: "Full refund anytime before week 1 starts. After week 1 begins, no refunds — the cohort is built around your 4-player roster and we can't replace mid-stream.",
  },
  {
    q: "Is the tournament entry included?",
    a: "Yes. The all-in cohort price covers your four training sessions plus entry into the cohort-ending tournament — one commitment, no add-ons. Coach Sam picks the tournament based on your cohort's level and age band, and pairs you with a partner from the cohort.",
  },
  {
    q: "What if the tournament gets cancelled?",
    a: "Coach Sam picks a substitute local tournament within 30 days of your cohort end date. No refund is issued if a substitute is offered. (Rainouts and last-minute organizer cancellations happen — we plan for them.)",
  },
  {
    q: "I already train with another coach — can I join?",
    a: "Please check with your current coach first. We focus on community cohorts and don't want to step on existing coaching relationships.",
  },
  {
    q: "What's recorded — and is it safe for my kid?",
    a: "Every cohort session is recorded with audio, photos, and video. Footage is used for instructional clips, marketing on Instagram/TikTok/YouTube, and Coach Up training. For minors specifically: footage is never sold to third parties, and faces of minors are never publicly tagged or captioned with first or last names on social media. Full media-release language is on the signup form before payment.",
  },
];

export default function CohortPage() {
  return (
    <>
      <BackToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Programs", href: "/programs" },
              { name: "4-Week Cohorts", href: "/programs/cohort" },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(FAQS.map((f) => ({ question: f.q, answer: f.a })))
          ),
        }}
      />

      {/* ─── Hero ─── */}
      <section className="relative min-h-[75vh] flex items-end hero-full-bleed -mt-16 pt-16 overflow-hidden">
        <Image
          src="/images/sam-group-selfie.jpg"
          alt="Coach Sam coaching a small group"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full pb-20 pt-32">
          <AnimateOnScroll>
            <div className="max-w-3xl">
              <p className="eyebrow mb-4">4-Week Training Cohorts · Surfaced by Link &amp; Dink</p>
              <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
                4 weeks. 4 players.{" "}
                <span className="gradient-text-warm">One tournament.</span>
              </h1>
              <p className="text-text-primary/85 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
                A small-group training series that builds chemistry, then ships
                you to a local tournament with a partner you&apos;ve actually
                practiced with. One all-in price per player, tournament
                entry included.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={COHORT_POOL_URL}
                  className="inline-flex items-center justify-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
                >
                  Join the cohort pool →
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
                >
                  How it works
                </a>
              </div>
              <p className="text-text-muted text-sm mt-6">
                Saturdays at Walter Johnson HS · Sundays at Gaithersburg HS · Cap 4 per cohort
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Why it works ─── */}
      <section id="how-it-works" className="py-24 px-6 scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">Why it works</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 leading-tight">
                The committed-group{" "}
                <span className="gradient-text-warm">unlock.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Drop-in lessons are great for showing up. Cohorts are great for
                actually improving — because you train with the same players
                every week.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {PILLARS.map((card) => (
              <AnimateOnScroll key={card.title}>
                <div className="glass-card p-8 h-full">
                  <h3 className="font-heading font-bold text-xl mb-3">
                    {card.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">{card.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="py-24 px-6 bg-navy-light">
        <AnimateOnScroll>
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">Pricing</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 leading-tight">
                One price.{" "}
                <span className="gradient-text-warm">One commitment.</span>
              </h2>
            </div>

            <div className="glass-card-amber rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="font-heading font-bold text-xl text-text-primary">
                  4-Week Cohort
                </div>
                <span className="brand-badge brand-badge-sm">
                  Tournament entry included
                </span>
              </div>
              <p className="text-text-muted text-sm mb-4">
                4 sessions × 1 hour · 4-player roster ·
                paired tournament entry on or after week 4
              </p>
              <p className="text-accent-lime text-sm font-semibold mb-6">
                One all-in price — training plus your tournament entry, bundled.
              </p>
              <Link
                href={COHORT_POOL_URL}
                className="inline-block w-full text-center font-heading font-semibold px-6 py-4 rounded-full btn-gradient text-base"
              >
                Join the cohort pool →
              </Link>
              <p className="text-text-muted text-xs mt-4 text-center">
                Training plus tournament entry, one commitment. Sam confirms your
                spot and sends an invoice once the cohort is set.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-6">
        <AnimateOnScroll>
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">FAQ</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 leading-tight">
                Common <span className="gradient-text-warm">questions.</span>
              </h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="glass-card p-6 rounded-xl group"
                >
                  <summary className="font-heading font-semibold text-lg text-text-primary cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-accent-blue text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-text-muted leading-relaxed mt-4">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="relative py-24 px-6 hero-spotlight overflow-hidden">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading font-black text-3xl md:text-5xl mb-5 leading-tight">
            Train with intention.{" "}
            <span className="gradient-text-warm">Compete with a plan.</span>
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            4 spots per cohort. New cohorts launch
            monthly through August. Reserve before the roster closes.
          </p>
          <Link
            href={COHORT_POOL_URL}
            className="inline-flex items-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
          >
            Join the cohort pool →
          </Link>
        </div>
      </section>
    </>
  );
}
