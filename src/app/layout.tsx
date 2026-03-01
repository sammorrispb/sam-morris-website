import type { Metadata } from "next";
import { Montserrat, Inter, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
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
    default:
      "Sam Morris — Pickleball Coach in Montgomery County, MD | Adults, Families & Kids",
    template: "%s | Sam Morris Pickleball",
  },
  description:
    "Professional pickleball coaching for adults, families, and kids in Montgomery County, MD. PPR-certified coach offering private lessons, youth academy, and community programs in Rockville, North Bethesda, and Olney.",
  keywords: [
    "pickleball coaching Montgomery County MD",
    "pickleball lessons Rockville",
    "pickleball lessons North Bethesda",
    "youth pickleball Montgomery County",
    "kids pickleball lessons Maryland",
    "family pickleball Montgomery County",
    "adult pickleball coaching MD",
    "private pickleball lessons near me",
    "pickleball academy kids Maryland",
    "beginner pickleball Montgomery County",
    "pickleball coach near Bethesda",
    "pickleball clinics Olney MD",
    "DUPR certified pickleball coach",
    "PPR pickleball professional Maryland",
    "Next Gen Pickleball Academy",
    "pickleball community Montgomery County",
    "learn pickleball Montgomery County",
    "pickleball programs families MD",
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
      "Sam Morris — Pickleball Coach in Montgomery County, MD | Adults, Families & Kids",
    description:
      "Professional pickleball coaching for adults, families, and kids in Montgomery County, MD. Private lessons, youth academy, and community programs in Rockville & North Bethesda.",
    images: [
      {
        url: "/images/sam-portrait-with-paddle.jpg",
        width: 1200,
        height: 630,
        alt: "Sam Morris — Pickleball Coach in Montgomery County, MD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Sam Morris — Pickleball Coach in Montgomery County, MD",
    description:
      "Professional pickleball coaching for adults, families, and kids. Private lessons, youth academy & community programs in Rockville & North Bethesda, MD.",
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
    >
      <body className="antialiased">
        {/* Person + Coach Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sam Morris",
              jobTitle: "Professional Pickleball Coach & Director of Programming",
              description:
                "PPR-certified professional pickleball coach in Montgomery County, MD. Specializes in coaching adults, families, and kids ages 5-16 at Dill Dinkers Rockville and North Bethesda.",
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
            }),
          }}
        />
        {/* LocalBusiness / SportsActivityLocation Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              name: "Sam Morris Pickleball Coaching",
              description:
                "Professional pickleball coaching for adults, families, and kids in Montgomery County, MD. Private lessons, group clinics, youth academy programs, and skill evaluations at Dill Dinkers Rockville and North Bethesda.",
              url: "https://www.sammorrispb.com",
              telephone: "301-325-4731",
              email: "sam.morris2131@gmail.com",
              image: "https://www.sammorrispb.com/images/sam-portrait-with-paddle.jpg",
              priceRange: "$-$$",
              areaServed: [
                {
                  "@type": "AdministrativeArea",
                  name: "Montgomery County, Maryland",
                },
                { "@type": "City", name: "Rockville, MD" },
                { "@type": "City", name: "North Bethesda, MD" },
                { "@type": "City", name: "Bethesda, MD" },
                { "@type": "City", name: "Olney, MD" },
                { "@type": "City", name: "Gaithersburg, MD" },
                { "@type": "City", name: "Silver Spring, MD" },
                { "@type": "City", name: "Germantown, MD" },
                { "@type": "City", name: "Wheaton, MD" },
                { "@type": "City", name: "Takoma Park, MD" },
                { "@type": "City", name: "Potomac, MD" },
              ],
              location: [
                {
                  "@type": "Place",
                  name: "Dill Dinkers Rockville",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Rockville",
                    addressRegion: "MD",
                    addressCountry: "US",
                  },
                },
                {
                  "@type": "Place",
                  name: "Dill Dinkers North Bethesda",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "North Bethesda",
                    addressRegion: "MD",
                    addressCountry: "US",
                  },
                },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Pickleball Coaching Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    price: "130.00",
                    priceCurrency: "USD",
                    itemOffered: {
                      "@type": "Service",
                      name: "Private Pickleball Lessons",
                      description:
                        "Personalized 1-on-1 pickleball coaching for adults and families in Montgomery County, MD. Includes video analysis, custom practice plans, and flexible scheduling. $130 per session or $400 for a 4-session package.",
                      provider: {
                        "@type": "Person",
                        name: "Sam Morris",
                      },
                      areaServed: "Montgomery County, MD",
                      audience: {
                        "@type": "Audience",
                        audienceType: "Adults, Families, Beginners to Advanced",
                      },
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Next Gen Pickleball Academy — Youth Program",
                      description:
                        "Structured pickleball academy for kids ages 5-16 in Montgomery County, MD. Four skill levels (Red, Orange, Green, Yellow) with clear progression from beginner to advanced.",
                      provider: {
                        "@type": "Person",
                        name: "Sam Morris",
                      },
                      areaServed: "Montgomery County, MD",
                      audience: {
                        "@type": "Audience",
                        audienceType: "Children and Youth ages 5-16",
                      },
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Pickleball Skill Evaluation",
                      description:
                        "30-minute pickleball skill evaluation with DUPR-certified coach. Includes Link & Dink account creation for ongoing skill tracking.",
                      provider: {
                        "@type": "Person",
                        name: "Sam Morris",
                      },
                      areaServed: "Montgomery County, MD",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Family Pickleball Coaching",
                      description:
                        "Family-friendly pickleball sessions in Montgomery County, MD. Learn and play together — a great sport for parents and kids of all ages.",
                      provider: {
                        "@type": "Person",
                        name: "Sam Morris",
                      },
                      areaServed: "Montgomery County, MD",
                      audience: {
                        "@type": "Audience",
                        audienceType: "Families with children",
                      },
                    },
                  },
                ],
              },
              sameAs: [
                "https://instagram.com/sammorris.pb",
                "https://facebook.com/sam.km.18",
                "https://linkedin.com/in/sammorris2131",
                "https://tiktok.com/@sammorris.pb",
                "https://youtube.com/@sammorris.pb8",
              ],
            }),
          }}
        />
        {/* FAQ Schema — targets common pickleball questions in Montgomery County */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Where can I take pickleball lessons in Montgomery County, MD?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sam Morris offers professional pickleball coaching at Dill Dinkers Rockville and Dill Dinkers North Bethesda. Private lessons, group clinics, and youth academy programs are available for all skill levels — from complete beginners to 5.0+ players. Visit sammorrispb.com/contact to book a free evaluation.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is pickleball good for kids and families?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Pickleball is one of the best family sports — it's easy for beginners of all ages to learn, requires minimal equipment, and provides great exercise. The Next Gen Pickleball Academy in Montgomery County offers structured programs for kids ages 5-16 with four skill levels. Many families play together and it's a wonderful way to bond through sport.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What age can kids start learning pickleball?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Kids can start learning pickleball as young as age 5. The Next Gen Pickleball Academy's Red Level is designed specifically for first-time players, teaching grip, stance, basic serves, and court awareness in a fun, supportive environment.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How much do private pickleball lessons cost in Montgomery County?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sam Morris offers private 1-on-1 pickleball lessons with video analysis and custom practice plans. Lessons are $130 per session or $400 for a 4-session package ($100/session). Skill evaluations start at $15 per person (free for Dill Dinkers members). Visit sammorrispb.com/programs to book or contact Sam at 301-325-4731.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Where can I play indoor pickleball in Montgomery County, MD?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Dill Dinkers operates indoor pickleball facilities in Rockville and North Bethesda, both in Montgomery County, MD. Sam Morris directs programming at both locations, which together offer 17 courts for lessons, open play, leagues, and tournaments year-round.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is DUPR and why does it matter for pickleball?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "DUPR (Dynamic Universal Pickleball Rating) is the global pickleball rating system used to match players of similar skill levels. Sam Morris is a DUPR Certified Coach who provides skill evaluations and helps players track their improvement over time through the Link & Dink community app.",
                  },
                },
              ],
            }),
          }}
        />
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
