"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  page: string;
};

export function TrackedExternalLink({
  label,
  page,
  href,
  onClick,
  children,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      onClick={(e) => {
        trackEvent("external_link", { label, url: href ?? "", page });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
