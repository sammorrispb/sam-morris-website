import { hubUrl, surveyUrl, SIGN_OFF } from "./emailTemplates";
import { SINGLE_LESSON_LINK, FOUR_PACK_LINK } from "./coaching";
import { WIDGET_URLS } from "./locations";

interface DripEmail {
  subject: string;
  body: string;
}

// ─── Coaching ───

function coaching1(name: string): DripEmail {
  return {
    subject: `${name}, still thinking about lessons?`,
    body: `Hi ${name},

Just checking in — I know picking the right coaching setup matters.

Whether it's your serve, your resets, or your overall court strategy, a single session is a great way to see if we're a good fit. I tailor every lesson to where you are and where you want to go.

Book a single lesson here:
${SINGLE_LESSON_LINK}

No commitment — just show up and play.

${SIGN_OFF}`,
  };
}

function coaching2(name: string): DripEmail {
  return {
    subject: `A 4-pack saves you $120, ${name}`,
    body: `Hi ${name},

Quick follow-up — a lot of my students see the biggest jumps when they commit to a 4-session block. We build on each lesson: video review, targeted drills, and live play.

The 4-pack is $400 (vs $520 for four singles):
${FOUR_PACK_LINK}

Most common breakthroughs I see in 4 sessions: third shot drop consistency, serve placement, and winning the kitchen line battle.

${SIGN_OFF}`,
  };
}

function coaching3(name: string): DripEmail {
  return {
    subject: `One last thing, ${name}`,
    body: `Hi ${name},

I won't keep filling your inbox — just wanted to mention that community play is a great complement to lessons. You can practice what we work on in a real game setting.

Browse upcoming events and find playing partners:
${hubUrl("Coaching")}

Whenever you're ready for coaching, I'm here. Just reply to this email.

${SIGN_OFF}`,
  };
}

// ─── Youth Programs ───

function youth1(name: string): DripEmail {
  return {
    subject: `Next Gen Academy — here's what we do, ${name}`,
    body: `Hi ${name},

Wanted to share a bit more about how Next Gen Academy works.

We have 4 progressive levels — Red Ball (beginners, ages 5+), Orange Ball (advanced beginners, 7+), Green Ball (strategy, 9+), and Yellow Ball (competition, 12+). Each level builds real skills in a fun, supportive environment.

For kids 10 and under who are new to the sport, we offer a free trial session:
https://www.nextgenpbacademy.com/freetrial

For ages 11+, we recommend a free 30-minute evaluation so we can place them in the right group. Just reply to this email or reach out to nextgenacademypb@gmail.com.

${SIGN_OFF}`,
  };
}

function youth2(name: string): DripEmail {
  return {
    subject: `Parents love this part, ${name}`,
    body: `Hi ${name},

One thing parents tell me over and over: their kids are making real friends at Next Gen Academy. The sport brings them together, and the team environment keeps them coming back.

Beyond the social side, we focus on athletic development — footwork, hand-eye coordination, strategic thinking — skills that transfer to any sport.

Learn more about the academy:
https://www.nextgenpbacademy.com

We also offer private junior lessons for focused 1-on-1 coaching:
https://www.sammorrispb.com/programs/coaching?utm_source=website&utm_medium=email&utm_campaign=youth_programs

${SIGN_OFF}`,
  };
}

function youth3(name: string): DripEmail {
  return {
    subject: `Quick question, ${name}`,
    body: `Hi ${name},

I'd love to help find the right fit for your child — could you share their age and any prior pickleball experience?

That way I can recommend the best group and schedule. Just reply here or email nextgenacademypb@gmail.com.

${SIGN_OFF}`,
  };
}

// ─── Social/Recreational Play ───

function social1(name: string): DripEmail {
  return {
    subject: `Here's what's coming up, ${name}`,
    body: `Hi ${name},

We've got events running every week at Dill Dinkers Rockville and North Bethesda — open play, social mixers, and themed nights.

The easiest way to see what's happening and sign up:
${hubUrl("Social/Recreational Play")}

No commitment, no pressure — just show up and play.

${SIGN_OFF}`,
  };
}

function social2(name: string): DripEmail {
  return {
    subject: `Finding the right group, ${name}`,
    body: `Hi ${name},

Sometimes the hardest part is finding people who play at your pace. We've got a couple of ways to help:

1. Take our quick matching survey and we'll connect you with compatible players:
${surveyUrl("Social/Recreational Play")}

2. Join the WhatsApp group where players post open court times and look for partners:
https://chat.whatsapp.com/HMjGamk0Mtx662DbtGmDwe

Both are free and low-key.

${SIGN_OFF}`,
  };
}

