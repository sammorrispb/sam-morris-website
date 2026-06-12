import { CONTACT, SERVICE_AREA, COACH_REQUEST_URL, COACH_BOOKING_URL } from "./constants";

export function interestSlug(interest: string): string {
  return interest.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export const SIGN_OFF = `Looking forward to connecting!

Sam Morris
${CONTACT.phone}
${CONTACT.email}
sammorrispb.com`;

function privateLessonTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about a private lesson — I'd love to help you level up your game.

Every session is 1-on-1 and built around what you most want to work on: third shot drops, resets under pressure, kitchen battles, serve patterns, doubles strategy — whatever's the bottleneck. I bring video review when it helps so you can see exactly what we're working on.

Service area: ${SERVICE_AREA.shortDescription}. You arrange and pay for the court; I bring the coaching.

Single sessions and 4-session packages are both available — whatever fits your goals.

Reply to this email or request a time at ${COACH_REQUEST_URL} and I'll confirm a slot.

${SIGN_OFF}`;
}

function groupLessonTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about a group lesson — small-group coaching is one of the most efficient ways to level up because you get reps with real partners and live feedback at the same time.

Group lessons are for 2 or more players. Bring a friend, a partner, or a small crew — I'll build the session around the group's level and goals.

Service area: ${SERVICE_AREA.shortDescription}. You arrange and pay for the court; I bring the coaching.

To get this scheduled, reply with:
  • How many players (and rough skill level)
  • A couple of times that work for the group
  • Your preferred court / facility

Reply to this email or request a time at ${COACH_REQUEST_URL} and I'll confirm a slot.

${SIGN_OFF}`;
}

function threePlusOneTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about the 3+1 Play-In Special — this is one of my favorite formats.

Here's how it works: you bring 3 players, I make 4. Two hours of doubles with live coaching baked in — you get real-game reps with a coach in the lineup calling shots, resetting points, and giving feedback in flow. Great for players who want to compete and learn at the same time.

To get this on the calendar, reply with:
  • Names + rough skill levels of your 3 players
  • A couple of 2-hour windows that work
  • Your preferred court / facility

Reply to this email or request a time at ${COACH_REQUEST_URL} and I'll confirm a slot within 24 hours.

Service area: ${SERVICE_AREA.shortDescription}. You arrange and pay for the court; I bring the coaching and play in.

${SIGN_OFF}`;
}

function youthTemplate(name: string, interest: string): string {
  return `Hi ${name},

Thanks for your interest in youth programs! I run the Next Gen Pickleball Academy, designed to get kids ages 6-17 excited about the sport while building real skills.

We focus on fundamentals, sportsmanship, and having fun — whether your child is picking up a paddle for the first time or already competing. I'd be happy to offer a free evaluation session so we can find the right fit.

Learn more about the academy:
→ https://nextgenpbacademy.com

I also offer private lessons for juniors who want focused, one-on-one coaching:
→ https://sammorrispb.com/programs/coaching?utm_source=website&utm_medium=email&utm_campaign=${interestSlug(interest)}

Reply here or visit the links above and we'll get something set up.

${SIGN_OFF}`;
}

function businessTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about a potential partnership — I appreciate your interest.

I'm always open to exploring collaborations that help grow the community. Whether it's event sponsorship, facility partnerships, or something else entirely, I'd love to hear more about what you have in mind.

Would you be open to a quick call this week or next? Just reply with a couple of times that work and we'll find something.

${SIGN_OFF}`;
}

function socialTemplate(name: string): string {
  return `Hi ${name},

Great to hear you're looking for some social play! There are a lot of ways to get involved in the local scene, and I'd love to help you find the right fit.

I'd love to learn a bit about your skill level and what you're looking for — drop-in vibes, regular weekly games, mixed-level social, etc. Reply with a few details and I'll point you to the right next step.

${SIGN_OFF}`;
}

function competitiveTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about competitive play — love the drive to compete!

I can help with skill assessments to dial in your current level, and I stay plugged into local and regional tournament schedules so I can point you in the right direction. If you're looking to sharpen specific parts of your game before competing, coaching sessions are a great complement.

