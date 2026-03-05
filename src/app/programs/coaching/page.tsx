import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageSectionNav } from "@/components/PageSectionNav";
import { BackToTop } from "@/components/BackToTop";
import { WIDGET_URLS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Coaching & Clinics — Dill Dinkers Rockville & North Bethesda",
  description:
    "Pickleball coaching programs at Dill Dinkers. Private lessons, group clinics, coached open play, and coach profiles for Rockville and North Bethesda.",
  alternates: { canonical: "https://www.sammorrispb.com/programs/coaching" },
  openGraph: {
    title: "Coaching & Clinics — Dill Dinkers Rockville & North Bethesda",
    description: "Private lessons, clinics, and coached open play. Meet our coaching staff.",
    url: "https://www.sammorrispb.com/programs/coaching",
  },
};

const COACHES = [
  { name: "Sam Morris", role: "Head Pro \u00b7 Director of Programming", email: "Smorris@Dilldinkers.com", bio: "9 years MCPS Physical Educator, Master\u2019s in Coaching. Co-founder of Next Gen Pickleball Academy, Link and Dink, and Pickleball Climb 5.0.", color: "#4DACD0", isHead: true },
  { name: "Art Shenk", role: "PPR Certified Coach", email: "aeshenk@gmail.com", phone: "301.956.3590", link: "https://sendfox.com/aeshenkpb", linkLabel: "Artful Pickleball Academy", color: "#22c55e", isHead: false },
  { name: "Ben Fan", role: "Coach", phone: "562.881.8625", link: "https://calendly.com/bfcoachingllc", linkLabel: "Book via Calendly", color: "#8b5cf6", isHead: false },
  { name: "Bridgit Fried", role: "Coach", phone: "301.996.1673", color: "#eab308", isHead: false },
  { name: "Collin Danielson", role: "Coach", phone: "301.775.5706", color: "#f97316", isHead: false },
  { name: "Gary Rosen", role: "Coach", phone: "240.375.2399", color: "#64748b", isHead: false },
];

const SECTIONS = [
  { id: "location-links", label: "Locations" },
  { id: "why-train", label: "Why Train" },
  { id: "cop-vs-clinics", label: "COP vs Clinics" },
  { id: "private-lessons", label: "Private Lessons" },
  { id: "group-coaching", label: "Group Coaching" },
  { id: "coaches", label: "Coaches" },
  { id: "ready-to-start", label: "Get Started" },
];

