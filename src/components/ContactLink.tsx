"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/analytics";

type ContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  method: "email" | "phone";
  page: string;
};

export function ContactLink({ method, page, onClick, children, ...props }: ContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent("contact_direct", { method, page });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
