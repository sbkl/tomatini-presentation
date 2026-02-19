import { TargetIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PresentationIntroSectionProps = {
  badge: string;
  title: string;
  description: string;
  objective: string;
  goals: readonly string[];
  className?: string;
};

export function PresentationIntroSection({
  badge,
  title,
  description,
  objective,
  goals,
  className,
}: PresentationIntroSectionProps) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl space-y-4", className)}>
      <div className="rounded-[12px] border border-border/70 bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),radial-gradient(circle_at_top_right,oklch(0.6489_0.1708_28.21/0.1),transparent_45%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {badge}
        </p>
        <h2 className="mt-2 text-xl sm:text-2xl">{title}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="border border-border/70 bg-background/70 p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <TargetIcon className="size-3.5" />
              Objective
            </p>
            <p className="mt-2 text-sm leading-relaxed">{objective}</p>
          </div>
          <div className="border border-border/70 bg-background/70 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Goals
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
              {goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
