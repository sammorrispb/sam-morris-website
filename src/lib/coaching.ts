// Stripe Payment Links for private lessons
export const SINGLE_LESSON_LINK = "https://buy.stripe.com/aFabJ3ehjaUhfI7g6s3Je01";
export const FOUR_PACK_LINK = "https://buy.stripe.com/00w00l8WZe6t7bBdYk3Je08";

// Group lessons stay invoice-based (price varies with headcount) — players inquire,
// Sam confirms time + sends a Stripe invoice. Play-In is fixed-price → real Payment Link.
export const GROUP_LESSON_LINK = "/contact?interest=Group+Lesson+%282%2B%29";
export const THREE_PLUS_ONE_LINK = "https://book.stripe.com/eVqeVf6OR0fDcvV9I43Je0a";

// Cohort Series — 4-week committed training, 4 players, $160/cohort all-in:
// $120 for training ($30/session × 4) + $40 tournament entry bundled. Sam
// creates the $160 one-time Payment Link in Stripe dashboard.
export const COHORT_LINK = process.env.NEXT_PUBLIC_COHORT_STRIPE_LINK ?? "";

// Pricing — single source of truth for the coaching page + emails + JSON-LD
export const PRICING = {
  singleHourly: 130,
  fourPackTotal: 400,
  fourPackHourly: 100,
  groupPerPersonHourly: 50, // 2+ players
  threePlusOneTotal: 150, // 2-hour play-in session, 3 students + Sam
  threePlusOneHours: 2,
  threePlusOneStudents: 3,
  cohortTotal: 160, // all-in: $120 training + $40 tournament entry bundled
  cohortTrainingPortion: 120,
  cohortTournamentPortion: 40,
  cohortPerSession: 40, // $160 / 4 sessions
  cohortWeeks: 4,
  cohortPlayers: 4,
} as const;

// Google Calendar Appointment Schedule for lesson booking
export const BOOKING_URL = "https://calendar.app.google/FsvvwDzNPGUX6VZbA";
