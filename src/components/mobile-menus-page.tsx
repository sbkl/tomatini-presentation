"use client";

import { MobileAppLayout } from "@/components/mobile-app-layout";
import { MobileMenusContent } from "@/components/mobile-menus-content";
import { mobilePrimaryNav } from "@/components/mobile-primary-nav";

export function MobileMenusPage() {
  return (
    <MobileAppLayout
      primaryNav={mobilePrimaryNav}
      activeNavItemId="menus"
      user={{
        name: "Ethan Alvarez",
        email: "ethan.alvarez@lpm.team",
        initials: "EA",
      }}
      sectionTitle="Screen 02: Mobile Menus"
      sectionBullets={[
        "Staff-facing menu list with Dubai-only scope for on-shift service and kitchen teams.",
        "Uses sticky category headers to keep context while browsing long dish lists.",
        "Dishes are displayed in a compact two-column grid with operational metadata chips.",
      ]}
    >
      <MobileMenusContent />
    </MobileAppLayout>
  );
}
