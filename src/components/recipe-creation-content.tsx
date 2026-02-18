"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MessageCircleIcon, MicIcon, SendHorizontalIcon } from "lucide-react";
import Image from "next/image";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  InputGroupText,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { WebAppPageHeader } from "@/components/web-app-page-header";
import { cn } from "@/lib/utils";

type RecipeDraft = {
  title: string;
  description: string;
  dishAnnouncement: string;
  ingredients: string[];
  dressing: string[];
  garnish: string[];
  allergens: string[];
  preparationSteps: string[];
  serviceTools: string[];
  chefNotes: string[];
};

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

const initialConversation: ChatMessage[] = [
  {
    id: 1,
    role: "user",
    content:
      "Create a recipe for Salade Nicoise. Keep the tone elegant and concise.",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "Perfect. I will keep this strictly to your inputs and format it clearly.",
  },
  {
    id: 3,
    role: "user",
    content: "Use yellowfin tuna, cherry tomato, olives, and quail egg.",
  },
  {
    id: 4,
    role: "assistant",
    content: "Noted. I have listed those ingredients exactly as provided.",
  },
  {
    id: 5,
    role: "user",
    content: "Add lemon-dijon-caper dressing and keep garnish simple.",
  },
  {
    id: 6,
    role: "assistant",
    content:
      "Great, I have added that dressing profile and marked garnish as simple.",
  },
  {
    id: 7,
    role: "user",
    content:
      "Allergens: fish, egg, mustard. Service tools: big fork and big spoon.",
  },
  {
    id: 8,
    role: "assistant",
    content:
      "Done. Allergens and service tools are now documented exactly as you specified.",
  },
];

const restaurantOptions = [
  {
    concept: "La Petite Maison",
    restaurants: [
      "London",
      "Dubai",
      "Abu Dhabi",
      "Hong Kong",
      "Riyadh",
      "Doha",
      "Marbella",
      "Mykonos",
      "Limassol",
      "Kuwait",
    ],
  },
  {
    concept: "LPM RESTAURANT & BAR",
    restaurants: ["Miami", "Las Vegas"],
  },
] as const;

const ALL_RESTAURANTS_VALUE = "__all_restaurants__";
const ALL_GROUP_PREFIX = "__all_group__:";

const allRestaurants = restaurantOptions.flatMap((group) => group.restaurants);
const bulkRestaurantValues = restaurantOptions.map(
  (group) => `${ALL_GROUP_PREFIX}${group.concept}`,
);
const restaurantComboboxItems = [
  ALL_RESTAURANTS_VALUE,
  ...bulkRestaurantValues,
  ...allRestaurants,
];

const baseDraft: RecipeDraft = {
  title: "Salade Nicoise",
  description:
    "Classic Mediterranean starter with tuna, vegetables, and bright dressing.",
  dishAnnouncement:
    "Salade Nicoise with tuna, confit vegetables, and citrus caper dressing.",
  ingredients: [
    "Yellowfin tuna",
    "Baby gem lettuce",
    "Cherry tomato",
    "Green beans",
    "Olives",
    "Quail egg",
  ],
  dressing: ["Lemon juice", "Olive oil", "Dijon mustard", "Capers"],
  garnish: ["Chives", "Black olive dust"],
  allergens: ["Fish", "Mustard", "Egg"],
  preparationSteps: [
    "Marinate tuna lightly with olive oil, sea salt, and lemon zest.",
    "Arrange vegetables and lettuce in a chilled shallow bowl.",
    "Place sliced tuna on top and finish with dressing and garnish.",
  ],
  serviceTools: ["Big fork", "Big spoon"],
  chefNotes: [
    "Keep tuna cold until final plating.",
    "Dressing should be served fresh and emulsified.",
  ],
};

const ingredientLexicon = [
  "tuna",
  "seabass",
  "salmon",
  "octopus",
  "prawns",
  "beetroot",
  "tomato",
  "cherry tomato",
  "olive",
  "capers",
  "fennel",
  "lentils",
  "quinoa",
  "burrata",
  "feta",
  "mozzarella",
  "egg",
  "quail egg",
  "avocado",
  "chili",
  "lemon",
  "lime",
  "orange",
  "garlic",
  "shallot",
  "onion",
  "mustard",
  "honey",
  "basil",
  "parsley",
  "mint",
  "coriander",
  "chives",
  "cream",
  "butter",
  "chocolate",
  "hazelnut",
  "apple",
  "vanilla",
  "ice cream",
];

