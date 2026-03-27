import { track } from "@vercel/analytics";

type AnalyticsEventMap = {
  cta_click: { label: string; page: string; section: string };
  lead_form: { action: "started" | "submitted" | "error"; interest?: string; page: string };
  external_link: { label: string; url: string; page: string };
  program_card: { program: string; page: string };
  nav_click: { label: string; device: "desktop" | "mobile" };
  contact_direct: { method: "email" | "phone"; page: string };
  scroll_depth: { depth: 25 | 50 | 75 | 100; page: string };
};

export function trackEvent<K extends keyof AnalyticsEventMap>(
  name: K,
  props: AnalyticsEventMap[K],
) {
  track(name, props);
}
