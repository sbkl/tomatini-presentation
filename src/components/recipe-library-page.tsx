"use client";

import { RecipeLibraryContent } from "@/components/recipe-library-content";
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

export function RecipeLibraryPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="recipes"
      sectionTitle="Screen 03: Recipe Library & Discovery"
      sectionBullets={[
        "Central recipe list with dish cards across every course category.",
        "Search plus horizontally scrollable filters for category, level, station, allergens, and sorting.",
        "Cards include placeholder image slots so real photos can be dropped in later from /public/recipes.",
      ]}
    >
      <RecipeLibraryContent />
    </WebAppLayout>
  );
}
