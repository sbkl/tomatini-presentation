export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type ChatHistoryBucket = "today" | "yesterday" | "last-week";

export type ChatThread = {
  id: string;
  title: string;
  updatedAtLabel: string;
  updatedAtBucket: ChatHistoryBucket;
  messages: ChatMessage[];
};

export const mobileChatVoiceAcknowledgement =
  "Voice capture is not enabled yet in this preview. Type your message and I will continue from there.";

export const mobileChatThreadsSeed: ChatThread[] = [
  {
    id: "thread-1",
    title: "Allergens for Salade Nicoise",
    updatedAtLabel: "8m",
    updatedAtBucket: "today",
    messages: [
      {
        id: "thread-1-msg-1",
        role: "user",
        content:
          "Remind me of the allergens for Salade Nicoise before lineup.",
      },
      {
        id: "thread-1-msg-2",
        role: "assistant",
        content:
          "For Salade Nicoise, call out fish, egg, mustard, and anchovy in the dressing. If guest notes shellfish sensitivity, confirm no cross-contact during prep.",
      },
      {
        id: "thread-1-msg-3",
        role: "user",
        content: "Give me a short version I can tell FOH.",
      },
      {
        id: "thread-1-msg-4",
        role: "assistant",
        content:
          "FOH short callout: Salade Nicoise contains fish, egg, and mustard. Confirm allergy notes before firing.",
      },
    ],
  },
  {
    id: "thread-2",
    title: "Burrata allergen reminder",
    updatedAtLabel: "24m",
    updatedAtBucket: "today",
    messages: [
      {
        id: "thread-2-msg-1",
        role: "user",
        content:
          "Quick check, what allergens should I call out for Burrata Provencale?",
      },
      {
        id: "thread-2-msg-2",
        role: "assistant",
        content:
          "Main callouts are milk, pine nuts, and possible mustard traces in vinaigrette prep. Confirm nut sensitivity before sending.",
      },
      {
        id: "thread-2-msg-3",
        role: "user",
        content: "Give me one line for FOH briefing.",
      },
      {
        id: "thread-2-msg-4",
        role: "assistant",
        content:
          "FOH line: Burrata Provencale contains dairy and pine nuts, please reconfirm guest allergy notes before firing.",
      },
    ],
  },
  {
    id: "thread-3",
    title: "Sea bass carpaccio callout",
    updatedAtLabel: "1h",
    updatedAtBucket: "today",
    messages: [
      {
        id: "thread-3-msg-1",
        role: "user",
        content:
          "Guest at table 7 asked about allergens in sea bass carpaccio. Fast summary?",
      },
      {
        id: "thread-3-msg-2",
        role: "assistant",
        content:
          "Call out fish plus mustard in dressing components. Flag cross-contact if dressing station handles anchovy prep.",
      },
      {
        id: "thread-3-msg-3",
        role: "user",
        content: "Can I say no gluten ingredients listed?",
      },
      {
        id: "thread-3-msg-4",
        role: "assistant",
        content:
          "Yes, but add that kitchen cross-contact cannot be fully guaranteed during peak service.",
      },
    ],
  },
  {
    id: "thread-4",
    title: "Tomatini ingredient allergy check",
    updatedAtLabel: "2h",
    updatedAtBucket: "today",
    messages: [
      {
        id: "thread-4-msg-1",
        role: "user",
        content:
          "I need allergen notes for Tomatini salad before pre-service.",
      },
      {
        id: "thread-4-msg-2",
        role: "assistant",
        content:
          "Primary alerts are tomato, dairy if feta add-on is used, and potential sulfites from some vinegar batches.",
      },
      {
        id: "thread-4-msg-3",
        role: "user",
        content: "Can we provide a no-dairy version?",
      },
      {
        id: "thread-4-msg-4",
        role: "assistant",
        content:
          "Yes. Remove feta add-on, use clean utensils, and mark ticket dairy-sensitive for pass verification.",
      },
    ],
  },
  {
    id: "thread-5",
    title: "Dessert board nut warning",
    updatedAtLabel: "Yesterday",
    updatedAtBucket: "yesterday",
    messages: [
      {
        id: "thread-5-msg-1",
        role: "user",
        content:
          "Need a guest-safe warning for pistachio on tonight dessert board.",
      },
      {
        id: "thread-5-msg-2",
        role: "assistant",
        content:
          "State tree nuts clearly and note shared garnish tools. Offer fruit plate alternative prepared on clean station.",
      },
      {
        id: "thread-5-msg-3",
        role: "user",
        content: "Make it shorter for floor briefing.",
      },
      {
        id: "thread-5-msg-4",
        role: "assistant",
        content:
          "Floor brief: Dessert board contains pistachio. Confirm nut allergies before recommending.",
      },
    ],
  },
  {
    id: "thread-6",
    title: "Shellfish cross-contact note",
    updatedAtLabel: "Yesterday",
    updatedAtBucket: "yesterday",
    messages: [
      {
        id: "thread-6-msg-1",
        role: "user",
        content:
          "Table 12 has shellfish allergy. Can they have linguine vongole area alternatives?",
      },
      {
        id: "thread-6-msg-2",
        role: "assistant",
        content:
          "Avoid that station for allergy-sensitive dishes. Route to clean saute pan and separate tongs to prevent shellfish residue.",
      },
      {
        id: "thread-6-msg-3",
        role: "user",
        content: "What wording should FOH use?",
      },
      {
        id: "thread-6-msg-4",
        role: "assistant",
        content:
          "Say we can offer alternatives prepared away from shellfish station, with dedicated utensils and pass confirmation.",
      },
    ],
  },
  {
    id: "thread-7",
    title: "Lactose-sensitive VIP table",
    updatedAtLabel: "Yesterday",
    updatedAtBucket: "yesterday",
    messages: [
      {
        id: "thread-7-msg-1",
        role: "user",
        content:
          "VIP table requested lactose-sensitive options. What should I brief quickly?",
      },
      {
        id: "thread-7-msg-2",
        role: "assistant",
        content:
          "Highlight dishes without butter finish, no cream emulsions, and no cheese garnish. Mark tickets lactose-sensitive at expo.",
      },
      {
        id: "thread-7-msg-3",
        role: "user",
        content: "Add one reminder for dessert.",
      },
      {
        id: "thread-7-msg-4",
        role: "assistant",
        content:
          "Avoid mascarpone-based options and verify sorbet is dairy-free from current batch sheet.",
      },
    ],
  },
  {
    id: "thread-8",
    title: "Celiac guest protocol",
    updatedAtLabel: "Mon",
    updatedAtBucket: "last-week",
    messages: [
      {
        id: "thread-8-msg-1",
        role: "user",
        content:
          "Walk me through celiac-safe handling for one table during peak service.",
      },
      {
        id: "thread-8-msg-2",
        role: "assistant",
        content:
          "Use clean board, fresh gloves, dedicated pan, and separate pass position. Mark ticket gluten-critical and verbal confirm at handoff.",
      },
    ],
  },
  {
    id: "thread-9",
    title: "Sesame allergy briefing",
    updatedAtLabel: "Sun",
    updatedAtBucket: "last-week",
    messages: [
      {
        id: "thread-9-msg-1",
        role: "user",
        content:
          "Need a short sesame allergy callout for staff meal and guest menu confusion.",
      },
      {
        id: "thread-9-msg-2",
        role: "assistant",
        content:
          "Call out sesame in garnish oils and seed toppings. Keep separate squeeze bottle and clean pass area for allergy tickets.",
      },
    ],
  },
  {
    id: "thread-10",
    title: "Fryer cross-contact reminder",
    updatedAtLabel: "Sat",
    updatedAtBucket: "last-week",
    messages: [
      {
        id: "thread-10-msg-1",
        role: "user",
        content:
          "Can we promise allergen-free fries when fryer is shared?",
      },
      {
        id: "thread-10-msg-2",
        role: "assistant",
        content:
          "No. Shared fryer means cross-contact risk. Offer oven-roasted potatoes prepared on clean tray instead.",
      },
    ],
  },
  {
    id: "thread-11",
    title: "Soy-sensitive guest options",
    updatedAtLabel: "Thu",
    updatedAtBucket: "last-week",
    messages: [
      {
        id: "thread-11-msg-1",
        role: "user",
        content:
          "Guest avoids soy. Which sauces need immediate caution tonight?",
      },
      {
        id: "thread-11-msg-2",
        role: "assistant",
        content:
          "Flag vinaigrettes with soy lecithin and any glaze reductions. Verify labels and send soy-free alternatives from prep notes.",
      },
    ],
  },
  {
    id: "thread-12",
    title: "Allergen cheat sheet request",
    updatedAtLabel: "Last week",
    updatedAtBucket: "last-week",
    messages: [
      {
        id: "thread-12-msg-1",
        role: "user",
        content:
          "Need a one-minute allergen cheat sheet for FOH line-up before Friday service.",
      },
      {
        id: "thread-12-msg-2",
        role: "assistant",
        content:
          "I can format by dish: top allergens, cross-contact zone, and safe alternative. Keep one laminated copy at pass and one at host stand.",
      },
    ],
  },
];

