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
  { label: "Path Progress", value: "68%", note: "4 lessons left in Level 1" },
  { label: "Quiz Accuracy", value: "91%", note: "+4 pts this week" },
  { label: "Current Streak", value: "6 days", note: "Complete today to hit 7" },
  { label: "Coach Score", value: "4.7 / 5", note: "From recent practical checks" },
];

const quickActions = [
  "Resume Wine Pairing Lesson 4",
  "Take 3-min Service Rituals Quiz",
  "Open Today's Station Checklist",
];

const flashCardsDue = [
  {
    module: "Wine Pairing Foundations",
    dueCount: 18,
    dueWindow: "Due now",
    retention: "83% retention",
    tone: "alert",
  },
  {
    module: "LPM Service Rituals",
    dueCount: 11,
    dueWindow: "Due in 2h",
    retention: "89% retention",
    tone: "neutral",
  },
  {
    module: "Guest Recovery",
    dueCount: 7,
    dueWindow: "Due today",
    retention: "91% retention",
    tone: "positive",
  },
] as const;

const activityFeed = [
  {
    context: "Assessment",
    summary: "You completed Knife Safety refresher with 94% accuracy.",
    tone: "positive",
    time: "6 min ago",
  },
  {
    context: "Coach Feedback",
    summary: "Coach Amina left feedback on your fish station practical.",
    tone: "neutral",
    time: "21 min ago",
  },
  {
    context: "Deadline",
    summary: "Your Wine Pairing checkpoint is due by 18:00 today.",
    tone: "alert",
    time: "38 min ago",
  },
  {
    context: "Milestone",
    summary: "You unlocked Level 2 in Guest Recovery micro-learning.",
    tone: "positive",
    time: "1h ago",
  },
];

export function MobileDashboardContent() {
  const totalFlashCardsDue = flashCardsDue.reduce(
    (acc, module) => acc + module.dueCount,
    0,
  );

  return (
    <div className="space-y-3">
      <Card className="border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_30%,white_70%),color-mix(in_oklch,var(--background)_90%,var(--muted)_10%))]">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardDescription>My Training Pulse</CardDescription>
            <Badge variant="secondary">Live</Badge>
          </div>
          <CardTitle className="text-base">Today&apos;s Learning Focus</CardTitle>
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
          {quickActions.map((label, index) => (
            <Button
              key={label}
              variant={index === 0 ? "default" : "outline"}
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
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">FSRS Flashcards Due</CardTitle>
            <Badge variant="secondary">{totalFlashCardsDue} due</Badge>
          </div>
          <CardDescription>
            Spaced-repetition cards scheduled from your active training modules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-3">
          {flashCardsDue.map((module) => (
            <article
              key={module.module}
              className="border-border/60 bg-background/85 space-y-1 border p-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs">{module.module}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    module.tone === "positive" && "text-primary",
                    module.tone === "alert" && "text-destructive",
                  )}
                >
                  {module.dueWindow}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px] leading-snug">
                {module.dueCount} cards to review · {module.retention}
              </p>
            </article>
          ))}
          <Button size="sm" className="w-full justify-between">
            <span>Start FSRS Review Session</span>
            <ArrowUpRightIcon className="size-3.5" />
          </Button>
        </CardContent>
      </Card>

      <Card size="sm" className="border-border/70">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-sm">Recent Activity</CardTitle>
          <CardDescription>Your progress and feedback updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-3">
          {activityFeed.map((item) => (
            <article
              key={item.summary}
              className="border-border/60 bg-background/85 space-y-1 border p-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs">{item.context}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    item.tone === "positive" && "text-primary",
                    item.tone === "alert" && "text-destructive",
                  )}
                >
                  {item.tone === "positive"
                    ? "Completed"
                    : item.tone === "alert"
                      ? "Action Needed"
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
          <CardDescription>Generated from your latest learning activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-3">
          <div className="border-border/70 bg-background/85 border p-2 text-[11px] leading-snug">
            Review the fish station feedback clip before retrying your practical
            check to improve plating speed consistency.
          </div>
          <div className="border-border/70 bg-background/85 border p-2 text-[11px] leading-snug">
            Complete the Service Rituals micro-quiz today to keep your streak
            active and unlock the weekend challenge set.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
