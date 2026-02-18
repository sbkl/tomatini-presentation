"use client";

import { RecipeCreationContent } from "@/components/recipe-creation-content";
import { primaryNav } from "@/components/primary-nav";
import { WebAppLayout } from "@/components/web-app-layout";

export function RecipeCreationPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="menus"
      sectionTitle="Screen 03: New Recipe"
      sectionBullets={[
        "Form-led workflow where the user fills in the details of a new recipe.",
        "Recipe template follows the LPM training format from your course files.",
        "Captures title, dish announcement, ingredients, dressing, garnish, allergens, method, and service tools.",
        "Saves the recipe to the recipe library and allows the user to edit it later.",
      ]}
    >
      <RecipeCreationContent />
    </WebAppLayout>
  );
}
