import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { LeadForm } from "@/components/LeadForm";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getTestimonialsByProgram } from "@/lib/testimonials";
import { TestimonialGrid } from "@/components/TestimonialGrid";
import {
  SINGLE_LESSON_LINK,
  FOUR_PACK_LINK,
  GROUP_LESSON_LINK,
  THREE_PLUS_ONE_LINK,
  BOOKING_URL,
  PRICING,
} from "@/lib/coaching";
import { SERVICE_AREA } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Coaching, Clinics & Group Lessons — Sam Morris Pickleball | DMV",
  description:
    "Private lessons, group lessons, and the 3+1 Play-In Special with PPR-certified Coach Sam Morris. Sam travels to your court within ~35 minutes of Olney, MD — covering MoCo, DC, and nearby PG/Howard/NoVA.",
  keywords: [
    "private pickleball lessons Montgomery County",
    "pickleball coach Montgomery County",
    "group pickleball lessons DMV",
    "pickleball coach near DC",
    "pickleball coach northern Virginia",
    "PPR certified pickleball coach Maryland",
    "mobile pickleball coach Olney MD",
    "pickleball clinic Bethesda Rockville Olney",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/coaching" },
  openGraph: {
    title: "Coaching, Clinics & Group Lessons — Sam Morris Pickleball",
    description:
      "Private + group + play-in lessons in the DMV. Sam travels to your court.",
    url: "https://www.sammorrispb.com/programs/coaching",
    images: [
      {
        url: "/og?title=Coaching%20%26%20Clinics&subtitle=Private%20%24130%20%C2%B7%20Group%20%2450pp%20%C2%B7%203%2B1%20%24150",
        width: 1200,
        height: 630,
        alt: "Coaching & Clinics — Sam Morris Pickleball",
      },
    ],
  },
};

const SECTIONS = [
  { id: "why-train", label: "Why Train" },
  { id: "private-lessons", label: "Private" },
  { id: "group-and-play-in", label: "Group & Play-In" },
  { id: "service-area", label: "Service Area" },
  { id: "ready-to-start", label: "Get Started" },
];

const REASONS = [
  { title: "Personalized Feedback", desc: "Real-time corrections on technique, footwork, and positioning." },
  { title: "Strategic Development", desc: "Shot selection, court positioning, and tactics for your level." },
  { title: "Structured Progression", desc: "Clear pathway from fundamentals to advanced play." },
  { title: "Accountability", desc: "Stay committed to your goals with consistent coaching support." },
  { title: "Faster Skill Acquisition", desc: "Avoid common mistakes and build proper habits from day one." },
  { title: "Honest Assessment", desc: "DUPR-aligned ratings and a clear read on where to focus next." },
];

