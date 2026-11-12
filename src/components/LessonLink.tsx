import { useId, type ReactNode } from "react";
import { TrackedLink } from "@/components/TrackedLink";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import {
  COACH_REQUEST_URL,
  COHORT_POOL_URL,
  COHORT_HANDOFF_NOTE,
  LESSON_HANDOFF_NOTE,
} from "@/lib/constants";
import { coachRequestUrl } from "@/lib/urls";

/**
 * The one way to put a lesson or cohort request button in page content.
 *
 * The request page lives on a different site, so the button and a short
 * visible line saying so are rendered together and the line cannot be left
 * off. The component owns the URL: pages pass `kind` (and an optional UTM
 * `content`), never an href. tests/lesson-link.test.tsx fails if a page
 * reaches for the request URL directly or drops one of these.
 *
 * Exempt by rule, and not built on this: the nav, the mobile sticky bar, the
 * footer tagline strip, quiz results and plain-text emails.
 */
type Tracking =
  // Fires `external_link` and opens a new tab (TrackedExternalLink).
  | { event: "external_link"; label: string; page: string }
  // Fires `cta_click` with the link as `destination` (TrackedLink).
  | { event: "cta_click"; label: string; page: string; section: string };

type LessonLinkProps = {
  /** Which request page: a private lesson (default) or the cohort pool. */
  kind?: "lesson" | "cohort";
  /** UTM content, "<page>_<section>". Lesson links only. Omit for the bare URL. */
  content?: string;
  /** Open in a new tab. `external_link` tracking always does. */
  newTab?: boolean;
  tracking?: Tracking;
  /** Classes for the button itself. */
  className: string;
  /** Layout of the button plus line. Replaces the centered default. */
  wrapperClassName?: string;
  children: ReactNode;
};

const DEFAULT_WRAPPER = "flex flex-col items-center gap-2";

export function LessonLink({
  kind = "lesson",
  content,
  newTab = false,
  tracking,
  className,
  wrapperClassName = DEFAULT_WRAPPER,
  children,
}: LessonLinkProps) {
  const noteId = useId();
  const href =
    kind === "cohort"
      ? COHORT_POOL_URL
      : content
        ? coachRequestUrl(content)
        : COACH_REQUEST_URL;

  let link: ReactNode;
  if (tracking?.event === "external_link") {
    link = (
      <TrackedExternalLink
        href={href}
        label={tracking.label}
        page={tracking.page}
        className={className}
        aria-describedby={noteId}
      >
        {children}
      </TrackedExternalLink>
    );
  } else if (tracking?.event === "cta_click") {
    link = (
      <TrackedLink
        href={href}
        className={className}
        aria-describedby={noteId}
        eventProps={{
          label: tracking.label,
          page: tracking.page,
          section: tracking.section,
          destination: href,
        }}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </TrackedLink>
    );
  } else {
    link = (
      <a
        href={href}
        className={className}
        aria-describedby={noteId}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <div data-lesson-link={kind} className={wrapperClassName}>
      {link}
      <p id={noteId} data-lesson-handoff className="text-text-muted text-xs leading-snug">
        {kind === "cohort" ? COHORT_HANDOFF_NOTE : LESSON_HANDOFF_NOTE}
      </p>
    </div>
  );
}
