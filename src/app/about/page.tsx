import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Sam Morris — from PE teacher to pickleball entrepreneur in Montgomery County, MD.",
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
    year: "2012\u20132021",
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
      "First pickleball business \u2014 organized competitive play for 3.5+ players.",
  },
  {
    year: "2023",
    title: "Dill Dinkers",
    description:
      "Joined as Assistant Manager at Rockville. Promoted to Director of Programming at North Bethesda before training was even complete. Now leads both locations.",
  },
  {
    year: "Now",
    title: "Building the Future",
    description:
      "Co-founder of Next Gen Pickleball Academy (with Amine Lahlou) and Link & Dink community app. Father of Kobe and Owen. Husband to Kelly. Living in Olney, MD.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative py-24 md:py-32 px-6 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-6">
            About <span className="gradient-text">Sam</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Sports coach, community builder, and entrepreneur in Montgomery
            County, MD. Helping families and kids develop a growth mindset
            through competitive play.
          </p>
        </div>
      </section>

      {/* ─── Story Intro ─── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-text-muted text-lg leading-relaxed">
            A Chinese-born, US-adopted former Physical Educator turned
            pickleball programming leader. Sam grew up in Takoma Park, MD,
            played varsity baseball and soccer at Montgomery Blair, and earned a
            Master&apos;s in Coaching from Ball State University. After nine years
            teaching PE across five schools, he discovered pickleball in 2019
            and never looked back &mdash; building businesses, programs, and a
            community around the sport he loves.
          </p>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-12 text-center">
            The Journey
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[5px] top-0 bottom-0 w-0.5"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
            />

            <div className="flex flex-col gap-10">
              {TIMELINE.map((milestone) => (
                <div key={milestone.year} className="relative pl-10">
                  {/* Glowing dot */}
                  <div
                    className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-accent-blue"
                    style={{
                      boxShadow:
                        "0 0 8px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.3)",
                    }}
                  />

                  <div className="font-mono text-accent-blue text-sm mb-1">
                    {milestone.year}
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Competitive Highlight ─── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="bg-navy-light glow-border rounded-xl p-8 text-center">
            <div className="font-mono text-accent-lime text-sm uppercase tracking-wider mb-3">
              Competitive Highlight
            </div>
            <p className="font-heading font-bold text-lg md:text-xl leading-relaxed">
              Mixed Gender Gold at the Legends Tournament, defeating future pro
              Alix Truong and John Truong in the Open Division final.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Projects ─── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://nextgenpbacademy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-navy-light glow-border rounded-xl p-6 text-center hover:scale-[1.02] transition-transform"
            >
              <div className="font-mono text-accent-blue text-sm uppercase tracking-wider mb-2">
                Academy
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">
                Next Gen Academy
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Youth pickleball academy co-founded with Amine Lahlou, building
                the next generation of players.
              </p>
            </a>

            <a
              href="https://www.linkanddink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-navy-light glow-border rounded-xl p-6 text-center hover:scale-[1.02] transition-transform"
            >
              <div className="font-mono text-accent-lime text-sm uppercase tracking-wider mb-2">
                Community
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">
                Link &amp; Dink
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Social discovery platform connecting pickleball players for
                events, groups, and community.
              </p>
            </a>

            <a
              href="https://tournamentwebsite-g34i63j8t-sammorris2131-7591s-projects.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-navy-light glow-border rounded-xl p-6 text-center hover:scale-[1.02] transition-transform"
            >
              <div className="font-mono text-accent-pink text-sm uppercase tracking-wider mb-2">
                Tournaments
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">
                Tournament Series
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Competitive tournament events for players looking to test their
                skills.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Coaching Philosophy ─── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">
            Coaching Philosophy
          </h2>
          <blockquote className="border-l-4 border-accent-blue pl-6 py-2">
            <p className="text-text-muted text-lg leading-relaxed italic">
              &ldquo;Pickleball is more than a sport &mdash; it&apos;s a way to help kids
              and families grow stronger together. Drawing from my background in
              physical education, I create sessions that are safe, structured,
              and fun, while always emphasizing EASE values. Every drill has
              purpose, every milestone is celebrated, and every lesson is
              designed to build confidence on the court and resilience in
              life.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

    </>
  );
}
