import type { ReactNode } from "react";

import { AgentsDetailsPage } from "@/components/agents-details-page";
import { DashboardPage } from "@/components/dashboard-page";
import { MobileChatPage } from "@/components/mobile-chat-page";
import { MobileDashboardPage } from "@/components/mobile-dashboard-page";
import { MobileMenusPage } from "@/components/mobile-menus-page";
import { MobileRecipeDetailsPage } from "@/components/mobile-recipe-details-page";
import { MobileTeamPage } from "@/components/mobile-team-page";
import { MobileTrainingModuleDetailsPage } from "@/components/mobile-training-module-details-page";
import { MobileTrainingModulesPage } from "@/components/mobile-training-modules-page";
import { PresentationIntroSection } from "@/components/presentation-intro-section";
import { RecipeCreationPage } from "@/components/recipe-creation-page";
import { RecipeLibraryPage } from "@/components/recipe-library-page";
import { TeamsPage } from "@/components/teams-page";
import { TrainingModuleDetailsPage } from "@/components/training-module-details-page";
import { TrainingModulesPage } from "@/components/training-modules-page";
import type { PresentationPlatform } from "@/lib/presentation-navigation";

export type PresentationScreen = {
  platform: PresentationPlatform;
  screenId: string;
  label: string;
  order: number;
  render: () => ReactNode;
};

export type PresentationRegistry = {
  web: readonly PresentationScreen[];
  mobile: readonly PresentationScreen[];
};

export const webScreens = [
  {
    platform: "web",
    screenId: "platform-overview",
    label: "Section: Platform Concept",
    order: 0,
    render: () => (
      <PresentationIntroSection
        badge="Overall Introduction"
        title="Tomatini is a unified training operating system for hospitality teams."
        description="The platform combines content authoring, learning delivery, team performance tracking, and agent-assisted coaching in one product. It keeps brand standards consistent while making training practical for day-to-day restaurant operations, then sustains performance through FSRS-based spaced repetition."
        objective="Create one trusted training workflow from HQ content creation to in-shift team execution, with measurable long-term retention driven by FSRS review cycles."
        goals={[
          "Standardize recipes, modules, and service playbooks across all restaurants.",
          "Reduce time from training design to live team adoption on the floor.",
          "Give leadership a clear view of completion, skill gaps, retention trajectory, and coaching priorities.",
        ]}
      />
    ),
  },
  {
    platform: "web",
    screenId: "web-admin-cms-intro",
    label: "Section: Web App (Admin & CMS)",
    order: 0,
    render: () => (
      <PresentationIntroSection
        badge="Web App Section"
        title="The web app is the admin and CMS control plane."
        description="This side is built for training managers, operational leaders, and GMs to structure content, monitor adoption, and coordinate interventions. It centralizes menus, modules, teams, and agent workflows so governance and quality stay controlled."
        objective="Enable leadership to design, manage, and optimize training content and performance at scale, including future knowledge retention outcomes."
        goals={[
          "Author and maintain menus, recipes, and module content with clear standards.",
          "Track team-level learning performance and identify risk early.",
          "Use FSRS retention signals to schedule reinforcement and coordinate follow-up actions.",
        ]}
      />
    ),
  },
  {
    platform: "web",
    screenId: "dashboard",
    label: "Screen 01: Dashboard",
    order: 1,
    render: () => <DashboardPage />,
  },
  {
    platform: "web",
    screenId: "menus-library",
    label: "Screen 02: Menus",
    order: 2,
    render: () => <RecipeLibraryPage />,
  },
  {
    platform: "web",
    screenId: "menus-create",
    label: "Screen 03: New Recipe",
    order: 3,
    render: () => <RecipeCreationPage />,
  },
  {
    platform: "web",
    screenId: "modules-list",
    label: "Screen 04: Training Modules",
    order: 4,
    render: () => <TrainingModulesPage />,
  },
  {
    platform: "web",
    screenId: "modules-details",
    label: "Screen 05: Module Details",
    order: 5,
    render: () => <TrainingModuleDetailsPage />,
  },
  {
    platform: "web",
    screenId: "teams",
    label: "Screen 06: Teams",
    order: 6,
    render: () => <TeamsPage />,
  },
  {
    platform: "web",
    screenId: "agents-details",
    label: "Screen 07: Agents Details",
    order: 7,
    render: () => <AgentsDetailsPage />,
  },
] as const satisfies readonly PresentationScreen[];

export const mobileScreens = [
  {
    platform: "mobile",
    screenId: "mobile-learning-intro",
    label: "Section: Mobile App (Staff Learning)",
    order: 0,
    render: () => (
      <PresentationIntroSection
        badge="Mobile App Section"
        title="The mobile app is where staff consume training during real operations."
        description="This experience is designed for FOH and kitchen teams who need fast, focused guidance on shift. It prioritizes personal progression, quick reference content, and clear next actions without admin complexity, with FSRS guiding when each learner should review."
        objective="Turn training into a practical daily tool that improves confidence, consistency, service execution, and long-term memory retention."
        goals={[
          "Give each team member a clear personal learning path and progress view.",
          "Provide easy access to menu and recipe details during service.",
          "Reinforce module completion with FSRS-powered review timing that protects future retention.",
        ]}
      />
    ),
  },
  {
    platform: "mobile",
    screenId: "mobile-dashboard",
    label: "Screen 01: Mobile Dashboard",
    order: 1,
    render: () => <MobileDashboardPage />,
  },
  {
    platform: "mobile",
    screenId: "mobile-menus",
    label: "Screen 02: Mobile Menus",
    order: 2,
    render: () => <MobileMenusPage />,
  },
  {
    platform: "mobile",
    screenId: "mobile-recipe-details",
    label: "Screen 03: Mobile Recipe Details",
    order: 3,
    render: () => <MobileRecipeDetailsPage />,
  },
  {
    platform: "mobile",
    screenId: "mobile-training-modules",
    label: "Screen 04: Mobile Training Modules",
    order: 4,
    render: () => <MobileTrainingModulesPage />,
  },
  {
    platform: "mobile",
    screenId: "mobile-training-module-details",
    label: "Screen 05: Mobile Training Module Details",
    order: 5,
    render: () => <MobileTrainingModuleDetailsPage />,
  },
  {
    platform: "mobile",
    screenId: "mobile-team",
    label: "Screen 06: Mobile Team",
    order: 6,
    render: () => <MobileTeamPage />,
  },
  {
    platform: "mobile",
    screenId: "mobile-chat",
    label: "Screen 07: Mobile Chat",
    order: 7,
    render: () => <MobileChatPage />,
  },
] as const satisfies readonly PresentationScreen[];

export const presentationRegistry: PresentationRegistry = {
  web: webScreens,
  mobile: mobileScreens,
};
