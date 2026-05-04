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

export default function CoachingPage() {
  return (
    <div className="page-sam-morris">
      {/* Breadcrumb Schema */}
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
      {/* Service Schema */}
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
              {
                "@type": "Offer",
                name: "Single Private Lesson",
                price: PRICING.singleHourly.toFixed(2),
                priceCurrency: "USD",
                description: "1 hour of 1-on-1 coaching",
              },
              {
                "@type": "Offer",
                name: "4-Session Private Package",
                price: PRICING.fourPackTotal.toFixed(2),
                priceCurrency: "USD",
                description: `$${PRICING.fourPackHourly} per session`,
              },
              {
                "@type": "Offer",
                name: "Group Lesson (2+ players)",
                price: PRICING.groupPerPersonHourly.toFixed(2),
                priceCurrency: "USD",
                description: `$${PRICING.groupPerPersonHourly} per person per hour`,
              },
              {
                "@type": "Offer",
                name: "3+1 Play-In Special",
                price: PRICING.threePlusOneTotal.toFixed(2),
                priceCurrency: "USD",
                description: `${PRICING.threePlusOneHours}-hour play-in session — ${PRICING.threePlusOneStudents} students plus Sam in the lineup`,
              },
            ],
          }),
        }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much do private pickleball lessons cost?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Private 1-on-1 lessons with Sam Morris are $${PRICING.singleHourly} per hour, or $${PRICING.fourPackTotal} for a 4-session package ($${PRICING.fourPackHourly}/session). Book at sammorrispb.com/programs/coaching.`,
                },
              },
              {
                "@type": "Question",
                name: "Do you offer group pickleball lessons?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Yes — group lessons are $${PRICING.groupPerPersonHourly} per person per hour with 2 or more players. Bring a friend, partner, or small crew and we'll build the session around the group's level and goals.`,
                },
              },
              {
                "@type": "Question",
                name: "What is the 3+1 Play-In Special?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `The 3+1 Play-In Special is a ${PRICING.threePlusOneHours}-hour session for $${PRICING.threePlusOneTotal} where you bring ${PRICING.threePlusOneStudents} players and Sam plays as the 4th. You get real doubles reps with live coaching baked in — great for players who want to compete and learn at the same time.`,
                },
              },
              {
                "@type": "Question",
                name: "Where do lessons happen?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Sam travels to your court within roughly 35 minutes of Olney, MD — covering Montgomery County, Washington DC, and nearby parts of Prince George's, Howard, and northern Virginia. You arrange and pay for the court; Sam brings the coaching.`,
                },
              },
            ],
          }),
        }}
      />
      <ScrollDepthTracker page="coaching" />
      <PageSectionNav sections={SECTIONS} brandColor="#4DACD0" />
      <BackToTop />
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-sam-morris">
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <span className="brand-badge brand-badge-sm mb-4">Sam Morris Coaching</span>
              <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
                Coaching, Clinics &amp; <span className="gradient-text-sm">Play-In</span>
              </h1>
              <p className="text-text-muted text-lg md:text-xl max-w-xl">
                Private 1-on-1 lessons, group lessons (2+), and the 3+1 Play-In
                Special — built around the part of your game you most want to
                level up. Sam travels to your court anywhere within ~35 minutes
                of Olney, MD.
              </p>
            </div>
            <div className="shrink-0 hidden md:block">
              <Image
                src="/images/sam-portrait-arms-crossed.jpg"
                alt="Coach Sam Morris"
                width={260}
                height={340}
                className="rounded-2xl glow-border-sm object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Train */}
      <section id="why-train" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Why Train with a Coach?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Personalized Feedback", desc: "Real-time corrections on technique, footwork, and positioning" },
                { title: "Strategic Development", desc: "Shot selection, court positioning, and tactics for your level" },
                { title: "Structured Progression", desc: "Clear pathway from beginner fundamentals to advanced play" },
                { title: "Accountability", desc: "Stay committed to your goals with consistent coaching support" },
                { title: "Faster Skill Acquisition", desc: "Avoid common mistakes and build proper habits from the start" },
              ].map((item) => (
                <div key={item.title} className="card-sm p-6">
                  <h3 className="font-heading text-text-primary mb-2">{item.title}</h3>
                  <p className="text-text-muted text-sm">{item.desc}</p>
                </div>
              ))}
              <div className="hidden lg:block">
                <Image
                  src="/images/poster-3rd-shot.webp"
                  alt="Third shot drop technique"
                  width={300}
                  height={200}
                  className="rounded-xl glow-border-sm object-cover w-full h-full"
                />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Private Lessons */}
      <section id="private-lessons" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Private Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-sm p-6">
                <h3 className="font-heading font-bold text-lg mb-3">Single Session</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-4">
                  <li>1 hour of personalized 1-on-1 instruction</li>
                  <li>Built around the skill or game-situation you choose</li>
                  <li>Great for trying out coaching or a specific focus</li>
                </ul>
                <p className="font-heading font-bold text-xl mb-4">${PRICING.singleHourly}<span className="text-text-muted text-sm font-normal">/hour</span></p>
                <TrackedExternalLink
                  href={SINGLE_LESSON_LINK}
                  label="Book Single Session"
                  page="coaching"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm"
                >
                  Book Single Session
                </TrackedExternalLink>
              </div>
              <div className="card-sm p-6">
                <h3 className="font-heading font-bold text-lg mb-3">4-Session Package</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-4">
                  <li>4 hours of structured 1-on-1 progression</li>
                  <li>Skill tracking across sessions</li>
                  <li>Best value — save ${(PRICING.singleHourly - PRICING.fourPackHourly) * 4}</li>
                </ul>
                <p className="font-heading font-bold text-xl mb-4">${PRICING.fourPackTotal}<span className="text-text-muted text-sm font-normal"> (${PRICING.fourPackHourly}/hour)</span></p>
                <TrackedExternalLink
                  href={FOUR_PACK_LINK}
                  label="Book 4-Session Package"
                  page="coaching"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm"
                >
                  Book 4-Session Package
                </TrackedExternalLink>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-text-muted text-sm mb-4">Already purchased? Pick your time:</p>
              <TrackedExternalLink
                href={BOOKING_URL}
                label="Schedule Your Lesson"
                page="coaching"
                className="inline-block text-white font-heading font-semibold px-8 py-3 rounded-lg btn-sm text-sm"
              >
                Schedule Your Lesson →
              </TrackedExternalLink>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Group + Play-In */}
      <section id="group-and-play-in" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-3">Group Lessons &amp; Play-In</h2>
            <p className="text-text-muted mb-8 max-w-2xl">
              Bring your crew. Two formats designed around small groups —
              cheaper per person, more reps, and live coaching in the flow of
              real games.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-sm p-6">
                <h3 className="font-heading font-bold text-lg mb-3">Group Lesson (2+)</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-4">
                  <li>2 or more players, 1 hour</li>
                  <li>Drills + game situations tailored to the group&apos;s level</li>
                  <li>Bring a friend, partner, or small crew</li>
                </ul>
                <p className="font-heading font-bold text-xl mb-4">
                  ${PRICING.groupPerPersonHourly}
                  <span className="text-text-muted text-sm font-normal"> / person / hour</span>
                </p>
                <Link
                  href={GROUP_LESSON_LINK}
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm"
                >
                  Request Group Lesson
                </Link>
              </div>
              <div className="card-sm p-6">
                <h3 className="font-heading font-bold text-lg mb-3">3+1 Play-In Special</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-4">
                  <li>{PRICING.threePlusOneHours}-hour session, you bring {PRICING.threePlusOneStudents} players + Sam plays as 4th</li>
                  <li>Doubles reps with a coach in the lineup, calling shots and resetting points</li>
                  <li>Great for players who want to compete and learn at the same time</li>
                </ul>
                <p className="font-heading font-bold text-xl mb-4">
                  ${PRICING.threePlusOneTotal}
                  <span className="text-text-muted text-sm font-normal"> flat / {PRICING.threePlusOneHours} hrs</span>
                </p>
                <TrackedExternalLink
                  href={THREE_PLUS_ONE_LINK}
                  label="Book 3+1 Play-In Special"
                  page="coaching"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm"
                >
                  Book 3+1 Special
                </TrackedExternalLink>
              </div>
            </div>
            <p className="text-text-muted text-xs mt-6 text-center">
              Group lessons are invoiced after Sam confirms the time (price varies with
              headcount). The 3+1 Play-In is a flat $150 — pay up front and reply with
              your preferred court + a couple of windows that work, and Sam locks it in
              within 24 hours.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Service Area */}
      <section id="service-area" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-4">Service Area</h2>
            <div className="card-sm p-6">
              <p className="text-text-muted leading-relaxed mb-4">
                {SERVICE_AREA.description}
              </p>
              <p className="text-text-muted leading-relaxed text-sm">
                Common courts include indoor + outdoor facilities across Olney,
                Rockville, Bethesda, Silver Spring, North Bethesda, Gaithersburg,
                Potomac, DC, and Arlington. If you have a regular court you
                already play at, that&apos;s usually the easiest spot.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Next Steps CTA */}
      <section id="ready-to-start" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="card-sm p-8">
            <h2 className="font-heading font-bold text-xl mb-4 text-center">Ready to Start?</h2>
            <ol className="space-y-2 text-text-muted text-sm list-decimal list-inside max-w-md mx-auto">
              <li><strong className="text-text-primary">Book a free skill evaluation</strong> if you&apos;re new to coaching</li>
              <li><strong className="text-text-primary">Pick a single session or 4-pack</strong> for focused 1-on-1 progression</li>
              <li><strong className="text-text-primary">Bring a crew</strong> for the group or 3+1 play-in rate</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary text-center mb-10">
            What Our Students Say
          </h2>
          <TestimonialGrid testimonials={getTestimonialsByProgram("coaching")} limit={3} />
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <LeadForm heading="Interested in Coaching?" page="coaching" />
        </div>
      </section>
    </div>
  );
}
