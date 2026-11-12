import { LESSON_REQUEST_HOST } from "@/lib/constants";
import { PRICING } from "@/lib/coaching";

/**
 * FAQ entries behind the FAQPage structured data on /programs/coaching.
 *
 * Kept out of the page file so the default test pass can assert on the exact
 * text search engines receive (a page.tsx may only export what Next allows).
 * The booking answer names the request host through LESSON_REQUEST_HOST: the
 * inline version had the host typed out and went stale when the request page
 * moved.
 */
export const COACHING_FAQS: { question: string; answer: string }[] = [
  {
    question: "How do I book a private pickleball lesson?",
    answer: `Request a lesson at ${LESSON_REQUEST_HOST} and Sam will confirm a time that works. Lessons are $${PRICING.lessonPerHourUsd}/hour for privates or groups up to 4 players, plus court fee.`,
  },
  {
    question: "Do you offer group pickleball lessons?",
    answer:
      "Yes — group lessons are available for 2 or more players. Request a time and Sam will build the session around your group's level and goals.",
  },
  {
    question: "What is the 3+1 Play-In Special?",
    answer:
      "The 3+1 Play-In Special is a 2-hour session where you bring 3 players and Sam plays as the 4th — doubles reps with a coach in the lineup.",
  },
  {
    question: "Where do lessons happen?",
    answer:
      "Sam travels to your court across Montgomery County, Washington DC, and nearby parts of Prince George's, Howard, and northern Virginia. Private lessons are also available at The Pickl Park in Frederick, MD.",
  },
];
