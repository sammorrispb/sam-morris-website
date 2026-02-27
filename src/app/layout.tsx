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

export const metadata: Metadata = {
  title: {
    default: "Sam Morris — Coach. Builder. Dad.",
    template: "%s | Sam Morris",
  },
  description:
    "Sports coach, community builder, and entrepreneur in Montgomery County, MD. Helping families grow through sport.",
  keywords: [
    "pickleball coaching",
    "Montgomery County",
    "youth sports",
    "pickleball Maryland",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sam Morris",
              jobTitle: "Director of Programming, Sports Coach",
              description:
                "Sports coach, community builder, and entrepreneur in Montgomery County, MD",
              email: "sam.morris2131@gmail.com",
              telephone: "301-325-4731",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Montgomery County",
                addressRegion: "MD",
                addressCountry: "US",
              },
              sameAs: [],
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
