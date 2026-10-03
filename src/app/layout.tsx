import type { Metadata } from "next";
import { Montserrat, Inter, Roboto_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { ANNOUNCEMENT } from "@/lib/constants";
import { PageViewTracker } from "@/components/PageViewTracker";
import { UtmCapture } from "@/components/UtmCapture";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const SITE_URL = "https://www.sammorrispb.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Used on routes that don't override metadata.title (rare — most pages set their own).
    // Keep ≤60 chars to satisfy SERP truncation budget.
    default: "Pickleball Lessons in Montgomery & Frederick | Sam Morris",
    // Per-page titles already include brand context, so use a no-op template
    // (otherwise page titles get a duplicate "| Sam Morris Pickleball" suffix
    // that blows past 60 chars).
    template: "%s",
  },
  description:
    "Private pickleball lessons in Montgomery County, MD, plus lessons and adult clinics at The Pickl Park in Frederick. Request a lesson with Coach Sam.",
  keywords: [
    "pickleball lessons Montgomery County MD",
    "private pickleball coaching Montgomery County",
    "pickleball lessons Frederick MD",
    "adult pickleball clinics Frederick",
    "The Pickl Park clinics",
    "pickleball lessons Rockville",
    "pickleball lessons North Bethesda",
    "adult pickleball coaching MD",
    "private pickleball lessons near me",
    "beginner pickleball Montgomery County",
    "pickleball coach near Bethesda",
    "pickleball clinics Olney MD",
    "DUPR certified pickleball coach",
    "PPR pickleball professional Maryland",
    "learn pickleball Montgomery County",
    "beginner pickleball class near me",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Sam Morris Pickleball",
    title:
      "Pickleball Lessons in Montgomery & Frederick | Sam Morris",
    description:
      "Private pickleball lessons in Montgomery County, MD, plus lessons and adult clinics at The Pickl Park in Frederick. Request a lesson with Coach Sam.",
    images: [
      {
        url: "/images/sam-portrait-with-paddle.jpg",
        width: 1200,
        height: 630,
        alt: "Sam Morris — Pickleball Lessons in Montgomery & Frederick",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pickleball Lessons in Montgomery & Frederick | Sam Morris",
    description:
      "Private pickleball lessons in Montgomery County, MD, plus lessons and adult clinics at The Pickl Park in Frederick. Request a lesson with Coach Sam.",
    images: ["/images/sam-portrait-with-paddle.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: 'dNYGa1MBNPJyb5hLSWZQjc2e2EOuyJ2UBDPET2b7CXU',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${robotoMono.variable}`}
      /* Drives .hero-nav-offset + .announcement-banner in globals.css. Cleared
         before paint by the script below when the visitor already dismissed
         this announcement, so the hero reclaims its bleed-under-nav layout. */
      data-announcement={ANNOUNCEMENT ? ANNOUNCEMENT.id : undefined}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {ANNOUNCEMENT && (
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(localStorage.getItem('dismissed-announcement-${ANNOUNCEMENT.id}'))document.documentElement.removeAttribute('data-announcement')}catch(e){}`,
            }}
          />
        )}
        {/* Person + Coach Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://www.sammorrispb.com/#person",
              name: "Sam Morris",
              jobTitle: "Professional Pickleball Coach",
              description:
                "PPR-certified pickleball coach offering private and family coaching in Montgomery County, MD, and at The Pickl Park in Frederick. Co-founder of Next Gen Pickleball Academy, a youth academy for ages 6–16.",
              email: "sam.morris2131@gmail.com",
              telephone: "301-325-4731",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Olney",
                addressRegion: "MD",
                postalCode: "20832",
                addressCountry: "US",
              },
              url: "https://www.sammorrispb.com",
              knowsAbout: [
                "Pickleball Coaching",
                "Youth Sports Development",
                "Physical Education",
                "Sports Community Building",
                "DUPR Rating System",
              ],
              hasCredential: [
                {
                  "@type": "EducationalOccupationalCredential",
                  credentialCategory: "degree",
                  name: "M.S. in Coaching",
                  educationalLevel: "Master's Degree",
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  credentialCategory: "certification",
                  name: "PPR Certified Pickleball Professional",
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  credentialCategory: "certification",
                  name: "DUPR Certified Coach",
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  credentialCategory: "certification",
                  name: "RPO Certified",
                },
              ],
              sameAs: [
                "https://instagram.com/sammorris.pb",
                "https://facebook.com/sam.km.18",
                "https://linkedin.com/in/sammorris2131",
                "https://tiktok.com/@sammorris.pb",
                "https://youtube.com/@sammorris.pb8",
              ],
              affiliation: {
                "@type": "SportsOrganization",
                "@id": "https://nextgenpbacademy.com/#organization",
                name: "Next Gen Pickleball Academy",
                url: "https://nextgenpbacademy.com",
              },
            }),
          }}
        />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              description: "Independent pickleball coaching in Montgomery County, MD, plus private lessons and adult clinics at The Pickl Park in Frederick.",
              areaServed: [
                { "@type": "AdministrativeArea", name: "Montgomery County, Maryland" },
                { "@type": "AdministrativeArea", name: "Washington, DC" },
                { "@type": "AdministrativeArea", name: "Prince George's County, Maryland" },
                { "@type": "AdministrativeArea", name: "Howard County, Maryland" },
                { "@type": "AdministrativeArea", name: "Northern Virginia" },
                { "@type": "City", name: "Frederick, MD" },
              ],
              name: "Sam Morris Pickleball",
              url: "https://www.sammorrispb.com",
              logo: "https://www.sammorrispb.com/images/sam-portrait-with-paddle.jpg",
              founder: { "@id": "https://www.sammorrispb.com/#person" },
              email: "sam.morris2131@gmail.com",
              telephone: "301-325-4731",
              sameAs: [
                "https://instagram.com/sammorris.pb",
                "https://facebook.com/sam.km.18",
                "https://linkedin.com/in/sammorris2131",
                "https://tiktok.com/@sammorris.pb",
                "https://youtube.com/@sammorris.pb8",
                "https://www.google.com/maps/place/Sam+Morris+Pickleball+Coaching/data=!4m2!3m1!1s0x0:0x38cdd944077fe2e",
              ],
            }),
          }}
        />
        {/* FAQ JSON-LD intentionally NOT emitted here. Per Google guidance
            (search.google.com/structured-data/testing-tool — FAQPage policy):
            only pages with visible FAQ content should emit FAQPage. Home page
            embeds its own visible FAQ-derived schema; /programs/coaching ships
            its own per-page FAQ. Sitewide FAQ schema was removed 2026-05-24
            as part of the SEO audit fix. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main-content" className="pt-16">
          <AnnouncementBanner />
          {children}
        </main>
        <Footer />
        <UtmCapture />
        <PageViewTracker />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
