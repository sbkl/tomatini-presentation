"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangleIcon,
  MessageCircleIcon,
  MicIcon,
  SendHorizontalIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebAppPageHeader } from "@/components/web-app-page-header";
import { cn } from "@/lib/utils";

type TeamsTabKey = "overview" | "gaps" | "actions";

type SimulationMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type TeamOverviewMetric = {
  id: string;
  label: string;
  value: string;
  note: string;
  delta: string;
  deltaTone: "positive" | "warning" | "neutral";
};

type TeamModuleProgress = {
  id: string;
  module: string;
  audience: string;
  completion: number;
  correctness: number;
  stalledLearners: number;
};

type SkillGapRecord = {
  id: string;
  teamMember: string;
  role: string;
  module: string;
  gapArea: string;
  currentScore: number;
  completion: number;
  risk: "High" | "Medium" | "Low";
  discussionOwner: string;
  coachingSuggestion: string;
};

type ManagerActionItem = {
  id: string;
  timeframe: "Today" | "This Week";
  priority: "High" | "Medium";
  title: string;
  owner: string;
  dueDate: string;
  expectedOutcome: string;
};

const fixedContext = {
  restaurantId: "dubai",
  restaurantLabel: "Dubai",
  reportWindowLabel: "Week of 2026-02-16",
};

const outlinedSecondaryBadgeClass =
  "border-secondary/55 text-secondary bg-transparent";

const teamOverviewMetrics: TeamOverviewMetric[] = [
  {
    id: "metric-completion",
    label: "Team Completion",
    value: "84%",
    note: "Across active modules",
    delta: "+2.1 pts vs last week",
    deltaTone: "positive",
  },
  {
    id: "metric-correctness",
    label: "Average Correctness",
    value: "87%",
    note: "Assessment attempts",
    delta: "+1.4 pts vs last week",
    deltaTone: "positive",
  },
  {
    id: "metric-at-risk",
    label: "At-Risk Learners",
    value: "7",
    note: "No progress in 7+ days",
    delta: "3 need immediate follow-up",
    deltaTone: "warning",
  },
  {
    id: "metric-overdue",
    label: "Overdue Assessments",
    value: "5",
    note: "Due before 2026-02-21",
    delta: "2 from Fish Station",
    deltaTone: "neutral",
  },
];

const teamModuleProgress: TeamModuleProgress[] = [
  {
    id: "module-carpaccios-l1",
    module: "Carpaccios L1",
    audience: "Fish Station Team",
    completion: 86,
    correctness: 88,
    stalledLearners: 2,
  },
  {
    id: "module-fish-seafood-l1",
    module: "Fish & Seafood L1",
    audience: "Fish Station Team",
    completion: 79,
    correctness: 84,
    stalledLearners: 3,
  },
  {
    id: "module-service-rituals-l1",
    module: "LPM Service Rituals L1",
    audience: "FOH Team",
    completion: 89,
    correctness: 91,
    stalledLearners: 1,
  },
  {
    id: "module-cocktail-l1",
    module: "Cocktail Fundamentals L1",
    audience: "Bar Team",
    completion: 82,
    correctness: 86,
    stalledLearners: 1,
  },
];

const skillGaps: SkillGapRecord[] = [
  {
    id: "gap-sara",
    teamMember: "Sara M.",
    role: "Commis",
    module: "Carpaccios L1",
    gapArea: "Allergen-first pass communication",
    currentScore: 74,
    completion: 80,
    risk: "High",
    discussionOwner: "Fish Chef de Partie",
    coachingSuggestion:
      "Run two live pass checks this week and rehearse allergen callout sequence before pickup.",
  },
  {
    id: "gap-noah",
    teamMember: "Noah P.",
    role: "Junior Fish Cook",
    module: "Fish & Seafood L1",
    gapArea: "Doneness calibration on sea bass",
    currentScore: 77,
    completion: 75,
    risk: "High",
    discussionOwner: "Sous Chef",
    coachingSuggestion:
      "Pair on first two fish fires each service and log doneness variance at pass handoff.",
  },
  {
    id: "gap-lina",
    teamMember: "Lina A.",
    role: "Runner",
    module: "LPM Service Rituals L1",
    gapArea: "Table rhythm and reset timing",
    currentScore: 81,
    completion: 72,
    risk: "Medium",
    discussionOwner: "FOH Manager",
    coachingSuggestion:
      "Shadow one peak dinner section and review reset timing against station standard.",
  },
  {
    id: "gap-adam",
    teamMember: "Adam R.",
    role: "Bartender",
    module: "Cocktail Fundamentals L1",
    gapArea: "Specs consistency under rush",
    currentScore: 83,
    completion: 78,
    risk: "Medium",
    discussionOwner: "Bar Manager",
    coachingSuggestion:
      "Run a timed 6-drink spec drill before service and track variance per build.",
  },
  {
    id: "gap-julien",
    teamMember: "Julien D.",
    role: "Junior Fish Cook",
    module: "Carpaccios L1",
    gapArea: "Slicing uniformity",
    currentScore: 88,
    completion: 92,
    risk: "Low",
    discussionOwner: "Fish Chef de Partie",
    coachingSuggestion:
      "Maintain cadence checks at prep start to preserve consistency through peak.",
  },
];

