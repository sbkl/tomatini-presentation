import { cn } from "@/lib/utils";

type IntegrationTrack = {
  title: string;
  outcome: string;
};

const integrationTracks: readonly IntegrationTrack[] = [
  {
    title: "Employees Onboarding Sync",
    outcome:
      "When someone joins or changes role in Factorial, Tomatini automatically creates or updates the learner profile and training path.",
  },
  {
    title: "Training Content Sync",
    outcome:
      "Tomatini stays the source of truth for content, while training catalog and assignment progress are shared with Factorial.",
  },
  {
    title: "KPI Sync",
    outcome:
      "Completion, correctness, and retention KPIs from Tomatini are published to Factorial for HR and manager visibility.",
  },
];

type FactorialIntegrationPageProps = {
  className?: string;
};

export function FactorialIntegrationPage({
  className,
}: FactorialIntegrationPageProps) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl space-y-4", className)}>
      <div className="rounded-[12px] border border-border/70 bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),radial-gradient(circle_at_top_right,oklch(0.6489_0.1708_28.21/0.1),transparent_45%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Factorial Integration
        </p>
        <h2 className="mt-2 text-xl sm:text-2xl">
          Tomatini is the training source of truth, while Factorial is the HR system of record.
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Integration starts with onboarding, training content visibility, and KPI
          sync.
        </p>

        <div className="mt-4 border border-border/70 bg-background/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Target Integration
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            One connected flow from employee onboarding to training delivery and KPI reporting:
            Tomatini powers training truth, Factorial centralizes HR visibility.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {integrationTracks.map((track) => (
            <article
              key={track.title}
              className="border border-border/70 bg-background/75 p-4"
            >
              <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {track.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {track.outcome}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Final integration scope, priorities, and sequencing will be confirmed
          during the project discovery phase.
        </p>
      </div>
    </section>
  );
}