const allergenLexicon = [
  { label: "Fish", words: ["tuna", "seabass", "salmon", "anchovy", "octopus"] },
  { label: "Shellfish", words: ["prawn", "crab", "lobster", "oyster"] },
  { label: "Egg", words: ["egg", "aioli", "mayo"] },
  {
    label: "Dairy",
    words: ["burrata", "feta", "cream", "butter", "ice cream"],
  },
  { label: "Nuts", words: ["hazelnut", "almond", "walnut", "pistachio"] },
  { label: "Mustard", words: ["mustard"] },
  { label: "Gluten", words: ["bread", "brioche", "flour", "pasta"] },
];

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function splitList(value: string) {
  return unique(value.split(/[\n,;]+/g));
}

function formatList(value: string[]) {
  return value.join("\n");
}

function extractSection(text: string, labels: string[]) {
  const escapedLabels = labels.map((label) =>
    label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regex = new RegExp(
    `(?:^|\\n)\\s*(?:${escapedLabels.join("|")})\\s*[:\\-]\\s*([^\\n]+)`,
    "gi",
  );
  const values: string[] = [];
  let match = regex.exec(text);
  while (match) {
    values.push(...splitList(match[1]!));
    match = regex.exec(text);
  }
  return unique(values);
}

function guessTitle(prompt: string) {
  const quoted = prompt.match(/["']([^"']{3,80})["']/);
  if (quoted?.[1]) {
    return toTitleCase(quoted[1]);
  }

  const firstLine = prompt.split(/\n|\./)[0] ?? "";
  const cleaned = firstLine
    .replace(/\b(create|generate|draft|make|build)\b/gi, "")
    .replace(/\b(a|an|the)\b/gi, "")
    .replace(/\b(recipe|dish)\b/gi, "")
    .replace(/\bfor\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const candidate = cleaned.split(/\bwith\b/i)[0]?.trim();
  return toTitleCase(candidate || "New Lpm Recipe");
}

function sentenceSummary(prompt: string) {
  const sentence = prompt
    .split(/\n|(?<=[.!?])\s+/)
    .map((entry) => entry.trim())
    .find(Boolean);

  if (!sentence) {
    return "Structured draft generated from user prompt.";
  }

  const compact = sentence.replace(/\s+/g, " ");
  return compact.length > 150 ? `${compact.slice(0, 147)}...` : compact;
}

function extractIngredients(prompt: string) {
  const labeledIngredients = extractSection(prompt, [
    "ingredients",
    "ingredient",
    "key ingredients",
  ]);

  const inferredIngredients = ingredientLexicon
    .filter((item) => new RegExp(`\\b${item}\\b`, "i").test(prompt))
    .map((item) => toTitleCase(item));

  return unique([...labeledIngredients, ...inferredIngredients]);
}

function extractAllergens(prompt: string, ingredients: string[]) {
  const explicitAllergens = extractSection(prompt, ["allergens", "allergies"]);
  const inferredAllergens = allergenLexicon
    .filter((allergen) => {
      const matcher = new RegExp(`\\b(${allergen.words.join("|")})\\b`, "i");
      return (
        matcher.test(prompt) || ingredients.some((item) => matcher.test(item))
      );
    })
    .map((allergen) => allergen.label);

  return unique([
    ...explicitAllergens.map((item) => toTitleCase(item)),
    ...inferredAllergens,
  ]);
}

function extractMethod(prompt: string, title: string) {
  const explicitMethod = extractSection(prompt, [
    "method",
    "preparation",
    "steps",
  ]);
  if (explicitMethod.length > 0) {
    return explicitMethod.map((step) => `${toTitleCase(step)}.`);
  }

  const firstSentence = sentenceSummary(prompt).replace(/[.!?]+$/, "");
  return [
    `Prepare the core mise en place for ${title.toLowerCase()}.`,
    "Build the dish with balanced seasoning and texture contrast.",
    `Finalize plating and service check: ${firstSentence}.`,
  ];
}

function buildRecipeDraft(prompt: string): RecipeDraft {
  const normalizedPrompt = prompt.trim();
  if (!normalizedPrompt) {
    return baseDraft;
  }

  const title = guessTitle(normalizedPrompt);
  const description = sentenceSummary(normalizedPrompt);
  const ingredients = extractIngredients(normalizedPrompt);
  const dressing = extractSection(normalizedPrompt, [
    "dressing",
    "sauce",
    "vinaigrette",
    "marinade",
  ]);
  const garnish = extractSection(normalizedPrompt, [
    "garnish",
    "finished with",
    "topping",
  ]);
  const serviceTools = extractSection(normalizedPrompt, [
    "service tools",
    "cutlery",
    "tools",
    "utensils",
  ]);
  const chefNotes = extractSection(normalizedPrompt, [
    "chef note",
    "notes",
    "service note",
  ]);
  const allergens = extractAllergens(normalizedPrompt, ingredients);
  const preparationSteps = extractMethod(normalizedPrompt, title);

  const heroIngredient = ingredients.slice(0, 3).join(", ");
  const dishAnnouncement = heroIngredient
    ? `${title} with ${heroIngredient}.`
    : `${title}, prepared in LPM style.`;

  return {
    title,
    description,
    dishAnnouncement,
    ingredients: ingredients.length > 0 ? ingredients : baseDraft.ingredients,
    dressing: dressing.length > 0 ? dressing : ["No dressing specified"],
    garnish: garnish.length > 0 ? garnish : ["No garnish specified"],
    allergens: allergens.length > 0 ? allergens : ["No declared allergens"],
    preparationSteps,
    serviceTools:
      serviceTools.length > 0 ? serviceTools : ["Service tools not specified"],
    chefNotes: chefNotes.length > 0 ? chefNotes : ["No additional chef notes"],
  };
}

function assistantResponse(recipe: RecipeDraft) {
  return `Draft ready for ${recipe.title}. I have structured your notes into the LPM layout and kept the wording service-ready.`;
}

export function RecipeCreationContent() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialConversation);
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState<RecipeDraft>(baseDraft);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [restaurantQuery, setRestaurantQuery] = useState("");
  const [assignedRestaurants, setAssignedRestaurants] = useState<string[]>([
    "London",
    "Dubai",
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const restaurantsAnchorRef = useComboboxAnchor();
  const showRecipeImage = /nicoise/i.test(recipe.title);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);
  const handleGenerate = () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      return;
    }

    const generatedRecipe = buildRecipeDraft(userPrompt);
    setRecipe(generatedRecipe);
    setMessages((previous) => [
      ...previous,
      { id: previous.length + 1, role: "user", content: userPrompt },
      {
        id: previous.length + 2,
        role: "assistant",
        content: assistantResponse(generatedRecipe),
      },
    ]);
    setPrompt("");
  };

  const handlePromptKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      handleGenerate();
    }
  };

  const normalizedRestaurantQuery = restaurantQuery.trim().toLowerCase();
  const visibleRestaurantGroups = restaurantOptions
    .map((group) => {
      if (!normalizedRestaurantQuery) {
        return group;
      }

      return {
        ...group,
        restaurants: group.restaurants.filter((restaurant) =>
          restaurant.toLowerCase().includes(normalizedRestaurantQuery),
        ),
      };
    })
    .filter((group) => group.restaurants.length > 0);
  const isAllRestaurantsSelected =
    assignedRestaurants.length > 0 &&
    allRestaurants.every((restaurant) =>
      assignedRestaurants.includes(restaurant),
    );
  const getGroupAllSelected = (concept: string) => {
    const group = restaurantOptions.find(
      (option) => option.concept === concept,
    );
    return !!group?.restaurants.every((restaurant) =>
      assignedRestaurants.includes(restaurant),
    );
  };
  const restaurantSelectorValue = [
    ...assignedRestaurants,
    ...(isAllRestaurantsSelected ? [ALL_RESTAURANTS_VALUE] : []),
    ...restaurantOptions
      .filter((group) => getGroupAllSelected(group.concept))
      .map((group) => `${ALL_GROUP_PREFIX}${group.concept}`),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WebAppPageHeader
        title="New Recipe"
        actions={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={isChatOpen ? "Hide chat" : "Show chat"}
            title={isChatOpen ? "Hide chat" : "Show chat"}
            onClick={() => setIsChatOpen((previous) => !previous)}
          >
            <MessageCircleIcon />
          </Button>
        }
      />
      <div className="min-h-0 flex-1 p-5">
        <div className="flex h-full min-h-0 w-full gap-4">
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
                    {messages.map((message) =>
                      message.role === "assistant" ? (
                        <p
                          key={message.id}
                          className="max-w-[84%] text-xs leading-relaxed text-foreground/90"
                        >
                          {message.content}
                        </p>
                      ) : (
                        <div
                          key={message.id}
                          className="ml-auto w-fit max-w-[84%] border border-primary/35 bg-primary/12 p-2 text-xs leading-relaxed"
                        >
                          {message.content}
                        </div>
                      ),
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>
              </div>

              <InputGroup className="h-auto border-secondary/55 bg-background shadow-[0_0_0_1px_color-mix(in_oklch,var(--secondary)_28%,transparent),0_16px_24px_-22px_oklch(0.6489_0.1708_28.21)]">
                <InputGroupTextarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={handlePromptKeyDown}
                  placeholder="Describe the dish, ingredients, garnish, allergens, and service details..."
                  className="min-h-20 placeholder:text-foreground/45"
                />
                <InputGroupAddon
                  align="block-end"
                  className="border-t border-border/85 pt-2"
                >
                  <InputGroupText className="text-foreground/70">
                    Press Cmd/Ctrl + Enter to generate
                  </InputGroupText>
                  <div className="ml-auto flex items-center gap-2">
                    <InputGroupButton
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Voice input"
                      title="Voice input"
                      onClick={() => {
                        setMessages((previous) => [
                          ...previous,
                          {
                            id: previous.length + 1,
                            role: "assistant",
                            content:
                              "Voice capture is not connected yet in this preview.",
                          },
                        ]);
                      }}
                    >
                      <MicIcon />
                    </InputGroupButton>
                    <InputGroupButton
                      variant="default"
                      size="icon-sm"
                      aria-label="Send recipe prompt"
                      title="Send"
                      onClick={handleGenerate}
                    >
                      <SendHorizontalIcon />
                    </InputGroupButton>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </section>

          <section className="min-h-0 flex-1">
            <ScrollArea className="h-full min-h-0 p-0 border border-border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_42%,white_58%),color-mix(in_oklch,var(--background)_88%,var(--muted)_12%))]">
              <div className="p-3 sticky top-0 z-20 mb-2 border-b border-border/60 pb-2 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_42%,white_58%),color-mix(in_oklch,var(--background)_88%,var(--muted)_12%))]">
                <p className="text-sm uppercase tracking-[0.12em]">
                  {recipe.title}
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {recipe.description}
                </p>
              </div>
              {showRecipeImage ? (
                <div className="px-3">
                  <Image
                    src="/salade-nicoise.png"
                    alt="Salade Nicoise example plating"
                    width={1320}
                    height={770}
                    sizes="(max-width: 1536px) 100vw, 60vw"
                    className="mb-2 h-auto w-full"
                    priority
                  />
                </div>
              ) : null}
              <div className="grid gap-2 lg:grid-cols-2 px-3 pb-3">
                <section
                  ref={restaurantsAnchorRef}
                  className="relative min-h-14 border border-border bg-background p-0 transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50 lg:col-span-2"
                >
                  <p className="text-muted-foreground pointer-events-none absolute top-3 left-3 z-10 text-[10px] uppercase tracking-[0.16em]">
                    Restaurants
                  </p>
                  <Combobox
                    multiple
                    items={restaurantComboboxItems}
                    value={restaurantSelectorValue}
                    onInputValueChange={(value) => setRestaurantQuery(value)}
                    onValueChange={(value) => {
                      if (!Array.isArray(value)) {
                        return;
                      }

                      const nextSelection = new Set(value);
                      const nextHasGlobalAll = nextSelection.has(
                        ALL_RESTAURANTS_VALUE,
                      );

                      if (nextHasGlobalAll !== isAllRestaurantsSelected) {
                        setAssignedRestaurants(
                          nextHasGlobalAll ? [...allRestaurants] : [],
                        );
                        return;
                      }

                      const nextAssignedSet = new Set(assignedRestaurants);
                      let groupToggleHandled = false;

                      restaurantOptions.forEach((group) => {
                        const groupAllValue = `${ALL_GROUP_PREFIX}${group.concept}`;
                        const prevGroupAll = getGroupAllSelected(group.concept);
                        const nextGroupAll = nextSelection.has(groupAllValue);

                        if (nextGroupAll === prevGroupAll) {
                          return;
                        }

                        groupToggleHandled = true;
                        if (nextGroupAll) {
                          group.restaurants.forEach((restaurant) =>
                            nextAssignedSet.add(restaurant),
                          );
                        } else {
                          group.restaurants.forEach((restaurant) =>
                            nextAssignedSet.delete(restaurant),
                          );
                        }
                      });

                      if (groupToggleHandled) {
                        setAssignedRestaurants(
                          allRestaurants.filter((restaurant) =>
                            nextAssignedSet.has(restaurant),
                          ),
                        );
                        return;
                      }

                      const selectedRestaurants = value.filter(
                        (entry): entry is (typeof allRestaurants)[number] =>
                          typeof entry === "string" &&
                          allRestaurants.includes(entry as any),
                      );
                      setAssignedRestaurants(selectedRestaurants);
                    }}
                  >
                    <ComboboxChips className="h-full min-h-14 w-full border-0 bg-transparent px-3 pt-9! pb-2! shadow-none focus-within:border-transparent! focus-within:ring-0! has-data-[slot=combobox-chip]:px-3!">
                      <ComboboxValue>
                        {(selectedValue) =>
                          Array.isArray(selectedValue)
                            ? selectedValue
                                .filter((entry) =>
                                  allRestaurants.includes(entry),
                                )
                                .map((restaurant) => (
                                  <ComboboxChip key={restaurant}>
                                    {restaurant}
                                  </ComboboxChip>
                                ))
                            : null
                        }
                      </ComboboxValue>
                      <ComboboxChipsInput
                        placeholder={
                          assignedRestaurants.length > 0
                            ? "Type to add more restaurants..."
                            : "Assign restaurants..."
                        }
                        className="min-w-0 text-xs placeholder:text-muted-foreground"
                      />
                    </ComboboxChips>
                    <ComboboxContent anchor={restaurantsAnchorRef}>
                      <ComboboxList>
                        <ComboboxItem value={ALL_RESTAURANTS_VALUE}>
                          All
                        </ComboboxItem>
                        {visibleRestaurantGroups.map((group) => (
                          <ComboboxGroup key={group.concept}>
                            <ComboboxLabel>{group.concept}</ComboboxLabel>
                            <ComboboxItem
                              value={`${ALL_GROUP_PREFIX}${group.concept}`}
                            >
                              All
                            </ComboboxItem>
                            {group.restaurants.map((restaurant) => (
                              <ComboboxItem key={restaurant} value={restaurant}>
                                {restaurant}
                              </ComboboxItem>
                            ))}
                          </ComboboxGroup>
                        ))}
                        {visibleRestaurantGroups.length === 0 ? (
                          <ComboboxEmpty>No restaurants found.</ComboboxEmpty>
                        ) : null}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </section>
                <EditableRecipeCard
                  title="Dish Announcement"
                  value={recipe.dishAnnouncement}
                  onChange={(value) =>
                    setRecipe((previous) => ({
                      ...previous,
                      dishAnnouncement: value,
                    }))
                  }
                />
                <EditableRecipeCard
                  title="Ingredients"
                  value={formatList(recipe.ingredients)}
                  onChange={(value) =>
                    setRecipe((previous) => ({
                      ...previous,
                      ingredients: splitList(value),
                    }))
                  }
                />
                <EditableRecipeCard
                  title="Dressing / Sauce"
                  value={formatList(recipe.dressing)}
                  onChange={(value) =>
                    setRecipe((previous) => ({
                      ...previous,
                      dressing: splitList(value),
                    }))
                  }
                />
                <EditableRecipeCard
                  title="Garnish"
                  value={formatList(recipe.garnish)}
                  onChange={(value) =>
                    setRecipe((previous) => ({
                      ...previous,
                      garnish: splitList(value),
                    }))
                  }
                />
                <EditableRecipeCard
                  title="Allergens"
                  value={formatList(recipe.allergens)}
                  onChange={(value) =>
                    setRecipe((previous) => ({
                      ...previous,
                      allergens: splitList(value),
                    }))
                  }
                />
                <EditableRecipeCard
                  title="Service Tools"
                  value={formatList(recipe.serviceTools)}
                  onChange={(value) =>
                    setRecipe((previous) => ({
                      ...previous,
                      serviceTools: splitList(value),
                    }))
                  }
                />
                <EditableRecipeCard
                  title="Restaurants"
                  value={formatList(assignedRestaurants)}
                  onChange={(value) =>
                    setAssignedRestaurants(
                      allRestaurants.filter((restaurant) =>
                        splitList(value)
                          .map((item) => item.toLowerCase())
                          .includes(restaurant.toLowerCase()),
                      ),
                    )
                  }
                  className="lg:col-span-2"
                />
                <EditableRecipeCard
                  title="Preparation Steps"
                  value={formatList(recipe.preparationSteps)}
                  onChange={(value) =>
                    setRecipe((previous) => ({
                      ...previous,
                      preparationSteps: splitList(value),
                    }))
                  }
                  minHeightClass="min-h-32"
                  className="lg:col-span-2"
                />
                <EditableRecipeCard
                  title="Chef Notes"
                  value={formatList(recipe.chefNotes)}
                  onChange={(value) =>
                    setRecipe((previous) => ({
                      ...previous,
                      chefNotes: splitList(value),
                    }))
                  }
                  minHeightClass="min-h-32"
                  className="lg:col-span-2"
                />
              </div>
            </ScrollArea>
          </section>
        </div>
      </div>
    </div>
  );
}

function EditableRecipeCard({
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