export default function CoachingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Programs", href: "/programs" },
              { name: "Coaching & Clinics", href: "/programs/coaching" },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Pickleball Coaching — Private, Group & Play-In",
            provider: {
              "@type": "Person",
              name: "Sam Morris",
              jobTitle: "PPR-Certified Pickleball Coach",
            },
            areaServed: [
              { "@type": "AdministrativeArea", name: "Montgomery County, Maryland" },
              { "@type": "AdministrativeArea", name: "Washington, DC" },
              { "@type": "AdministrativeArea", name: "Prince George's County, Maryland" },
              { "@type": "AdministrativeArea", name: "Howard County, Maryland" },
              { "@type": "AdministrativeArea", name: "Northern Virginia" },
            ],
            description:
              "Private 1-on-1 lessons, small-group lessons (2+), and the 3+1 Play-In Special with PPR-certified coach Sam Morris. Sam travels to your court within roughly 35 minutes of Olney, MD.",
            offers: [
              { "@type": "Offer", name: "Single Private Lesson", price: PRICING.singleHourly.toFixed(2), priceCurrency: "USD", description: "1 hour of 1-on-1 coaching" },
              { "@type": "Offer", name: "4-Session Private Package", price: PRICING.fourPackTotal.toFixed(2), priceCurrency: "USD", description: `$${PRICING.fourPackHourly} per session` },
              { "@type": "Offer", name: "Group Lesson (2+ players)", price: PRICING.groupPerPersonHourly.toFixed(2), priceCurrency: "USD", description: `$${PRICING.groupPerPersonHourly} per person per hour` },
              { "@type": "Offer", name: "3+1 Play-In Special", price: PRICING.threePlusOneTotal.toFixed(2), priceCurrency: "USD", description: `${PRICING.threePlusOneHours}-hour play-in session — ${PRICING.threePlusOneStudents} students plus Sam in the lineup` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "How much do private pickleball lessons cost?", acceptedAnswer: { "@type": "Answer", text: `Private 1-on-1 lessons with Sam Morris are $${PRICING.singleHourly} per hour, or $${PRICING.fourPackTotal} for a 4-session package ($${PRICING.fourPackHourly}/session).` } },
              { "@type": "Question", name: "Do you offer group pickleball lessons?", acceptedAnswer: { "@type": "Answer", text: `Yes — group lessons are $${PRICING.groupPerPersonHourly} per person per hour with 2 or more players.` } },
              { "@type": "Question", name: "What is the 3+1 Play-In Special?", acceptedAnswer: { "@type": "Answer", text: `The 3+1 Play-In Special is a ${PRICING.threePlusOneHours}-hour session for $${PRICING.threePlusOneTotal} — bring 3 players and Sam plays as the 4th.` } },
              { "@type": "Question", name: "Where do lessons happen?", acceptedAnswer: { "@type": "Answer", text: `Sam travels to your court within roughly 35 minutes of Olney, MD — covering Montgomery County, Washington DC, and nearby parts of Prince George's, Howard, and northern Virginia.` } },
            ],
          }),
        }}
      />
      <ScrollDepthTracker page="coaching" />
      <PageSectionNav sections={SECTIONS} brandColor="#E8A03A" />
      <BackToTop />

      {/* ─── Full-Bleed Hero ─── */}
      <section className="relative min-h-[80vh] flex items-end hero-full-bleed -mt-16 pt-16 overflow-hidden">
        <Image
          src="/images/coach-sam.jpeg"
          alt="Coach Sam Morris coaching"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full pb-20 pt-32">
          <span className="brand-badge brand-badge-sm mb-5">Sam Morris Coaching</span>
          <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6 max-w-4xl">
            Coaching, clinics &amp; <span className="gradient-text-warm">play-in.</span>
          </h1>
          <p className="text-text-primary/85 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
            Private 1-on-1 lessons, group lessons (2+), and the 3+1 Play-In
            Special — built around the part of your game you most want to level
            up. Sam travels to your court within ~35 minutes of Olney, MD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={SINGLE_LESSON_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-heading font-semibold px-7 py-3.5 rounded-full btn-gradient text-base"
            >
              Book a Private Lesson →
            </a>
            <Link
              href="#group-and-play-in"
              className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-7 py-3.5 rounded-full text-base"
            >
              See Group Options
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Train ─── */}
      <section id="why-train" className="py-24 px-6 scroll-mt-28">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">Why train</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-5 leading-tight">
                What you get from a <span className="gradient-text-warm">real coach.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Six things you don&apos;t get from drop-in play.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {REASONS.map((item) => (
                <div key={item.title} className="glass-card p-7">
                  <div className="text-accent-blue font-mono text-xs mb-3 tracking-[0.18em] uppercase">
                    Coaching
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-text-primary">{item.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Private Lessons ─── */}
      <section
        id="private-lessons"
        className="relative section-photo-backdrop py-24 px-6 scroll-mt-28"
      >
        <div className="photo-bg">
          <Image
            src="/images/indoor-play-action.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <AnimateOnScroll>
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">1-on-1</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight">
                Private <span className="gradient-text-warm">lessons.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-warm p-8">
                <h3 className="font-heading font-bold text-xl mb-3">Single Session</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-6">
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> 1 hour of personalized 1-on-1 instruction</li>
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> Built around the skill you choose</li>
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> Great for trying coaching or a specific focus</li>
                </ul>
                <p className="font-heading font-black text-4xl mb-6">
                  ${PRICING.singleHourly}<span className="text-text-muted text-base font-normal"> / hour</span>
                </p>
                <TrackedExternalLink
                  href={SINGLE_LESSON_LINK}
                  label="Book Single Session"
                  page="coaching"
                  className="inline-block w-full text-center font-heading font-semibold px-6 py-3 rounded-full btn-gradient text-sm"
                >
                  Book Single Session
                </TrackedExternalLink>
              </div>

              <div className="glass-card-amber rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-heading font-bold text-xl">4-Session Package</h3>
                  <span className="brand-badge brand-badge-sm">Best value</span>
                </div>
                <ul className="space-y-2 text-text-muted text-sm mb-6">
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> 4 hours of structured 1-on-1 progression</li>
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> Skill tracking across sessions</li>
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> Save ${(PRICING.singleHourly - PRICING.fourPackHourly) * 4} vs. singles</li>
                </ul>
                <p className="font-heading font-black text-4xl mb-6">
                  ${PRICING.fourPackTotal}<span className="text-text-muted text-base font-normal"> · ${PRICING.fourPackHourly}/hr</span>
                </p>
                <TrackedExternalLink
                  href={FOUR_PACK_LINK}
                  label="Book 4-Session Package"
                  page="coaching"
                  className="inline-block w-full text-center font-heading font-semibold px-6 py-3 rounded-full btn-gradient text-sm"
                >
                  Buy Package
                </TrackedExternalLink>
              </div>
            </div>
            <div className="mt-10 text-center">
              <p className="text-text-muted text-sm mb-3">Already purchased? Pick your time:</p>
              <TrackedExternalLink
                href={BOOKING_URL}
                label="Schedule Your Lesson"
                page="coaching"
                className="inline-flex items-center btn-outline font-semibold px-7 py-3 rounded-full text-sm"
              >
                Schedule Your Lesson →
              </TrackedExternalLink>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Group + Play-In ─── */}
      <section id="group-and-play-in" className="py-24 px-6 scroll-mt-28">
        <div className="mx-auto max-w-5xl">
          <AnimateOnScroll>
            <div className="mb-12">
              <p className="eyebrow mb-3">Bring your crew</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-5 leading-tight">
                Group lessons &amp; <span className="gradient-text-warm">play-in.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl">
                Two formats designed around small groups — cheaper per person,
                more reps, and live coaching in the flow of real games.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-warm p-8">
                <h3 className="font-heading font-bold text-xl mb-3">Group Lesson (2+)</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-6">
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> 2 or more players, 1 hour</li>
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> Drills + game situations tailored to the group</li>
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> Bring a friend, partner, or small crew</li>
                </ul>
                <p className="font-heading font-black text-4xl mb-6">
                  ${PRICING.groupPerPersonHourly}
                  <span className="text-text-muted text-base font-normal"> / pp / hr</span>
                </p>
                <Link
                  href={GROUP_LESSON_LINK}
                  className="inline-block w-full text-center font-heading font-semibold px-6 py-3 rounded-full btn-gradient text-sm"
                >
                  Request Group Lesson
                </Link>
              </div>
              <div className="card-warm p-8">
                <h3 className="font-heading font-bold text-xl mb-3">3+1 Play-In Special</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-6">
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> {PRICING.threePlusOneHours}-hour session, you bring {PRICING.threePlusOneStudents} players + Sam plays as 4th</li>
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> Doubles reps with a coach in the lineup</li>
                  <li className="flex gap-2"><span className="text-accent-blue">→</span> Compete and learn at the same time</li>
                </ul>
                <p className="font-heading font-black text-4xl mb-6">
                  ${PRICING.threePlusOneTotal}
                  <span className="text-text-muted text-base font-normal"> flat / {PRICING.threePlusOneHours} hrs</span>
                </p>
                <TrackedExternalLink
                  href={THREE_PLUS_ONE_LINK}
                  label="Book 3+1 Play-In Special"
                  page="coaching"
                  className="inline-block w-full text-center font-heading font-semibold px-6 py-3 rounded-full btn-gradient text-sm"
                >
                  Book 3+1 Special
                </TrackedExternalLink>
              </div>
            </div>
            <p className="text-text-muted text-xs mt-8 text-center max-w-2xl mx-auto">
              Group lessons are invoiced after Sam confirms the time (price varies with
              headcount). The 3+1 Play-In is a flat $150 — pay up front and reply with
              your preferred court + a couple of windows that work, and Sam locks it in
              within 24 hours.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Service Area ─── */}
      <section
        id="service-area"
        className="relative section-photo-backdrop py-24 px-6 scroll-mt-28"
      >
        <div className="photo-bg">
          <Image
            src="/images/multi-court-outdoor.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <AnimateOnScroll>
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <p className="eyebrow mb-3">Where</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight">
                Service area.
              </h2>
            </div>
            <div className="glass-card p-8">
              <p className="text-text-primary leading-relaxed mb-4 text-lg">
                {SERVICE_AREA.description}
              </p>
              <p className="text-text-muted leading-relaxed text-sm">
                Common courts include indoor + outdoor facilities across Olney,
                Rockville, Bethesda, Silver Spring, North Bethesda, Gaithersburg,
                Potomac, DC, and Arlington. If you have a regular court you
                already play at, that&apos;s usually the easiest spot.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Get Started ─── */}
      <section id="ready-to-start" className="py-24 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll>
            <div className="glass-card-amber rounded-2xl p-10 text-center">
              <p className="eyebrow mb-3">Get started</p>
              <h2 className="font-heading font-black text-3xl md:text-4xl mb-6 leading-tight">
                Three ways to <span className="gradient-text-warm">get on the court.</span>
              </h2>
              <ol className="space-y-3 text-text-muted text-base list-none max-w-md mx-auto text-left mb-8">
                <li className="flex gap-3">
                  <span className="font-mono text-accent-blue font-bold">01</span>
                  <span><strong className="text-text-primary">Book a free skill evaluation</strong> if you&apos;re new to coaching.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-accent-blue font-bold">02</span>
                  <span><strong className="text-text-primary">Pick a single session or 4-pack</strong> for focused 1-on-1 progression.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-accent-blue font-bold">03</span>
                  <span><strong className="text-text-primary">Bring a crew</strong> for the group or 3+1 play-in rate.</span>
                </li>
              </ol>
              <Link
                href="/evaluation"
                className="inline-flex items-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
              >
                Book a Free Evaluation →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="px-6 py-20 bg-navy-light">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Student feedback</p>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-text-primary leading-tight">
              What students say.
            </h2>
          </div>
          <TestimonialGrid testimonials={getTestimonialsByProgram("coaching")} limit={3} />
        </div>
      </section>

      {/* ─── Lead Capture ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <LeadForm heading="Interested in coaching?" page="coaching" />
        </div>
      </section>
    </>
  );
}
