"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/funnelClient";

const MILESTONES = [25, 50, 75, 100] as const;

export function ScrollDepthTracker({ page }: { page: string }) {
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    const sentinels = MILESTONES.map((depth) => {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = "0";
      el.style.width = "1px";
      el.style.height = "1px";
      el.style.pointerEvents = "none";
      el.dataset.depth = String(depth);
      // Place at percentage of document height
      el.style.top = `${depth}%`;
      document.documentElement.appendChild(el);
      return el;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const depth = Number((entry.target as HTMLElement).dataset.depth) as 25 | 50 | 75 | 100;
          if (fired.current.has(depth)) continue;
          fired.current.add(depth);
          trackEvent("scroll_depth", { depth, page });
        }
      },
      { threshold: 0 },
    );

    for (const el of sentinels) observer.observe(el);

    return () => {
      observer.disconnect();
      for (const el of sentinels) el.remove();
    };
  }, [page]);

  return null;
}
