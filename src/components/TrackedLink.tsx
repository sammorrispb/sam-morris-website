"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/funnelClient";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventProps: {
    label: string;
    page: string;
    section: string;
    destination?: string;
  };
};

export function TrackedLink({ eventProps, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent("cta_click", eventProps);
        onClick?.(e);
      }}
    />
  );
}
