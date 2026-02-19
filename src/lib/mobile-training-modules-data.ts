export type ModuleSection = "to-start" | "active" | "completed";

export type FohTrainingModule = {
  id: string;
  title: string;
  goal: string;
  description: string;
  section: ModuleSection;
  progress: number;
};

export const dubaiFohTrainingModules: readonly FohTrainingModule[] = [
  {
    id: "valentines-menu-launch",
    title: "Valentine's Menu Launch",
    goal: "Master sequence and storytelling for the seasonal tasting flow.",
    description:
      "Learn guest language, timing cues, and pairing prompts for the new Valentine's dishes.",
    section: "to-start",
    progress: 0,
  },
  {
    id: "clienteling-cross-up-sell",
    title: "Clienteling: Cross-Sell & Up-Sell",
    goal: "Increase check value with natural, guest-first recommendation moments.",
    description:
      "Practice add-on timing, premium upgrade phrasing, and recovery-safe suggestion patterns.",
    section: "active",
    progress: 68,
  },
  {
    id: "business-lunch-menu-rollout",
    title: "Business Lunch Menu Rollout",
    goal: "Deliver lunch menu service with speed, precision, and consistent upsell rhythm.",
    description:
      "Completed onboarding for course flow, timing standards, and midday guest profile handling.",
    section: "completed",
    progress: 100,
  },
];

export const primaryMobileModuleId = "clienteling-cross-up-sell";

export function getDubaiFohTrainingModuleById(moduleId: string) {
  return dubaiFohTrainingModules.find((module) => module.id === moduleId) ?? null;
}
