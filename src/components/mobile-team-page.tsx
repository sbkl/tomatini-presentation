"use client";

import { MobileAppLayout } from "@/components/mobile-app-layout";
import { mobilePrimaryNav } from "@/components/mobile-primary-nav";
import { MobileTeamContent } from "@/components/mobile-team-content";

export function MobileTeamPage() {
  return (
    <MobileAppLayout
      primaryNav={mobilePrimaryNav}
      activeNavItemId="teams"
      user={{
        name: "Romain Dupont",
        email: "romain.dupont@lpm.team",
        initials: "RD",
      }}
      sectionTitle="Screen 06: Mobile Team"
      sectionBullets={[
        "Manager and GM mobile review of team training activity and follow-up priorities.",
        "Highlights who needs discussion first, with owner and coaching action per team member.",
        "Keeps the Team tab active while preserving the existing mobile shell and visual rhythm.",
      ]}
    >
      <MobileTeamContent />
    </MobileAppLayout>
  );
}
