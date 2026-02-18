"use client";
import { DashboardContent } from "@/components/dashboard-content";
import { primaryNav } from "@/components/primary-nav";
import { WebAppLayout } from "@/components/web-app-layout";

export function DashboardPage() {
  return (
    <WebAppLayout
      primaryNav={primaryNav}
      className="h-full"
      activeNavItemId="dashboard"
      sectionTitle="Screen 01: Training Performance Dashboard"
      sectionBullets={[
        "Web admin view for training managers and restaurant GMs.",
        "Highlights completion, correctness, and learner activity signals.",
        "Supports fast follow-up with module insights and action queue.",
      ]}
    >
      <DashboardContent />
    </WebAppLayout>
  );
}
