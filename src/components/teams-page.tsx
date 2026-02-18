"use client";

import { primaryNav } from "@/components/primary-nav";
import { TeamsContent } from "@/components/teams-content";
import { WebAppLayout } from "@/components/web-app-layout";

export function TeamsPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="teams"
      sectionTitle="Screen 06: Teams"
      sectionBullets={[
        "Focused GM view of current team training completion, correctness, and learner risk.",
        "Highlights ongoing module skill gaps by team member with clear discussion owners.",
        "Provides weekly coaching priorities and practical follow-up actions.",
      ]}
    >
      <TeamsContent />
    </WebAppLayout>
  );
}
