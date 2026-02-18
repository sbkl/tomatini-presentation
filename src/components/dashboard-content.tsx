import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WebAppPageHeader } from "@/components/web-app-page-header";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DashboardContent() {
  const overviewMetrics = [
    {
      label: "Staff in Training",
      value: "428",
      note: "Across all active locations",
      delta: "+26 this week",
      deltaTone: "positive" as const,
    },
    {
      label: "Completion Rate",
      value: "82%",
      note: "Program-wide completion",
      delta: "+3.4 pts vs last month",
      deltaTone: "positive" as const,
    },
    {
      label: "Avg Correctness",
      value: "88%",
      note: "Assessment accuracy",
      delta: "+1.8 pts vs last month",
      deltaTone: "positive" as const,
    },
    {
      label: "At-Risk Learners",
      value: "36",
      note: "No progress in 10+ days",
      delta: "12 need manager follow-up",
      deltaTone: "warning" as const,
    },
  ];

  const restaurantLeaderboard = [
    {
      rank: 1,
      location: "London",
      completion: 92,
      correctness: 91,
      onboarding: "97% in 14 days",
    },
    {
      rank: 2,
      location: "Dubai",
      completion: 89,
      correctness: 90,
      onboarding: "94% in 14 days",
    },
    {
      rank: 3,
      location: "Miami",
      completion: 86,
      correctness: 88,
      onboarding: "91% in 14 days",
    },
    {
      rank: 4,
      location: "Abu Dhabi",
      completion: 82,
      correctness: 86,
      onboarding: "87% in 14 days",
    },
    {
      rank: 5,
      location: "Riyadh",
      completion: 78,
      correctness: 84,
      onboarding: "82% in 14 days",
    },
  ];

  const peopleLeaderboard = [
    {
      rank: 1,
      name: "Camille R.",
      location: "London",
      completion: 100,
      correctness: 97,
      modules: "8/8",
    },
    {
      rank: 2,
      name: "Ethan A.",
      location: "Dubai",
      completion: 100,
      correctness: 95,
      modules: "8/8",
    },
    {
      rank: 3,
      name: "Yara M.",
      location: "Miami",
      completion: 94,
      correctness: 96,
      modules: "7/8",
    },
    {
      rank: 4,
      name: "Noah L.",
      location: "Abu Dhabi",
      completion: 91,
      correctness: 93,
      modules: "7/8",
    },
    {
      rank: 5,
      name: "Mina K.",
      location: "Hong Kong",
      completion: 89,
      correctness: 92,
      modules: "7/8",
    },
  ];

  const modulePerformance = [
    {
      title: "LPM Service Rituals",
      audience: "All FOH Staff",
      completion: 93,
      correctness: 90,
      activeLearners: 164,
    },
    {
      title: "Wine Pairing Foundations",
      audience: "Waiters & Sommeliers",
      completion: 84,
      correctness: 87,
      activeLearners: 122,
    },
    {
      title: "Onboarding Essentials",
      audience: "New Joiners",
      completion: 88,
      correctness: 85,
      activeLearners: 96,
    },
    {
      title: "Upselling & Guest Recovery",
      audience: "Senior FOH",
      completion: 71,
      correctness: 79,
      activeLearners: 74,
    },
  ];

  const weeklyActivity = [
    { day: "Mon", attempts: 182, correctness: 84 },
    { day: "Tue", attempts: 205, correctness: 85 },
    { day: "Wed", attempts: 224, correctness: 87 },
    { day: "Thu", attempts: 238, correctness: 88 },
    { day: "Fri", attempts: 259, correctness: 90 },
    { day: "Sat", attempts: 211, correctness: 89 },
    { day: "Sun", attempts: 176, correctness: 87 },
  ];

  const followUpQueue = [
    {
      location: "Riyadh",
      detail: "14 learners stalled on module 2 for 7+ days",
      owner: "GM",
    },
    {
      location: "Doha",
      detail: "Correctness below 80% on Wine Pairing Foundations",
      owner: "Training Manager",
    },
    {
      location: "Abu Dhabi",
      detail: "8 onboarding paths due this week",
      owner: "GM",
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WebAppPageHeader title="Dashboard" />
      <ScrollArea className="min-h-0 flex-1 w-full">
        <div className="space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {overviewMetrics.map((metric) => (
              <MetricTile
                key={metric.label}
                label={metric.label}
                value={metric.value}
                note={metric.note}
                delta={metric.delta}
                deltaTone={metric.deltaTone}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Training Ecosystem Pulse</CardTitle>
              <CardDescription>
                Weekly assessment activity with quick context cards.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
              <div className="bg-background border border-border p-3">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <p className="text-muted-foreground">
                    Assessment Attempts (Last 7 Days)
                  </p>
                  <p className="text-muted-foreground">
                    Trend: +11% week over week
                  </p>
                </div>
                <div className="space-y-2">
                  {weeklyActivity.map((day) => (
                    <div
                      key={day.day}
                      className="grid grid-cols-[2rem_1fr_auto] items-center gap-2 text-xs"
                    >
                      <span className="text-muted-foreground">{day.day}</span>
                      <div className="bg-muted h-2 border border-border">
                        <div
                          className="bg-secondary h-full"
                          style={{ width: `${(day.attempts / 260) * 100}%` }}
                        />
                      </div>
                      <span className="tabular-nums">{day.attempts}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-border pt-3 text-xs">
                  <p className="text-muted-foreground">
                    Average correctness this week
                  </p>
                  <p className="mt-1 text-sm">
                    {Math.round(
                      weeklyActivity.reduce(
                        (acc, day) => acc + day.correctness,
                        0,
                      ) / weeklyActivity.length,
                    )}
                    %
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <div className="bg-background border border-border p-3 text-xs">
                  <p className="text-muted-foreground">Assessments This Week</p>
                  <p className="mt-1 text-sm">1,495 attempts</p>
                </div>
                <div className="bg-background border border-border p-3 text-xs">
                  <p className="text-muted-foreground">Modules Updated</p>
                  <p className="mt-1 text-sm">5 updated in last 30 days</p>
                </div>
                <div className="bg-background border border-border p-3 text-xs">
                  <p className="text-muted-foreground">Coaching Sessions</p>
                  <p className="mt-1 text-sm">41 manager follow-ups</p>
                </div>
                <div className="bg-background border border-border p-3 text-xs">
                  <p className="text-muted-foreground">Overdue Onboarding</p>
                  <p className="mt-1 text-sm">18 team members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 2xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard by Restaurant</CardTitle>
                <CardDescription>
                  Ranked by completion first, then correctness.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="overflow-hidden border border-border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Rank</th>
                        <th className="px-3 py-2 text-left">Location</th>
                        <th className="px-3 py-2 text-left">Completion</th>
                        <th className="px-3 py-2 text-left">Correctness</th>
                        <th className="px-3 py-2 text-left">Onboarding SLA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantLeaderboard.map((item) => (
                        <tr
                          key={item.location}
                          className="border-t border-border"
                        >
                          <td className="px-3 py-2">#{item.rank}</td>
                          <td className="px-3 py-2">{item.location}</td>
                          <td className="px-3 py-2">{item.completion}%</td>
                          <td className="px-3 py-2">{item.correctness}%</td>
                          <td className="px-3 py-2">{item.onboarding}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leaderboard by Team Member</CardTitle>
                <CardDescription>
                  Top learners by module completion and answer quality.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="overflow-hidden border border-border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Rank</th>
                        <th className="px-3 py-2 text-left">Team Member</th>
                        <th className="px-3 py-2 text-left">Location</th>
                        <th className="px-3 py-2 text-left">Modules</th>
                        <th className="px-3 py-2 text-left">Correctness</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peopleLeaderboard.map((item) => (
                        <tr key={item.name} className="border-t border-border">
                          <td className="px-3 py-2">#{item.rank}</td>
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">{item.location}</td>
                          <td className="px-3 py-2">
                            {item.modules} ({item.completion}%)
                          </td>
                          <td className="px-3 py-2">{item.correctness}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Module Performance</CardTitle>
              <CardDescription>
                Completion and correctness view by active training module.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {modulePerformance.map((module) => (
                <div
                  key={module.title}
                  className="bg-background border border-border p-3"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm">{module.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {module.audience}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {module.activeLearners} active
                    </Badge>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Completion
                        </span>
                        <span>{module.completion}%</span>
                      </div>
                      <PercentBar value={module.completion} />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Correctness
                        </span>
                        <span>{module.correctness}%</span>
                      </div>
                      <PercentBar value={module.correctness} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Action Queue</CardTitle>
              <CardDescription>
                Suggested interventions to keep onboarding and quality on track.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {followUpQueue.map((item) => (
                <div
                  key={`${item.location}-${item.detail}`}
                  className="bg-background border border-border p-3 text-xs"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm">{item.location}</p>
                    <Badge variant="secondary">{item.owner}</Badge>
                  </div>
                  <p className="text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

function MetricTile({
  label,
  value,
  note,
  delta,
  deltaTone = "neutral",
}: {
  label: string;
  value: string;
  note: string;
  delta: string;
  deltaTone?: "positive" | "warning" | "neutral";
}) {
  const toneClass =
    deltaTone === "positive"
      ? "text-secondary"
      : deltaTone === "warning"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className="bg-background border border-border p-3 text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
      <p className="text-muted-foreground mt-1">{note}</p>
      <p className={cn("mt-2", toneClass)}>{delta}</p>
    </div>
  );
}

function PercentBar({ value }: { value: number }) {
  return (
    <div className="bg-muted h-2 w-full border border-border">
      <div className="bg-secondary h-full" style={{ width: `${value}%` }} />
    </div>
  );
}
