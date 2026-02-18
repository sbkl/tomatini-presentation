"use client";

import { useMemo, useState } from "react";
import {
  ChevronsUpDownIcon,
  Clock3Icon,
  SearchIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WebAppPageHeader } from "@/components/web-app-page-header";
import { cn } from "@/lib/utils";

type ModuleCategory =
  | "Appetizers & Cold Starters"
  | "Carpaccios"
  | "Desserts"
  | "Fish & Seafood"
  | "Hot Starters"
  | "Meat"
  | "Mocktails"
  | "Sommelier Foundations"
  | "Cocktail Fundamentals"
  | "LPM Service Rituals";

type ModuleLevel = 1 | 2;
type ModuleAudience =
  | "Cold Kitchen Team"
  | "Hot Kitchen Team"
  | "Pastry Team"
  | "Fish Station Team"
  | "Grill Team"
  | "Bar Team"
  | "Sommelier Team"
  | "FOH Team";
type ModuleStatus = "Active" | "Upcoming" | "Needs Review";

type TrainingModule = {
  id: string;
  title: string;
  category: ModuleCategory;
  level: ModuleLevel;
  audience: ModuleAudience;
  durationMinutes: number;
  deliveryFormats: string[];
  status: ModuleStatus;
  summary: string;
};

const moduleCategories: ModuleCategory[] = [
  "Appetizers & Cold Starters",
  "Carpaccios",
  "Desserts",
  "Fish & Seafood",
  "Hot Starters",
  "Meat",
  "Mocktails",
  "Sommelier Foundations",
  "Cocktail Fundamentals",
  "LPM Service Rituals",
];

const moduleAudiences: ModuleAudience[] = [
  "Cold Kitchen Team",
  "Hot Kitchen Team",
  "Pastry Team",
  "Fish Station Team",
  "Grill Team",
  "Bar Team",
  "Sommelier Team",
  "FOH Team",
];

