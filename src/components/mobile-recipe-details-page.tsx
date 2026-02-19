"use client";

import { ChevronLeftIcon } from "lucide-react";

import { MobileAppLayout } from "@/components/mobile-app-layout";
import { MobileRecipeDetailsContent } from "@/components/mobile-recipe-details-content";
import { mobilePrimaryNav } from "@/components/mobile-primary-nav";
import { saladeNicoiseRecipe } from "@/lib/salade-nicoise-recipe";

export function MobileRecipeDetailsPage() {
  return (
    <MobileAppLayout
      primaryNav={mobilePrimaryNav}
      showBottomNav={false}
      headerTitle={saladeNicoiseRecipe.title}
      headerLeading={
        <button
          type="button"
          aria-label="Go back"
          className="text-foreground/90 inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/65"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
      }
      headerTrailing={null}
      sectionTitle="Screen 03: Mobile Recipe Details"
      sectionBullets={[
        "Recipe detail view with media-first layout and read-only culinary fields.",
        "Uses the same Salade Nicoise seed data as the web recipe details form.",
        "Hides bottom tab bar for focused recipe consultation during service.",
      ]}
    >
      <MobileRecipeDetailsContent />
    </MobileAppLayout>
  );
}
