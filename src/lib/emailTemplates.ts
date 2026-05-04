import { CONTACT, SERVICE_AREA } from "./constants";
import {
  SINGLE_LESSON_LINK,
  FOUR_PACK_LINK,
  THREE_PLUS_ONE_LINK,
  BOOKING_URL,
  PRICING,
} from "./coaching";

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

Ready to book?

→ Single Lesson ($${PRICING.singleHourly}/hour): ${SINGLE_LESSON_LINK}
→ 4-Hour Package ($${PRICING.fourPackTotal} — best value, $${PRICING.fourPackHourly}/hour): ${FOUR_PACK_LINK}

Already purchased? Pick your time:
→ Schedule Your Lesson: ${BOOKING_URL}

Or reply with a couple times + your preferred court and we'll lock it in.

${SIGN_OFF}`;
}

function groupLessonTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about a group lesson — small-group coaching is one of the most efficient ways to level up because you get reps with real partners and live feedback at the same time.

Rate: $${PRICING.groupPerPersonHourly}/person/hour, 2 or more players. Bring a friend, a partner, or a small crew — I'll build the session around the group's level and goals.

Service area: ${SERVICE_AREA.shortDescription}. You arrange and pay for the court; I bring the coaching.

To get this scheduled, reply with:
  • How many players (and rough skill level)
  • A couple of times that work for the group
  • Your preferred court / facility

I'll confirm the time and send a Stripe invoice once we've locked it in.

${SIGN_OFF}`;
}

function threePlusOneTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about the 3+1 Play-In Special — this is one of my favorite formats.

Here's how it works: you bring 3 players, I make 4. Two hours of doubles with live coaching baked in — you get real-game reps with a coach in the lineup calling shots, resetting points, and giving feedback in flow. Great for players who want to compete and learn at the same time.

Rate: $${PRICING.threePlusOneTotal} flat for the ${PRICING.threePlusOneHours}-hour session (works out to ~$${Math.round(PRICING.threePlusOneTotal / PRICING.threePlusOneStudents / PRICING.threePlusOneHours)}/person/hour).

→ Pay & lock it in: ${THREE_PLUS_ONE_LINK}

Once you've paid, just reply with:
  • Names + rough skill levels of your 3 players
  • A couple of 2-hour windows that work
  • Your preferred court / facility

I'll confirm the time within 24 hours.

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

const TEMPLATE_MAP: Record<string, (name: string, interest: string) => string> = {
  "Free Evaluation": (name) => evaluationTemplate(name),
  "Private Lesson": (name) => privateLessonTemplate(name),
  "Group Lesson (2+)": (name) => groupLessonTemplate(name),
  "3+1 Play-In Special": (name) => threePlusOneTemplate(name),
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
 * since the membership-lookup branch was removed on 2026-05-02.
 */
export function generateEmailDraft(
  interest: string,
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isLndMember: boolean = false,
): string {
  const templateFn = TEMPLATE_MAP[interest] ?? ((n: string) => privateLessonTemplate(n));
  return templateFn(name, interest);
}
