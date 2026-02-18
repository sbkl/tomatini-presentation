"use client";

import { RecipeCreationContent } from "@/components/recipe-creation-content";
import { defineWebNav, WebAppLayout } from "@/components/web-app-layout";
import {
  BookOpenIcon,
  ChartColumnIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  UserRoundCheckIcon,
} from "lucide-react";

const primaryNav = defineWebNav([
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  {
    id: "recipes",
    label: "Recipe Builder",
    icon: BookOpenIcon,
    isActive: true,
  },
  { id: "modules", label: "Training Modules", icon: UserRoundCheckIcon },
  { id: "progress", label: "Progress", icon: ChartColumnIcon },
  { id: "communication", label: "Announcements", icon: MessageSquareTextIcon },
] as const);

export function RecipeCreationPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="recipes"
      sectionTitle="Screen 02: AI-Assisted Recipe Creation"
      sectionBullets={[
        "Chat-led workflow where the user describes a dish and receives a structured draft.",
        "Recipe template follows the LPM training format from your course files.",
        "Captures title, dish announcement, ingredients, dressing, garnish, allergens, method, and service tools.",
      ]}
    >
      <RecipeCreationContent />
    </WebAppLayout>
  );
}
