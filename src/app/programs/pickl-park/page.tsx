import type { Metadata } from "next";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BackToTop } from "@/components/BackToTop";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { CONTACT, FREDERICK_VENUE } from "@/lib/constants";
import { coachRequestUrl, picklParkEventUrl } from "@/lib/urls";
import {
  PICKL_PARK_SESSIONS,
  sessionChipLabel,
  sessionFullLabel,
  upcomingSessions,
} from "@/lib/picklParkSessions";

const PAGE = "programs_pickl_park";
const VENUE_ADDRESS = `${FREDERICK_VENUE.street}, ${FREDERICK_VENUE.city} ${FREDERICK_VENUE.zip}`;

export const metadata: Metadata = {
  title: "Pickleball Classes in Frederick, MD — Coach Sam at The Pickl Park",
  description:
    "Group pickleball clinics and skills assessments led by Coach Sam Morris at The Pickl Park in Frederick, MD. Intro fundamentals, net play, third shot drops, and DUPR-style skills assessments.",
  keywords: [
    "pickleball classes Frederick MD",
    "pickleball clinic Frederick Maryland",
    "beginner pickleball lessons Frederick",
    "pickleball skills assessment Frederick",
    "The Pickl Park clinics",
    "Ballenger Center pickleball",
  ],
  alternates: {
    canonical: "https://www.sammorrispb.com/programs/pickl-park",
  },
  openGraph: {
    title: "Pickleball Classes at The Pickl Park — Coach Sam",
    description:
      "Weekly group clinics and skills assessments in Frederick, MD. Beginner fundamentals through net play under pressure.",
    url: "https://www.sammorrispb.com/programs/pickl-park",
    images: [
      {
        url: "/og?title=Classes%20at%20The%20Pickl%20Park&subtitle=Frederick%2C%20MD%20%C2%B7%20Clinics%20%C2%B7%20Skills%20Assessments",
        width: 1200,
        height: 630,
        alt: "Pickleball classes with Coach Sam at The Pickl Park in Frederick, MD",
      },
    ],
  },
};

// Re-render hourly so sessions that have already happened drop off their card
// without waiting for the next deploy.
export const revalidate = 3600;

/**
 * The classes Sam personally leads at The Pickl Park.
 *
 * `cadence` is the durable claim — the recurring pattern Sam teaches. The
 * dated registration links live in lib/picklParkSessions.ts, keyed by `id`;
 * see that file for why they are hand-maintained and how to refresh them.
 *
 * A class with no upcoming dated sessions falls back to the full clinics
 * listing, so letting the tail run short is untidy rather than broken.
 */
const CLASSES: {
  id: string;
  title: string;
  level: string;
  cadence: string;
  body: string;
}[] = [
  {
    id: "101",
    title: "101 — Intro to Pickleball",
    level: "Beginner",
    cadence: "Mondays, 10:00–11:00am",
    body: "Never held a paddle? Start here. Grip, ready position, the serve and return, and the two rules that trip up every new player. You leave having played real points.",
  },
  {
    id: "201",
    title: "201 — Net Play & Dinking Under Pressure",
    level: "Intermediate",
    cadence: "Mondays, 11:00am–12:00pm",
    body: "The kitchen line is where games are won. Dink patterns, resets off a fast ball, when to speed up, and how to hold your position when the pace climbs.",
  },
  {
    id: "skills-beginner",
    title: "Skills Assessment — Beginner/Intermediate",
    level: "Beginner to 3.0",
    cadence: "Tuesdays, 10:00–11:00am",
    body: "A structured hour that measures where your game actually is across serve, return, dinks, drops, and movement — and tells you the two things to work on next.",
  },
  {
    id: "skills-advanced",
    title: "Skills Assessment — Intermediate/Advanced",
    level: "3.0 and up",
    cadence: "Tuesdays, 11:00am–12:00pm",
    body: "Same format, higher ceiling. Pressure-tested reads, transition-zone decisions, and shot selection under fatigue, with a clear picture of what's capping your rating.",
  },
  {
    id: "101a",
    title: "101A — Repetition & Foundations",
    level: "Beginner",
    cadence: "Runs periodically, midday",
    body: "The follow-up to 101. High-volume reps on the shots you just learned, so the mechanics hold up once someone is hitting back.",
  },
  {
    id: "104",
    title: "104 — Third Shot Drops",
    level: "Advanced beginner",
    cadence: "Runs periodically, midday",
    body: "The shot that gets you off the baseline and up to the net. Contact point, arc, and target — plus what to do when the drop comes back high.",
  },
  {
    // DRAFT COPY — pending Sam's sign-off. Currently a one-off (Tue Aug 25);
    // if it does not return to the schedule, drop this entry rather than
    // leaving a card with no dates.
    id: "204",
    title: "204 — Defense to Offense: Mid-Court Play",
    level: "Intermediate",
    cadence: "Next session listed below",
    body: "The awkward middle of the court, handled. Reading which balls to take out of the air, resetting when you're stretched, and turning a defensive dig into the point you wanted.",
  },
];

