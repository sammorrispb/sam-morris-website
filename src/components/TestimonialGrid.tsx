import type { Testimonial } from "@/lib/testimonials";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-yellow-400" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-current" : "fill-white/10"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialGrid({
  testimonials,
  limit,
}: {
  testimonials: Testimonial[];
  limit?: number;
}) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((t) => (
        <div
          key={t.id}
          className="glow-border rounded-xl p-6 bg-white/[0.02]"
        >
          <StarRating rating={t.rating} />
          <blockquote className="mt-3 text-text-primary text-sm leading-relaxed italic">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="mt-4 border-t border-white/5 pt-3">
            <p className="text-text-primary text-sm font-medium">{t.author}</p>
            <p className="text-text-muted text-xs">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
