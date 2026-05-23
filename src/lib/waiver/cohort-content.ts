/**
 * Waiver + consent copy for Coach Sam's 4-Week Training Cohorts.
 *
 * Storage: rows land in community-os `public.waivers` (Supabase project
 * tqqhbccomjhfnylafwnk) — same table P3 uses. The schema captures booleans
 * for liability + media consent; the actual legal text shown to the signer
 * lives here in version control. Git log of this file is the audit trail
 * for what wording was in effect on any given date.
 *
 * NOT LEGAL ADVICE. This text is a starting draft. Have a Maryland attorney
 * review before relying on it in a dispute — especially the minor-signing
 * flow (MD courts scrutinize parental waivers for minors heavily) and the
 * media-release scope for youth.
 */

export const CURRENT_SEASON = "2026";

export const PROGRAM_NAME = "Coach Sam 4-Week Training Cohort";
export const BRAND_NAME = "Coach Sam Pickleball";
export const SUPPORT_EMAIL = "sam.morris2131@gmail.com";

export const LIABILITY_HEADING = "Release of liability + assumption of risk";

export const LIABILITY_BODY = [
  "Pickleball involves physical activity on a hard court with fast-moving balls, paddles, and other players. Risks include but are not limited to: sprains, fractures, falls, concussions, eye injuries, heat illness, cardiac events, contact with other players or fixed objects, and exposure to weather and outdoor conditions.",
  "I voluntarily assume all risks of participating in Coach Sam 4-Week Training Cohorts — including practice sessions, drills, scrimmages, end-of-cohort tournament play, and any related on-court or off-court activity organized under Coach Sam Pickleball or surfaced through Link & Dink.",
  "On behalf of myself (or the minor I am signing for), my heirs, my next of kin, and my personal representatives, I release and hold harmless Samuel Morris d/b/a Coach Sam Pickleball, Link & Dink, and any volunteers, sponsors, and venue hosts from any claim, demand, lawsuit, or cause of action arising out of participation, whether caused by negligence or otherwise, to the fullest extent permitted by Maryland law.",
  "I confirm the participant is physically able to take part, and I will tell Coach Sam immediately if any medical condition could affect safety during the cohort.",
];

export const MEDIA_HEADING = "Audio, photo, video, and likeness release";

export const MEDIA_BODY = [
  "Coach Sam captures audio, photo, AND video during every cohort session. The primary uses are: (1) instructional video clips on Instagram, TikTok, YouTube, and Facebook for Coach Sam Pickleball, Next Gen Pickleball Academy, and Link & Dink, (2) training material reviewed by Coach Up assistant coaches, (3) drill and technique breakdowns used in newsletters and on websites, (4) press, partner, and sponsor coverage.",
  "I grant Samuel Morris d/b/a Coach Sam Pickleball an irrevocable, royalty-free, worldwide right to use the participant's name, image, likeness, voice, and any audio, photos, or video captured during the cohort — for any lawful purpose, in any medium now known or later developed.",
  "I waive any right to inspect or approve the finished use, and I understand there will be no compensation. I release Coach Sam Pickleball from any claim related to the use of the participant's image or likeness, including claims of invasion of privacy, defamation, or right of publicity.",
  "If signing for a minor: I confirm I am the parent or legal guardian, and I grant this release on behalf of the minor. Recordings and images of minors will NOT be sold to third parties and will NOT be publicly tagged or captioned with the minor's first or last name on social media. The participant's general likeness, voice, and game footage may still appear in clips, photos, and instructional content.",
];

export const REFUND_HEADING = "Refund + cancellation policy";

export const REFUND_BODY = [
  "Full refund available any time before the week 1 start date.",
  "After week 1 begins, no refunds will be issued. Missed sessions cannot be made up or credited to a future cohort.",
  "If Coach Sam cancels a session, a make-up session will be offered at a mutually agreed time within the cohort window. If a make-up is not possible, the missed session will be prorated and refunded.",
  "The $160 cohort price includes one tournament entry on or shortly after week 4. If the originally targeted tournament is cancelled (rainout, organizer cancellation, etc.), Coach Sam will select a substitute local tournament within 30 days of the cohort end date. No refund is issued if a substitute is offered.",
];

export const COHORT_CONTEXT = "sammorrispb-cohort-2026";
