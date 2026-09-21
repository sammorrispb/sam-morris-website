import type { Metadata } from "next";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { TrackedLink } from "@/components/TrackedLink";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { ContactLink } from "@/components/ContactLink";
import { StickyContactBar } from "@/components/StickyContactBar";
import { CONTACT } from "@/lib/constants";
import { familySiteUrl } from "@/lib/urls";

export const metadata: Metadata = {
  // Title kept ≤60 chars (audit baseline: 84 with old template).
  title: "Pickleball Coach in Montgomery County, MD — Sam Morris",
  // Description kept ≤160 chars (audit baseline: 178).
  description:
    "PPR-certified pickleball coach in Montgomery County, MD. Private lessons, group clinics, and youth academy for adults, families, and kids.",
  keywords: [
    "pickleball coach Montgomery County",
    "indoor pickleball facility near me",
    "pickleball lessons DC area",
    "pickleball coaching Northern Virginia",
    "youth pickleball academy Maryland",
    "private pickleball lessons Bethesda",
    "beginner pickleball DMV",
    "PPR certified coach Maryland",
    "Next Gen Pickleball Academy",
    "indoor pickleball courts Maryland",
    "pickleball near Washington DC",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/" },
  openGraph: {
    url: "https://www.sammorrispb.com/",
    title: "Pickleball Coach in Montgomery County, MD — Sam Morris",
    description:
      "PPR-certified pickleball coach in Montgomery County, MD. Private lessons, group clinics, and youth academy for adults, families, and kids.",
    images: [
      {
        url: "/og?title=Helping%20Families%20Grow%20Through%20Sport&subtitle=Pickleball%20Coaching%20for%20Adults%2C%20Families%20%26%20Kids",
        width: 1200,
        height: 630,
        alt: "Sam Morris Pickleball — Helping Families Grow Through Sport",
      },
    ],
  },
  twitter: {
    // Mirror og:title so social cards don't share the sitewide fallback.
    title: "Pickleball Coach in Montgomery County, MD — Sam Morris",
  },
};

const TEL = CONTACT.phone.replace(/[^0-9+]/g, "");

/**
 * The three ways into the sport. Every card funnels to the same #contact
 * block — the landing page deliberately has no outbound exit before the
 * visitor has a way to reach Sam.
 */
const PATHS = [
  {
    title: "Intro to the Game",
    badge: "New players",
    description:
      "Never held a paddle, or played twice at a friend's place? We cover the rules, the serve, the kitchen line, and a real rally — so you can walk onto any court and play.",
    detail: [
      "Learn the FUNdamentals and why this game is easy to start and fun for all",
    ],
    cta: "Ask about Intro",
    image: "/images/kids-outdoor-play.jpeg",
    imageAlt:
      "Beginner pickleball players rallying on an outdoor court in Montgomery County, MD",
    primary: true,
  },
  {
    title: "Private Lessons",
    badge: null,
    description:
      "Custom lesson for improving any aspect of your game. Great for more reps, a new perspective, and getting better.",
    detail: [
      "Solo or bring a small group (up to 4)",
      "I travel within ~1 hour of Olney, MD",
    ],
    cta: "Ask about Lessons",
    image: "/images/coach-sam.jpeg",
    imageAlt: "Coach Sam Morris running a private pickleball lesson",
    primary: false,
  },
  {
    title: "Youth Programs",
    badge: null,
    description:
      "Next Gen Academy — a structured pathway for kids to play and grow together.",
    detail: ["Seasonal academy + after-school clubs"],
    cta: "Ask about Youth",
    image: "/images/youth-indoor-player.jpeg",
    imageAlt: "Young player at a Next Gen Academy pickleball session",
    primary: false,
  },
] as const;

export default function Home() {
  return (
    <>
      {/* ─── Full-Bleed Hero ─── */}
      <section className="relative min-h-[92vh] flex items-center hero-full-bleed hero-nav-offset overflow-hidden">
        <Image
          src="/images/coach-sam.jpeg"
          alt="Coach Sam Morris on the court"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-10 animate-fade-up">
              Pickleball coach in{" "}
              <span className="gradient-text-warm">
                Montgomery &amp; Frederick County.
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackedLink
                href="#paths"
                className="inline-flex items-center justify-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
                eventProps={{
                  label: "See the three ways to start",
                  page: "home",
                  section: "hero",
                  destination: "#paths",
                }}
              >
                See the three ways to start
              </TrackedLink>
              <ContactLink
                method="phone"
                page="home"
                section="hero"
                href={`tel:${TEL}`}
                className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
              >
                Call {CONTACT.phone}
              </ContactLink>
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 animate-fade-in">
          <span className="text-text-muted text-xs uppercase tracking-[0.2em]">
            Scroll
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-accent-blue to-transparent" />
        </div>
      </section>

      {/* ─── Three ways to start ─── */}
      <section id="paths" className="scroll-mt-20 py-24 px-6">
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight">
                Find your{" "}
                <span className="gradient-text-warm">starting line.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PATHS.map((path) => (
                <div
                  key={path.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 transition-all card-hover bg-navy-light flex flex-col"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={path.image}
                      alt={path.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-light via-navy-light/40 to-transparent" />
                    {path.badge && (
                      <span className="absolute top-4 left-4 brand-badge brand-badge-sm">
                        {path.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-2xl mb-3 text-text-primary">
                      {path.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-5">
                      {path.description}
                    </p>
                    <div className="text-text-muted/80 text-sm leading-relaxed pt-5 border-t border-white/10 mb-6">
                      {path.detail.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <TrackedLink
                        href="#contact"
                        eventProps={{
                          label: path.cta,
                          page: "home",
                          section: "path_card",
                          destination: "#contact",
                        }}
                        className={`inline-flex w-full items-center justify-center font-heading font-semibold px-6 py-3.5 rounded-full text-sm ${
                          path.primary ? "btn-gradient" : "btn-outline"
                        }`}
                      >
                        {path.cta}
                      </TrackedLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Contact — the only exit ─── */}
      <section
        id="contact"
        className="scroll-mt-20 relative section-photo-backdrop py-24 px-6"
      >
        <div className="photo-bg">
          <Image
            src="/images/multi-court-outdoor.jpeg"
            alt="Outdoor pickleball courts in Montgomery County, MD"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <AnimateOnScroll>
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-3">Get in touch</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-10 leading-tight">
              Tell me what{" "}
              <span className="gradient-text-warm">you&apos;re after.</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactLink
                method="sms"
                page="home"
                section="contact_block"
                href={`sms:${TEL}`}
                className="inline-flex items-center justify-center gap-2.5 font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-4.1A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"
                  />
                </svg>
                Text me
              </ContactLink>
              <ContactLink
                method="phone"
                page="home"
                section="contact_block"
                href={`tel:${TEL}`}
                className="inline-flex items-center justify-center gap-2.5 btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                Call me
              </ContactLink>
              <ContactLink
                method="email"
                page="home"
                section="contact_block"
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center justify-center gap-2.5 btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75h19.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75zm0 0L12 13.5l9.75-6.75"
                  />
                </svg>
                Email me
              </ContactLink>
            </div>

            <p className="text-text-muted text-sm mt-10 pt-8 border-t border-white/10">
              Already playing?{" "}
              <TrackedExternalLink
                href={familySiteUrl("ld")}
                label="Join a local group"
                page="home"
                className="text-accent-blue font-semibold hover:underline underline-offset-4"
              >
                Join a local group &rarr;
              </TrackedExternalLink>
            </p>
          </div>
        </AnimateOnScroll>
      </section>

      <StickyContactBar page="home" />
    </>
  );
}