const managerActions: ManagerActionItem[] = [
  {
    id: "action-1",
    timeframe: "Today",
    priority: "High",
    title: "Review Fish Station gap list with Sous Chef",
    owner: "General Manager",
    dueDate: "2026-02-18",
    expectedOutcome:
      "Confirm coaching owners for Sara M. and Noah P. and lock service-floor check-ins.",
  },
  {
    id: "action-2",
    timeframe: "Today",
    priority: "High",
    title: "Schedule targeted reassessment for Carpaccios L1",
    owner: "Training Manager",
    dueDate: "2026-02-19",
    expectedOutcome:
      "Reassessment slots assigned for all learners below 80% correctness.",
  },
  {
    id: "action-3",
    timeframe: "This Week",
    priority: "Medium",
    title: "Run FOH table-rhythm practice in pre-shift",
    owner: "FOH Manager",
    dueDate: "2026-02-20",
    expectedOutcome:
      "Lina A. and two peers complete one observed service simulation.",
  },
  {
    id: "action-4",
    timeframe: "This Week",
    priority: "Medium",
    title: "Bar spec consistency drill before Friday peak",
    owner: "Bar Manager",
    dueDate: "2026-02-21",
    expectedOutcome:
      "Cocktail Fundamentals L1 team posts at least 88% drill accuracy.",
  },
];

const oneToOnePrompts = [
  "Which training step feels least clear when the station gets busy?",
  "Where do you lose pace first: prep, execution, or pass communication?",
  "Which teammate should shadow you this week to close the specific gap?",
  "What measurable result should we see by your next reassessment?",
];

const sharedSimulatedChat: SimulationMessage[] = [
  {
    id: "chat-1",
    role: "user",
    content:
      "How is the Dubai team trending this week on Carpaccios L1 and Fish & Seafood L1?",
  },
  {
    id: "chat-2",
    role: "assistant",
    content:
      "Completion is stable on Carpaccios L1, but Fish & Seafood L1 has 3 stalled learners. Start with Sara M. and Noah P.; both are below target on core pass-critical skills.",
  },
  {
    id: "chat-3",
    role: "user",
    content:
      "Who should I discuss with first about the training gaps and what should they coach on?",
  },
  {
    id: "chat-4",
    role: "assistant",
    content:
      "Discuss Sara M. with the Fish Chef de Partie for allergen callouts, then Noah P. with the Sous Chef for doneness calibration. Both should be observed in live service before reassessment.",
  },
];

