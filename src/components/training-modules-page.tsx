"use client";

import { TrainingModulesContent } from "@/components/training-modules-content";
import { primaryNav } from "@/components/primary-nav";
import { WebAppLayout } from "@/components/web-app-layout";

export function TrainingModulesPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="modules"
      sectionTitle="Screen 04: Training Modules"
      sectionBullets={[
        "Catalog of all core LPM learning categories with Level 1 and Level 2 progression.",
        "Search and filters mirror the Menus screen for fast module slicing.",
        "Cards summarize audience, status, duration, delivery format, and FSRS retention strategy readiness.",
      ]}
    >
      <TrainingModulesContent />
    </WebAppLayout>
  );
}
