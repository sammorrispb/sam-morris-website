import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BackToTop } from "@/components/BackToTop";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { TrackedLink } from "@/components/TrackedLink";
import { faqJsonLd } from "@/lib/seo";
import { CONTACT } from "@/lib/constants";
import { hubUrl } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Free Pickleball Rating Evaluation — DMV | Coach Sam Morris",
  description:
    "Free 30-minute pickleball skill evaluation in the DMV. Get your rating, a personalized improvement plan, and a free Link & Dink account — with DUPR-certified Coach Sam Morris at Dill Dinkers Rockville & North Bethesda.",
  keywords: [
    "pickleball rating evaluation DMV",
    "DUPR rating Maryland",
    "free pickleball skill assessment",
    "pickleball evaluation Rockville",
    "pickleball evaluation North Bethesda",
    "what is my pickleball rating",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/evaluation" },
  openGraph: {
    title: "Free Pickleball Rating Evaluation — DMV",
    description:
      "Know your rating. Find the right games. Improve faster. Free 30-minute evaluation with Coach Sam.",
    url: "https://www.sammorrispb.com/evaluation",
    images: [
      {
        url: "/og?title=Free%20Rating%20Evaluation&subtitle=Know%20Your%20Level%20%C2%B7%20Find%20the%20Right%20Play%20%C2%B7%20DMV",
        width: 1200,
        height: 630,
        alt: "Free Pickleball Rating Evaluation with Coach Sam",
      },
    ],
  },
};

const STEPS = [
  {
    n: "1",
    title: "30-minute on-court session",
    body: "Rally, dink, serve, and play points with Coach Sam at Dill Dinkers Rockville or North Bethesda.",
  },
  {
    n: "2",
    title: "Get your rating + written plan",
    body: "DUPR-aligned skill level, three things you're doing well, and the two highest-leverage fixes to work on next.",
  },
  {
    n: "3",
    title: "Get placed in the right play",
    body: "We route you to the right clinics, open play, and groups on Link & Dink so you stop guessing and start improving.",
  },
];

const FAQS = [
  {
    q: "Is this really free?",
    a: "Yes — free for every player in the DMV, no membership required. We cover the court; you bring a paddle.",
  },
  {
    q: "What will I walk away with?",
    a: "A skill rating, a short written improvement plan, and a free Link & Dink account that tracks your level and matches you to the right play over time.",
  },
  {
    q: "Do I need experience?",
    a: "No. Brand-new players, returning players, and 4.0+ competitors all benefit. The plan is calibrated to wherever you are today.",
  },
  {
    q: "Where does it happen?",
    a: "Dill Dinkers Rockville or Dill Dinkers North Bethesda — whichever is closer. Both are indoor, year-round facilities.",
  },
];

export default function EvaluationPage() {
  return (
    <>
      <BackToTop />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(FAQS.map((f) => ({ question: f.q, answer: f.a })))
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/10 via-transparent to-accent-blue/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-accent-pink font-semibold tracking-wide uppercase text-sm mb-4">
                Free for DMV players · Limited weekly spots
              </p>
              <h1 className="font-heading font-bold text-4xl md:text-6xl leading-tight mb-6">
                Know your rating.
                <br />
                <span className="text-accent-pink">Find the right play.</span>
              </h1>
              <p className="text-text-muted text-lg md:text-xl mb-8 leading-relaxed">
                A free 30-minute pickleball evaluation with DUPR-certified Coach
                Sam Morris. Walk out with a skill rating, a personalized
                improvement plan, and the right games to join — so you stop
                guessing and start improving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <TrackedLink
                  eventProps={{ label: "Book My Free Evaluation", page: "evaluation", section: "hero" }}
                  href="/contact?interest=evaluation"
                  className="inline-block bg-accent-pink hover:bg-accent-pink/90 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105"
                >
                  Book My Free Evaluation
                </TrackedLink>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="inline-block border border-white/20 hover:border-accent-pink text-text font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Call {CONTACT.phone}
                </a>
              </div>
              <p className="text-text-muted text-sm mt-6">
                Dill Dinkers Rockville · Dill Dinkers North Bethesda
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-navy-light">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-4">
              What happens in 30 minutes
            </h2>
            <p className="text-text-muted text-center max-w-2xl mx-auto mb-12">
              No sales pitch. Just court time, honest feedback, and a clear
              next step.
            </p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {STEPS.map((step) => (
              <AnimateOnScroll key={step.n}>
                <div className="bg-navy glow-border rounded-xl p-6 h-full">
                  <div className="text-accent-pink font-heading font-bold text-4xl mb-3">
                    {step.n}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">{step.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
                Playing at the wrong level is the #1 reason players quit
              </h2>
              <p className="text-text-muted text-lg leading-relaxed mb-4">
                Too easy and you plateau. Too hard and you lose every point.
                Either way, you stop having fun — and you stop getting better.
              </p>
              <p className="text-text-muted text-lg leading-relaxed mb-4">
                An honest rating fixes that. You find games where the score is
                close, the points are longer, and every session teaches you
                something. That&apos;s how improvement compounds.
              </p>
              <p className="text-text-muted text-lg leading-relaxed">
                Your evaluation includes a free{" "}
                <TrackedExternalLink
                  href={hubUrl("/", { utm_campaign: "evaluation_lp" })}
                  label="Link & Dink"
                  page="evaluation"
                  className="text-accent-blue hover:text-accent-pink underline"
                >
                  Link &amp; Dink
                </TrackedExternalLink>{" "}
                account so your rating travels with you — to clinics, open play,
                leagues, and matches across the DMV.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-navy-light">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
              Questions
            </h2>
          </AnimateOnScroll>
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq) => (
              <AnimateOnScroll key={faq.q}>
                <div className="bg-navy glow-border rounded-xl p-6">
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-text-muted leading-relaxed">{faq.a}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <AnimateOnScroll>
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-6">
              Ready to know your level?
            </h2>
            <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
              Grab a free 30-minute slot. Leave with a rating, a plan, and the
              right games to join.
            </p>
            <TrackedLink
              eventProps={{ label: "Book My Free Evaluation", page: "evaluation", section: "final" }}
              href="/contact?interest=evaluation"
              className="inline-block bg-accent-pink hover:bg-accent-pink/90 text-white font-semibold px-10 py-5 rounded-lg text-lg transition-all hover:scale-105"
            >
              Book My Free Evaluation
            </TrackedLink>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