const FAQS = [
  {
    q: "Where exactly are the classes?",
    a: `${FREDERICK_VENUE.name}, ${VENUE_ADDRESS} — eight cushioned indoor courts, so classes run in any weather.`,
  },
  {
    q: "How do I register?",
    a: "Registration is handled by The Pickl Park's own booking platform. Pick a date on any class above and you'll land directly on that session's page to reserve your spot. The venue's full listing is always current — check there if the date you want isn't shown.",
  },
  {
    q: "Do I need my own paddle?",
    a: "No. Loaner paddles are available for first-timers, and balls are provided. Court shoes and water are the only things worth bringing on day one.",
  },
  {
    q: "Which class should I start with?",
    a: "If you've never played, 101. If you play socially and want to stop losing points at the net, 201. If you're not sure where you stand — or you want a real number to train against — book a Skills Assessment first.",
  },
  {
    q: "How many people are in a class?",
    a: "Small enough that you get individual feedback every session. Classes cap out and fill on a first-come basis, so booking ahead through the listing is the safe move.",
  },
  {
    q: "Do you also teach privately in Frederick?",
    a: "Yes. Private lessons at The Pickl Park are available alongside the group classes — those are booked directly with Sam rather than through the venue.",
  },
];

const BREADCRUMBS = [
  { name: "Home", href: "/" },
  { name: "Programs", href: "/programs" },
  { name: "Classes at The Pickl Park", href: "/programs/pickl-park" },
];