export default function CoachingPage() {
  return (
    <div className="page-sam-morris">
      <PageSectionNav sections={SECTIONS} brandColor="#4DACD0" />
      <BackToTop />
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 hero-sam-morris">
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <span className="brand-badge brand-badge-sm mb-4">Sam Morris Coaching</span>
              <h1 className="font-heading font-black text-4xl md:text-6xl leading-tight mb-6">
                Coaching &amp; <span className="gradient-text-sm">Clinics</span>
              </h1>
              <p className="text-text-muted text-lg md:text-xl max-w-xl">
                Your complete guide to coaching programs in Rockville and North Bethesda.
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

      {/* Location Quick Links */}
      <section id="location-links" className="py-12 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-sm p-6">
            <h2 className="font-heading font-bold text-xl mb-3">Rockville</h2>
            <div className="flex flex-wrap gap-3">
              <a href={WIDGET_URLS.rockville.clinics} target="_blank" rel="noopener noreferrer" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">Clinics</a>
              <span className="text-white/20">&middot;</span>
              <a href={WIDGET_URLS.rockville.coachedOpenPlay} target="_blank" rel="noopener noreferrer" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">Coached Open Play</a>
            </div>
          </div>
          <div className="card-sm p-6">
            <h2 className="font-heading font-bold text-xl mb-3">North Bethesda</h2>
            <div className="flex flex-wrap gap-3">
              <a href={WIDGET_URLS.northBethesda.clinics} target="_blank" rel="noopener noreferrer" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">Classes</a>
              <span className="text-white/20">&middot;</span>
              <a href={WIDGET_URLS.northBethesda.coachedOpenPlay} target="_blank" rel="noopener noreferrer" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">Coached Open Play</a>
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

      {/* COP vs Clinics */}
      <section id="cop-vs-clinics" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">
              Coached Open Play vs. Clinics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-sm p-6" style={{ borderTop: "3px solid #4DACD0" }}>
                <h3 className="font-heading font-bold text-lg mb-3">Coached Open Play</h3>
                <p className="text-[#4DACD0] text-sm font-semibold mb-3">Gameplay-Based Learning</p>
                <ul className="space-y-2 text-text-muted text-sm">
                  <li>Real-time feedback during live games</li>
                  <li>Strategic advice for match situations</li>
                  <li>Quick technical corrections between points</li>
                  <li>Partner rotation and competitive play</li>
                </ul>
                <p className="text-text-muted text-xs mt-4 italic">
                  Best for players who learn through playing
                </p>
              </div>
              <div className="card-sm p-6" style={{ borderTop: "3px solid #22c55e" }}>
                <h3 className="font-heading font-bold text-lg mb-3">Clinics</h3>
                <p className="text-[#22c55e] text-sm font-semibold mb-3">Drill-Focused Training</p>
                <ul className="space-y-2 text-text-muted text-sm">
                  <li>Repetitive drills to build muscle memory</li>
                  <li>Isolated skill development (serves, volleys, dinks)</li>
                  <li>Progressive difficulty levels</li>
                  <li>Strategy-specific training (drops, transitions)</li>
                </ul>
                <p className="text-text-muted text-xs mt-4 italic">
                  Best for focused practice on specific techniques
                </p>
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
                  <li>1 hour of personalized instruction</li>
                  <li>Court time included</li>
                  <li>Great for trying out coaching or a specific skill</li>
                </ul>
                <a
                  href="https://nextgenpb.as.me/?appointmentType=85545633"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm"
                >
                  Book Single Session
                </a>
              </div>
              <div className="card-sm p-6">
                <h3 className="font-heading font-bold text-lg mb-3">4-Session Package</h3>
                <ul className="space-y-2 text-text-muted text-sm mb-4">
                  <li>4 hours of personalized instruction</li>
                  <li>Court time included for all sessions</li>
                  <li>Best value for committed improvement</li>
                </ul>
                <a
                  href="https://app.acuityscheduling.com/catalog.php?owner=37395910&action=addCart&clear=1&id=2084265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white font-heading font-semibold px-6 py-3 rounded-lg btn-sm text-sm"
                >
                  Book 4-Session Package
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Group Coaching */}
      <section id="group-coaching" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Group Coaching Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-heading font-bold text-xl mb-4">Rockville</h3>
                <p className="text-text-muted text-sm mb-4">40C Southlawn Court, Rockville, MD 20850</p>
                <div className="space-y-3">
                  <a href={WIDGET_URLS.rockville.clinics} target="_blank" rel="noopener noreferrer" className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">Browse All Clinics &rarr;</a>
                  <a href={WIDGET_URLS.rockville.coachedOpenPlay} target="_blank" rel="noopener noreferrer" className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">Coached Open Play &rarr;</a>
                  <a href={WIDGET_URLS.rockville.allEvents} target="_blank" rel="noopener noreferrer" className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">All Events &rarr;</a>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl mb-4">North Bethesda</h3>
                <p className="text-text-muted text-sm mb-4">4942 Boiling Brook Pkwy, North Bethesda, MD 20852</p>
                <div className="space-y-3">
                  <a href={WIDGET_URLS.northBethesda.clinics} target="_blank" rel="noopener noreferrer" className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">Browse All Classes &rarr;</a>
                  <a href={WIDGET_URLS.northBethesda.coachedOpenPlay} target="_blank" rel="noopener noreferrer" className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">Coached Open Play &rarr;</a>
                  <a href={WIDGET_URLS.northBethesda.allEvents} target="_blank" rel="noopener noreferrer" className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">All Events &rarr;</a>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Meet Our Coaches */}
      <section id="coaches" className="py-16 px-6 scroll-mt-28">
        <div className="mx-auto max-w-4xl">
          <AnimateOnScroll>
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Meet Our Coaches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {COACHES.map((coach) => (
                <div
                  key={coach.name}
                  className={`card-sm p-6 ${coach.isHead ? "sm:col-span-2 lg:col-span-1" : ""}`}
                  style={{ borderLeft: `4px solid ${coach.color}` }}
                >
                  {coach.isHead && (
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src="/images/sam-portrait-arms-crossed.jpg"
                        alt="Sam Morris"
                        width={56}
                        height={56}
                        className="rounded-full object-cover w-14 h-14"
                      />
                      <div>
                        <h3 className="font-heading font-bold text-lg">{coach.name}</h3>
                        <p className="text-text-muted text-sm">{coach.role}</p>
                      </div>
                    </div>
                  )}
                  {!coach.isHead && (
                    <>
                      <h3 className="font-heading font-bold text-lg mb-1">{coach.name}</h3>
                      <p className="text-text-muted text-sm mb-3">{coach.role}</p>
                    </>
                  )}
                  {coach.bio && <p className="text-text-muted text-xs mb-3 leading-relaxed">{coach.bio}</p>}
                  <div className="space-y-1 text-sm">
                    {coach.email && (
                      <a href={`mailto:${coach.email}`} className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors">{coach.email}</a>
                    )}
                    {coach.phone && (
                      <p className="text-text-muted">{coach.phone}</p>
                    )}
                    {coach.link && (
                      <a href={coach.link} target="_blank" rel="noopener noreferrer" className="block text-[#4DACD0] hover:text-[#3b82f6] transition-colors">{coach.linkLabel} &rarr;</a>
                    )}
                  </div>
                </div>
              ))}
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
              <li><strong className="text-text-primary">Browse the clinic schedule</strong> for your preferred location</li>
              <li><strong className="text-text-primary">Book a coached open play session</strong> for coaching during live games</li>
              <li><strong className="text-text-primary">Schedule a private lesson</strong> for one-on-one attention</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-3xl flex justify-between items-center">
          <Link href="/programs/coached-open-play" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">
            &larr; Coached Open Play
          </Link>
          <Link href="/programs/tournaments" className="text-[#4DACD0] hover:text-[#3b82f6] transition-colors font-semibold text-sm">
            Tournaments &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
