"use client";

import { AgentsDetailsContent } from "@/components/agents-details-content";
import { primaryNav } from "@/components/primary-nav";
import { WebAppLayout } from "@/components/web-app-layout";

export function AgentsDetailsPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="agents"
      sectionTitle="Screen 06: Agents Details"
      sectionBullets={[
        "Agent workspace with one selector for Host, Chef, Clienteling, FOH, and Training profiles.",
        "Split view mirrors other detail screens with chat on the left and editable content on the right.",
        "Soul and Documents submenu supports markdown authoring and simulated upload management.",
      ]}
    >
      <AgentsDetailsContent />
    </WebAppLayout>
  );
}
