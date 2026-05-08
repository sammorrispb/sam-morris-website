import type { Metadata } from "next";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BackToTop } from "@/components/BackToTop";
import { LeadForm } from "@/components/LeadForm";
import { faqJsonLd } from "@/lib/seo";
import { CONTACT, EVENT_TYPES, SERVICE_AREA } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pickleball Events & Clinics — Hire Coach Sam | DMV",
  description:
    "Book Coach Sam Morris to run your pickleball event in the DMV — birthdays, corporate offsites, social mixers, and health & wellness programming. Paddles + format included.",
  keywords: [
    "pickleball event coach DMV",
    "pickleball birthday party Maryland",
    "corporate pickleball clinic",
    "pickleball social mixer Bethesda",
    "wellness pickleball clinic Montgomery County",
    "hire pickleball instructor for event",
  ],
  alternates: { canonical: "https://www.sammorrispb.com/programs/events" },
  openGraph: {
    title: "Pickleball Events & Clinics — Hire Coach Sam",
    description:
      "Birthdays, corporate, social, and wellness pickleball events in the DMV. Coach Sam runs the format — you bring the people.",
    url: "https://www.sammorrispb.com/programs/events",
    images: [
      {
        url: "/og?title=Events%20%26%20Clinics&subtitle=Birthdays%20%C2%B7%20Corporate%20%C2%B7%20Social%20%C2%B7%20Wellness",
        width: 1200,
        height: 630,
        alt: "Pickleball Events & Clinics with Coach Sam",
      },
    ],
  },
};

const EVENT_HIGHLIGHTS = [
  {
    title: "Birthday parties",
    body: "Kid or adult, beginner or experienced. Format scaled to the energy of the room — fundamentals, dink ladders, mini-tournaments, or just coached fun play.",
  },
  {
    title: "Corporate & team-building",
    body: "Offsites, all-hands, client appreciation. Mixed skill levels welcome. We finish on a high — usually a coached round-robin with prizes.",
  },
  {
    title: "Social mixers",
    body: "League nights, neighborhood meet-ups, club socials. I run the format so everyone plays meaningful points; nobody sits on the sidelines.",
  },
  {
    title: "Health & wellness",
    body: "HOAs, retirement communities, gyms, wellness programs. Low-impact, mobility-friendly progressions for first-time players.",
  },
];

const FAQS = [
  {
    q: "How many people can you handle?",
    a: "From a 4-player birthday up to ~40 across multiple courts. Larger groups are split into rotating stations so nobody is standing around.",
  },
  {
    q: "Do you provide paddles and balls?",
    a: "Yes — loaner paddles for first-timers, fresh balls, and portable nets if your venue doesn't have a court setup. Just confirm headcount when booking.",
  },
  {
    q: "Where can you run an event?",
    a: `${SERVICE_AREA.shortDescription}. I can also help find a public or private court if you don't have one lined up.`,
  },
  {
    q: "How is pricing structured?",
    a: "Quote-by-headcount — there's a base coaching fee plus a per-player rate that scales with group size. Reply to the form below with rough numbers and you'll get a quote within a day.",
  },
  {
    q: "What about beginners?",
    a: "Most of my events are mostly-beginner. The format is designed for people who've never held a paddle — every drill has a ladder so the experienced players are also challenged.",
  },
];

export default function EventsPage() {
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

      {/* ─── Hero ─── */}
      <section className="relative min-h-[80vh] flex items-end hero-full-bleed -mt-16 pt-16 overflow-hidden">
        <Image
          src="/images/sam-group-selfie.jpg"
          alt="Coach Sam with a group at a pickleball event"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full pb-20 pt-32">
          <AnimateOnScroll>
            <div className="max-w-3xl">
              <p className="eyebrow text-accent-pink mb-4">
                Hire Coach Sam · DMV
              </p>
              <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
                Pickleball for{" "}
                <span className="gradient-text-warm">your event.</span>
              </h1>
              <p className="text-text-primary/85 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
                Birthdays, corporate offsites, social mixers, wellness clinics
                — Sam runs the format, brings the gear, and gets every player
                hitting balls. You bring the people.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#request"
                  className="inline-flex items-center justify-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
                >
                  Request a Quote
                </a>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="inline-flex items-center justify-center btn-outline font-heading font-semibold px-8 py-4 rounded-full text-base"
                >
                  Call {CONTACT.phone}
                </a>
              </div>
              <p className="text-text-muted text-sm mt-6">
                {SERVICE_AREA.shortDescription}
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Event Types ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">What I run</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 leading-tight">
                Five event{" "}
                <span className="gradient-text-warm">flavors.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Each scales to your group size, skill mix, and goals. Format is
                tailored — never a one-size-fits-all clinic.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {EVENT_HIGHLIGHTS.map((card) => (
              <AnimateOnScroll key={card.title}>
                <div className="glass-card p-8 h-full">
                  <h3 className="font-heading font-bold text-xl mb-3">
                    {card.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">{card.body}</p>
                </div>
              </AnimateOnScroll>
            ))}
            <AnimateOnScroll>
              <div className="glass-card p-8 h-full md:col-span-2">
                <h3 className="font-heading font-bold text-xl mb-3">
                  Something else?
                </h3>
                <p className="text-text-muted leading-relaxed">
                  Bachelor/bachelorette weekends, summer camps, league launches,
                  league championships, charity tournaments, fundraisers — if
                  pickleball belongs in it, fill out the form below and we&apos;ll
                  shape it together.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
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
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="font-heading font-black text-3xl md:text-5xl mb-8 leading-tight">
              Four steps from{" "}
              <span className="gradient-text-warm">inquiry to courts.</span>
            </h2>
            <ol className="space-y-5 text-text-muted text-lg leading-relaxed list-decimal list-inside">
              <li>
                <span className="text-text-primary font-semibold">Send the request</span> — tell me the event type, headcount, date window, and venue (if you have one).
              </li>
              <li>
                <span className="text-text-primary font-semibold">Get a quote within a day</span> — recommended format, pricing, and any venue help you need.
              </li>
              <li>
                <span className="text-text-primary font-semibold">Lock the date + deposit</span> — small deposit holds the date; balance due day-of.
              </li>
              <li>
                <span className="text-text-primary font-semibold">Show up and play</span> — I bring paddles, balls, nets if needed, and the format. You bring the crew.
              </li>
            </ol>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Lead Form ─── */}
      <section id="request" className="py-24 px-6 scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll>
            <div className="text-center mb-10">
              <p className="eyebrow mb-3">Request a quote</p>
              <h2 className="font-heading font-black text-3xl md:text-5xl mb-4 leading-tight">
                Tell me about{" "}
                <span className="gradient-text-warm">your event.</span>
              </h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto">
                Pick the event type, drop the basics, and I&apos;ll come back
                with a recommended format and pricing within a day.
              </p>
            </div>
          </AnimateOnScroll>
          <LeadForm
            heading="Event details"
            page="/programs/events"
            lockedInterest="Event / Clinic"
            eventTypeRequired
          />
          <p className="text-text-muted text-xs text-center mt-6">
            Event types: {EVENT_TYPES.join(" · ")}
          </p>
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
