import type { Metadata } from "next";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BackToTop } from "@/components/BackToTop";
import { TrackedLink } from "@/components/TrackedLink";
import { faqJsonLd } from "@/lib/seo";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Pickleball Rating Evaluation — DMV | Coach Sam Morris",
  description:
    "Free 30-minute pickleball skill evaluation in the DMV. Get your rating and a personalized improvement plan with DUPR-certified Coach Sam Morris in Montgomery County, MD.",
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
    n: "01",
    title: "30-minute on-court session",
    body: "Rally, dink, serve, and play points with Coach Sam. We meet at a court in Montgomery County.",
  },
  {
    n: "02",
    title: "Get your rating + written plan",
    body: "DUPR-aligned skill level, three things you're doing well, and the two highest-leverage fixes to work on next.",
  },
  {
    n: "03",
    title: "Know what to play next",
    body: "Walk away with a clear next step — the kinds of clinics, open play, and groups that match your level.",
  },
];

const FAQS = [
  {
    q: "Is this really free?",
    a: "Yes — free for every player in the DMV, no membership required. We cover the court; you bring a paddle.",
  },
  {
    q: "What will I walk away with?",
    a: "A skill rating and a short written improvement plan tailored to your level.",
  },
  {
    q: "Do I need experience?",
    a: "No. Brand-new players, returning players, and 4.0+ competitors all benefit. The plan is calibrated to wherever you are today.",
  },
  {
    q: "Where does it happen?",
    a: "On a court in Montgomery County, MD — exact location confirmed when you book.",
  },
];

export default function EvaluationPage() {
  return (
    <>
      <BackToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(FAQS.map((f) => ({ question: f.q, answer: f.a })))
          ),
        }}
      />

      {/* ─── Full-Bleed Hero ─── */}
      <section className="relative min-h-[85vh] flex items-end hero-full-bleed -mt-16 pt-16 overflow-hidden">
        <Image
          src="/images/sam-portrait-with-paddle.jpg"
          alt="Sam Morris — pickleball evaluation"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full pb-20 pt-32">
          <AnimateOnScroll>
            <div className="max-w-3xl">
              <p className="eyebrow text-accent-pink mb-4">
                Free for DMV players · Limited weekly spots
              </p>
              <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
                Know your rating.
                <br />
                Find the <span className="gradient-text-warm">right play.</span>
              </h1>
              <p className="text-text-primary/85 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
                A free 30-minute pickleball evaluation with DUPR-certified Coach
                Sam Morris. Walk out with a skill rating, a personalized
                improvement plan, and the right games to join — so you stop
                guessing and start improving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <TrackedLink
                  eventProps={{ label: "Book My Free Evaluation", page: "evaluation", section: "hero", destination: "/contact?interest=evaluation" }}
                  href="/contact?interest=evaluation"
                  className="inline-flex items-center justify-center btn-ember font-heading font-semibold px-8 py-4 rounded-full text-base"
                >
                  Book My Free Evaluation
                </TrackedLink>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
                >
                  Call {CONTACT.phone}
                </a>
              </div>
              <p className="text-text-muted text-sm mt-6">
                Montgomery County, MD
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">How it works</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 leading-tight">
                What happens in <span className="gradient-text-warm">30 minutes.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                No sales pitch. Just court time, honest feedback, and a clear next step.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {STEPS.map((step) => (
              <AnimateOnScroll key={step.n}>
                <div className="glass-card p-8 h-full">
                  <div className="text-accent-pink font-mono font-bold text-2xl mb-4 tracking-tight">
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

      {/* ─── Why it matters — photo backdrop ─── */}
      <section className="relative section-photo-backdrop py-24 px-6">
        <div className="photo-bg">
          <Image
            src="/images/outdoor-action-shot.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto">
            <p className="eyebrow mb-3">Why it matters</p>
            <h2 className="font-heading font-black text-3xl md:text-5xl mb-8 leading-tight">
              Playing at the wrong level is the <span className="gradient-text-warm">#1 reason players quit.</span>
            </h2>
            <div className="space-y-5 text-text-muted text-lg leading-relaxed">
              <p>
                Too easy and you plateau. Too hard and you lose every point.
                Either way, you stop having fun — and you stop getting better.
              </p>
              <p>
                An honest rating fixes that. You find games where the score is
                close, the points are longer, and every session teaches you
                something. That&apos;s how improvement compounds.
              </p>
              <p>
                You&apos;ll leave with a calibrated rating and a short plan that
                tells you exactly what to work on next — and what kinds of
                games to seek out so every session moves you forward.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">Questions</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight">
                Good <span className="gradient-text-warm">questions.</span>
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <AnimateOnScroll key={faq.q}>
                <div className="glass-card p-7">
                  <h3 className="font-heading font-bold text-lg mb-2 text-text-primary">
                    {faq.q}
                  </h3>
                  <p className="text-text-muted leading-relaxed">{faq.a}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative py-28 px-6 hero-spotlight overflow-hidden">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateOnScroll>
            <h2 className="font-heading font-black text-4xl md:text-6xl mb-6 leading-tight">
              Ready to know <span className="gradient-text-warm">your level?</span>
            </h2>
            <p className="text-text-muted text-lg mb-10 max-w-2xl mx-auto">
              Grab a free 30-minute slot. Leave with a rating, a plan, and the
              right games to join.
            </p>
            <TrackedLink
              eventProps={{ label: "Book My Free Evaluation", page: "evaluation", section: "final", destination: "/contact?interest=evaluation" }}
              href="/contact?interest=evaluation"
              className="inline-flex items-center btn-ember font-heading font-semibold px-10 py-5 rounded-full text-lg"
            >
              Book My Free Evaluation →
            </TrackedLink>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
