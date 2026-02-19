import { cn } from "@/lib/utils";

type AgentCard = {
  name: string;
  roleDescription: string;
  availabilityLabel: string;
};

const agentCards: readonly AgentCard[] = [
  {
    name: "Agent Architect",
    roleDescription:
      "Defines and maintains the soul of each agent, shaping behavior, tone, and role boundaries across the full agent ecosystem.",
    availabilityLabel: "Web app only",
  },
  {
    name: "Chef Agent",
    roleDescription:
      "Helps create recipes, adapts to the chef mindset of each client restaurant, and ensures the required information is complete to define a recipe clearly.",
    availabilityLabel: "Web app only",
  },
  {
    name: "Trainer Agent",
    roleDescription:
      "Helps build high-quality training module content that is structured, practical, and ready for team execution.",
    availabilityLabel: "Web app only",
  },
  {
    name: "Coach Agent",
    roleDescription:
      "Reviews team performance and advises GMs and team managers on how to support their teams through targeted training actions.",
    availabilityLabel: "Web app only",
  },
  {
    name: "Host Agent",
    roleDescription:
      "Supports general chat over the client knowledge base across training materials, company culture, and policies, while also helping with team coaching.",
    availabilityLabel: "Mobile app only",
  },
];

type AgentsDrivenPageProps = {
  className?: string;
};

export function AgentsDrivenPage({ className }: AgentsDrivenPageProps) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl space-y-4", className)}>
      <div className="rounded-[12px] border border-border/70 bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),radial-gradient(circle_at_top_right,oklch(0.6489_0.1708_28.21/0.1),transparent_45%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Agents Driven
        </p>
        <h2 className="mt-2 text-xl sm:text-2xl">
          A role-focused agent ecosystem that powers recipe, training, and team
          performance workflows.
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Each agent has a clear scope, operational intent, and platform
          availability so teams always know which assistant to use for each
          task.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {agentCards.map((agent) => (
            <article
              key={agent.name}
              className="border border-border/70 bg-background/75 p-4"
            >
              <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {agent.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {agent.roleDescription}
              </p>
              <p className="mt-3 inline-flex border border-border/70 bg-background px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {agent.availabilityLabel}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
