import { cn } from "@/lib/utils";

type QuoteLineItem = {
  category: "Development" | "Maintenance" | "Infra" | "AI" | "Support";
  description: string;
  cost?: number;
  estimatedMinCost?: number;
  estimatedMaxCost?: number;
  cadence: "one-time" | "monthly";
  variableCostPerRestaurant?: number;
  isEstimate?: boolean;
};

const quoteLineItems: readonly QuoteLineItem[] = [
  {
    category: "Development",
    description:
      "Implementation of the platform experience across web and mobile, including core product features and delivery workflows.",
    cost: 60000,
    cadence: "one-time",
  },
  {
    category: "Maintenance",
    description:
      "Post-launch support, bug fixing, security monitoring, and iterative enhancements to keep the platform stable and aligned with operations.",
    cost: 1000,
    cadence: "monthly",
  },
  {
    category: "Infra",
    description:
      "Infrastructure setup and operational costs for hosting, environments, observability, and reliability foundations.",
    estimatedMinCost: 100,
    estimatedMaxCost: 200,
    cadence: "monthly",
    isEstimate: true,
  },
  {
    category: "AI",
    description:
      "Agent capabilities, model usage, and AI-related orchestration required to power assistant-driven workflows.",
    estimatedMinCost: 200,
    estimatedMaxCost: 300,
    cadence: "monthly",
    isEstimate: true,
  },
  {
    category: "Support",
    description:
      "User support to help restaurant teams adopt the product and utilize the app effectively in day-to-day operations.",
    cadence: "monthly",
    variableCostPerRestaurant: 100,
  },
] as const;

type QuotePageProps = {
  className?: string;
};

export function QuotePage({ className }: QuotePageProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    }).format(value);
  const formatRange = (min: number, max: number) => {
    const minLabel = formatCurrency(min);
    const maxLabel = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(max);

    return `${minLabel}-${maxLabel}`;
  };

  const projectCost = quoteLineItems.reduce(
    (total, item) =>
      item.cadence === "one-time" && typeof item.cost === "number"
        ? total + item.cost
        : total,
    0,
  );
  const ongoingMonthlyBaseMinCost = quoteLineItems.reduce((total, item) => {
    if (item.cadence !== "monthly") {
      return total;
    }
    if (typeof item.cost === "number") {
      return total + item.cost;
    }
    if (typeof item.estimatedMinCost === "number") {
      return total + item.estimatedMinCost;
    }
    return total;
  }, 0);
  const ongoingMonthlyBaseMaxCost = quoteLineItems.reduce((total, item) => {
    if (item.cadence !== "monthly") {
      return total;
    }
    if (typeof item.cost === "number") {
      return total + item.cost;
    }
    if (typeof item.estimatedMaxCost === "number") {
      return total + item.estimatedMaxCost;
    }
    return total;
  }, 0);
  const formatLineItemCost = (item: QuoteLineItem) => {
    const perRestaurantLabel =
      typeof item.variableCostPerRestaurant === "number"
        ? `${formatCurrency(item.variableCostPerRestaurant)}/month/site`
        : null;

    if (
      typeof item.estimatedMinCost === "number" &&
      typeof item.estimatedMaxCost === "number"
    ) {
      const baseLabel = `${formatRange(item.estimatedMinCost, item.estimatedMaxCost)}${item.cadence === "monthly" ? "/month" : ""}`;
      return perRestaurantLabel
        ? `${baseLabel} + ${perRestaurantLabel}`
        : baseLabel;
    }
    if (typeof item.cost === "number") {
      const baseLabel = `${formatCurrency(item.cost)}${item.cadence === "monthly" ? "/month" : ""}`;
      return perRestaurantLabel
        ? `${baseLabel} + ${perRestaurantLabel}`
        : baseLabel;
    }
    return (
      perRestaurantLabel ??
      (item.cadence === "monthly" ? "USD 0/month" : "USD 0")
    );
  };
  const monthlyBaseLabel =
    ongoingMonthlyBaseMinCost === ongoingMonthlyBaseMaxCost
      ? `${formatCurrency(ongoingMonthlyBaseMinCost)}/month`
      : `${formatRange(ongoingMonthlyBaseMinCost, ongoingMonthlyBaseMaxCost)}/month`;

  const monthlyIncludesEstimates = quoteLineItems.some(
    (item) => item.cadence === "monthly" && item.isEstimate,
  );
  const supportLineItem = quoteLineItems.find(
    (item) => item.category === "Support",
  );
  const supportVariablePerRestaurant =
    supportLineItem?.variableCostPerRestaurant ?? 0;

  return (
    <section className={cn("mx-auto w-full max-w-7xl space-y-4", className)}>
      <div className="rounded-[12px] border border-border/70 bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),radial-gradient(circle_at_top_right,oklch(0.6489_0.1708_28.21/0.1),transparent_45%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Quote
        </p>
        <h2 className="mt-2 text-xl sm:text-2xl">
          Project quote structure for delivery and ongoing operations.
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Budget is split by delivery and operational workstreams to make scope,
          ownership, and monthly run costs clear.
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-5">
          <article className="border border-border/70 bg-background/80 p-4 xl:col-span-1">
            <p className="text-xs uppercase tracking-[0.12em] text-black">
              Project Cost
            </p>
            <p className="mt-2 text-2xl">{formatCurrency(projectCost)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              One-time build and implementation.
            </p>
          </article>
          <article className="border border-border/70 bg-background/80 p-4 xl:col-span-4">
            <p className="text-xs uppercase tracking-[0.12em] text-black">
              Ongoing Monthly Cost
            </p>
            <p className="mt-2 text-2xl">
              {monthlyBaseLabel} +{" "}
              {formatCurrency(supportVariablePerRestaurant)}/month/site
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Includes Maintenance, Infra, AI, and user support.
            </p>
            {monthlyIncludesEstimates ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Infra and AI are usage-based estimates and actual costs cannot
                be forecast exactly in advance.
              </p>
            ) : null}
          </article>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Detailed Pricing
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {quoteLineItems.map((item) => (
            <article
              key={item.category}
              className="flex h-full flex-col border border-border/70 bg-background/75 p-4"
            >
              <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {item.category}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-auto pt-3">
                <p className="inline-flex self-start border border-border/70 bg-background px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-black">
                  {formatLineItemCost(item)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 border border-border/70 bg-background/80 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Commercial Terms
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Infra and AI costs are estimates based on expected platform activity
            and may vary with actual usage.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A one-month notice is required to stop ongoing monthly services.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Project cost remains open to discussion based on final scope and
            rollout plan across restaurants.
          </p>
        </div>
      </div>
    </section>
  );
}
