"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangleIcon,
  CheckIcon,
  Clock3Icon,
  MessageCircleIcon,
  MicIcon,
  PlusIcon,
  PlayCircleIcon,
  SendHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebAppPageHeader } from "@/components/web-app-page-header";
import { cn } from "@/lib/utils";

type ModuleRecipe = {
  id: string;
  title: string;
  category: "Carpaccios";
  level: 1 | 2;
  station: "Cold Station" | "Fish Station";
  prepMinutes: number;
  allergens: string[];
  imageFile: string;
  note: string;
};

type ModuleAssessmentResult = {
  id: string;
  userName: string;
  role: string;
  completedOn: string;
  score: number;
  status: "Pass" | "Needs Coaching";
  restaurantId: string;
  moduleId: string;
};

type EditableChoice = {
  id: string;
  text: string;
};

type EditableFlashcard = {
  id: string;
  category: string;
  question: string;
  choices: EditableChoice[];
  correctChoiceId: string;
};

type ModuleVideo = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
};

type ModuleTabKey =
  | "summary"
  | "medias"
  | "content"
  | "flashcards"
  | "assessments";

type SimulationMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const fixedContext = {
  restaurantId: "dubai",
  restaurantLabel: "Dubai",
  moduleId: "carpaccios-l1",
  moduleTitle: "Carpaccios",
  moduleLevel: 1 as const,
  audience: "Fish Station Team",
  durationMinutes: 55,
};

const outlinedSecondaryBadgeClass =
  "border-secondary/55 text-secondary bg-transparent";

const categoryRecipes: ModuleRecipe[] = [
  {
    id: "car-seabass-carpaccio",
    title: "Seabass Carpaccio",
    category: "Carpaccios",
    level: 1,
    station: "Fish Station",
    prepMinutes: 16,
    allergens: ["Fish"],
    imageFile: "seabass-carpaccio.png",
    note: "Thin sliced seabass with fennel, citrus, and extra virgin olive oil.",
  },
  {
    id: "car-tuna-carpaccio",
    title: "Yellowfin Tuna Carpaccio",
    category: "Carpaccios",
    level: 1,
    station: "Fish Station",
    prepMinutes: 17,
    allergens: ["Fish", "Sesame"],
    imageFile: "yellowfin-tuna-carpaccio.png",
    note: "Yellowfin tuna with chili oil, capers, and micro herbs.",
  },
  {
    id: "car-beef-carpaccio",
    title: "Beef Tenderloin Carpaccio",
    category: "Carpaccios",
    level: 2,
    station: "Cold Station",
    prepMinutes: 21,
    allergens: ["Dairy"],
    imageFile: "beef-tenderloin-carpaccio.png",
    note: "Aged beef, parmesan shavings, rocket, and lemon emulsion.",
  },
  {
    id: "car-bluefin-tuna-carpaccio",
    title: "Bluefin Tuna Carpaccio",
    category: "Carpaccios",
    level: 2,
    station: "Fish Station",
    prepMinutes: 19,
    allergens: ["Fish"],
    imageFile: "bluefin-tuna-carpaccio.png",
    note: "Bluefin tuna with lemon oil, sea salt flakes, and shaved fennel.",
  },
  {
    id: "car-salmon-carpaccio",
    title: "Scottish Salmon Carpaccio",
    category: "Carpaccios",
    level: 2,
    station: "Fish Station",
    prepMinutes: 18,
    allergens: ["Fish"],
    imageFile: "scottish-salmon-carpaccio.png",
    note: "Cured salmon ribbons with dill, pink pepper, and citrus zest.",
  },
];

const seededVideos: ModuleVideo[] = [
  {
    id: "video-knife-calibration",
    title: "Knife Calibration Drill (Sample)",
    description:
      "Short video reference for consistent slicing width and clean edge control.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "video-cold-pass-plating",
    title: "Cold Pass Plating Rhythm (Sample)",
    description:
      "Sample pacing guide for garnish placement and pass readiness checks.",
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },
];

