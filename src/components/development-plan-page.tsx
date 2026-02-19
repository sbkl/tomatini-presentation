import { cn } from "@/lib/utils";

type PlanPhase = {
  name: string;
  weeksLabel: string;
  startWeek: number;
  duration: number;
  summary: string;
  isOngoing?: boolean;
};

const planHighlights = [
  "6-week delivery plan",
  "2-week go-live support",
  "Maintenance starts week 9+",
] as const;

const planPhases: readonly PlanPhase[] = [
  {
    name: "General Design",
    weeksLabel: "Week 1",
    startWeek: 1,
    duration: 1,
    summary: "Define scope, objectives, architecture, and UX direction.",
  },
  {
    name: "Detailed Design",
    weeksLabel: "Week 2",
    startWeek: 2,
    duration: 1,
    summary: "Finalize flows, data models, interfaces, and implementation details.",
  },
  {
    name: "Development",
    weeksLabel: "Weeks 1-4",
    startWeek: 1,
    duration: 4,
    summary: "Build core features, integration points, and internal tooling.",
  },
  {
    name: "Test",
    weeksLabel: "Week 5",
    startWeek: 5,
    duration: 1,
    summary: "Validate functionality, quality, and release readiness.",
  },
  {
    name: "Bug Fixes",
    weeksLabel: "Weeks 5-8",
    startWeek: 5,
    duration: 4,
    summary:
      "Address defects found during testing and early rollout to improve reliability and polish.",
  },
  {
    name: "Go Live",
    weeksLabel: "Week 6",
    startWeek: 6,
    duration: 1,
    summary: "Launch to production with release controls and monitoring in place.",
  },
  {
    name: "Go-Live Support",
    weeksLabel: "Weeks 7-8",
    startWeek: 7,
    duration: 2,
    summary: "Stabilize, triage, and optimize after launch.",
  },
  {
    name: "Maintenance",
    weeksLabel: "Week 9+",
    startWeek: 9,
    duration: 1,
    summary: "Run ongoing support, enhancements, and lifecycle improvements.",
    isOngoing: true,
  },
] as const;

const weekHeaders = [
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "W7",
  "W8",
  "W9+",
] as const;
const totalTimelineWeeks = weekHeaders.length;

type DevelopmentPlanPageProps = {
  className?: string;
};

export function DevelopmentPlanPage({ className }: DevelopmentPlanPageProps) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl space-y-4", className)}>
      <div className="rounded-[12px] border border-border/70 bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),radial-gradient(circle_at_top_right,oklch(0.6489_0.1708_28.21/0.1),transparent_45%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Development Plan
        </p>
        <h2 className="mt-2 text-xl sm:text-2xl">
          High-level roadmap from design through launch and steady-state operations.
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          The program runs across an 8-week delivery and stabilization window,
          then transitions into ongoing maintenance from week 9 onward.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {planHighlights.map((highlight) => (
            <p
              key={highlight}
              className="border border-border/70 bg-background/75 px-3 py-2 text-xs text-muted-foreground"
            >
              {highlight}
            </p>
          ))}
        </div>

        <div className="mt-6 hidden border border-border/70 bg-background/75 md:block">
          <div className="max-h-[420px] overflow-auto">
            <div className="min-w-[2120px]">
              <div className="sticky top-0 z-50 grid grid-cols-[320px_minmax(1800px,1fr)]">
                <p className="sticky left-0 z-[60] border-b border-r border-border/70 bg-sidebar px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Phase
                </p>
                <div className="border-b border-border/60 bg-sidebar">
                  <div className="grid grid-cols-[repeat(9,minmax(200px,1fr))]">
                    {weekHeaders.map((week, index) => (
                      <p
                        key={week}
                        className={cn(
                          "px-2 py-2.5 text-center text-[11px] uppercase tracking-[0.1em] text-muted-foreground",
                          index > 0 && "border-l border-border/60",
                          index === weekHeaders.length - 1 && "border-r",
                        )}
                      >
                        {week}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {planPhases.map((phase, index) => {
                const leftPercent =
                  ((phase.startWeek - 1) / totalTimelineWeeks) * 100;
                const widthPercent = (phase.duration / totalTimelineWeeks) * 100;
                const phaseElementBackgroundClass =
                  index % 2 === 0
                    ? "bg-[color-mix(in_oklch,var(--muted)_34%,white_66%)] border-border/90"
                    : "bg-[color-mix(in_oklch,var(--muted)_18%,white_82%)] border-border/85";

                return (
                  <div
                    key={phase.name}
                    className="grid grid-cols-[320px_minmax(1800px,1fr)]"
                  >
                    <div className="sticky left-0 z-20 border-b border-r border-border/70 bg-[color-mix(in_oklch,var(--background)_96%,white_4%)] px-4 py-3">
                      <p className="text-sm">{phase.name}</p>
                      <p className="text-xs text-muted-foreground">{phase.weeksLabel}</p>
                    </div>

                    <div className="border-b border-border/60 bg-background/55">
                      <div className="relative min-h-[92px]">
                        <div className="pointer-events-none absolute inset-0 grid grid-cols-[repeat(9,minmax(200px,1fr))]">
                          {weekHeaders.map((week, index) => (
                            <div
                              key={`${phase.name}-${week}`}
                              className={cn(
                                index > 0 && "border-l border-border/60",
                                index === weekHeaders.length - 1 && "border-r",
                              )}
                            />
                          ))}
                        </div>

                        <div
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          className="absolute inset-y-2 z-10 px-1.5"
                        >
                          <div
                            className={cn(
                              "h-full border px-3 py-2 text-xs leading-relaxed",
                              phaseElementBackgroundClass,
                            )}
                          >
                            {phase.summary}
                            {phase.isOngoing ? " Ongoing." : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2 md:hidden">
          {planPhases.map((phase, index) => (
            <article
              key={phase.name}
              className={cn(
                "border border-border/70 p-3",
                index % 2 === 0
                  ? "bg-[color-mix(in_oklch,var(--muted)_20%,white_80%)]"
                  : "bg-[color-mix(in_oklch,var(--muted)_10%,white_90%)]",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm">{phase.name}</h3>
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  {phase.weeksLabel}
                </p>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {phase.summary}
                {phase.isOngoing ? " Ongoing." : null}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
