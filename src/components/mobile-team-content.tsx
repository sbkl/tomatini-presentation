"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  managerActionQueue,
  teamContext,
  teamMemberFollowUps,
  teamPulseMetrics,
  type ManagerActionItem,
  type TeamMemberFollowUp,
  type TeamPulseMetric,
} from "@/lib/mobile-team-data";
import { cn } from "@/lib/utils";

const outlinedSecondaryBadgeClass =
  "border-secondary/55 text-secondary bg-transparent";

function metricDeltaClass(tone: TeamPulseMetric["deltaTone"]) {
  if (tone === "positive") {
    return "text-emerald-700";
  }
  if (tone === "warning") {
    return "text-amber-700";
  }
  return "text-muted-foreground";
}

function riskBadgeClass(risk: TeamMemberFollowUp["risk"]) {
  if (risk === "High") {
    return "border-rose-600/55 text-rose-700 bg-rose-500/10";
  }
  if (risk === "Medium") {
    return "border-amber-600/55 text-amber-700 bg-amber-500/10";
  }
  return "border-emerald-600/55 text-emerald-700 bg-emerald-500/10";
}

function priorityBadgeClass(priority: ManagerActionItem["priority"]) {
  if (priority === "High") {
    return "border-rose-600/55 text-rose-700 bg-rose-500/10";
  }
  return "border-blue-600/55 text-blue-700 bg-blue-500/10";
}

export function MobileTeamContent() {
  const followUps = useMemo(
    () =>
      [...teamMemberFollowUps].sort((a, b) => {
        const riskWeight = { High: 3, Medium: 2, Low: 1 };
        const riskDiff = riskWeight[b.risk] - riskWeight[a.risk];
        if (riskDiff !== 0) {
          return riskDiff;
        }
        return a.currentScore - b.currentScore;
      }),
    [],
  );

  return (
    <div className="space-y-8">
      <section className="border-border/70 space-y-2 border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_35%,white_65%),color-mix(in_oklch,var(--background)_90%,var(--muted)_10%))] p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm leading-none">{teamContext.restaurantLabel}</p>
          <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
            {teamContext.scopeLabel}
          </Badge>
        </div>
        <p className="text-muted-foreground text-[11px] leading-snug">
          {teamContext.reportWindowLabel}
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-[11px] uppercase tracking-[0.12em]">Team Pulse</h3>
        <div className="grid grid-cols-2 gap-3.5">
          {teamPulseMetrics.map((metric) => (
            <article
              key={metric.id}
              className="border-border/70 bg-background space-y-2 border p-3"
            >
              <p className="text-muted-foreground text-[10px] uppercase tracking-[0.14em]">
                {metric.label}
              </p>
              <p className="text-sm">{metric.value}</p>
              <p className="text-muted-foreground text-[10px]">{metric.note}</p>
              <p className={cn("text-[10px]", metricDeltaClass(metric.deltaTone))}>
                {metric.delta}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-1">
        <h3 className="text-[11px] uppercase tracking-[0.12em]">Needs Follow-Up</h3>
        <div className="space-y-4">
          {followUps.map((record) => (
            <Card key={record.id} size="sm" className="border-border/70">
              <CardHeader className="border-b border-border/60 pb-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm">{record.teamMember}</CardTitle>
                    <CardDescription>{record.role}</CardDescription>
                  </div>
                  <Badge variant="outline" className={riskBadgeClass(record.risk)}>
                    {record.risk}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-3">
                <p className="text-[11px] leading-snug">
                  {record.module} - {record.gapArea}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {record.currentScore}% score - {record.completion}% completion
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Owner: {record.discussionOwner}
                </p>
                <p className="text-[11px] leading-snug">{record.nextAction}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-1">
        <h3 className="text-[11px] uppercase tracking-[0.12em]">Action Queue</h3>
        <div className="space-y-4">
          {managerActionQueue.map((action) => (
            <Card key={action.id} size="sm" className="border-border/70">
              <CardHeader className="border-b border-border/60 pb-2.5">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm leading-tight">{action.title}</CardTitle>
                  <Badge
                    variant="outline"
                    className={priorityBadgeClass(action.priority)}
                  >
                    {action.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-3">
                <p className="text-muted-foreground text-[11px]">
                  {action.owner} - Due {action.dueDate}
                </p>
                <p className="text-[11px] leading-snug">{action.successCheck}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
