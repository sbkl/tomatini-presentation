import {
  dubaiFohTrainingModules,
  primaryMobileModuleId,
  type FohTrainingModule,
} from "@/lib/mobile-training-modules-data";

export type MediaAsset = {
  id: string;
  title: string;
  note: string;
  kind: "video" | "guide" | "script";
  youtubeUrl?: string;
};

export type FlashcardItem = {
  id: string;
  question: string;
  answer: string;
};

export type FlashcardSection = {
  id: string;
  title: string;
  cards: readonly FlashcardItem[];
};

export type AssessmentChoice = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type AssessmentQuestion = {
  id: string;
  question: string;
  choices: readonly AssessmentChoice[];
  explanation: string;
  quote: string;
};

export type AssessmentReviewItem = {
  questionId: string;
  question: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  quote: string;
};

export type TrainingModuleDetail = {
  module: FohTrainingModule;
  restaurantLabel: string;
  profileLabel: string;
  statusLabel: "Pending" | "In Progress" | "Completed";
  summary: string;
  objectives: readonly string[];
  relatedModules: readonly FohTrainingModule[];
  medias: readonly MediaAsset[];
  flashcardSections: readonly FlashcardSection[];
  assessmentQuestions: readonly AssessmentQuestion[];
};

const primaryModule = dubaiFohTrainingModules.find(
  (item) => item.id === primaryMobileModuleId,
);

if (!primaryModule) {
  throw new Error("Primary mobile training module seed is missing.");
}

const relatedModules = dubaiFohTrainingModules.filter(
  (item) => item.id !== primaryModule.id,
);

export const clientelingTrainingModuleDetail: TrainingModuleDetail = {
  module: primaryModule,
  restaurantLabel: "Dubai",
  profileLabel: "FOH",
  statusLabel: "In Progress",
  summary:
    "Sharpen clienteling instincts by timing cross-sell and up-sell prompts naturally around guest intent, service rhythm, and table energy.",
  objectives: [
    "Recognize high-probability recommendation moments without interrupting flow.",
    "Use premium upgrade language that stays confident, brief, and guest-first.",
    "Recover gracefully after a declined suggestion while protecting rapport.",
  ],
  relatedModules,
  medias: [
    {
      id: "clienteling-roleplay-video",
      title: "Shift Floor Role-Play",
      note: "Cross-sell timing at table turn and first check-back.",
      kind: "video",
      youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    },
    {
      id: "upsell-language-guide",
      title: "Upgrade Language Guide",
      note: "Short scripts for premium spirit and dessert pairings.",
      kind: "guide",
    },
    {
      id: "objection-recovery-script",
      title: "Objection Recovery Script",
      note: "Fallback phrasing after a polite no.",
      kind: "script",
    },
  ],
  flashcardSections: [
    {
      id: "signals-and-timing",
      title: "Signals and Timing",
      cards: [
        {
          id: "signal-1",
          question:
            "A guest asks for recommendations and lingers on the cocktail page. What should you prioritize first?",
          answer:
            "Lead with one pairing suggestion tied to their profile before adding a premium upgrade.",
        },
        {
          id: "signal-2",
          question:
            "When is the best moment to suggest a side add-on during main course ordering?",
          answer:
            "Immediately after confirming mains, while the decision window is still open.",
        },
        {
          id: "signal-3",
          question:
            "A table declines a premium bottle. What is the strongest recovery move?",
          answer:
            "Offer a by-the-glass alternative that keeps choice open and pressure low.",
        },
        {
          id: "signal-4",
          question:
            "How should you frame a dessert up-sell after a long business lunch?",
          answer:
            "Keep it concise and functional, for example: one light dessert to share before coffee.",
        },
      ],
    },
    {
      id: "phrasing",
      title: "Phrasing",
      cards: [
        {
          id: "phrase-1",
          question:
            "Which opener sounds most guest-first for a premium upgrade?",
          answer:
            "\"Based on your choice, one elevated option that pairs very well is...\"",
        },
        {
          id: "phrase-2",
          question: "How do you avoid sounding pushy after a decline?",
          answer: "Acknowledge quickly, then pivot to value and comfort.",
        },
        {
          id: "phrase-3",
          question:
            "What closes an add-on recommendation with low friction?",
          answer:
            "\"Would you like me to add that now, or keep it as your next option?\"",
        },
      ],
    },
  ],
  assessmentQuestions: [
    {
      id: "assess-1",
      question:
        "Which opening line is best for a premium wine up-sell after confirming mains?",
      choices: [
        {
          id: "assess-1-a",
          text: "Would you like the most expensive bottle we have?",
          isCorrect: false,
        },
        {
          id: "assess-1-b",
          text: "One elevated pairing that works especially well here is...",
          isCorrect: true,
        },
        {
          id: "assess-1-c",
          text: "You should upgrade this order.",
          isCorrect: false,
        },
      ],
      explanation:
        "The best line is specific, confident, and recommendation-led without pressure.",
      quote:
        "Recommend with intent, not urgency. Guests respond to relevance.",
    },
    {
      id: "assess-2",
      question:
        "A guest declines your add-on. What is the strongest next response?",
      choices: [
        {
          id: "assess-2-a",
          text: "Repeat the same recommendation with stronger language.",
          isCorrect: false,
        },
        {
          id: "assess-2-b",
          text: "Acknowledge and immediately move to a lighter alternative.",
          isCorrect: true,
        },
        {
          id: "assess-2-c",
          text: "Stop recommending anything else for the table.",
          isCorrect: false,
        },
      ],
      explanation:
        "Recovery should maintain trust while preserving optionality for the next step.",
      quote:
        "A graceful pivot keeps rapport intact and protects future recommendation moments.",
    },
    {
      id: "assess-3",
      question:
        "When is the best time to cross-sell a side with mains in a business-lunch context?",
      choices: [
        {
          id: "assess-3-a",
          text: "After mains are served.",
          isCorrect: false,
        },
        {
          id: "assess-3-b",
          text: "Right after mains are confirmed.",
          isCorrect: true,
        },
        {
          id: "assess-3-c",
          text: "At dessert stage.",
          isCorrect: false,
        },
      ],
      explanation:
        "Cross-sell timing is most effective while decisions are still being finalized.",
      quote:
        "Offer additions while the guest is still in selection mode.",
    },
    {
      id: "assess-4",
      question:
        "Which phrasing best fits a dessert up-sell for guests short on time?",
      choices: [
        {
          id: "assess-4-a",
          text: "You should absolutely have dessert.",
          isCorrect: false,
        },
        {
          id: "assess-4-b",
          text: "A light dessert to share before coffee works very well if you like.",
          isCorrect: true,
        },
        {
          id: "assess-4-c",
          text: "Let's add two desserts now.",
          isCorrect: false,
        },
      ],
      explanation:
        "Time-aware language lowers friction and keeps the suggestion aligned with context.",
      quote:
        "Brevity plus relevance is stronger than enthusiasm alone.",
    },
    {
      id: "assess-5",
      question: "What defines a guest-first up-sell style?",
      choices: [
        {
          id: "assess-5-a",
          text: "Feature-driven, always premium, always urgent.",
          isCorrect: false,
        },
        {
          id: "assess-5-b",
          text: "Context-led, optional, and tied to the guest's choice.",
          isCorrect: true,
        },
        {
          id: "assess-5-c",
          text: "Price-first before relevance.",
          isCorrect: false,
        },
      ],
      explanation:
        "Guest-first recommendations prioritize fit and tone over pressure and price.",
      quote:
        "Relevance creates acceptance. Pressure creates resistance.",
    },
  ],
};
