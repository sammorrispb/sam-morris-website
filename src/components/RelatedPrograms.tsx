import Link from "next/link";
import { RELATED_PROGRAMS } from "@/lib/related-programs";

export function RelatedPrograms({ currentPath }: { currentPath: string }) {
  const programs = RELATED_PROGRAMS[currentPath];
  if (!programs) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary text-center mb-10">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="glow-border rounded-xl p-6 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
            >
              <h3 className="text-lg font-heading font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                {p.title}
              </h3>
              <p className="mt-2 text-text-muted text-sm leading-relaxed">
                {p.description}
              </p>
              <span className="mt-4 inline-block text-accent-blue text-sm font-medium">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
