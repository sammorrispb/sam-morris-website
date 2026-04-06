export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  program: "coaching" | "youth" | "open-play" | "leagues" | "community";
  rating: number;
  location?: "rockville" | "north-bethesda";
}

export const TESTIMONIALS: Testimonial[] = [
  // 3 coaching testimonials
  {
    id: "coaching-1",
    quote: "Sam breaks down every shot so clearly. After just 4 sessions, my third-shot drop went from a liability to a weapon. Worth every penny.",
    author: "Mike R.",
    role: "Adult student, 3.5 DUPR",
    program: "coaching",
    rating: 5,
    location: "rockville",
  },
  {
    id: "coaching-2",
    quote: "I was stuck at 3.0 for months. Sam's video analysis showed me things I never would have caught on my own. Now I'm consistently winning at 3.5.",
    author: "Jennifer L.",
    role: "Adult student",
    program: "coaching",
    rating: 5,
    location: "north-bethesda",
  },
  {
    id: "coaching-3",
    quote: "The 4-pack package is a game changer. You actually have time to build on skills week to week instead of cramming everything into one session.",
    author: "David K.",
    role: "Adult student, competitive player",
    program: "coaching",
    rating: 5,
  },
  // 3 youth/parent testimonials
  {
    id: "youth-1",
    quote: "My daughter went from barely hitting the ball to winning her age group in just one season of Next Gen. The coaches make it fun while actually teaching real skills.",
    author: "Sarah T.",
    role: "Parent of Red Level student",
    program: "youth",
    rating: 5,
    location: "north-bethesda",
  },
  {
    id: "youth-2",
    quote: "Summer camp was the highlight of our kids' summer. They came home excited every day and begged to sign up for the academy afterward.",
    author: "Carlos M.",
    role: "Parent of two campers",
    program: "youth",
    rating: 5,
  },
  {
    id: "youth-3",
    quote: "As a PE teacher myself, I can see the quality in Sam's youth program. The EASE framework gives kids structure without taking the fun out of it.",
    author: "Angela P.",
    role: "Parent & educator",
    program: "youth",
    rating: 5,
    location: "rockville",
  },
  // 2 open play / community
  {
    id: "community-1",
    quote: "I showed up knowing nothing about pickleball and left with three new friends and a weekly game. The community here is unreal.",
    author: "New player",
    role: "First-time visitor",
    program: "open-play",
    rating: 5,
    location: "rockville",
  },
  {
    id: "community-2",
    quote: "Coached open play is the secret weapon. You get real feedback while actually playing games — it's like having a coach in your pocket.",
    author: "Priya S.",
    role: "Advanced beginner",
    program: "open-play",
    rating: 5,
    location: "north-bethesda",
  },
  // 1 leagues
  {
    id: "leagues-1",
    quote: "League night is the best night of my week. The DUPR brackets mean every match is competitive, and the atmosphere is always supportive.",
    author: "Tom W.",
    role: "League player, 3.3 DUPR",
    program: "leagues",
    rating: 5,
    location: "rockville",
  },
  {
    id: "community-3",
    quote: "Between the WhatsApp group and Link & Dink, I never have trouble finding people to play with. This community is the real deal.",
    author: "Rachel F.",
    role: "Regular player",
    program: "community",
    rating: 5,
  },
];

export function getTestimonialsByProgram(program: Testimonial["program"]): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.program === program);
}

export function getAggregateRating() {
  const total = TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0);
  return {
    ratingValue: (total / TESTIMONIALS.length).toFixed(1),
    reviewCount: TESTIMONIALS.length,
    bestRating: 5,
    worstRating: 1,
  };
}
