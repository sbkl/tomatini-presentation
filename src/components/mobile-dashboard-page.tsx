"use client";

import { MobileAppLayout } from "@/components/mobile-app-layout";
import { MobileDashboardContent } from "@/components/mobile-dashboard-content";
import { mobilePrimaryNav } from "@/components/mobile-primary-nav";

export function MobileDashboardPage() {
  return (
    <MobileAppLayout
      primaryNav={mobilePrimaryNav}
      activeNavItemId="dashboard"
      user={{
        name: "Nora Trainee",
        email: "nora.trainee@lpm.team",
        initials: "NT",
      }}
      sectionTitle="Screen 01: Mobile Training Dashboard"
      sectionBullets={[
        "Learner-facing dashboard focused on personal progress, FSRS due reviews, and next training steps.",
        "Uses the established mobile shell with fixed native chrome and bottom tab navigation.",
        "KPIs and actions are trainee-specific and focused on protecting future knowledge retention.",
      ]}
    >
      <MobileDashboardContent />
    </MobileAppLayout>
  );
}
