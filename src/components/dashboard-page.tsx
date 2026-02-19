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
        "Highlights completion, correctness, learner activity, and retention health signals.",
        "Supports fast follow-up with module insights, FSRS review queues, and action planning.",
      ]}
    >
      <DashboardContent />
    </WebAppLayout>
  );
}
