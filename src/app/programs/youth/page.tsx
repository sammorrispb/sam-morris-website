import type { Metadata } from "next";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BackToTop } from "@/components/BackToTop";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { RelatedPrograms } from "@/components/RelatedPrograms";
import { getTestimonialsByProgram } from "@/lib/testimonials";
import { TestimonialGrid } from "@/components/TestimonialGrid";

export const metadata: Metadata = {
  title: "Youth & Junior Programs — Next Gen Academy",
  description:
    "Next Gen Academy youth pickleball programs in Montgomery County, MD. Multi-week sessions and summer camps for kids ages 5-16.",
  keywords: [
    "kids pickleball lessons Rockville",
    "youth pickleball Montgomery County",
    "junior pickleball academy Maryland",
    "pickleball summer camp North Bethesda",
    "kids pickleball near me",
    "Next Gen Pickleball Academy",
    "pickleball for kids DC area",
    "youth pickleball camp Maryland",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/youth" },
  openGraph: {
    title: "Youth & Junior Programs — Next Gen Academy",
    description:
      "Next Gen Academy youth pickleball programs and summer camps in Montgomery County, MD.",
    url: "https://www.sammorrispb.com/programs/youth",
    images: [
      {
        url: "/og?title=Youth%20%26%20Junior%20Programs&subtitle=Next%20Gen%20Academy%20%C2%B7%20Summer%20Camp%20%C2%B7%20Ages%205-16",
        width: 1200,
        height: 630,
        alt: "Youth & Junior Pickleball Programs — Next Gen Academy",
      },
    ],
  },
};

const LEVELS = [
  {
    name: "Red Ball",
    color: "#ef4444",
    rgb: "239,68,68",
    ages: "Ages 5+",
    tagline: "New / beginners — learning to rally",
  },
  {
    name: "Orange Ball",
    color: "#f97316",
    rgb: "249,115,22",
    ages: "Ages 7+",
    tagline: "Advanced beginners — learning to play games",
  },
  {
    name: "Green Ball",
    color: "#22c55e",
    rgb: "34,197,94",
    ages: "Ages 9+",
    tagline: "Learning to strategize",
  },
  {
    name: "Yellow Ball",
    color: "#eab308",
    rgb: "234,179,8",
    ages: "Ages 12+",
    tagline: "Learning to compete",
  },
];

export default function YouthPage() {

  return (
    <div className="page-next-gen">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Programs", href: "/programs" },
              { name: "Youth & Junior Programs", href: "/programs/youth" },
            ])
          ),
        }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd([
              {
                question: "What age can kids start pickleball at Next Gen Academy?",
                answer:
                  "Kids can start as young as age 5 in the Red Ball level at Next Gen Academy. The program has four progressive levels: Red Ball (5+), Orange Ball (7+), Green Ball (9+), and Yellow Ball (11+).",
              },
              {
                question: "How much does Next Gen Academy cost?",
                answer:
                  "Next Gen Academy sessions run in multi-week seasons in Montgomery County, MD. Visit nextgenpbacademy.com for current pricing and registration.",
              },
            ])
          ),
        }}
      />
      {/* Course Schema — Next Gen Academy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "Next Gen Pickleball Academy",
            description: "Youth pickleball development program for ages 5-16 with four progressive skill levels.",
            provider: {
              "@type": "Person",
              name: "Sam Morris",
            },
            hasCourseInstance: [
              {
                "@type": "CourseInstance",
                name: "Red Level — Beginner",
                description: "Fundamentals: grip, stance, serves, court awareness",
                courseMode: "onsite",
              },
              {
                "@type": "CourseInstance",
                name: "Orange Level — Advanced Beginner",
                description: "Consistency: dinking, return of serve, positioning",
                courseMode: "onsite",
              },
              {
                "@type": "CourseInstance",
                name: "Green Level — Intermediate",
                description: "Strategy: shot selection, drops, stacking, competitive play",
                courseMode: "onsite",
              },
              {
                "@type": "CourseInstance",
                name: "Yellow Level — Advanced",
                description: "Coach-curated advanced program: tournament prep, mental game",
                courseMode: "onsite",
              },
            ],
          }),
        }}
      />
      <ScrollDepthTracker page="youth" />
      <BackToTop />

      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-next-gen">
        <div className="relative mx-auto max-w-4xl text-center">
          <Image
            src="/images/Next Gen Pickleball Academy Logo Horizontal.png"
            alt="Next Gen Pickleball Academy"
            width={400}
            height={150}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
            Youth &amp; Junior <span className="gradient-text-ng">Programs</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Next Gen Academy brings age-appropriate pickleball coaching to young
            athletes in Montgomery County, MD. Four progressive levels from
            first-timers to competitive juniors.
          </p>
        </div>
      </section>

      {/* Academy Levels */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Academy Levels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LEVELS.map((level) => (
                <div
                  key={level.name}
                  className="card-ng p-6"
                  style={{
                    borderLeft: `4px solid ${level.color}`,
                    background: `linear-gradient(135deg, rgba(${level.rgb}, 0.03), #0e1a1e)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className="font-heading font-bold text-lg"
                      style={{ color: level.color }}
                    >
                      {level.name}
                    </h3>
                    <span className="text-text-muted text-sm">{level.ages}</span>
                  </div>
                  <p className="text-text-muted text-sm">{level.tagline}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="card-ng p-8 text-center" style={{ borderColor: "rgba(34,197,94,0.3)", borderWidth: "2px" }}>
            <h2 className="font-heading font-bold text-xl mb-6">
              Get Started with Next Gen Academy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="rounded-lg bg-white/[0.03] border border-white/10 p-5">
                <p className="font-heading font-semibold text-text-primary mb-1">New to Pickleball?</p>
                <p className="text-text-muted text-sm mb-4">Ages 10 &amp; under — try a free session.</p>
                <TrackedExternalLink
                  href="https://www.nextgenpbacademy.com/freetrial"
                  label="Book a Free Trial"
                  page="youth"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-ng text-sm"
                >
                  Book a Free Trial
                </TrackedExternalLink>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/10 p-5">
                <p className="font-heading font-semibold text-text-primary mb-1">Ages 11 &amp; Up</p>
                <p className="text-text-muted text-sm mb-4">Schedule a free 30-minute evaluation.</p>
                <TrackedExternalLink
                  href="mailto:nextgenacademypb@gmail.com"
                  label="Schedule Evaluation"
                  page="youth"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-ng text-sm"
                >
                  Schedule Evaluation
                </TrackedExternalLink>
              </div>
            </div>
            <p className="text-text-muted text-xs font-semibold italic">
              Schedules are subject to change. Please check your registration
              confirmation email for accurate session times.
            </p>
          </div>
        </div>
      </section>

      {/* About NGA */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="card-ng p-8 text-center" style={{ borderWidth: "2px" }}>
            <Image
              src="/images/nextgen-academy-logo.svg"
              alt="Next Gen Academy"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h2 className="font-heading font-bold text-xl mb-4">
              About Next Gen Academy
            </h2>
            <p className="text-text-muted text-sm mb-4">
              Next Gen Academy is a youth development program founded by Sam Morris,
              focused on building athletic skills, sportsmanship, and community
              through age-appropriate coaching.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <TrackedExternalLink
                href="https://www.nextgenpbacademy.com"
                label="Visit Next Gen Academy"
                page="youth"
                className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-ng text-sm"
              >
                Visit Next Gen Academy
              </TrackedExternalLink>
              <TrackedExternalLink
                href="mailto:nextgenacademypb@gmail.com"
                label="Contact NGA"
                page="youth"
                className="inline-block font-heading font-semibold px-6 py-3 rounded-lg border border-[rgba(34,197,94,0.25)] text-text-muted hover:border-[rgba(34,197,94,0.5)] hover:text-text-primary transition-all text-sm"
              >
                Contact Us
              </TrackedExternalLink>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary text-center mb-10">
            What Parents Say
          </h2>
          <TestimonialGrid testimonials={getTestimonialsByProgram("youth")} limit={3} />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                What age can kids start pickleball at Next Gen Academy?
              </h3>
              <p className="text-text-muted leading-relaxed">
                Kids can start as young as age 5 in the Red Ball level at Next Gen
                Academy. The program has four progressive levels: Red Ball (5+),
                Orange Ball (7+), Green Ball (9+), and Yellow Ball (11+).
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                How much does Next Gen Academy cost?
              </h3>
              <p className="text-text-muted leading-relaxed">
                Next Gen Academy sessions run in multi-week seasons in Montgomery
                County, MD. Visit nextgenpbacademy.com for current pricing and
                registration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedPrograms currentPath="/programs/youth" />

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-end items-center">
          <TrackedExternalLink
            href="https://tournamentwebsite.vercel.app/"
            label="Tournaments"
            page="youth"
            className="text-[#22c55e] hover:text-[#4ade80] transition-colors font-semibold text-sm"
          >
            Tournaments &rarr;
          </TrackedExternalLink>
        </div>
      </section>
    </div>
  );
}