function riskBadgeClass(risk: SkillGapRecord["risk"]) {
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

function metricDeltaClass(tone: TeamOverviewMetric["deltaTone"]) {
  if (tone === "positive") {
    return "text-emerald-700";
  }
  if (tone === "warning") {
    return "text-amber-700";
  }
  return "text-muted-foreground";
}

export function TeamsContent() {
  const idCounterRef = useRef(0);
  const nextId = (prefix: string) => {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  };

  const [activeTab, setActiveTab] = useState<TeamsTabKey>("overview");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatPrompt, setChatPrompt] = useState("");
  const [simulationMessages, setSimulationMessages] =
    useState<SimulationMessage[]>(sharedSimulatedChat);

  const discussionsThisWeek = useMemo(
    () =>
      [...skillGaps].sort((a, b) => {
        const riskWeight = { High: 3, Medium: 2, Low: 1 };
        const riskDiff = riskWeight[b.risk] - riskWeight[a.risk];
        if (riskDiff !== 0) {
          return riskDiff;
        }
        return a.currentScore - b.currentScore;
      }),
    [],
  );

  const handleSimulationSend = () => {
    const prompt = chatPrompt.trim();
    if (!prompt) {
      return;
    }

    setSimulationMessages((previous) => [
      ...previous,
      {
        id: nextId("chat"),
        role: "user",
        content: prompt,
      },
      {
        id: nextId("chat"),
        role: "assistant",
        content:
          "Current recommendation: prioritize High-risk learners first, assign a coaching owner, and confirm one service-floor observation before reassessment.",
      },
    ]);
    setChatPrompt("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WebAppPageHeader
        title="Teams"
        actions={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={isChatOpen ? "Hide chat" : "Show chat"}
            title={isChatOpen ? "Hide chat" : "Show chat"}
            onClick={() => setIsChatOpen((previous) => !previous)}
          >
            <MessageCircleIcon />
          </Button>
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TeamsTabKey)}
        className="min-h-0 flex-1"
      >
        <div className="min-h-0 flex-1 p-4">
          <div className="flex h-full min-h-0 gap-3">
            <section
              className={cn(
                "min-h-0 shrink-0 overflow-hidden transition-[width,opacity,transform] duration-300 ease-out",
                isChatOpen
                  ? "w-[clamp(18rem,38%,30rem)] opacity-100 translate-x-0"
                  : "w-0 min-w-0 opacity-0 -translate-x-12 pointer-events-none",
              )}
            >
              <div className="flex h-full min-h-0 flex-col gap-3">
                <div className="min-h-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-4 p-2 pr-3">
                      {simulationMessages.map((message) =>
                        message.role === "assistant" ? (
                          <p
                            key={message.id}
                            className="max-w-[88%] text-xs leading-relaxed text-foreground/90"
                          >
                            {message.content}
                          </p>
                        ) : (
                          <div
                            key={message.id}
                            className="ml-auto w-fit max-w-[88%] border border-primary/35 bg-primary/12 p-2 text-xs leading-relaxed"
                          >
                            {message.content}
                          </div>
                        ),
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <InputGroup className="h-auto border-secondary/55 bg-background shadow-[0_0_0_1px_color-mix(in_oklch,var(--secondary)_28%,transparent),0_16px_24px_-22px_oklch(0.6489_0.1708_28.21)]">
                  <InputGroupTextarea
                    value={chatPrompt}
                    onChange={(event) => setChatPrompt(event.target.value)}
                    className="min-h-20 placeholder:text-foreground/45"
                    placeholder="Ask about team progress, gaps, and coaching priorities..."
                    onKeyDown={(event) => {
                      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                        event.preventDefault();
                        handleSimulationSend();
                      }
                    }}
                  />
                  <InputGroupAddon
                    align="block-end"
                    className="border-t border-border/85 pt-2"
                  >
                    <InputGroupText className="text-foreground/70">
                      Press Cmd/Ctrl + Enter to send
                    </InputGroupText>
                    <div className="ml-auto flex items-center gap-2">
                      <InputGroupButton
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Voice input"
                        title="Voice input"
                        onClick={() =>
                          setSimulationMessages((previous) => [
                            ...previous,
                            {
                              id: nextId("chat"),
                              role: "assistant",
                              content:
                                "Voice capture is not connected yet in this preview.",
                            },
                          ])
                        }
                      >
                        <MicIcon />
                      </InputGroupButton>
                      <InputGroupButton
                        variant="default"
                        size="icon-sm"
                        aria-label="Send teams prompt"
                        title="Send"
                        onClick={handleSimulationSend}
                      >
                        <SendHorizontalIcon />
                      </InputGroupButton>
                    </div>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </section>

            <section className="min-w-0 flex-1 min-h-0 overflow-hidden border border-border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_26%,white_74%),var(--background))]">
              <div className="border-b border-border/70 bg-background/70 px-3 py-2">
                <TabsList variant="line" className="w-full sm:w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="gaps">Gaps</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="min-h-0 h-full">
                <div className="space-y-3 p-3">
                  <TabsContent value="overview" className="space-y-6">
                    <section className="space-y-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-[0.12em]">
                          Team Snapshot
                        </h3>
                        <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
                          {fixedContext.restaurantLabel} · {fixedContext.reportWindowLabel}
                        </Badge>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        {teamOverviewMetrics.map((metric) => (
                          <article
                            key={metric.id}
                            className="border border-border bg-background px-3 py-2"
                          >
                            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.14em]">
                              {metric.label}
                            </p>
                            <p className="mt-1 text-lg leading-none">{metric.value}</p>
                            <p className="text-muted-foreground mt-1 text-xs">{metric.note}</p>
                            <p
                              className={cn(
                                "mt-1 text-[11px] leading-tight",
                                metricDeltaClass(metric.deltaTone),
                              )}
                            >
                              {metric.delta}
                            </p>
                          </article>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h3 className="text-sm uppercase tracking-[0.12em]">
                        Module Performance By Team
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-muted/45 border-b border-border">
                              <th className="px-3 py-2 text-left">Module</th>
                              <th className="px-3 py-2 text-left">Audience</th>
                              <th className="px-3 py-2 text-left">Completion</th>
                              <th className="px-3 py-2 text-left">Avg Correctness</th>
                              <th className="px-3 py-2 text-left">Stalled</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamModuleProgress.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b border-border last:border-b-0"
                              >
                                <td className="px-3 py-2">{item.module}</td>
                                <td className="text-muted-foreground px-3 py-2">
                                  {item.audience}
                                </td>
                                <td className="px-3 py-2">{item.completion}%</td>
                                <td className="px-3 py-2">{item.correctness}%</td>
                                <td className="px-3 py-2">{item.stalledLearners}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h3 className="text-sm uppercase tracking-[0.12em]">
                        Who To Discuss This Week
                      </h3>
                      <div className="divide-y divide-border">
                        {discussionsThisWeek.slice(0, 4).map((record) => (
                          <article key={`discussion-${record.id}`} className="space-y-1 py-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm">{record.teamMember}</p>
                              <Badge
                                variant="outline"
                                className={riskBadgeClass(record.risk)}
                              >
                                {record.risk}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {record.role} · {record.module}
                            </p>
                            <p className="text-xs">Gap: {record.gapArea}</p>
                            <p className="text-muted-foreground text-xs">
                              Discuss with: {record.discussionOwner}
                            </p>
                          </article>
                        ))}
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="gaps">
                    <div className="overflow-x-auto border border-border bg-background">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/45 border-b border-border">
                            <th className="min-w-[15rem] px-3 py-2 text-left">
                              Team Member
                            </th>
                            <th className="px-3 py-2 text-left">Role</th>
                            <th className="px-3 py-2 text-left">Module</th>
                            <th className="px-3 py-2 text-left">Weak Competency</th>
                            <th className="px-3 py-2 text-left">Current</th>
                            <th className="px-3 py-2 text-left">Risk</th>
                            <th className="px-3 py-2 text-left">Discussion Owner</th>
                          </tr>
                        </thead>
                        <tbody>
                          {skillGaps.map((record) => (
                            <tr
                              key={record.id}
                              className="border-b border-border align-top last:border-b-0"
                            >
                              <td className="min-w-[15rem] px-3 py-2">
                                <p>{record.teamMember}</p>
                                <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                                  {record.coachingSuggestion}
                                </p>
                              </td>
                              <td className="text-muted-foreground px-3 py-2">
                                {record.role}
                              </td>
                              <td className="px-3 py-2">{record.module}</td>
                              <td className="px-3 py-2">{record.gapArea}</td>
                              <td className="px-3 py-2">
                                {record.currentScore}% score · {record.completion}% completion
                              </td>
                              <td className="px-3 py-2">
                                <Badge
                                  variant="outline"
                                  className={riskBadgeClass(record.risk)}
                                >
                                  <AlertTriangleIcon className="size-3" />
                                  {record.risk}
                                </Badge>
                              </td>
                              <td className="px-3 py-2">{record.discussionOwner}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-6">
                    <section className="space-y-3 border border-border bg-background p-3">
                      <h3 className="text-sm uppercase tracking-[0.12em]">
                        Priority Action Queue
                      </h3>
                      <div className="space-y-2">
                        {managerActions.map((action) => (
                          <article
                            key={action.id}
                            className="space-y-1 border border-border bg-background p-3"
                          >
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge
                                variant="outline"
                                className={outlinedSecondaryBadgeClass}
                              >
                                {action.timeframe}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={priorityBadgeClass(action.priority)}
                              >
                                {action.priority}
                              </Badge>
                            </div>
                            <p className="text-sm">{action.title}</p>
                            <p className="text-muted-foreground text-xs">
                              Owner: {action.owner} · Due: {action.dueDate}
                            </p>
                            <p className="text-xs">Success check: {action.expectedOutcome}</p>
                          </article>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-3 border border-border bg-background p-3">
                      <h3 className="text-sm uppercase tracking-[0.12em]">
                        Recommended 1:1 Agenda Prompts
                      </h3>
                      <ol className="space-y-1 pl-4 text-xs list-decimal">
                        {oneToOnePrompts.map((prompt) => (
                          <li key={prompt} className="leading-relaxed">
                            {prompt}
                          </li>
                        ))}
                      </ol>
                    </section>
                  </TabsContent>
                </div>
              </ScrollArea>
            </section>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
