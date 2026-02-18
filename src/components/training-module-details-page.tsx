"use client";

import { TrainingModuleDetailsContent } from "@/components/training-module-details-content";
import { primaryNav } from "@/components/primary-nav";
import { WebAppLayout } from "@/components/web-app-layout";

export function TrainingModuleDetailsPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="modules"
      sectionTitle="Screen 05: Training Module Details"
      sectionBullets={[
        "Detailed module view with tabbed learning assets for one restaurant context.",
        "Content is seeded from the module category and adapts to the fixed Dubai menu offer.",
        "Covers summary, media, included recipes, flashcards, and assessment results.",
      ]}
    >
      <TrainingModuleDetailsContent />
    </WebAppLayout>
  );
}
