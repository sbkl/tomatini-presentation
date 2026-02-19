"use client";

import { MobileAppLayout } from "@/components/mobile-app-layout";
import { mobilePrimaryNav } from "@/components/mobile-primary-nav";
import { MobileTrainingModulesContent } from "@/components/mobile-training-modules-content";

export function MobileTrainingModulesPage() {
  return (
    <MobileAppLayout
      primaryNav={mobilePrimaryNav}
      activeNavItemId="modules"
      user={{
        name: "Lea Martin",
        email: "lea.martin@lpm.team",
        initials: "LM",
      }}
      sectionTitle="Screen 04: Mobile Training Modules"
      sectionBullets={[
        "Dubai FOH training list focused on personal progression by module status.",
        "Modules are split into to-start, active, and completed sections with FSRS follow-up cadence.",
        "Cards remain clean and actionable while reinforcing long-term retention habits.",
      ]}
    >
      <MobileTrainingModulesContent />
    </MobileAppLayout>
  );
}
