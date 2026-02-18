"use client";

import { RecipeLibraryContent } from "@/components/recipe-library-content";
import { primaryNav } from "@/components/primary-nav";
import { WebAppLayout } from "@/components/web-app-layout";

export function RecipeLibraryPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="menus"
      sectionTitle="Screen 02: Menus"
      sectionBullets={[
        "Central menu list with dish cards across every course category by restaurant.",
        "Search plus horizontally scrollable filters for restaurant, category, and status.",
        "Cards include placeholder image slots so real photos can be dropped in later from /public/recipes.",
      ]}
    >
      <RecipeLibraryContent />
    </WebAppLayout>
  );
}
