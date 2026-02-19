"use client";

import { MobileAppLayout } from "@/components/mobile-app-layout";
import { MobileDashboardContent } from "@/components/mobile-dashboard-content";
import { mobilePrimaryNav } from "@/components/mobile-primary-nav";

export function MobileDashboardPage() {
  return (
    <MobileAppLayout
      primaryNav={mobilePrimaryNav}
      activeNavItemId="dashboard"
      sectionTitle="Screen 01: Mobile Training Dashboard"
      sectionBullets={[
        "Native-app style mobile preview for learner-facing experiences.",
        "Realistic iPhone frame with fixed native chrome and persistent bottom tabs.",
        "Scrollable in-screen content area that can host future interactive mobile screens.",
      ]}
    >
      <MobileDashboardContent />
    </MobileAppLayout>
  );
}

