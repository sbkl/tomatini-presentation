"use client";

import {
  CheckIcon,
  CircleCheckIcon,
  Clock3Icon,
  LoaderCircleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  dubaiFohTrainingModules,
  type ModuleSection,
} from "@/lib/mobile-training-modules-data";
import { cn } from "@/lib/utils";

const outlinedSecondaryBadgeClass =
  "border-secondary/55 text-secondary bg-transparent";

const sections: {
  id: ModuleSection;
  title: string;
  icon: typeof Clock3Icon;
  dotClassName: string;
  iconClassName: string;
}[] = [
  {
    id: "to-start",
    title: "Pending",
    icon: Clock3Icon,
    dotClassName: "bg-orange-500/15 border-orange-600/45",
    iconClassName: "text-orange-700",
  },
  {
    id: "active",
    title: "In Progress",
    icon: LoaderCircleIcon,
    dotClassName: "bg-blue-500/15 border-blue-600/45",
    iconClassName: "text-blue-700",
  },
  {
    id: "completed",
    title: "Completed",
    icon: CircleCheckIcon,
    dotClassName: "bg-emerald-500/15 border-emerald-600/45",
    iconClassName: "text-emerald-700",
  },
];

export function MobileTrainingModulesContent() {
  return (
    <div className="space-y-3">
      <section className="border-border/70 space-y-2 border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_35%,white_65%),color-mix(in_oklch,var(--background)_90%,var(--muted)_10%))] p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm leading-none">Dubai</p>
          <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
            FOH Training
          </Badge>
        </div>
        <p className="text-muted-foreground text-[11px] leading-snug">
          Personal learning path for front-of-house service excellence.
        </p>
      </section>

      <div className="mt-8 space-y-10">
        {sections.map((section) => {
          const modules = dubaiFohTrainingModules.filter(
            (module) => module.section === section.id,
          );

          return (
            <section key={section.id} className="space-y-2">
              <h3 className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em]">
                <span
                  className={cn(
                    "inline-flex size-4 items-center justify-center rounded-full border",
                    section.dotClassName,
                  )}
                >
                  <section.icon className={cn("size-2.5", section.iconClassName)} />
                </span>
                {section.title}
              </h3>
              <div className="space-y-2">
                {modules.map((module) => (
                  <Card key={module.id} size="sm" className="border-border/70">
                    <CardHeader className="border-b border-border/60 pb-2.5">
                      <CardTitle className="text-sm leading-tight">{module.title}</CardTitle>
                      <CardDescription className="text-[11px] leading-snug">
                        {module.goal}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-3">
                      <p className="text-muted-foreground text-[11px] leading-snug">
                        {module.description}
                      </p>
                      <ModuleProgress
                        progress={module.progress}
                        section={module.section}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ModuleProgress({
  progress,
  section,
}: {
  progress: number;
  section: ModuleSection;
}) {
  const resolvedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="space-y-1.5">
      <div className="bg-muted/45 h-1.5 w-full border border-border/70">
        <div
          className={cn(
            "h-full transition-[width] duration-300",
            section === "active" && "bg-secondary",
            section === "completed" && "bg-emerald-600/75",
            section === "to-start" && "bg-muted-foreground/35",
          )}
          style={{ width: `${resolvedProgress}%` }}
        />
      </div>
      <div className="text-muted-foreground flex items-center justify-between text-[10px]">
        <span>{resolvedProgress}%</span>
        {section === "completed" ? (
          <CheckIcon className="size-3 text-emerald-700" />
        ) : null}
      </div>
    </div>
  );
}
