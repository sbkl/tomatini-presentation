"use client";
import { DashboardContent } from "@/components/dashboard-content";
import { defineWebNav, WebAppLayout } from "@/components/web-app-layout";
import {
  BookOpenIcon,
  ChartColumnIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  UserRoundCheckIcon,
} from "lucide-react";

const primaryNav = defineWebNav([
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    isActive: true,
  },
  { id: "modules", label: "Training Modules", icon: BookOpenIcon },
  { id: "coaching", label: "Coaching", icon: UserRoundCheckIcon },
  { id: "progress", label: "Progress", icon: ChartColumnIcon },
  { id: "communication", label: "Announcements", icon: MessageSquareTextIcon },
] as const);

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
