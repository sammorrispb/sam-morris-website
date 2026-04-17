"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/funnelClient";

type ContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  method: "email" | "phone";
  page: string;
};

export function ContactLink({ method, page, onClick, children, ...props }: ContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent("cta_click", {
          label: method === "email" ? "email" : "phone",
          page,
          section: `contact_${method}`,
        });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
