import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative py-32 px-6 text-center hero-spotlight overflow-hidden min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-lg relative">
        <p className="eyebrow mb-4">Error 404</p>
        <h1 className="font-heading font-black text-5xl md:text-7xl mb-5 leading-[0.95]">
          Out of <span className="gradient-text-warm">bounds.</span>
        </h1>
        <p className="text-text-muted text-lg mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <nav aria-label="Page not found navigation" className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-gradient px-7 py-3 rounded-full font-heading font-semibold text-sm"
          >
            Go Home
          </Link>
          <Link
            href="/programs"
            className="btn-outline px-7 py-3 rounded-full font-heading font-semibold text-sm"
          >
            Programs
          </Link>
          <Link
            href="/contact"
            className="btn-outline px-7 py-3 rounded-full font-heading font-semibold text-sm"
          >
            Contact
          </Link>
        </nav>
      </div>
    </section>
  );
}