const moduleAssessments: ModuleAssessmentResult[] = [
  {
    id: "result-1",
    userName: "Amira K.",
    role: "Fish Chef de Partie",
    completedOn: "2026-02-14",
    score: 94,
    status: "Pass",
    restaurantId: "dubai",
    moduleId: "carpaccios-l1",
  },
  {
    id: "result-2",
    userName: "Julien D.",
    role: "Junior Fish Cook",
    completedOn: "2026-02-13",
    score: 88,
    status: "Pass",
    restaurantId: "dubai",
    moduleId: "carpaccios-l1",
  },
  {
    id: "result-3",
    userName: "Sara M.",
    role: "Commis",
    completedOn: "2026-02-11",
    score: 74,
    status: "Needs Coaching",
    restaurantId: "dubai",
    moduleId: "carpaccios-l1",
  },
  {
    id: "result-4",
    userName: "Marc T.",
    role: "Fish Chef de Partie",
    completedOn: "2026-02-10",
    score: 92,
    status: "Pass",
    restaurantId: "dubai",
    moduleId: "carpaccios-l1",
  },
];

const sharedSimulatedChat: SimulationMessage[] = [
  {
    id: "chat-1",
    role: "user",
    content:
      "Create a Carpaccios Level 1 module for Dubai using only the dishes currently on this location menu.",
  },
  {
    id: "chat-2",
    role: "assistant",
    content:
      "Module drafted. Included recipes are Seabass Carpaccio and Yellowfin Tuna Carpaccio, with summary objectives aligned to fish station standards.",
  },
  {
    id: "chat-3",
    role: "user",
    content:
      "Add media references for slicing technique and plating rhythm, and generate flashcards focused on allergens and prep checks.",
  },
  {
    id: "chat-4",
    role: "assistant",
    content:
      "Done. Media and flashcards are generated from the selected recipes and can be refined before publishing.",
  },
];

