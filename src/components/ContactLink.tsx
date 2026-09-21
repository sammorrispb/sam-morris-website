"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/funnelClient";

type ContactMethod = "email" | "phone" | "sms";

type ContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  method: ContactMethod;
  page: string;
  /** Overrides the default `contact_<method>` section label in analytics. */
  section?: string;
};

const METHOD_LABEL: Record<ContactMethod, string> = {
  email: "email",
  phone: "phone",
  sms: "text",
};

export function ContactLink({
  method,
  page,
  section,
  onClick,
  children,
  ...props
}: ContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent("cta_click", {
          label: METHOD_LABEL[method],
          page,
          section: section ?? `contact_${method}`,
        });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