const trainingModules: TrainingModule[] = [
  {
    id: "acs-l1",
    title: "Appetizers & Cold Starters",
    category: "Appetizers & Cold Starters",
    level: 1,
    audience: "Cold Kitchen Team",
    durationMinutes: 60,
    deliveryFormats: ["PDF", "Slides", "Station Demo"],
    status: "Active",
    summary: "Foundational mise-en-place, plating rhythm, and quality checks.",
  },
  {
    id: "acs-l2",
    title: "Appetizers & Cold Starters",
    category: "Appetizers & Cold Starters",
    level: 2,
    audience: "Cold Kitchen Team",
    durationMinutes: 75,
    deliveryFormats: ["PDF", "Slides", "Assessment"],
    status: "Needs Review",
    summary:
      "Advanced garnish standards and faster service sequencing for peak periods.",
  },
  {
    id: "carpaccios-l1",
    title: "Carpaccios",
    category: "Carpaccios",
    level: 1,
    audience: "Fish Station Team",
    durationMinutes: 55,
    deliveryFormats: ["PDF", "Slides", "Knife Lab"],
    status: "Active",
    summary: "Core slicing precision, seasoning balance, and chilled pass handling.",
  },
  {
    id: "carpaccios-l2",
    title: "Carpaccios",
    category: "Carpaccios",
    level: 2,
    audience: "Fish Station Team",
    durationMinutes: 70,
    deliveryFormats: ["PDF", "Slides", "Assessment"],
    status: "Upcoming",
    summary: "Complex carpaccio sequencing with consistency checks under pressure.",
  },
  {
    id: "desserts-l1",
    title: "Desserts",
    category: "Desserts",
    level: 1,
    audience: "Pastry Team",
    durationMinutes: 60,
    deliveryFormats: ["PDF", "Slides", "Kitchen Practical"],
    status: "Active",
    summary: "Classic dessert assembly, timing, and finishing standards.",
  },
  {
    id: "desserts-l2",
    title: "Desserts",
    category: "Desserts",
    level: 2,
    audience: "Pastry Team",
    durationMinutes: 80,
    deliveryFormats: ["PDF", "Slides", "Assessment"],
    status: "Needs Review",
    summary:
      "Refined pastry execution and high-volume service calibration for finals.",
  },
  {
    id: "fish-seafood-l1",
    title: "Fish & Seafood",
    category: "Fish & Seafood",
    level: 1,
    audience: "Fish Station Team",
    durationMinutes: 65,
    deliveryFormats: ["PDF", "Slides", "Station Demo"],
    status: "Active",
    summary: "Seafood prep discipline, doneness control, and service communication.",
  },
  {
    id: "fish-seafood-l2",
    title: "Fish & Seafood",
    category: "Fish & Seafood",
    level: 2,
    audience: "Fish Station Team",
    durationMinutes: 85,
    deliveryFormats: ["PDF", "Slides", "Assessment"],
    status: "Upcoming",
    summary:
      "Advanced fish station throughput with sauce integration and pass accuracy.",
  },
  {
    id: "hot-starters-l1",
    title: "Hot Starters",
    category: "Hot Starters",
    level: 1,
    audience: "Hot Kitchen Team",
    durationMinutes: 60,
    deliveryFormats: ["PDF", "Slides", "Kitchen Practical"],
    status: "Active",
    summary: "Heat control, timing discipline, and first-pass presentation quality.",
  },
  {
    id: "hot-starters-l2",
    title: "Hot Starters",
    category: "Hot Starters",
    level: 2,
    audience: "Hot Kitchen Team",
    durationMinutes: 78,
    deliveryFormats: ["PDF", "Slides", "Assessment"],
    status: "Needs Review",
    summary:
      "Refined station coordination for complex hot starter finishing sequences.",
  },
  {
    id: "meat-l1",
    title: "Meat",
    category: "Meat",
    level: 1,
    audience: "Grill Team",
    durationMinutes: 68,
    deliveryFormats: ["PDF", "Slides", "Grill Practical"],
    status: "Active",
    summary:
      "Foundational grill standards, resting windows, and sauce pairing checks.",
  },
  {
    id: "meat-l2",
    title: "Meat",
    category: "Meat",
    level: 2,
    audience: "Grill Team",
    durationMinutes: 84,
    deliveryFormats: ["PDF", "Slides", "Assessment"],
    status: "Upcoming",
    summary: "Advanced doneness calibration with multi-fire service coordination.",
  },
  {
    id: "mocktails-l1",
    title: "Mocktails",
    category: "Mocktails",
    level: 1,
    audience: "Bar Team",
    durationMinutes: 48,
    deliveryFormats: ["PDF", "Slides", "Bar Demo"],
    status: "Active",
    summary:
      "Core non-alcoholic drink builds, garnish polish, and speed techniques.",
  },
  {
    id: "mocktails-l2",
    title: "Mocktails",
    category: "Mocktails",
    level: 2,
    audience: "Bar Team",
    durationMinutes: 62,
    deliveryFormats: ["PDF", "Slides", "Assessment"],
    status: "Needs Review",
    summary:
      "Signature mocktail program execution with batching and station handoff.",
  },
  {
    id: "sommelier-l1",
    title: "Sommelier Foundations",
    category: "Sommelier Foundations",
    level: 1,
    audience: "Sommelier Team",
    durationMinutes: 72,
    deliveryFormats: ["Slides", "Workshop", "Tasting Flight"],
    status: "Active",
    summary: "Wine service fundamentals, guest language, and core pairing logic.",
  },
  {
    id: "sommelier-l2",
    title: "Sommelier Foundations",
    category: "Sommelier Foundations",
    level: 2,
    audience: "Sommelier Team",
    durationMinutes: 90,
    deliveryFormats: ["Slides", "Workshop", "Blind Tasting"],
    status: "Upcoming",
    summary:
      "Regional depth and advanced pairing recommendations for premium guests.",
  },
  {
    id: "cocktail-fundamentals-l1",
    title: "Cocktail Fundamentals",
    category: "Cocktail Fundamentals",
    level: 1,
    audience: "Bar Team",
    durationMinutes: 56,
    deliveryFormats: ["Slides", "Workshop", "Bar Practical"],
    status: "Active",
    summary:
      "Classic cocktail framework, specs discipline, and service presentation.",
  },
  {
    id: "cocktail-fundamentals-l2",
    title: "Cocktail Fundamentals",
    category: "Cocktail Fundamentals",
    level: 2,
    audience: "Bar Team",
    durationMinutes: 74,
    deliveryFormats: ["Slides", "Workshop", "Assessment"],
    status: "Needs Review",
    summary: "Advanced techniques, menu storytelling, and speed-round execution.",
  },
  {
    id: "service-rituals-l1",
    title: "LPM Service Rituals",
    category: "LPM Service Rituals",
    level: 1,
    audience: "FOH Team",
    durationMinutes: 58,
    deliveryFormats: ["Slides", "Workshop", "Role Play"],
    status: "Active",
    summary:
      "Guest welcome, table rhythm, and communication standards across shifts.",
  },
  {
    id: "service-rituals-l2",
    title: "LPM Service Rituals",
    category: "LPM Service Rituals",
    level: 2,
    audience: "FOH Team",
    durationMinutes: 76,
    deliveryFormats: ["Slides", "Workshop", "Scenario Lab"],
    status: "Upcoming",
    summary:
      "Recovery moments, premium guest handling, and cross-team service flow.",
  },
];