function social3(name: string): DripEmail {
  return {
    subject: `Open play is the easiest way to start, ${name}`,
    body: `Hi ${name},

If you haven't jumped in yet, open play is the simplest way to get on the court. No partner needed, all levels welcome, and you rotate through games.

Browse open play times:
Rockville: ${WIDGET_URLS.rockville.openPlay}
North Bethesda: ${WIDGET_URLS.northBethesda.openPlay}

Hope to see you out there!

${SIGN_OFF}`,
  };
}

// ─── Competitive Play ───

function competitive1(name: string): DripEmail {
  return {
    subject: `Know your rating, ${name}?`,
    body: `Hi ${name},

Rating matters for competitive play — it determines who you're matched with and which events are the right fit.

If you're not sure where you stand, sign up on the Hub and take our quick skill survey:
${hubUrl("Competitive Play")}
${surveyUrl("Competitive Play")}

If you already have a DUPR or self-rating, just reply with it and I can point you to the right events.

${SIGN_OFF}`,
  };
}

function competitive2(name: string): DripEmail {
  return {
    subject: `Competitive events near you, ${name}`,
    body: `Hi ${name},

Here's where to find competitive play and leagues at Dill Dinkers:

Competitive events:
Rockville: ${WIDGET_URLS.rockville.competitive}
North Bethesda: ${WIDGET_URLS.northBethesda.competitive}

Leagues (seasonal, structured):
Rockville: ${WIDGET_URLS.rockville.leagues}
North Bethesda: ${WIDGET_URLS.northBethesda.leagues}

Leagues are a great way to play consistent, rated matches against players at your level.

${SIGN_OFF}`,
  };
}

function competitive3(name: string): DripEmail {
  return {
    subject: `Training + competition = results, ${name}`,
    body: `Hi ${name},

The players who improve fastest combine competitive play with targeted coaching. If you want to sharpen specific parts of your game before your next event, a lesson can make a big difference.

Book a single lesson:
${SINGLE_LESSON_LINK}

And keep browsing events on the Hub:
${hubUrl("Competitive Play")}

Whenever you're ready, I'm here.

${SIGN_OFF}`,
  };
}

// ─── Ambassador ───

function ambassador1(name: string): DripEmail {
  return {
    subject: `What ambassadors actually do, ${name}`,
    body: `Hi ${name},

Wanted to give you a clearer picture of the Ambassador role.

Ambassadors help run community events, welcome new players, and represent the sport in their local area. It's part organizer, part coach, part connector. You don't need to be a top-level player — you need to care about growing the community.

Start by exploring the Hub to see the kind of events and community we're building:
${hubUrl("Ambassador (Player-Organizer-Coach)")}

${SIGN_OFF}`,
  };
}

function ambassador2(name: string): DripEmail {
  return {
    subject: `Meet the community, ${name}`,
    body: `Hi ${name},

Link & Dink is a community of 900+ pickleball players across two Dill Dinkers locations in Montgomery County. We run weekly events, social mixers, competitive leagues, and youth programs.

As an ambassador, you'd help shape what that looks like at the local level.

Learn more:
https://linkanddink.com/?utm_source=sammorrispb&utm_medium=website&utm_campaign=cross_site

See what's happening on the Hub:
${hubUrl("Ambassador (Player-Organizer-Coach)")}

${SIGN_OFF}`,
  };
}

function ambassador3(name: string): DripEmail {
  return {
    subject: `Want to chat about it, ${name}?`,
    body: `Hi ${name},

If the Ambassador role sounds interesting, I'd love to have a quick conversation about next steps. No pressure — just a chance to see if it's a good fit.

Reply here with a couple of times that work and we'll set something up.

${SIGN_OFF}`,
  };
}

// ─── Dispatcher ───

type StepFn = (name: string) => DripEmail;

const DRIP_MAP: Record<string, StepFn[]> = {
  "Coaching": [coaching1, coaching2, coaching3],
  "Youth Programs": [youth1, youth2, youth3],
  "Social/Recreational Play": [social1, social2, social3],
  "Competitive Play": [competitive1, competitive2, competitive3],
  "Ambassador (Player-Organizer-Coach)": [ambassador1, ambassador2, ambassador3],
};

/**
 * Returns the drip email for the given interest and step (1-indexed).
 * Returns null if the interest has no drip (e.g. Business Partnerships)
 * or the step is out of range.
 */
export function getDripEmail(
  interest: string,
  step: number,
  name: string,
): DripEmail | null {
  const steps = DRIP_MAP[interest];
  if (!steps) return null;

  const fn = steps[step - 1];
  if (!fn) return null;

  return fn(name);
}
