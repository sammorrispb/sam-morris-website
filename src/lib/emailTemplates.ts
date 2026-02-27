import { CONTACT } from "./constants";

const LND_INVITE = `I also run a local community called Link & Dink — it's a great way to find games, connect with other players, and stay in the loop on events in the area. I'd love to have you join us: https://www.linkanddink.com`;

const SIGN_OFF = `Looking forward to connecting!

Sam Morris
${CONTACT.phone}
${CONTACT.email}
sammorrispb.com`;

function coachingTemplate(name: string, includeLnd: boolean): string {
  return `Hi ${name},

Thanks for reaching out about coaching — I'd love to help you level up your game.

I offer private and small-group lessons tailored to your current skill level and goals. Whether you're working on your third shot drop, resetting under pressure, or sharpening your serve, we'll build a plan that fits. I also use video analysis so you can see exactly what we're working on and track your progress over time.

If you're interested, just reply with a few times that work for you and we can get something on the calendar.${includeLnd ? `\n\n${LND_INVITE}` : ""}

${SIGN_OFF}`;
}

function youthTemplate(name: string, includeLnd: boolean): string {
  return `Hi ${name},

Thanks for your interest in youth programs! I run the Next Gen Academy, which is designed to get kids ages 6-17 excited about the sport while building real skills.

We focus on fundamentals, sportsmanship, and having fun — whether your child is picking up a paddle for the first time or already competing. I'd be happy to offer a free evaluation session so we can find the right fit.

You can learn more at https://nextgenpbacademy.com, or just reply here and we'll get something set up.${includeLnd ? `\n\n${LND_INVITE}` : ""}

${SIGN_OFF}`;
}

function businessTemplate(name: string, includeLnd: boolean): string {
  return `Hi ${name},

Thanks for reaching out about a potential partnership — I appreciate your interest.

I'm always open to exploring collaborations that help grow the community. Whether it's event sponsorship, facility partnerships, or something else entirely, I'd love to hear more about what you have in mind.

Would you be open to a quick call this week or next? Just reply with a couple of times that work and we'll find something.${includeLnd ? `\n\n${LND_INVITE}` : ""}

${SIGN_OFF}`;
}

function socialTemplate(name: string, includeLnd: boolean): string {
  return `Hi ${name},

Great to hear you're looking for some social play! There are a lot of ways to get involved in the local scene, and I'd love to help you find the right fit.

I organize regular community play sessions that are open to all skill levels — the vibe is relaxed, friendly, and focused on having a good time on the court.${includeLnd ? `\n\n${LND_INVITE} It's the easiest way to find open play sessions, meet other players, and stay connected.` : ""}

${SIGN_OFF}`;
}

function competitiveTemplate(name: string, includeLnd: boolean): string {
  return `Hi ${name},

Thanks for reaching out about competitive play — love the drive to compete!

I can help with skill assessments to dial in your current level, and I stay plugged into local and regional tournament schedules so I can point you in the right direction. If you're looking to sharpen specific parts of your game before competing, coaching sessions are a great complement.

Let me know where you're at skill-wise and what your goals are, and I'll put together some recommendations.${includeLnd ? `\n\n${LND_INVITE} We have a number of competitive players in the community who are always looking for drilling partners and tournament teammates.` : ""}

${SIGN_OFF}`;
}

function ambassadorTemplate(name: string, includeLnd: boolean): string {
  return `Hi ${name},

Thanks for your interest in the Ambassador program — this is exactly how we grow the sport at the grassroots level.

Ambassadors are player-organizer-coaches who help run events, welcome new players, and build community in their local area. It's a great fit for people who love the sport and want to be more involved in making it accessible to others.

I'd love to tell you more about what the role looks like and what the next steps are. Want to set up a quick chat?${includeLnd ? `\n\n${LND_INVITE} Many of our ambassadors are active in the Link & Dink community, and it's a great place to start.` : ""}

${SIGN_OFF}`;
}

const TEMPLATE_MAP: Record<string, (name: string, includeLnd: boolean) => string> = {
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
  isLndMember: boolean
): string {
  const templateFn = TEMPLATE_MAP[interest] ?? coachingTemplate;
  const includeLnd = !isLndMember;
  return templateFn(name, includeLnd);
}
