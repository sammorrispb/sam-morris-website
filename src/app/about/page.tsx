import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "About Sam Morris — PPR-Certified Pickleball Coach, Montgomery County MD",
  description:
    "Meet Sam Morris — PPR-certified pickleball professional and DUPR coach in Montgomery County, MD. Former PE teacher with a Master's in Coaching, helping adults, families, and kids develop a growth mindset through pickleball.",
  alternates: {
    canonical: "https://www.sammorrispb.com/about",
  },
  openGraph: {
    title: "About Sam Morris — Pickleball Coach in Montgomery County, MD",
    description:
      "From PE teacher to pickleball coach and community builder. PPR Pro, DUPR Certified Coach, and 3x founder serving Rockville, North Bethesda, Olney & greater Montgomery County.",
    url: "https://www.sammorrispb.com/about",
    images: [
      {
        url: "/og?title=About%20Sam%20Morris&subtitle=PPR-Certified%20Coach%20%C2%B7%20Director%20of%20Programming",
        width: 1200,
        height: 630,
        alt: "About Sam Morris — PPR-Certified Pickleball Coach",
      },
    ],
  },
};

const TIMELINE = [
  {
    year: "1989",
    title: "Hong Kong to Takoma Park",
    description:
      "Adopted from Hong Kong at 1.5 years old, grew up in Takoma Park, MD.",
  },
  {
    year: "2006",
    title: "Montgomery Blair HS",
    description: "Varsity baseball and soccer. Class of 2006.",
  },
  {
    year: "2010",
    title: "McDaniel College",
    description: "B.S. Exercise Science with minor in Education.",
  },
  {
    year: "2012",
    title: "Ball State University",
    description: "M.S. Coaching with Physical Education specialization.",
  },
  {
    year: "2012–2021",
    title: "Physical Educator",
    description:
      "9 years as a PE teacher across five schools: Saint Bernadette, Montgomery Blair HS, The Potomac School, Brooke Lee MS, Weller Road Elementary.",
  },
  {
    year: "2019",
    title: "Discovered Pickleball",
    description:
      "Introduced by adult softball teammates. Went deep during the pandemic.",
  },
  {
    year: "2022",
    title: "Pickleball Climb 5.0",
    description:
      "First pickleball business — organized competitive play for 3.5+ players.",
  },
  {
    year: "Fall 2025",
    title: "Co-founded Next Gen Pickleball Academy",
    description:
      "Co-founded NGA with Amine Lahlou — youth pickleball pathway for ages 8–16 across Montgomery County, MD. Current focus.",
  },
];

const CREDENTIALS = [
  "M.S. Coaching — Ball State University",
  "B.S. Exercise Science — McDaniel College",
  "PPR Certified Pickleball Professional",
  "DUPR Certified Coach",
  "RPO Certified",
  "5.0+ Competitive Player",
  "9 yrs MCPS Physical Educator",
  "Mixed Gender Gold — Legends Open Division",
];

