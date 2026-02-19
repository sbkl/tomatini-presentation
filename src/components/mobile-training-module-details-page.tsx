"use client";

import { ChevronLeftIcon } from "lucide-react";

import { MobileAppLayout } from "@/components/mobile-app-layout";
import { MobileTrainingModuleDetailsContent } from "@/components/mobile-training-module-details-content";
import { clientelingTrainingModuleDetail } from "@/lib/mobile-training-module-details-data";

export function MobileTrainingModuleDetailsPage() {
  return (
    <MobileAppLayout
      showBottomNav={false}
      headerTitle={clientelingTrainingModuleDetail.module.title}
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
      sectionTitle="Screen 05: Mobile Training Module Details"
      sectionBullets={[
        "Learner-focused module details for Dubai FOH with summary, media, flashcards, and assessment.",
        "Uses staged flashcard flow with confidence feedback before advancing cards.",
        "Runs assessment in-session and ends with per-question right/wrong review and explanation callouts.",
      ]}
    >
      <MobileTrainingModuleDetailsContent />
    </MobileAppLayout>
  );
}
