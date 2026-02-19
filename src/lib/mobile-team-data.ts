export type TeamPulseMetric = {
  id: string;
  label: string;
  value: string;
  note: string;
  delta: string;
  deltaTone: "positive" | "warning" | "neutral";
};

export type TeamMemberFollowUp = {
  id: string;
  teamMember: string;
  role: string;
  module: string;
  gapArea: string;
  currentScore: number;
  completion: number;
  risk: "High" | "Medium" | "Low";
  discussionOwner: string;
  nextAction: string;
};

export type ManagerActionItem = {
  id: string;
  priority: "High" | "Medium";
  title: string;
  owner: string;
  dueDate: string;
  successCheck: string;
};

export const teamContext = {
  restaurantLabel: "Dubai",
  reportWindowLabel: "Week of 2026-02-16",
  scopeLabel: "Manager View",
} as const;

export const teamPulseMetrics: readonly TeamPulseMetric[] = [
  {
    id: "team-completion",
    label: "Completion",
    value: "84%",
    note: "Active modules",
    delta: "+2.1 pts",
    deltaTone: "positive",
  },
  {
    id: "team-correctness",
    label: "Correctness",
    value: "87%",
    note: "Assessments",
    delta: "+1.4 pts",
    deltaTone: "positive",
  },
  {
    id: "team-at-risk",
    label: "At Risk",
    value: "7",
    note: "No progress in 7+ days",
    delta: "3 urgent follow-ups",
    deltaTone: "warning",
  },
  {
    id: "team-overdue",
    label: "Overdue",
    value: "5",
    note: "Due before 2026-02-21",
    delta: "2 from Fish Station",
    deltaTone: "neutral",
  },
] as const;

export const teamMemberFollowUps: readonly TeamMemberFollowUp[] = [
  {
    id: "follow-up-sara",
    teamMember: "Sara M.",
    role: "Commis",
    module: "Carpaccios L1",
    gapArea: "Allergen-first pass communication",
    currentScore: 74,
    completion: 80,
    risk: "High",
    discussionOwner: "Fish Chef de Partie",
    nextAction:
      "Run two live pass checks this week and rehearse allergen callout sequence before pickup.",
  },
  {
    id: "follow-up-noah",
    teamMember: "Noah P.",
    role: "Junior Fish Cook",
    module: "Fish & Seafood L1",
    gapArea: "Doneness calibration on sea bass",
    currentScore: 77,
    completion: 75,
    risk: "High",
    discussionOwner: "Sous Chef",
    nextAction:
      "Pair on first two fish fires each service and log doneness variance at pass handoff.",
  },
  {
    id: "follow-up-lina",
    teamMember: "Lina A.",
    role: "Runner",
    module: "LPM Service Rituals L1",
    gapArea: "Table rhythm and reset timing",
    currentScore: 81,
    completion: 72,
    risk: "Medium",
    discussionOwner: "FOH Manager",
    nextAction:
      "Shadow one peak dinner section and review reset timing against station standard.",
  },
  {
    id: "follow-up-adam",
    teamMember: "Adam R.",
    role: "Bartender",
    module: "Cocktail Fundamentals L1",
    gapArea: "Specs consistency under rush",
    currentScore: 83,
    completion: 78,
    risk: "Medium",
    discussionOwner: "Bar Manager",
    nextAction:
      "Run a timed 6-drink spec drill before service and track variance per build.",
  },
  {
    id: "follow-up-julien",
    teamMember: "Julien D.",
    role: "Junior Fish Cook",
    module: "Carpaccios L1",
    gapArea: "Slicing uniformity",
    currentScore: 88,
    completion: 92,
    risk: "Low",
    discussionOwner: "Fish Chef de Partie",
    nextAction:
      "Maintain cadence checks at prep start to preserve consistency through peak.",
  },
] as const;

export const managerActionQueue: readonly ManagerActionItem[] = [
  {
    id: "action-fish-gap-review",
    priority: "High",
    title: "Review Fish Station gap list with Sous Chef",
    owner: "General Manager",
    dueDate: "2026-02-19",
    successCheck:
      "Coaching owners locked for Sara M. and Noah P. with live-service check-ins scheduled.",
  },
  {
    id: "action-carpaccios-reassessment",
    priority: "High",
    title: "Schedule targeted reassessment for Carpaccios L1",
    owner: "Training Manager",
    dueDate: "2026-02-20",
    successCheck: "All learners below 80% correctness assigned reassessment slots.",
  },
  {
    id: "action-foh-rhythm",
    priority: "Medium",
    title: "Run FOH table-rhythm practice in pre-shift",
    owner: "FOH Manager",
    dueDate: "2026-02-21",
    successCheck:
      "Lina A. and two peers complete one observed service simulation.",
  },
  {
    id: "action-bar-drill",
    priority: "Medium",
    title: "Run bar spec consistency drill before Friday peak",
    owner: "Bar Manager",
    dueDate: "2026-02-21",
    successCheck:
      "Cocktail Fundamentals L1 team reaches at least 88% drill accuracy.",
  },
] as const;