export function buildMobileChatAssistantReply(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (
    normalized.includes("allergen") ||
    normalized.includes("allergy")
  ) {
    return "Share the exact dish and I will give you a guest-safe allergen callout you can use with FOH before firing.";
  }

  if (
    normalized.includes("recipe") ||
    normalized.includes("dish") ||
    normalized.includes("plating")
  ) {
    return "If this is for guest communication, I can format it as: dish name, key allergens, and one cross-contact reminder for FOH.";
  }

  if (
    normalized.includes("training") ||
    normalized.includes("module") ||
    normalized.includes("coach")
  ) {
    return "Run this as a short cycle: demonstrate once, practice twice, then close with one measurable target to review at end of shift.";
  }

  if (
    normalized.includes("team") ||
    normalized.includes("performance") ||
    normalized.includes("score")
  ) {
    return "Prioritize highest-risk teammates first, assign one owner per follow-up, and validate progress with one live floor observation today.";
  }

  if (
    normalized.includes("guest") ||
    normalized.includes("service") ||
    normalized.includes("complaint")
  ) {
    return "Use a calm service rhythm: acknowledge, set precise timing, and return with a clear update before the guest asks again.";
  }

  return "I can shape that into a shift-ready action list with owner, timing, and service-floor checks if you share your current constraint.";
}

export function toMobileChatThreadTitle(prompt: string) {
  const normalized = prompt.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "New chat";
  }

  if (normalized.length <= 36) {
    return normalized;
  }

  return `${normalized.slice(0, 33).trimEnd()}...`;
}