const moduleLevels: ModuleLevel[] = [1, 2];

const outlinedSecondaryBadgeClass =
  "border-secondary/55 text-secondary bg-transparent";

function statusBadgeClass(status: ModuleStatus) {
  if (status === "Active") {
    return "border-emerald-600/55 text-emerald-700 bg-emerald-500/8";
  }
  if (status === "Upcoming") {
    return "border-blue-600/55 text-blue-700 bg-blue-500/8";
  }
  return "border-amber-600/55 text-amber-700 bg-amber-500/8";
}

export function TrainingModulesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ModuleCategory[]>(
    [],
  );
  const [selectedLevel, setSelectedLevel] = useState<ModuleLevel | null>(null);
  const [selectedAudience, setSelectedAudience] = useState<ModuleAudience | null>(
    null,
  );

  const filteredModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...trainingModules]
      .filter((module) => {
        const matchesSearch =
          query.length === 0 ||
          [module.title, module.category, module.audience, module.summary]
            .join(" ")
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(module.category);
        const matchesLevel =
          selectedLevel === null || module.level === selectedLevel;
        const matchesAudience =
          selectedAudience === null || module.audience === selectedAudience;

        return (
          matchesSearch && matchesCategory && matchesLevel && matchesAudience
        );
      })
      .sort((a, b) => {
        const categoryOrderA = moduleCategories.indexOf(a.category);
        const categoryOrderB = moduleCategories.indexOf(b.category);

        if (categoryOrderA !== categoryOrderB) {
          return categoryOrderA - categoryOrderB;
        }

        if (a.level !== b.level) {
          return a.level - b.level;
        }

        return a.title.localeCompare(b.title);
      });
  }, [searchQuery, selectedCategories, selectedLevel, selectedAudience]);

  const groupedModules = useMemo(() => {
    return moduleCategories
      .map((category) => ({
        category,
        items: filteredModules.filter((module) => module.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredModules]);

  const toggleCategory = (category: ModuleCategory) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category],
    );
  };

  const categoryFilterLabel =
    selectedCategories.length === 0
      ? "Categories"
      : selectedCategories.length === 1
        ? selectedCategories[0]
        : `${selectedCategories[0]} +${selectedCategories.length - 1}`;
  const levelFilterLabel =
    selectedLevel === null ? "Level" : `Level ${selectedLevel}`;
  const audienceFilterLabel = selectedAudience ?? "Audience";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WebAppPageHeader
        title="Training Modules"
        actions={
          <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
            {filteredModules.length} Modules
          </Badge>
        }
      />

      <div className="border-b border-border/70 bg-background/75">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <div className="relative min-w-[260px] flex-1">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-8"
              placeholder="Search module, category, audience, or summary..."
              aria-label="Search training modules"
            />
          </div>

          <DropdownMenu>
            <ButtonGroup>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-8 min-w-[230px] max-w-[290px] items-center justify-between gap-2 border px-2.5 text-xs",
                      selectedCategories.length === 0
                        ? "border-border bg-background text-muted-foreground"
                        : "border-primary/45 bg-primary/10 text-foreground",
                      selectedCategories.length > 0 ? "border-r-0" : "",
                    )}
                  />
                }
              >
                <span className="truncate text-left">{categoryFilterLabel}</span>
                <ChevronsUpDownIcon className="size-3.5 shrink-0" />
              </DropdownMenuTrigger>
              {selectedCategories.length > 0 ? (
                <button
                  type="button"
                  aria-label="Clear selected categories"
                  onClick={() => setSelectedCategories([])}
                  className="border-primary/45 bg-primary/10 text-foreground inline-flex h-8 w-8 items-center justify-center border border-l px-0"
                >
                  <XIcon className="size-3.5" />
                </button>
              ) : null}
            </ButtonGroup>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuGroup>
                {moduleCategories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    closeOnClick={false}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <ButtonGroup>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-8 min-w-[120px] max-w-[150px] items-center justify-between gap-2 border px-2.5 text-xs",
                      selectedLevel === null
                        ? "border-border bg-background text-muted-foreground"
                        : "border-primary/45 bg-primary/10 text-foreground",
                      selectedLevel !== null ? "border-r-0" : "",
                    )}
                  />
                }
              >
                <span className="truncate text-left">{levelFilterLabel}</span>
                <ChevronsUpDownIcon className="size-3.5 shrink-0" />
              </DropdownMenuTrigger>
              {selectedLevel !== null ? (
                <button
                  type="button"
                  aria-label="Clear selected level"
                  onClick={() => setSelectedLevel(null)}
                  className="border-primary/45 bg-primary/10 text-foreground inline-flex h-8 w-8 items-center justify-center border border-l px-0"
                >
                  <XIcon className="size-3.5" />
                </button>
              ) : null}
            </ButtonGroup>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={selectedLevel === null ? "" : String(selectedLevel)}
                  onValueChange={(value) =>
                    setSelectedLevel(
                      (value ? Number(value) : null) as ModuleLevel | null,
                    )
                  }
                >
                  {moduleLevels.map((level) => (
                    <DropdownMenuRadioItem key={level} value={String(level)}>
                      Level {level}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <ButtonGroup>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-8 min-w-[200px] max-w-[260px] items-center justify-between gap-2 border px-2.5 text-xs",
                      selectedAudience === null
                        ? "border-border bg-background text-muted-foreground"
                        : "border-primary/45 bg-primary/10 text-foreground",
                      selectedAudience !== null ? "border-r-0" : "",
                    )}
                  />
                }
              >
                <span className="truncate text-left">{audienceFilterLabel}</span>
                <ChevronsUpDownIcon className="size-3.5 shrink-0" />
              </DropdownMenuTrigger>
              {selectedAudience !== null ? (
                <button
                  type="button"
                  aria-label="Clear selected audience"
                  onClick={() => setSelectedAudience(null)}
                  className="border-primary/45 bg-primary/10 text-foreground inline-flex h-8 w-8 items-center justify-center border border-l px-0"
                >
                  <XIcon className="size-3.5" />
                </button>
              ) : null}
            </ButtonGroup>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={selectedAudience ?? ""}
                  onValueChange={(value) =>
                    setSelectedAudience((value as ModuleAudience | "") || null)
                  }
                >
                  {moduleAudiences.map((audience) => (
                    <DropdownMenuRadioItem key={audience} value={audience}>
                      {audience}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_26%,white_74%),var(--background))]">
        <div className="space-y-5 p-4">
          {groupedModules.length === 0 ? (
            <div className="border border-border bg-background p-5 text-xs">
              No training modules match the current search and filters.
            </div>
          ) : (
            groupedModules.map((group) => (
              <section key={group.category} className="space-y-2">
                <div className="flex items-center justify-between border-b border-border/70 pb-2">
                  <h3 className="text-sm uppercase tracking-[0.12em]">
                    {group.category}
                  </h3>
                  <Badge
                    variant="outline"
                    className={outlinedSecondaryBadgeClass}
                  >
                    {group.items.length}
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((module) => (
                    <article
                      key={module.id}
                      className="border border-border bg-background p-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex min-w-0 items-start justify-between gap-2">
                          <p className="line-clamp-2 min-w-0 flex-1 text-sm leading-tight">
                            {module.title}
                          </p>
                          <div className="flex shrink-0 gap-1">
                            <Badge
                              variant="outline"
                              className={outlinedSecondaryBadgeClass}
                            >
                              L{module.level}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={statusBadgeClass(module.status)}
                            >
                              {module.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                          <span className="inline-flex items-center gap-1">
                            <UsersIcon className="size-3" />
                            {module.audience}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3Icon className="size-3" />
                            {module.durationMinutes} min
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {module.summary}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {module.deliveryFormats.map((format) => (
                            <Badge
                              key={`${module.id}-${format}`}
                              variant="outline"
                              className={outlinedSecondaryBadgeClass}
                            >
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
