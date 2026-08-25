/**
 * CANONICAL class definitions for the clinics Coach Sam leads at The Pickl Park.
 *
 * This file is the single source of truth. The website reads it directly;
 * `classAboutText()` renders the same content as plain text for surfaces that
 * can't import it — the venue's Podplay "About" field, calendar event
 * descriptions, flyers, newsletter sections. Change the copy HERE, never at a
 * downstream surface, or the descriptions drift apart again.
 *
 * SOURCING RULES — this copy describes a paying customer's hour, so:
 *   - Terminology comes from the NGA Shared Vocabulary (sourced to RacketPro
 *     L1): dink, kitchen/NVZ, reset, third shot drop. Don't paraphrase a
 *     definition into something the vocabulary doesn't say.
 *   - Anything describing what Sam actually does in the hour comes from Sam.
 *     Entries still awaiting his confirmation are marked NEEDS SAM below.
 *   - Never restore DUPR numbers to `level` — dropped 2026-08-25 because an
 *     unrated rec player can't place themselves against "3.0", and those are
 *     exactly the players the beginner assessment is for.
 */

export type PicklParkClass = {
  /** Key into PICKL_PARK_SESSIONS. */
  id: string;
  /** Display title on Sam's site. */
  title: string;
  /** EXACT title the venue uses — the string to match when pulling sessions. */
  venueTitle: string;
  /** Plain-language level. No rating numbers; see sourcing rules. */
  level: string;
  /** Recurring pattern. Omit when there is no proven cadence. */
  cadence?: string;
  /** The self-selection cue, written as the reader's own frustration. */
  forYouIf: string;
  /** What the hour covers. */
  workOn: string;
  /** What the player walks away holding. */
  outcome: string;
};

export const PICKL_PARK_CLASSES: PicklParkClass[] = [
  {
    id: "101",
    title: "101 — Intro to Pickleball",
    venueTitle: "101 Intro To Pickleball",
    level: "New to the sport",
    cadence: "Mondays, 10:00–11:00am",
    forYouIf:
      "You've never held a paddle — or you've played twice at a friend's place and want to actually know what you're doing.",
    workOn:
      "Grip and ready position, the serve and the return, and the two rules that trip up every new player: the kitchen, and the double bounce.",
    outcome: "Real points played, not drills in a line.",
  },
  {
    id: "101a",
    title: "101A — Repetition & Foundations",
    venueTitle: "101A Clinic Repetition & Foundations",
    level: "New · after 101",
    cadence: "Runs periodically, midday",
    // NEEDS SAM: is 101 a hard prerequisite, or can someone walk in cold?
    // Current copy gates it on having done 101.
    forYouIf:
      "You've done 101, and the mechanics fall apart the moment someone hits back.",
    workOn:
      "High-volume reps on the shots you just learned. The same swing, over and over, until it holds up against a live ball.",
    outcome: "Mechanics that survive contact.",
  },
  {
    id: "104",
    title: "104 — Third Shot Drops",
    venueTitle: "104 Clinic Third Shot Drops",
    level: "Rallying comfortably",
    cadence: "Runs periodically, midday",
    forYouIf:
      "You're stuck at the baseline because every third shot comes back at your feet.",
    // "Lift with the legs, not the wrist" is the NGA Shared Vocabulary
    // coaching cue for Third Shot Drop (source: RacketPro L1).
    workOn:
      "Contact point, arc, and target on the shot that gets you off the baseline — lift with the legs, not the wrist — plus what to do when the drop comes back high.",
    outcome: "A way off the baseline.",
  },
  {
    id: "201",
    title: "201 — Net Play & Dinking Under Pressure",
    venueTitle: "201 Net Play & Dinking Under Pressure",
    level: "Regular player",
    cadence: "Mondays, 11:00am–12:00pm",
    forYouIf:
      "You can rally fine, but the point falls apart once everybody gets to the net.",
    workOn:
      "Dink patterns, resetting a ball that's coming at you fast, when to speed it up, and how to hold your position when the pace climbs.",
    outcome: "A plan for the kitchen line instead of a reaction.",
  },
  {
    id: "204",
    title: "204 — Defense to Offense: Mid-Court Play",
    venueTitle: "204 Defense to Offense - Mid-Court Play",
    level: "Regular player",
    // No cadence: kept on the page at Sam's direction (2026-08-25) with dates
    // unknown. Falls back to the venue listing until the next one is scheduled.
    // NEEDS SAM: content below is built from the class title plus the sourced
    // definition of a reset, not from Sam's actual session plan.
    forYouIf:
      "You're solid at the baseline and solid at the net, and the space in between is where points get away.",
    workOn:
      "The reset — the soft ball from mid-court that drops into their kitchen and buys you time to get set — plus reading which balls to take out of the air, and turning a scramble back into your point.",
    outcome: "Somewhere to go when you get caught in the middle.",
  },
  {
    id: "skills-beginner",
    title: "Skills Assessment — Beginner/Intermediate",
    venueTitle: "Skills Assessment Beginner/Intermediate",
    level: "New to solid rec",
    cadence: "Mondays 12:00–1:00pm · Tuesdays 10:00–11:00am",
    forYouIf:
      "You've never had your game measured against anything but the scoreboard — rated or not.",
    workOn:
      "A structured hour across serve, return, dinks, drops, and movement, scored the same way every time — so it's a baseline you can come back to and beat.",
    // Deliverable confirmed by Sam 2026-08-25: written report AND a rating.
    // The rating's SCALE is deliberately unnamed — see NEEDS SAM in the header
    // notes. Do not write "DUPR" here without confirming it.
    outcome: "A written report, a rating, and the two things to work on next.",
  },
  {
    id: "skills-advanced",
    title: "Skills Assessment — Intermediate/Advanced",
    venueTitle: "Skills Assessment Intermediate/Advanced",
    level: "Competitive rec & up",
    cadence: "Mondays 1:00–2:00pm · Tuesdays 11:00am–12:00pm",
    forYouIf:
      "You've plateaued, and the reason isn't obvious from inside the match.",
    workOn:
      "Same format, higher ceiling: pressure-tested reads, what to do in the mid-court, and shot selection once you're tired.",
    outcome: "A written report, a rating, and a clear read on what's capping you.",
  },
];

/** Lookup by id. */
export function picklParkClass(id: string): PicklParkClass | undefined {
  return PICKL_PARK_CLASSES.find((c) => c.id === id);
}

/**
 * The canonical description as plain text, for surfaces that can't import
 * this module — the venue's Podplay "About" field, a calendar event
 * description, a flyer, a newsletter block. Paste, don't rewrite.
 */
export function classAboutText(id: string): string {
  const k = picklParkClass(id);
  if (!k) return "";
  return [
    k.title.toUpperCase(),
    `Level: ${k.level.toLowerCase()}.`,
    "",
    `For you if: ${k.forYouIf}`,
    "",
    `What you'll work on: ${k.workOn}`,
    "",
    `You leave with: ${k.outcome}`,
    "",
    "Loaner paddles available. Bring court shoes and water.",
    "— Coach Sam",
  ].join("\n");
}
