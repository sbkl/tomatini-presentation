import type { ReactNode } from "react";

import { AgentsDetailsPage } from "@/components/agents-details-page";
import { DashboardPage } from "@/components/dashboard-page";
import { MobileDashboardPage } from "@/components/mobile-dashboard-page";
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
    screenId: "mobile-dashboard",
    label: "Screen 01: Mobile Dashboard",
    order: 1,
    render: () => <MobileDashboardPage />,
  },
] as const satisfies readonly PresentationScreen[];

export const presentationRegistry: PresentationRegistry = {
  web: webScreens,
  mobile: mobileScreens,
};