export default function PicklParkPage() {
  // One render-time clock, so every card filters against the same instant.
  const now = new Date();

  return (
    <>
      <BackToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(BREADCRUMBS)),
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
      <section className="relative min-h-[80vh] flex items-end hero-full-bleed hero-nav-offset overflow-hidden">
        <Image
          src="/images/indoor-play-action.jpeg"
          alt="Indoor pickleball play at a coached clinic"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full pb-20 pt-32">
          <AnimateOnScroll>
            <div className="max-w-3xl">
              <p className="eyebrow text-accent-pink mb-4">
                Coach Sam · {FREDERICK_VENUE.city}
              </p>
              <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
                Classes at{" "}
                <span className="gradient-text-warm">The Pickl Park.</span>
              </h1>
              <p className="text-text-primary/85 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
                Sam leads a weekly block of group clinics and skills
                assessments at the club in Frederick — beginner fundamentals
                through net play under pressure. Register through the venue and
                show up ready to hit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <TrackedExternalLink
                  label="picklpark_register"
                  page={PAGE}
                  href={FREDERICK_VENUE.clinicsUrl}
                  className="inline-flex items-center justify-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
                >
                  See dates &amp; register
                </TrackedExternalLink>
                <a
                  href="#classes"
                  className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
                >
                  Browse the classes
                </a>
              </div>
              <p className="text-text-primary/75 text-sm mt-6">{VENUE_ADDRESS}</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Classes ─── */}
      <section id="classes" className="py-24 px-6 scroll-mt-28">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">What Sam teaches here</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 leading-tight">
                Seven classes,{" "}
                <span className="gradient-text-warm">one ladder.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                They stack on purpose — start where your game is, and each one
                feeds the next. Each class lists its upcoming dates; pick one and
                you go straight to that session&apos;s registration page.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {CLASSES.map((klass) => {
              const sessions = upcomingSessions(
                PICKL_PARK_SESSIONS[klass.id],
                now
              );
              return (
              <AnimateOnScroll key={klass.id}>
                <div className="glass-card p-8 h-full flex flex-col">
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="font-heading font-bold text-xl">
                      {klass.title}
                    </h3>
                    <span className="shrink-0 text-text-muted text-xs uppercase tracking-wide">
                      {klass.level}
                    </span>
                  </div>
                  <p className="text-accent-pink font-semibold text-sm mb-3">
                    {klass.cadence}
                  </p>
                  <p className="text-text-muted leading-relaxed flex-1">
                    {klass.body}
                  </p>
                  {sessions.length > 0 ? (
                    <div className="mt-6">
                      <p className="eyebrow text-xs mb-3">Register for a date</p>
                      <ul className="flex flex-wrap gap-2">
                        {sessions.map((session) => (
                          <li key={session.eventId}>
                            <TrackedExternalLink
                              label="picklpark_register_session"
                              page={PAGE}
                              href={picklParkEventUrl(session.eventId)}
                              title={`${klass.title} — ${sessionFullLabel(session.startsAt)}`}
                              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-heading font-semibold text-sm text-text-primary transition hover:border-accent-blue hover:text-accent-blue"
                            >
                              {sessionChipLabel(session.startsAt)}
                            </TrackedExternalLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <TrackedExternalLink
                      label="picklpark_register_class"
                      page={PAGE}
                      href={FREDERICK_VENUE.clinicsUrl}
                      className="inline-flex items-center gap-1 mt-6 font-heading font-semibold text-sm text-accent-blue hover:underline"
                    >
                      See upcoming dates &amp; register &rarr;
                    </TrackedExternalLink>
                  )}
                </div>
              </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── How registration works ─── */}
      <section className="relative section-photo-backdrop py-24 px-6">
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
          <div className="max-w-3xl mx-auto">
            <p className="eyebrow mb-3">How to join</p>
            <h2 className="font-heading font-black text-3xl md:text-5xl mb-8 leading-tight">
              Three steps to{" "}
              <span className="gradient-text-warm">your first class.</span>
            </h2>
            <ol className="space-y-5 text-text-muted text-lg leading-relaxed list-decimal list-inside">
              <li>
                <span className="text-text-primary font-semibold">
                  Pick your level
                </span>{" "}
                — new to the sport starts at 101; if you&apos;re unsure where you
                stand, book a Skills Assessment and find out.
              </li>
              <li>
                <span className="text-text-primary font-semibold">
                  Register through The Pickl Park
                </span>{" "}
                — the venue handles booking and payment on its own platform,
                where the schedule stays current.
              </li>
              <li>
                <span className="text-text-primary font-semibold">
                  Show up and play
                </span>{" "}
                — loaner paddles and balls are there. Bring court shoes and
                water.
              </li>
            </ol>
            <TrackedExternalLink
              label="picklpark_register"
              page={PAGE}
              href={FREDERICK_VENUE.clinicsUrl}
              className="inline-flex items-center justify-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base mt-10"
            >
              See dates &amp; register
            </TrackedExternalLink>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Private lessons ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateOnScroll>
            <p className="eyebrow mb-3">Prefer one-on-one?</p>
            <h2 className="font-heading font-black text-3xl md:text-5xl mb-6 leading-tight">
              Private lessons at{" "}
              <span className="gradient-text-warm">the same courts.</span>
            </h2>
            <p className="text-text-muted text-lg mb-10 leading-relaxed">
              Group classes move at the group&apos;s pace. If you want the hour
              built entirely around your game — or you&apos;d rather work through
              something specific without an audience — Sam takes private lessons
              at The Pickl Park too. Those are booked directly, not through the
              venue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={coachRequestUrl("pickl_park_private")}
                className="inline-flex items-center justify-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
              >
                Request a private lesson
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
              >
                Call {CONTACT.phone}
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-6 bg-navy-light">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">Common questions</p>
              <h2 className="font-heading font-black text-3xl md:text-5xl leading-tight">
                Questions, <span className="gradient-text-warm">answered.</span>
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <AnimateOnScroll key={faq.q}>
                <div className="glass-card p-6">
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
    </>
  );
}
