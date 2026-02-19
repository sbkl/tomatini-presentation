"use client";

import { ArrowUpRightIcon, Clock3Icon, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const metricCards = [
  { label: "Completion", value: "82%", note: "+3.4 pts this month" },
  { label: "Correctness", value: "88%", note: "+1.8 pts this month" },
  { label: "Active Learners", value: "428", note: "Across all locations" },
  { label: "Needs Follow-up", value: "36", note: "No progress in 10+ days" },
];

const quickActions = [
  "Review stalled learners",
  "Assign onboarding module",
  "Share coaching summary",
];

const activityFeed = [
  {
    location: "London",
    summary: "12 team members completed Service Rituals",
    tone: "positive",
    time: "2 min ago",
  },
  {
    location: "Riyadh",
    summary: "Correctness dropped below 80% in Wine Pairing",
    tone: "alert",
    time: "14 min ago",
  },
  {
    location: "Dubai",
    summary: "New onboarding cohort started this morning",
    tone: "neutral",
    time: "32 min ago",
  },
  {
    location: "Miami",
    summary: "6 assessments awaiting manager review",
    tone: "alert",
    time: "48 min ago",
  },
  {
    location: "Abu Dhabi",
    summary: "Coaching session completed for FOH group",
    tone: "positive",
    time: "1h ago",
  },
  {
    location: "Hong Kong",
    summary: "Module refresh published to all learners",
    tone: "neutral",
    time: "2h ago",
  },
  {
    location: "Doha",
    summary: "9 learners reached 100% completion milestone",
    tone: "positive",
    time: "3h ago",
  },
];

export function MobileDashboardContent() {
  return (
    <div className="space-y-3">
      <Card className="border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_30%,white_70%),color-mix(in_oklch,var(--background)_90%,var(--muted)_10%))]">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardDescription>Training Pulse</CardDescription>
            <Badge variant="secondary">Live</Badge>
          </div>
          <CardTitle className="text-base">Today&apos;s Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 pt-4">
          {metricCards.map((metric) => (
            <div
              key={metric.label}
              className="border-border/70 bg-background/80 space-y-1 border p-2"
            >
              <p className="text-muted-foreground text-[10px]">{metric.label}</p>
              <p className="text-sm">{metric.value}</p>
              <p className="text-muted-foreground text-[10px]">{metric.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card size="sm" className="border-border/70">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-3">
          {quickActions.map((label) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              className="w-full justify-between"
            >
              <span>{label}</span>
              <ArrowUpRightIcon className="size-3.5" />
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card size="sm" className="border-border/70">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-sm">Recent Activity</CardTitle>
          <CardDescription>Updates across your restaurants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-3">
          {activityFeed.map((item) => (
            <article
              key={`${item.location}-${item.summary}`}
              className="border-border/60 bg-background/85 space-y-1 border p-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs">{item.location}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    item.tone === "positive" && "text-primary",
                    item.tone === "alert" && "text-destructive",
                  )}
                >
                  {item.tone === "positive"
                    ? "Progress"
                    : item.tone === "alert"
                      ? "Attention"
                      : "Update"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px] leading-snug">
                {item.summary}
              </p>
              <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                <Clock3Icon className="size-3" />
                <span>{item.time}</span>
              </div>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card size="sm" className="border-border/70">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">AI Coach Suggestions</CardTitle>
            <SparklesIcon className="text-primary size-3.5" />
          </div>
          <CardDescription>Generated from learner behavior signals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-3">
          <div className="border-border/70 bg-background/85 border p-2 text-[11px] leading-snug">
            Prioritize Riyadh and Miami for manager follow-up in the next 24
            hours due to stalled module progression.
          </div>
          <div className="border-border/70 bg-background/85 border p-2 text-[11px] leading-snug">
            Recommend a micro-quiz refresh for Wine Pairing after recurring
            low-correctness attempts in Doha and Riyadh.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
