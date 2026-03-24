import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="py-32 px-6 text-center">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-accent-blue text-sm uppercase tracking-wider mb-4">
          404
        </p>
        <h1 className="font-heading font-black text-4xl md:text-5xl mb-4">
          Page Not Found
        </h1>
        <p className="text-text-muted text-lg mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <nav aria-label="Page not found navigation" className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="btn-primary-sm px-6 py-3 rounded-lg font-heading font-semibold"
          >
            Go Home
          </Link>
          <Link
            href="/programs"
            className="border border-white/20 text-text-primary px-6 py-3 rounded-lg font-heading font-semibold hover:border-white/40 transition-colors"
          >
            Programs
          </Link>
          <Link
            href="/locations"
            className="border border-white/20 text-text-primary px-6 py-3 rounded-lg font-heading font-semibold hover:border-white/40 transition-colors"
          >
            Facilities
          </Link>
          <Link
            href="/contact"
            className="border border-white/20 text-text-primary px-6 py-3 rounded-lg font-heading font-semibold hover:border-white/40 transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </section>
  );
}
