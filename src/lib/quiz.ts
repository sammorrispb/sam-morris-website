export interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; points: number }[];
}

export interface QuizResult {
  level: string;
  dupr: string;
  description: string;
  programs: { title: string; description: string; href: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "experience",
    question: "How long have you been playing pickleball?",
    options: [
      { label: "I haven't started yet", points: 0 },
      { label: "Less than 6 months", points: 1 },
      { label: "6 months to 2 years", points: 2 },
      { label: "More than 2 years", points: 3 },
    ],
  },
  {
    id: "frequency",
    question: "How often do you play?",
    options: [
      { label: "I don't play yet", points: 0 },
      { label: "A few times a month", points: 1 },
      { label: "2-3 times per week", points: 2 },
      { label: "4+ times per week", points: 3 },
    ],
  },
  {
    id: "serve",
    question: "How would you describe your serve?",
    options: [
      { label: "I'm still learning the rules of serving", points: 0 },
      { label: "I can get it in most of the time", points: 1 },
      { label: "I can place it with some consistency", points: 2 },
      { label: "I vary spin, speed, and placement intentionally", points: 3 },
    ],
  },
  {
    id: "dink",
    question: "What's your comfort level at the kitchen line?",
    options: [
      { label: "What's the kitchen line?", points: 0 },
      { label: "I can rally but I pop up a lot of balls", points: 1 },
      { label: "I can sustain dink rallies and mix in resets", points: 2 },
      { label: "I use the kitchen to set up attacks and control pace", points: 3 },
    ],
  },
  {
    id: "strategy",
    question: "When you're playing doubles, do you and your partner have a strategy?",
    options: [
      { label: "We just try to hit it back", points: 0 },
      { label: "We try to get to the net but don't always coordinate", points: 1 },
      { label: "We stack, communicate, and target weaknesses", points: 2 },
      { label: "We run specific plays and adjust strategy mid-game", points: 3 },
    ],
  },
  {
    id: "goals",
    question: "What's your main goal with pickleball right now?",
    options: [
      { label: "Just want to have fun and meet people", points: 0 },
      { label: "Get good enough to play confidently in open play", points: 1 },
      { label: "Improve my rating and compete in leagues", points: 2 },
      { label: "Train seriously for tournaments and high-level play", points: 3 },
    ],
  },
];

export const QUIZ_RESULTS: Record<string, QuizResult> = {
  beginner: {
    level: "Beginner",
    dupr: "Under 2.5",
    description:
      "You're just getting started — and that's exciting! The best way to build a strong foundation is with structured coaching and beginner-friendly play sessions. We'll get you comfortable on the court fast.",
    programs: [
      {
        title: "Open Play (Beginner)",
        description: "Drop-in sessions with skill-based courts — no partner needed.",
        href: "/programs/open-play",
      },
      {
        title: "Coached Open Play",
        description: "Learn while you play with a coach giving real-time tips.",
        href: "/programs/coached-open-play",
      },
      {
        title: "Book a Free Evaluation",
        description: "30-minute assessment to map out your personalized path.",
        href: "/contact",
      },
    ],
  },
  "advanced-beginner": {
    level: "Advanced Beginner",
    dupr: "2.5 – 3.0",
    description:
      "You know the basics and you're hooked. Now it's time to build consistency and start thinking strategically. A mix of coached play and targeted lessons will accelerate your progress.",
    programs: [
      {
        title: "Coached Open Play",
        description: "Real-time feedback while playing games at your level.",
        href: "/programs/coached-open-play",
      },
      {
        title: "Private Lessons",
        description: "1-on-1 coaching with video analysis to fix specific habits.",
        href: "/programs/coaching",
      },
      {
        title: "Leagues (2.5-3.0 bracket)",
        description: "Weekly competitive play with DUPR tracking.",
        href: "/programs/leagues",
      },
    ],
  },
  intermediate: {
    level: "Intermediate",
    dupr: "3.0 – 3.5",
    description:
      "You've got solid fundamentals and a competitive edge. Focused coaching on shot selection, third-shot drops, and match strategy will push you to the next level.",
    programs: [
      {
        title: "Private Lessons (4-Pack)",
        description: "Build on skills week-to-week with our best-value package ($100/session).",
        href: "/programs/coaching",
      },
      {
        title: "Leagues (3.0-3.6 bracket)",
        description: "Competitive league play with DUPR-rated matches.",
        href: "/programs/leagues",
      },
      {
        title: "Clinics & Drills",
        description: "Group drill sessions focused on advanced techniques.",
        href: "/programs/coaching",
      },
    ],
  },
  advanced: {
    level: "Advanced",
    dupr: "3.5+",
    description:
      "You're a serious player who understands the game at a high level. Fine-tuning your mental game, developing advanced shot patterns, and competing in tournaments is your next frontier.",
    programs: [
      {
        title: "Private Coaching",
        description: "Advanced video analysis and match strategy with Coach Sam.",
        href: "/programs/coaching",
      },
      {
        title: "Leagues (3.5+ bracket)",
        description: "High-level league competition with DUPR tracking.",
        href: "/programs/leagues",
      },
      {
        title: "Tournament Series",
        description: "Competitive tournament events in the DMV area.",
        href: "https://tournamentwebsite.vercel.app/",
      },
    ],
  },
};

export function calculateResult(answers: number[]): string {
  const total = answers.reduce((sum, a) => sum + a, 0);
  const max = QUIZ_QUESTIONS.length * 3;
  const pct = total / max;

  if (pct <= 0.25) return "beginner";
  if (pct <= 0.5) return "advanced-beginner";
  if (pct <= 0.75) return "intermediate";
  return "advanced";
}