Let me know where you're at skill-wise and what your goals are, and I'll put together some recommendations.

${SIGN_OFF}`;
}

function ambassadorTemplate(name: string): string {
  return `Hi ${name},

Thanks for your interest in the Ambassador program — this is exactly how we grow the sport at the grassroots level.

Ambassadors are player-organizer-coaches who help run events, welcome new players, and build community in their local area. It's a great fit for people who love the sport and want to be more involved in making it accessible to others.

I'd love to tell you more about what the role looks like and what the next steps are. Want to set up a quick chat?

${SIGN_OFF}`;
}

function eventTemplate(name: string, eventType?: string): string {
  const opening = eventType
    ? `Thanks for reaching out about a ${eventType.toLowerCase()} pickleball event — these are some of my favorite gigs to run.`
    : `Thanks for reaching out about an event — these are some of my favorite gigs to run.`;
  return `Hi ${name},

${opening}

Whether it's 8 first-timers or 40 repeat players, I'll tailor the format — quick fundamentals, dink ladders, mini-tournaments, or a coached round-robin — to match the vibe and the experience level. I bring paddles, balls, and portable nets if your venue doesn't have courts set up.

Service area: ${SERVICE_AREA.shortDescription}. You arrange and pay for the court (or I'll help find one); I bring the coaching, the format, and the energy.

To put together a quick quote, reply with:
• Approximate group size + skill mix (mostly beginners? mixed levels?)
• Date + time window you have in mind
• Venue / location (or "need help finding a court")
• What "good" looks like for the day (skill-building? laughs? competitive?)

I'll come back within a day with a recommended format and pricing.

${SIGN_OFF}`;
}

function evaluationTemplate(name: string): string {
  return `Hi ${name},

Thanks for booking a free pickleball evaluation — looking forward to getting you on court.

Here's what to expect:
• 30 minutes on court in Montgomery County, MD (I'll confirm the exact location based on your availability)
• We'll rally, dink, and play a few points so I can see where your game is
• You leave with your rating, the two things to work on next, and the right games to jump into

I'll reach out within 24 hours to lock in a time that works for you. If you want to speed it up, reply with a couple of windows that work this week or next.

${SIGN_OFF}`;
}

const TEMPLATE_MAP: Record<
  string,
  (name: string, interest: string, eventType?: string) => string
> = {
  "Free Evaluation": (name) => evaluationTemplate(name),
  "Private Lesson": (name) => privateLessonTemplate(name),
  "Group Lesson (2+)": (name) => groupLessonTemplate(name),
  "3+1 Play-In Special": (name) => threePlusOneTemplate(name),
  "Event / Clinic": (name, _interest, eventType) => eventTemplate(name, eventType),
  // Legacy alias — older "Coaching" leads still route to private-lesson copy
  "Coaching": (name) => privateLessonTemplate(name),
  "Youth Programs": (name, interest) => youthTemplate(name, interest),
  "Business Partnerships": (name) => businessTemplate(name),
  "Social/Recreational Play": (name) => socialTemplate(name),
  "Competitive Play": (name) => competitiveTemplate(name),
  "Ambassador (Player-Organizer-Coach)": (name) => ambassadorTemplate(name),
};

/**
 * Generate the email body for a given lead interest. The third arg is
 * accepted for backward compatibility with existing callers; it is ignored
 * since the membership-lookup branch was removed on 2026-05-02. The fourth
 * arg (eventType) is used by the Event / Clinic template.
 */
export function generateEmailDraft(
  interest: string,
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isLndMember: boolean = false,
  eventType?: string,
): string {
  const templateFn = TEMPLATE_MAP[interest] ?? ((n: string) => privateLessonTemplate(n));
  return templateFn(name, interest, eventType);
}

// ─────────────────────────────────────────────────────────────────────────────
// Drip sequence (steps 1-3, sent by src/lib/drip.ts via the follow-up cron)
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors coachBookingUrl() from src/lib/urls.ts on the feat/utm-eval-cta
// branch (PR A1). Duplicated here so this branch has no merge dependency on
// A1 — swap to the shared helper once A1 lands on main.
function dripBookingUrl(step: number): string {
  const url = new URL(COACH_BOOKING_URL);
  url.searchParams.set("utm_source", "sammorrispb");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", "eval_cta");
  url.searchParams.set("utm_content", `drip_step${step}`);
  return url.toString();
}

const COACHING_INTERESTS = new Set([
  "Free Evaluation",
  "Private Lesson",
  "Group Lesson (2+)",
  "3+1 Play-In Special",
  "Coaching",
  "Competitive Play",
]);

type DripCta = { kind: "booking"; url: string } | { kind: "youth"; url: string } | { kind: "reply" };

function dripCta(interest: string, step: number): DripCta {
  if (COACHING_INTERESTS.has(interest)) {
    return { kind: "booking", url: dripBookingUrl(step) };
  }
  if (interest === "Youth Programs") {
    return { kind: "youth", url: "https://nextgenpbacademy.com" };
  }
  return { kind: "reply" };
}

/**
 * Drip follow-up emails. Voice per docs/brand-guide.md: friendly + direct,
 * empathetic + action-oriented, short sentences, no hype, no pricing.
 * Every body ends with the mandatory one-click unsubscribe line.
 */
export function generateDripEmail(
  step: number,
  interest: string,
  name: string,
  unsubscribeUrl: string,
): { subject: string; body: string } {
  const cta = dripCta(interest, step);
  const unsubscribeLine = `Don't want these follow-ups? One click and I'll stop: ${unsubscribeUrl}`;

  if (step === 1) {
    const ctaBlock =
      cta.kind === "booking"
        ? `If you're still deciding, the easiest next step is the free 30-minute evaluation. We get on court, I see where your game is, and you leave with a rating and a clear plan.\n\nBook a time here: ${cta.url}\n\nOr just reply — happy to answer anything.`
        : cta.kind === "youth"
          ? `If you're still deciding, take a look at the Next Gen Academy pathway — four levels, free evaluation before placement, and a clear picture of where your child fits:\n→ ${cta.url}\n\nOr just reply — happy to answer anything.`
          : `If anything was unclear — or you just want to talk it through — reply to this email and I'll point you to the right next step.`;
    return {
      subject: `Quick check-in from Coach Sam`,
      body: `Hi ${name},

Just checking in — did the info I sent a couple of days ago answer your questions?

${ctaBlock}

${SIGN_OFF}

${unsubscribeLine}`,
    };
  }

  if (step === 2) {
    const ctaBlock =
      cta.kind === "booking"
        ? `That's exactly what the free evaluation finds. 30 minutes on court, a DUPR-aligned rating, and the two things to work on next. Players from brand-new to 5.0 have used it to stop guessing and start improving.\n\nGrab a slot here: ${cta.url}`
        : cta.kind === "youth"
          ? `That's exactly why the Next Gen Academy starts every player with a free evaluation — so your child works on the right two things from day one, at the right level:\n→ ${cta.url}`
          : `If you want help figuring out your two, reply to this email — I'll get you pointed at the right next step.`;
    return {
      subject: `The two things holding most players back`,
      body: `Hi ${name},

Here's what I see over and over in evaluations: you're probably two specific habits away from your next level. Not ten — two. Usually it's serve consistency and what happens at the kitchen line.

${ctaBlock}

${SIGN_OFF}

${unsubscribeLine}`,
    };
  }

  // Step 3 — warm last touch; the door stays open.
  const ctaBlock =
    cta.kind === "booking"
      ? `Whenever you're ready to work on your game, the free evaluation will be here, and so will I. No pressure, no expiration.\n\nBook anytime: ${cta.url}`
      : cta.kind === "youth"
        ? `Whenever the timing works for your family, the Next Gen Academy door is open — and the free evaluation will be here:\n→ ${cta.url}`
        : `Whenever the timing is right, just reply to this email — I'll pick it up from there.`;
  return {
    subject: `Door's open whenever you're ready`,
    body: `Hi ${name},

Last note from me — I know timing isn't always right, and that's completely fine.

${ctaBlock}

Until then — see you on the courts.

${SIGN_OFF}

${unsubscribeLine}`,
  };
}
