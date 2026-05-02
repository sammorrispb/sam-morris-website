import { CONTACT } from "./constants";
import { SINGLE_LESSON_LINK, FOUR_PACK_LINK, BOOKING_URL } from "./coaching";

export const SIGN_OFF = `Looking forward to connecting!

Sam Morris
${CONTACT.phone}
${CONTACT.email}
sammorrispb.com`;

function coachingTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about coaching — I'd love to help you level up your game.

I offer private and small-group lessons tailored to your current skill level and goals. Whether you're working on your third shot drop, resetting under pressure, or sharpening your serve, we'll build a plan that fits. I also use video analysis so you can see exactly what we're working on and track your progress over time.

Ready to book?

→ Single Lesson ($130/hour): ${SINGLE_LESSON_LINK}
→ 4-Hour Package ($400 — best value): ${FOUR_PACK_LINK}

Already purchased? Pick your time:
→ Schedule Your Lesson: ${BOOKING_URL}

Or just reply with a few times that work and we'll set something up.

${SIGN_OFF}`;
}

function youthTemplate(name: string): string {
  return `Hi ${name},

Thanks for your interest in youth programs! I run the Next Gen Pickleball Academy, designed to get kids ages 6-17 excited about the sport while building real skills.

We focus on fundamentals, sportsmanship, and having fun — whether your child is picking up a paddle for the first time or already competing. I'd be happy to offer a free evaluation session so we can find the right fit.

Learn more about the academy:
→ https://nextgenpbacademy.com

I also offer private lessons for juniors who want focused, one-on-one coaching:
→ https://sammorrispb.com/programs/coaching

Reply here or visit the links above and we'll get something set up.

${SIGN_OFF}`;
}

function businessTemplate(name: string): string {
  return `Hi ${name},

Thanks for reaching out about a potential partnership — I appreciate your interest.

I'm always open to exploring collaborations that help grow the community. Whether it's event sponsorship, youth program partnerships, or something else entirely, I'd love to hear more about what you have in mind.

Would you be open to a quick call this week or next? Just reply with a couple of times that work and we'll find something.

${SIGN_OFF}`;
}

function socialTemplate(name: string): string {
  return `Hi ${name},

Great to hear you're looking for some social play! There are a lot of ways to get involved in the local scene, and I'd love to help you find the right fit.

I organize community play sessions that are open to all skill levels — the vibe is relaxed, friendly, and focused on having a good time on the court. Reply with where you're located and what kind of play you're looking for, and I'll point you in the right direction.

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

Thanks for your interest in growing the sport at the grassroots level.

I'd love to tell you more about how to get more involved as a player-organizer-coach in the local pickleball community. Want to set up a quick chat?

${SIGN_OFF}`;
}

function evaluationTemplate(name: string): string {
  return `Hi ${name},

Thanks for booking a free pickleball evaluation — looking forward to getting you on court.

Here's what to expect:
• 30 minutes on a court in Montgomery County, MD (we'll coordinate the location)
• We'll rally, dink, and play a few points so I can see where your game is
• You leave with your rating, the two things to work on next, and the right games to jump into

I'll reach out within 24 hours to lock in a time that works for you. If you want to speed it up, reply with a couple of windows that work this week or next.

${SIGN_OFF}`;
}

const TEMPLATE_MAP: Record<string, (name: string) => string> = {
  "Free Evaluation": evaluationTemplate,
  "Coaching": coachingTemplate,
  "Youth Programs": youthTemplate,
  "Business Partnerships": businessTemplate,
  "Social/Recreational Play": socialTemplate,
  "Competitive Play": competitiveTemplate,
  "Ambassador (Player-Organizer-Coach)": ambassadorTemplate,
};

export function generateEmailDraft(
  interest: string,
  name: string,
  // Kept in signature for backward compat with existing callers; no longer
  // changes the body since the Hub-only "L&D member" flow was retired
  // 2026-05-02.
  _isLndMember: boolean = false,
): string {
  void _isLndMember;
  const templateFn = TEMPLATE_MAP[interest] ?? coachingTemplate;
  return templateFn(name);
}
