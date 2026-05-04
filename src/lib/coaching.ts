// Stripe Payment Links for private lessons
export const SINGLE_LESSON_LINK = "https://buy.stripe.com/aFabJ3ehjaUhfI7g6s3Je01";
export const FOUR_PACK_LINK = "https://buy.stripe.com/00w00l8WZe6t7bBdYk3Je08";

// Group + Play-In tiers — invoice-based for now (Sam confirms time + sends Stripe invoice)
// When Stripe Payment Links are minted, swap these constants for the buy.stripe.com URLs.
export const GROUP_LESSON_LINK = "/contact?interest=Group+Lesson+%282%2B%29";
export const THREE_PLUS_ONE_LINK = "/contact?interest=3%2B1+Play-In+Special";

// Pricing — single source of truth for the coaching page + emails + JSON-LD
export const PRICING = {
  singleHourly: 130,
  fourPackTotal: 400,
  fourPackHourly: 100,
  groupPerPersonHourly: 50, // 2+ players
  threePlusOneTotal: 150, // 2-hour play-in session, 3 students + Sam
  threePlusOneHours: 2,
  threePlusOneStudents: 3,
} as const;

// Google Calendar Appointment Schedule for lesson booking
export const BOOKING_URL = "https://calendar.app.google/FsvvwDzNPGUX6VZbA";