export default function AboutPage() {
  return (
    <>
      <ScrollDepthTracker page="about" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: "Sam Morris",
              jobTitle: "Pickleball Coach",
              url: "https://www.sammorrispb.com/about",
              sameAs: [
                "https://instagram.com/sammorris.pb",
                "https://www.linkedin.com/in/sam-morris2131/",
                "https://facebook.com/sam.km.18",
                "https://tiktok.com/@sammorris.pb",
                "https://youtube.com/@sammorris.pb8",
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Sam Morris — Pickleball Coach & Community Builder",
            description: "Follow Sam Morris's pickleball journey — coaching highlights, tournament footage, and community events in Montgomery County, MD.",
            thumbnailUrl: "https://www.sammorrispb.com/images/sam-action.jpeg",
            uploadDate: "2025-01-01",
            contentUrl: "https://youtube.com/@sammorris.pb8",
            embedUrl: "https://www.youtube.com/embed?listType=user_uploads&list=sammorris.pb8",
            publisher: {
              "@type": "Person",
              name: "Sam Morris",
              url: "https://www.sammorrispb.com",
            },
          }),
        }}
      />

      {/* ─── Full-Bleed Hero ─── */}
      <section className="relative min-h-[80vh] flex items-end hero-full-bleed -mt-16 pt-16 overflow-hidden">
        <Image
          src="/images/sam-action.jpeg"
          alt="Sam Morris on the pickleball court"
          fill
          priority
          sizes="100vw"
          className="object-cover hero-image-warm"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full pb-20 pt-32">
          <p className="eyebrow mb-4">About Sam</p>
          <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.95] max-w-4xl">
            Coach. Builder. <span className="gradient-text-warm">Dad.</span>
          </h1>
          <p className="text-text-primary/85 text-lg md:text-xl max-w-2xl leading-relaxed">
            A Chinese-born, US-adopted former Physical Educator turned
            pickleball programming leader. Helping families and kids develop
            a growth mindset through competitive play.
          </p>
        </div>
      </section>

      {/* ─── Story Intro — text + portrait ─── */}
      <section className="py-24 px-6">
        <AnimateOnScroll>
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-3">My story</p>
              <h2 className="font-heading font-black text-3xl md:text-4xl mb-6 leading-tight">
                From Takoma Park to <span className="gradient-text-warm">tournament gold.</span>
              </h2>
              <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                <p>
                  Grew up in Takoma Park, MD. Played varsity baseball and soccer
                  at Montgomery Blair, earned a B.S. from McDaniel and an M.S.
                  in Coaching from Ball State.
                </p>
                <p>
                  Spent nine years as a PE teacher across five MCPS schools —
                  PK through 8th, plus high school baseball and basketball.
                  Discovered pickleball in 2019, never looked back.
                </p>
                <p>
                  Today: independent coach, three-time founder, husband to
                  Kelly, and dad to Kobe and Owen — building the kind of
                  programs I&apos;d want for my own kids.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glow-border">
              <Image
                src="/images/sam-portrait-arms-crossed.jpg"
                alt="Sam Morris portrait"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Credentials Grid ─── */}
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
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">Credentials</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight">
                The receipts.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CREDENTIALS.map((cred) => (
                <div
                  key={cred}
                  className="glass-card p-5 text-sm text-text-primary leading-snug"
                >
                  <span className="text-accent-blue font-bold mr-2">✓</span>
                  {cred}
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Timeline ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3">The journey</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight">
                How we got here.
              </h2>
            </div>
            <div className="relative">
              <div
                className="absolute left-[6px] top-0 bottom-0 w-0.5"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(232,160,58,0.4), rgba(184,92,47,0.2))",
                }}
              />

              <div className="flex flex-col gap-12">
                {TIMELINE.map((milestone) => (
                  <div key={milestone.year} className="relative pl-12">
                    <div
                      className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-accent-blue"
                      style={{
                        boxShadow:
                          "0 0 0 4px rgba(232, 160, 58, 0.18), 0 0 16px rgba(232, 160, 58, 0.45)",
                      }}
                    />
                    <div className="font-mono text-accent-blue text-xs uppercase tracking-[0.18em] mb-1.5">
                      {milestone.year}
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Coaching Philosophy ─── */}
      <section className="relative section-photo-backdrop py-24 px-6">
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
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_240px] gap-12 items-center">
            <div>
              <p className="eyebrow mb-3">Coaching philosophy</p>
              <h2 className="font-heading font-black text-3xl md:text-4xl mb-8 leading-tight">
                Every drill has a purpose. Every milestone gets <span className="gradient-text-warm">celebrated.</span>
              </h2>
              <blockquote className="border-l-2 border-accent-blue pl-6 py-2">
                <p className="text-text-primary text-lg md:text-xl leading-relaxed font-light italic">
                  &ldquo;Pickleball is more than a sport — it&apos;s a way to help kids
                  and families grow stronger together. Drawing from my background
                  in physical education, I create sessions that are safe,
                  structured, and fun, while always emphasizing EASE values.
                  Every drill has purpose, every milestone is celebrated, and
                  every lesson is designed to build confidence on the court and
                  resilience in life.&rdquo;
                </p>
                <footer className="mt-5 text-text-muted text-sm">
                  — Sam Morris
                </footer>
              </blockquote>
            </div>
            <div className="hidden md:block relative aspect-[3/4] w-full rounded-2xl overflow-hidden glow-border">
              <Image
                src="/images/sam-ready-position.jpg"
                alt="Sam in ready position"
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Projects / NGA ─── */}
      <section className="py-24 px-6">
        <AnimateOnScroll>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">Current ventures</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight">
                What I&apos;m building now.
              </h2>
            </div>
            <a
              href="https://nextgenpbacademy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative overflow-hidden rounded-2xl card-warm card-hover"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
                <div className="p-8 md:p-10">
                  <p className="font-mono text-accent-blue text-xs uppercase tracking-[0.18em] mb-3">
                    Youth Academy
                  </p>
                  <h3 className="font-heading font-black text-2xl md:text-3xl mb-4 group-hover:text-accent-blue transition-colors">
                    Next Gen Pickleball Academy
                  </h3>
                  <p className="text-text-muted leading-relaxed mb-6">
                    Co-founded with Amine Lahlou. A structured youth pathway —
                    Red (private bridge), Orange, Green, Yellow — building
                    confidence and competitive skill in players ages 8–16 who
                    can rally, across Montgomery County.
                  </p>
                  <span className="inline-flex items-center text-accent-blue font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Visit nextgenpbacademy.com ↗
                  </span>
                </div>
                <div className="relative aspect-square md:aspect-auto md:min-h-full">
                  <Image
                    src="/images/youth-indoor-player-2.jpeg"
                    alt="Youth pickleball academy"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-navy-light/30 md:to-transparent" />
                </div>
              </div>
            </a>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 bg-navy-light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading font-black text-3xl md:text-5xl mb-5 leading-tight">
            Want to <span className="gradient-text-warm">work with Sam?</span>
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            Free 30-minute evaluation gets you a rating and a plan. No pressure, no pitch.
          </p>
          <Link
            href="/evaluation"
            className="inline-flex items-center font-heading font-semibold px-8 py-4 rounded-full btn-gradient text-base"
          >
            Book a Free Evaluation →
          </Link>
        </div>
      </section>
    </>
  );
}