function hashToPositiveInt(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function isRecipeAvailableAtRestaurant(recipe: ModuleRecipe, restaurantId: string) {
  const maxHiddenCount = Math.max(categoryRecipes.length - 4, 0);
  if (maxHiddenCount === 0) {
    return true;
  }

  const hiddenCount =
    hashToPositiveInt(`${restaurantId}:${recipe.category}:count`) %
    (maxHiddenCount + 1);
  if (hiddenCount === 0) {
    return true;
  }

  const hiddenStartIndex =
    hashToPositiveInt(`${restaurantId}:${recipe.category}:start`) %
    categoryRecipes.length;
  const hiddenIndexes = new Set<number>();
  for (let offset = 0; offset < hiddenCount; offset += 1) {
    hiddenIndexes.add((hiddenStartIndex + offset) % categoryRecipes.length);
  }

  const recipeIndex = categoryRecipes.findIndex((item) => item.id === recipe.id);
  return recipeIndex >= 0 && !hiddenIndexes.has(recipeIndex);
}

function toYouTubeEmbedUrl(rawUrl: string) {
  const value = rawUrl.trim();
  if (!value) {
    return "";
  }

  if (value.includes("youtube.com/embed/")) {
    return value;
  }

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v")?.trim();
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch {
    return "";
  }

  return "";
}

function buildFlashcards(recipes: ModuleRecipe[]): EditableFlashcard[] {
  return recipes.slice(0, 4).map((recipe) => {
    const allergenAnswer = recipe.allergens[0] ?? "No listed allergen";
    const distractors = ["Gluten", "Nuts", "Mustard", "Soy"].filter(
      (value) => value !== allergenAnswer,
    );

    return {
      id: `flashcard-${recipe.id}`,
      category: recipe.category,
      question: `Which allergen should be highlighted first for ${recipe.title}?`,
      choices: [
        { id: `${recipe.id}-choice-1`, text: allergenAnswer },
        { id: `${recipe.id}-choice-2`, text: distractors[0] ?? "Shellfish" },
        { id: `${recipe.id}-choice-3`, text: distractors[1] ?? "Egg" },
        { id: `${recipe.id}-choice-4`, text: distractors[2] ?? "Dairy" },
      ],
      correctChoiceId: `${recipe.id}-choice-1`,
    };
  });
}

function splitLines(value: string) {
  return value
    .split(/\n+/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function assessmentStatusClass(status: ModuleAssessmentResult["status"]) {
  if (status === "Pass") {
    return "border-emerald-600/55 text-emerald-700 bg-emerald-500/8";
  }
  return "border-amber-600/55 text-amber-700 bg-amber-500/8";
}

export function TrainingModuleDetailsContent() {
  const offeredRecipes = useMemo(
    () =>
      categoryRecipes.filter((recipe) =>
        isRecipeAvailableAtRestaurant(recipe, fixedContext.restaurantId),
      ),
    [],
  );

  const idCounterRef = useRef(0);
  const nextId = (prefix: string) => {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  };

  const [activeTab, setActiveTab] = useState<ModuleTabKey>("summary");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatPrompt, setChatPrompt] = useState("");
  const [simulationMessages, setSimulationMessages] =
    useState<SimulationMessage[]>(sharedSimulatedChat);

  const [summaryIntroduction, setSummaryIntroduction] = useState(
    `This module trains the ${fixedContext.restaurantLabel} fish station team on carpaccio execution standards using only menu items currently offered in this location.`,
  );
  const [summaryObjectives, setSummaryObjectives] = useState<string[]>([
    `Identify product handling, slicing precision, and plating rhythm across ${offeredRecipes.length} active carpaccio offerings.`,
    "Apply allergen-first communication before dish handoff to the pass.",
    "Deliver consistent mise-en-place and garnish finish under peak service pressure.",
  ]);

  const [includedRecipeIds, setIncludedRecipeIds] = useState<string[]>(
    () =>
      offeredRecipes
        .filter((recipe) => recipe.level === fixedContext.moduleLevel)
        .map((recipe) => recipe.id),
  );
  const [mediaRecipeIds, setMediaRecipeIds] = useState<string[]>(() =>
    offeredRecipes.slice(0, 3).map((recipe) => recipe.id),
  );
  const [videos, setVideos] = useState<ModuleVideo[]>(seededVideos);
  const [flashcards, setFlashcards] = useState<EditableFlashcard[]>(() =>
    buildFlashcards(offeredRecipes),
  );

  const recipeById = useMemo(
    () => new Map(offeredRecipes.map((recipe) => [recipe.id, recipe])),
    [offeredRecipes],
  );

  const includedRecipes = useMemo(
    () =>
      includedRecipeIds
        .map((id) => recipeById.get(id))
        .filter((recipe): recipe is ModuleRecipe => Boolean(recipe)),
    [includedRecipeIds, recipeById],
  );

  const availableRecipesForContent = useMemo(
    () => offeredRecipes.filter((recipe) => !includedRecipeIds.includes(recipe.id)),
    [offeredRecipes, includedRecipeIds],
  );

  const mediaRecipes = useMemo(
    () =>
      mediaRecipeIds
        .map((id) => recipeById.get(id))
        .filter((recipe): recipe is ModuleRecipe => Boolean(recipe)),
    [mediaRecipeIds, recipeById],
  );

  const availableRecipesForMedia = useMemo(
    () => offeredRecipes.filter((recipe) => !mediaRecipeIds.includes(recipe.id)),
    [offeredRecipes, mediaRecipeIds],
  );

  const assessmentResults = useMemo(
    () =>
      moduleAssessments.filter(
        (item) =>
          item.restaurantId === fixedContext.restaurantId &&
          item.moduleId === fixedContext.moduleId,
      ),
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
          "Simulation response: module draft updated. Review the active tab content and adjust fields as needed.",
      },
    ]);
    setChatPrompt("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WebAppPageHeader
        title="Training Module Details"
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
        onValueChange={(value) => setActiveTab(value as ModuleTabKey)}
        className="min-h-0 flex-1"
      >
        <div className="min-h-0 flex-1 p-4">
          <div className="flex h-full min-h-0 gap-3">
            <section
              className={cn(
                "min-h-0 overflow-hidden transition-[width,opacity,transform] duration-300 ease-out",
                isChatOpen
                  ? "w-[42%] min-w-84 opacity-100 translate-x-0"
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
                    placeholder="Refine module generation prompt..."
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
                      Press Cmd/Ctrl + Enter to simulate
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
                        aria-label="Send simulation prompt"
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

            <section className="min-w-0 flex-1 min-h-0 border border-border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_26%,white_74%),var(--background))]">
              <div className="border-b border-border/70 bg-background/70 px-3 py-2">
                <TabsList variant="line" className="w-full sm:w-auto">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="medias">Medias</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="min-h-0 h-full">
                <div className="space-y-3 p-3">
                  <TabsContent value="summary" className="space-y-3">
                    <EditableTextCard
                      title="Summary Introduction"
                      value={summaryIntroduction}
                      onChange={setSummaryIntroduction}
                      minHeightClass="min-h-32"
                    />
                    <EditableTextCard
                      title="What You Will Learn"
                      value={summaryObjectives.join("\n")}
                      onChange={(value) => setSummaryObjectives(splitLines(value))}
                      minHeightClass="min-h-40"
                    />
                    <section className="border border-border bg-background p-3 text-xs">
                      <p className="text-muted-foreground mb-1 uppercase tracking-[0.14em]">
                        AI Generation Context
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Initial summary was seeded from menu offerings in the
                        <span className="text-foreground">
                          {" "}
                          {fixedContext.moduleTitle}
                        </span>
                        <span className="text-foreground"> category</span> for
                        <span className="text-foreground">
                          {" "}
                          {fixedContext.restaurantLabel}
                        </span>
                        . You can now edit this content manually.
                      </p>
                    </section>
                  </TabsContent>

                  <TabsContent value="medias" className="space-y-3">
                    <section className="space-y-2 border border-border bg-background p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-[0.12em]">
                          Pictures
                        </h3>
                        <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
                          {mediaRecipes.length} selected
                        </Badge>
                      </div>
                      {mediaRecipes.length === 0 ? (
                        <div className="border border-border bg-background p-4 text-xs">
                          No pictures selected for this module.
                        </div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {mediaRecipes.map((recipe) => (
                            <article
                              key={`media-picture-${recipe.id}`}
                              className="border border-border bg-background"
                            >
                              <ModuleImage imageFile={recipe.imageFile} alt={recipe.title} />
                              <div className="space-y-2 p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm">{recipe.title}</p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon-xs"
                                    aria-label={`Remove ${recipe.title} picture`}
                                    onClick={() =>
                                      setMediaRecipeIds((previous) =>
                                        previous.filter((id) => id !== recipe.id),
                                      )
                                    }
                                  >
                                    <Trash2Icon />
                                  </Button>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                  {recipe.note}
                                </p>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 border-t border-border/70 pt-2">
                        {availableRecipesForMedia.length === 0 ? (
                          <p className="text-muted-foreground text-xs">
                            All available recipe images are already included.
                          </p>
                        ) : (
                          availableRecipesForMedia.map((recipe) => (
                            <Button
                              key={`add-media-${recipe.id}`}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() =>
                                setMediaRecipeIds((previous) => [
                                  ...previous,
                                  recipe.id,
                                ])
                              }
                            >
                              <PlusIcon className="size-3" />
                              {recipe.title}
                            </Button>
                          ))
                        )}
                      </div>
                    </section>

                    <section className="space-y-2 border border-border bg-background p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-[0.12em]">Videos</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() =>
                            setVideos((previous) => [
                              ...previous,
                              {
                                id: nextId("video"),
                                title: "New Module Video",
                                description: "Describe what this video covers.",
                                youtubeUrl: "https://www.youtube.com/watch?v=",
                              },
                            ])
                          }
                        >
                          <PlusIcon className="size-3" />
                          Add Video
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {videos.map((video) => {
                          const embedUrl = toYouTubeEmbedUrl(video.youtubeUrl);
                          return (
                            <article
                              key={video.id}
                              className="bg-muted/25 space-y-3 p-3"
                            >
                              <div className="flex items-center gap-2">
                                <InputGroup className="h-8 flex-1 border-transparent bg-background has-[[data-slot=input-group-control]:focus-visible]:border-ring">
                                  <InputGroupInput
                                    value={video.title}
                                    onChange={(event) =>
                                      setVideos((previous) =>
                                        previous.map((item) =>
                                          item.id === video.id
                                            ? { ...item, title: event.target.value }
                                            : item,
                                        ),
                                      )
                                    }
                                    placeholder="Video title"
                                    className="text-sm"
                                  />
                                </InputGroup>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  aria-label={`Remove ${video.title}`}
                                  onClick={() =>
                                    setVideos((previous) =>
                                      previous.filter((item) => item.id !== video.id),
                                    )
                                  }
                                >
                                  <Trash2Icon />
                                </Button>
                              </div>
                              <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr]">
                                <div className="space-y-2">
                                  {embedUrl ? (
                                    <div className="aspect-video overflow-hidden bg-background">
                                      <iframe
                                        title={video.title}
                                        src={embedUrl}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        className="h-full w-full"
                                      />
                                    </div>
                                  ) : (
                                    <div className="bg-background p-3 text-xs text-muted-foreground">
                                      Add a valid YouTube link to preview the embed.
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <InputGroup className="h-auto border-transparent bg-background has-[[data-slot=input-group-control]:focus-visible]:border-ring">
                                    <InputGroupTextarea
                                      value={video.description}
                                      onChange={(event) =>
                                        setVideos((previous) =>
                                          previous.map((item) =>
                                            item.id === video.id
                                              ? {
                                                  ...item,
                                                  description: event.target.value,
                                                }
                                              : item,
                                          ),
                                        )
                                      }
                                      placeholder="Video description"
                                      className="min-h-20"
                                    />
                                  </InputGroup>
                                  <InputGroup className="h-auto border-transparent bg-background has-[[data-slot=input-group-control]:focus-visible]:border-ring">
                                    <InputGroupInput
                                      value={video.youtubeUrl}
                                      onChange={(event) =>
                                        setVideos((previous) =>
                                          previous.map((item) =>
                                            item.id === video.id
                                              ? {
                                                  ...item,
                                                  youtubeUrl: event.target.value,
                                                }
                                              : item,
                                          ),
                                        )
                                      }
                                      placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    <InputGroupAddon align="block-end" className="pt-1">
                                      <InputGroupText>
                                        Paste YouTube URL to refresh preview.
                                      </InputGroupText>
                                    </InputGroupAddon>
                                  </InputGroup>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-3">
                    <section className="space-y-2 border border-border bg-background p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-[0.12em]">
                          Recipes Included
                        </h3>
                        <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
                          {includedRecipes.length} recipes
                        </Badge>
                      </div>

                      {includedRecipes.length === 0 ? (
                        <div className="border border-border bg-background p-4 text-xs">
                          No recipes currently included in this module.
                        </div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {includedRecipes.map((recipe) => (
                            <article
                              key={recipe.id}
                              className="border border-border bg-background"
                            >
                              <ModuleImage imageFile={recipe.imageFile} alt={recipe.title} />
                              <div className="space-y-2 p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm">{recipe.title}</p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon-xs"
                                    aria-label={`Remove ${recipe.title} from content`}
                                    onClick={() =>
                                      setIncludedRecipeIds((previous) =>
                                        previous.filter((id) => id !== recipe.id),
                                      )
                                    }
                                  >
                                    <Trash2Icon />
                                  </Button>
                                </div>
                                <p className="text-muted-foreground text-xs">{recipe.note}</p>
                                <div className="flex flex-wrap gap-1">
                                  <Badge
                                    variant="outline"
                                    className={outlinedSecondaryBadgeClass}
                                  >
                                    <Clock3Icon className="size-3" />
                                    {recipe.prepMinutes} min
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={outlinedSecondaryBadgeClass}
                                  >
                                    {recipe.station}
                                  </Badge>
                                  {(recipe.allergens.length > 0
                                    ? recipe.allergens
                                    : ["No allergens listed"]
                                  ).map((allergen) => (
                                    <Badge
                                      key={`${recipe.id}-${allergen}`}
                                      variant="outline"
                                      className={outlinedSecondaryBadgeClass}
                                    >
                                      <AlertTriangleIcon className="size-3" />
                                      {allergen}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 border-t border-border/70 pt-2">
                        {availableRecipesForContent.length === 0 ? (
                          <p className="text-muted-foreground text-xs">
                            All available recipes are already included.
                          </p>
                        ) : (
                          availableRecipesForContent.map((recipe) => (
                            <Button
                              key={`add-recipe-${recipe.id}`}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() =>
                                setIncludedRecipeIds((previous) => [
                                  ...previous,
                                  recipe.id,
                                ])
                              }
                            >
                              <PlusIcon className="size-3" />
                              {recipe.title}
                            </Button>
                          ))
                        )}
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="flashcards" className="space-y-3">
                    <section className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-[0.12em]">
                          Flashcards
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            const firstChoiceId = nextId("choice");
                            const secondChoiceId = nextId("choice");
                            setFlashcards((previous) => [
                              ...previous,
                              {
                                id: nextId("flashcard"),
                                category: fixedContext.moduleTitle,
                                question: "New flashcard question",
                                choices: [
                                  { id: firstChoiceId, text: "Choice 1" },
                                  { id: secondChoiceId, text: "Choice 2" },
                                ],
                                correctChoiceId: firstChoiceId,
                              },
                            ]);
                          }}
                        >
                          <PlusIcon className="size-3" />
                          Add Flashcard
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {flashcards.length === 0 ? (
                          <div className="border border-border bg-background p-4 text-xs">
                            No flashcards configured yet.
                          </div>
                        ) : (
                          flashcards.map((card) => (
                            <article
                              key={card.id}
                              className="space-y-2 border border-border bg-background p-3"
                            >
                              <InputGroup className="h-auto border-transparent bg-muted/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring">
                                <InputGroupAddon
                                  align="block-start"
                                  className="border-b border-border/60"
                                >
                                  <InputGroupText className="text-muted-foreground uppercase tracking-[0.14em]">
                                    Question
                                  </InputGroupText>
                                  <div className="ml-auto">
                                    <InputGroupButton
                                      variant="ghost"
                                      size="icon-xs"
                                      aria-label="Remove flashcard"
                                      onClick={() =>
                                        setFlashcards((previous) =>
                                          previous.filter((item) => item.id !== card.id),
                                        )
                                      }
                                    >
                                      <Trash2Icon />
                                    </InputGroupButton>
                                  </div>
                                </InputGroupAddon>
                                <InputGroupTextarea
                                  value={card.question}
                                  onChange={(event) =>
                                    setFlashcards((previous) =>
                                      previous.map((item) =>
                                        item.id === card.id
                                          ? { ...item, question: event.target.value }
                                          : item,
                                      ),
                                    )
                                  }
                                  className="min-h-20"
                                />
                              </InputGroup>

                              <div className="space-y-1.5">
                                {card.choices.map((choice) => {
                                  const isCorrect = card.correctChoiceId === choice.id;
                                  return (
                                    <div
                                      key={choice.id}
                                      className="bg-muted/25 transition-colors"
                                    >
                                      <InputGroup className="h-auto border-transparent bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-ring">
                                        <InputGroupInput
                                          value={choice.text}
                                          onChange={(event) =>
                                            setFlashcards((previous) =>
                                              previous.map((item) => {
                                                if (item.id !== card.id) {
                                                  return item;
                                                }

                                                return {
                                                  ...item,
                                                  choices: item.choices.map((currentChoice) =>
                                                    currentChoice.id === choice.id
                                                      ? {
                                                          ...currentChoice,
                                                          text: event.target.value,
                                                        }
                                                      : currentChoice,
                                                  ),
                                                };
                                              }),
                                            )
                                          }
                                          className="h-8"
                                        />
                                        <InputGroupAddon
                                          align="inline-end"
                                          className="pl-1"
                                        >
                                          <InputGroupButton
                                            variant="ghost"
                                            size="icon-xs"
                                            aria-label="Remove answer choice"
                                            onClick={() =>
                                              setFlashcards((previous) =>
                                                previous.map((item) => {
                                                  if (item.id !== card.id) {
                                                    return item;
                                                  }
                                                  if (item.choices.length <= 2) {
                                                    return item;
                                                  }

                                                  const nextChoices = item.choices.filter(
                                                    (currentChoice) =>
                                                      currentChoice.id !== choice.id,
                                                  );
                                                  const nextCorrectChoiceId =
                                                    item.correctChoiceId === choice.id
                                                      ? nextChoices[0]?.id ?? ""
                                                      : item.correctChoiceId;

                                                  return {
                                                    ...item,
                                                    choices: nextChoices,
                                                    correctChoiceId: nextCorrectChoiceId,
                                                  };
                                                }),
                                              )
                                            }
                                          >
                                            <Trash2Icon />
                                          </InputGroupButton>
                                          <InputGroupButton
                                            variant="outline"
                                            size="icon-xs"
                                            className={cn(
                                              isCorrect
                                                ? "border-emerald-600/55 text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/15"
                                                : "",
                                            )}
                                            aria-label={
                                              isCorrect
                                                ? "Answer marked as correct"
                                                : "Set answer as correct"
                                            }
                                            onClick={() =>
                                              setFlashcards((previous) =>
                                                previous.map((item) =>
                                                  item.id === card.id
                                                    ? {
                                                        ...item,
                                                        correctChoiceId: choice.id,
                                                      }
                                                    : item,
                                                ),
                                              )
                                            }
                                          >
                                            <CheckIcon />
                                          </InputGroupButton>
                                        </InputGroupAddon>
                                      </InputGroup>
                                    </div>
                                  );
                                })}
                              </div>

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => {
                                  const newChoiceId = nextId("choice");
                                  setFlashcards((previous) =>
                                    previous.map((item) =>
                                      item.id === card.id
                                        ? {
                                            ...item,
                                            choices: [
                                              ...item.choices,
                                              { id: newChoiceId, text: "New choice" },
                                            ],
                                            correctChoiceId:
                                              item.correctChoiceId || newChoiceId,
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                              >
                                <PlusIcon className="size-3" />
                                Add Choice
                              </Button>
                            </article>
                          ))
                        )}
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="assessments" className="space-y-4">
                    <section className="space-y-2 border border-border bg-background p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-[0.12em]">
                          Assessment Results
                        </h3>
                        <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
                          <PlayCircleIcon className="size-3" />
                          Mobile app execution
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Assessments are taken from the companion mobile app. This view
                        tracks completion and score outcomes for this module context.
                      </p>
                      {assessmentResults.length === 0 ? (
                        <div className="border border-border bg-background p-4 text-xs">
                          No assessment attempts recorded yet.
                        </div>
                      ) : (
                        <div className="border border-border">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-muted/45 border-b border-border">
                                <th className="px-3 py-2 text-left">User</th>
                                <th className="px-3 py-2 text-left">Role</th>
                                <th className="px-3 py-2 text-left">Completed On</th>
                                <th className="px-3 py-2 text-left">Score</th>
                                <th className="px-3 py-2 text-left">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {assessmentResults.map((result) => (
                                <tr
                                  key={result.id}
                                  className="border-b border-border last:border-b-0"
                                >
                                  <td className="px-3 py-2">{result.userName}</td>
                                  <td className="text-muted-foreground px-3 py-2">
                                    {result.role}
                                  </td>
                                  <td className="px-3 py-2">{result.completedOn}</td>
                                  <td className="px-3 py-2">{result.score}%</td>
                                  <td className="px-3 py-2">
                                    <Badge
                                      variant="outline"
                                      className={assessmentStatusClass(result.status)}
                                    >
                                      {result.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
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

function EditableTextCard({
  title,
  value,
  onChange,
  minHeightClass = "min-h-28",
  className,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  minHeightClass?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative border border-border bg-background p-0 transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50",
        minHeightClass,
        className,
      )}
    >
      <p className="text-muted-foreground pointer-events-none absolute top-3 left-3 z-10 text-[10px] uppercase tracking-[0.16em]">
        {title}
      </p>
      <InputGroup className="h-full w-full border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0">
        <InputGroupTextarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-h-full w-full border-0 bg-transparent px-3 pt-8! pb-3! text-xs leading-relaxed shadow-none focus-visible:ring-0"
        />
      </InputGroup>
    </section>
  );
}

function ModuleImage({ imageFile, alt }: { imageFile: string; alt: string }) {
  const imageCandidates = useMemo(
    () => [`/recipes/${imageFile}`, `/${imageFile}`],
    [imageFile],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const imageSrc = imageCandidates[candidateIndex];

  return (
    <div className="border-border/70 relative overflow-hidden border-b bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--primary)_24%,transparent),transparent_48%),linear-gradient(145deg,color-mix(in_oklch,var(--muted)_70%,white_30%),color-mix(in_oklch,var(--background)_88%,var(--muted)_12%))]">
      <div className="p-3">
        <div className="border-border/60 relative aspect-16/10 overflow-hidden border bg-background/65">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover"
              onError={() =>
                setCandidateIndex((currentIndex) => currentIndex + 1)
              }
            />
          ) : (
            <div className="flex h-full flex-col justify-between p-2">
              <p className="text-muted-foreground text-[10px] uppercase tracking-[0.18em]">
                Placeholder Image
              </p>
              <div className="space-y-1">
                <p className="bg-background inline-block border border-border px-1.5 py-0.5 text-[10px]">
                  /public/recipes/{imageFile}
                </p>
                <p className="text-muted-foreground text-[10px]">
                  Add this file later to replace the placeholder.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
