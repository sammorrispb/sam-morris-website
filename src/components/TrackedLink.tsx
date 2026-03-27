"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: "cta_click" | "program_card";
  eventProps: { label: string; page: string; section?: string; program?: string };
};

export function TrackedLink({ event, eventProps, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        if (event === "cta_click") {
          trackEvent("cta_click", {
            label: eventProps.label,
            page: eventProps.page,
            section: eventProps.section ?? "",
          });
        } else if (event === "program_card") {
          trackEvent("program_card", {
            program: eventProps.program ?? eventProps.label,
            page: eventProps.page,
          });
        }
        onClick?.(e);
      }}
    />
  );
}
