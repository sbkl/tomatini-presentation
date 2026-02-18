"use client";

import { useMemo, useState } from "react";
import {
  SearchIcon,
  Clock3Icon,
  AlertTriangleIcon,
  Layers3Icon,
  ChevronsUpDownIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WebAppPageHeader } from "@/components/web-app-page-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { appRestaurants } from "@/components/web-app-layout";
import { cn } from "@/lib/utils";

type RecipeCategory =
  | "Appetizers & Cold Starters"
  | "Carpaccios"
  | "Desserts"
  | "Fish & Seafood"
  | "Hot Starters"
  | "Meat"
  | "Mocktails";

type RecipeLevel = 1 | 2;
type RecipeStation =
  | "Cold Station"
  | "Fish Station"
  | "Pastry"
  | "Hot Station"
  | "Grill"
  | "Bar";
type RecipeStatus = "Active" | "Archived" | "Draft";
type CurrencyCode =
  | "AED"
  | "EUR"
  | "GBP"
  | "HKD"
  | "KWD"
  | "MVR"
  | "QAR"
  | "SAR"
  | "USD";

type RecipePrice = {
  currency: CurrencyCode;
  amount: number;
};

type RecipeSummary = {
  id: string;
  title: string;
  category: RecipeCategory;
  level: RecipeLevel;
  station: RecipeStation;
  prepMinutes: number;
  allergens: string[];
  createdOn: string;
  imageFile: string;
  note: string;
  prices: RecipePrice[];
};

type RecipeSeed = Omit<RecipeSummary, "prices">;

const currencyRates: Record<CurrencyCode, number> = {
  AED: 3.67,
  EUR: 0.92,
  GBP: 0.79,
  HKD: 7.8,
  KWD: 0.31,
  MVR: 15.42,
  QAR: 3.64,
  SAR: 3.75,
  USD: 1,
};

const currencyOrder: CurrencyCode[] = [
  "AED",
  "EUR",
  "GBP",
  "HKD",
  "KWD",
  "MVR",
  "QAR",
  "SAR",
  "USD",
];

const restaurantCurrencyById: Record<string, CurrencyCode> = {
  london: "GBP",
  dubai: "AED",
  "abu-dhabi": "AED",
  "hong-kong": "HKD",
  riyadh: "SAR",
  limassol: "EUR",
  doha: "QAR",
  mykonos: "EUR",
  kuwait: "KWD",
  marbella: "EUR",
  maldives: "MVR",
  miami: "USD",
  "las-vegas": "USD",
  "le-cafe-soon": "AED",
};

function roundPriceByCurrency(currency: CurrencyCode, value: number) {
  if (currency === "KWD") {
    return Math.round(value * 10) / 10;
  }
  return Math.round(value);
}

function buildRecipePrices(basePriceUsd: number): RecipePrice[] {
  return currencyOrder.map((currency) => ({
    currency,
    amount: roundPriceByCurrency(
      currency,
      basePriceUsd * currencyRates[currency],
    ),
  }));
}

function restaurantCurrency(restaurantId: string): CurrencyCode {
  return restaurantCurrencyById[restaurantId] ?? "USD";
}

function recipePriceForRestaurant(recipe: RecipeSummary, restaurantId: string) {
  const currency = restaurantCurrency(restaurantId);
  return (
    recipe.prices.find((price) => price.currency === currency) ?? {
      currency: "USD",
      amount: 0,
    }
  );
}

function formatRecipePrice(price: RecipePrice) {
  const decimals = price.currency === "KWD" ? 1 : 0;
  return `${price.currency} ${price.amount.toFixed(decimals)}`;
}

const recipeSeeds: RecipeSeed[] = [
  {
    id: "acs-salade-nicoise",
    title: "Salade Nicoise",
    category: "Appetizers & Cold Starters",
    level: 1,
    station: "Cold Station",
    prepMinutes: 18,
    allergens: ["Fish", "Egg", "Mustard"],
    createdOn: "2026-02-10",
    imageFile: "salade-nicoise.png",
    note: "Classic composed starter with tuna, confit vegetables, and olives.",
  },
  {
    id: "acs-burrata-provencale",
    title: "Burrata Provencale",
    category: "Appetizers & Cold Starters",
    level: 1,
    station: "Cold Station",
    prepMinutes: 14,
    allergens: ["Dairy"],
    createdOn: "2026-02-11",
    imageFile: "burrata-provencale.png",
    note: "Burrata with heritage tomatoes, basil oil, and lemon zest.",
  },
  {
    id: "acs-crab-avocado-salad",
    title: "Crab & Avocado Salad",
    category: "Appetizers & Cold Starters",
    level: 2,
    station: "Cold Station",
    prepMinutes: 22,
    allergens: ["Shellfish"],
    createdOn: "2026-02-12",
    imageFile: "crab-avocado-salad.png",
    note: "Delicate crab salad with avocado, citrus, and fresh herbs.",
  },
  {
    id: "acs-tomato-tartare",
    title: "Tomato Confit Tartare",
    category: "Appetizers & Cold Starters",
    level: 2,
    station: "Cold Station",
    prepMinutes: 20,
    allergens: [],
    createdOn: "2026-02-08",
    imageFile: "tomato-confit-tartare.png",
    note: "Fine dice tomato tartare with olive tapenade and caper crumble.",
  },
  {
    id: "acs-anchovy-poivron-salad",
    title: "Anchovy & Poivron Salad",
    category: "Appetizers & Cold Starters",
    level: 2,
    station: "Cold Station",
    prepMinutes: 16,
    allergens: ["Fish"],
    createdOn: "2026-02-09",
    imageFile: "anchovy-poivron-salad.png",
    note: "Sweet peppers, anchovy fillets, parsley, and lemon olive oil.",
  },
  {
    id: "car-seabass-carpaccio",
    title: "Seabass Carpaccio",
    category: "Carpaccios",
    level: 1,
    station: "Fish Station",
    prepMinutes: 16,
    allergens: ["Fish"],
    createdOn: "2026-02-07",
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
    createdOn: "2026-02-09",
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
    createdOn: "2026-02-06",
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
    createdOn: "2026-02-05",
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
    createdOn: "2026-02-10",
    imageFile: "scottish-salmon-carpaccio.png",
    note: "Cured salmon ribbons with dill, pink pepper, and citrus zest.",
  },
  {
    id: "des-tarte-tropezienne",
    title: "Tarte Tropezienne",
    category: "Desserts",
    level: 1,
    station: "Pastry",
    prepMinutes: 35,
    allergens: ["Gluten", "Egg", "Dairy"],
    createdOn: "2026-02-13",
    imageFile: "tarte-tropezienne.png",
    note: "Brioche-style tart with vanilla cream and citrus sugar.",
  },
  {
    id: "des-chocolate-mousse",
    title: "Chocolate Hazelnut Mousse",
    category: "Desserts",
    level: 1,
    station: "Pastry",
    prepMinutes: 24,
    allergens: ["Egg", "Dairy", "Nuts"],
    createdOn: "2026-02-03",
    imageFile: "chocolate-hazelnut-mousse.png",
    note: "Silky dark chocolate mousse with roasted hazelnut crunch.",
  },
  {
    id: "des-creme-brulee",
    title: "Vanilla Creme Brulee",
    category: "Desserts",
    level: 2,
    station: "Pastry",
    prepMinutes: 28,
    allergens: ["Egg", "Dairy"],
    createdOn: "2026-02-02",
    imageFile: "vanilla-creme-brulee.png",
    note: "Classic baked custard with caramelized sugar crust.",
  },
  {
    id: "des-citrus-millefeuille",
    title: "Citrus Millefeuille",
    category: "Desserts",
    level: 2,
    station: "Pastry",
    prepMinutes: 38,
    allergens: ["Gluten", "Dairy", "Egg"],
    createdOn: "2026-02-04",
    imageFile: "citrus-millefeuille.png",
    note: "Layered puff pastry with orange blossom cream and grapefruit.",
  },
  {
    id: "des-tarte-citron",
    title: "Tarte au Citron",
    category: "Desserts",
    level: 2,
    station: "Pastry",
    prepMinutes: 30,
    allergens: ["Gluten", "Egg", "Dairy"],
    createdOn: "2026-02-09",
    imageFile: "tarte-au-citron.png",
    note: "Classic lemon tart with smooth curd and caramelized meringue.",
  },
  {
    id: "fs-grilled-seabass",
    title: "Grilled Seabass a la Provencale",
    category: "Fish & Seafood",
    level: 1,
    station: "Fish Station",
    prepMinutes: 26,
    allergens: ["Fish"],
    createdOn: "2026-02-11",
    imageFile: "grilled-seabass-provencale.png",
    note: "Seabass with tomato fondue, olives, and basil.",
  },
  {
    id: "fs-black-cod",
    title: "Baked Black Cod with Citrus",
    category: "Fish & Seafood",
    level: 1,
    station: "Fish Station",
    prepMinutes: 29,
    allergens: ["Fish", "Soy"],
    createdOn: "2026-02-01",
    imageFile: "baked-black-cod-citrus.png",
    note: "Miso-glazed cod with yuzu beurre blanc and herb salad.",
  },
  {
    id: "fs-saffron-prawn-risotto",
    title: "Saffron Prawn Risotto",
    category: "Fish & Seafood",
    level: 2,
    station: "Fish Station",
    prepMinutes: 32,
    allergens: ["Shellfish", "Dairy"],
    createdOn: "2026-02-12",
    imageFile: "saffron-prawn-risotto.png",
    note: "Arborio risotto with saffron, prawns, and lemon zest.",
  },
  {
    id: "fs-lobster-linguine",
    title: "Lobster Linguine",
    category: "Fish & Seafood",
    level: 2,
    station: "Fish Station",
    prepMinutes: 34,
    allergens: ["Shellfish", "Gluten"],
    createdOn: "2026-02-09",
    imageFile: "lobster-linguine.png",
    note: "Linguine in lobster reduction with confit cherry tomatoes.",
  },
  {
    id: "fs-octopus-a-la-plancha",
    title: "Octopus a la Plancha",
    category: "Fish & Seafood",
    level: 2,
    station: "Fish Station",
    prepMinutes: 30,
    allergens: ["Shellfish"],
    createdOn: "2026-02-10",
    imageFile: "octopus-a-la-plancha.png",
    note: "Charred octopus with smoked paprika, potato, and parsley oil.",
  },
  {
    id: "hs-truffle-arancini",
    title: "Truffle Mushroom Arancini",
    category: "Hot Starters",
    level: 1,
    station: "Hot Station",
    prepMinutes: 27,
    allergens: ["Gluten", "Dairy", "Egg"],
    createdOn: "2026-02-07",
    imageFile: "truffle-mushroom-arancini.png",
    note: "Crisp risotto arancini with parmesan and black truffle.",
  },
  {
    id: "hs-prawn-croquettes",
    title: "Prawn & Chili Croquettes",
    category: "Hot Starters",
    level: 1,
    station: "Hot Station",
    prepMinutes: 23,
    allergens: ["Shellfish", "Gluten", "Dairy"],
    createdOn: "2026-02-06",
    imageFile: "prawn-chili-croquettes.png",
    note: "Golden croquettes with spicy prawn filling and aioli.",
  },
  {
    id: "hs-escargot-garlic-butter",
    title: "Escargot in Garlic Butter",
    category: "Hot Starters",
    level: 2,
    station: "Hot Station",
    prepMinutes: 25,
    allergens: ["Dairy"],
    createdOn: "2026-02-08",
    imageFile: "escargot-garlic-butter.png",
    note: "Snails baked in herb butter with parsley and lemon.",
  },
  {
    id: "hs-baked-camembert",
    title: "Baked Camembert with Herbs",
    category: "Hot Starters",
    level: 2,
    station: "Hot Station",
    prepMinutes: 19,
    allergens: ["Dairy", "Gluten"],
    createdOn: "2026-02-10",
    imageFile: "baked-camembert-herbs.png",
    note: "Warm baked camembert served with thyme honey toast.",
  },
  {
    id: "hs-stuffed-zucchini-flowers",
    title: "Stuffed Zucchini Flowers",
    category: "Hot Starters",
    level: 2,
    station: "Hot Station",
    prepMinutes: 24,
    allergens: ["Dairy", "Gluten"],
    createdOn: "2026-02-09",
    imageFile: "stuffed-zucchini-flowers.png",
    note: "Zucchini flowers stuffed with ricotta, lightly fried and crisp.",
  },
  {
    id: "meat-lamb-cutlets",
    title: "Lamb Cutlets with Rosemary Jus",
    category: "Meat",
    level: 1,
    station: "Grill",
    prepMinutes: 31,
    allergens: [],
    createdOn: "2026-02-13",
    imageFile: "lamb-cutlets-rosemary-jus.png",
    note: "Charred lamb cutlets with rosemary jus and grilled courgette.",
  },
  {
    id: "meat-beef-au-poivre",
    title: "Beef Tenderloin au Poivre",
    category: "Meat",
    level: 1,
    station: "Grill",
    prepMinutes: 33,
    allergens: ["Dairy"],
    createdOn: "2026-02-04",
    imageFile: "beef-tenderloin-au-poivre.png",
    note: "Pepper-crusted beef with creamy cognac sauce.",
  },
  {
    id: "meat-chicken-paillard",
    title: "Chicken Paillard with Lemon",
    category: "Meat",
    level: 2,
    station: "Grill",
    prepMinutes: 24,
    allergens: [],
    createdOn: "2026-02-03",
    imageFile: "chicken-paillard-lemon.png",
    note: "Thin grilled chicken, rocket salad, and lemon dressing.",
  },
  {
    id: "meat-braised-veal-cheeks",
    title: "Braised Veal Cheeks",
    category: "Meat",
    level: 2,
    station: "Hot Station",
    prepMinutes: 40,
    allergens: ["Dairy"],
    createdOn: "2026-02-02",
    imageFile: "braised-veal-cheeks.png",
    note: "Slow braised veal cheeks with root vegetables.",
  },
  {
    id: "meat-duck-breast-orange-jus",
    title: "Duck Breast with Orange Jus",
    category: "Meat",
    level: 2,
    station: "Grill",
    prepMinutes: 29,
    allergens: [],
    createdOn: "2026-02-09",
    imageFile: "duck-breast-orange-jus.png",
    note: "Pan-seared duck breast with citrus jus and charred endive.",
  },
  {
    id: "mock-riviera-spritz",
    title: "Riviera Citrus Spritz",
    category: "Mocktails",
    level: 1,
    station: "Bar",
    prepMinutes: 6,
    allergens: [],
    createdOn: "2026-02-05",
    imageFile: "riviera-citrus-spritz.png",
    note: "Sparkling citrus blend with blood orange and rosemary.",
  },
  {
    id: "mock-cucumber-basil-cooler",
    title: "Cucumber Basil Cooler",
    category: "Mocktails",
    level: 1,
    station: "Bar",
    prepMinutes: 5,
    allergens: [],
    createdOn: "2026-02-07",
    imageFile: "cucumber-basil-cooler.png",
    note: "Cucumber tonic with basil syrup and lime.",
  },
  {
    id: "mock-pomegranate-fizz",
    title: "Pomegranate Garden Fizz",
    category: "Mocktails",
    level: 2,
    station: "Bar",
    prepMinutes: 7,
    allergens: [],
    createdOn: "2026-02-08",
    imageFile: "pomegranate-garden-fizz.png",
    note: "Pomegranate, mint, and pink grapefruit topped with soda.",
  },
  {
    id: "mock-passionfruit-collins",
    title: "Passionfruit Ginger Collins",
    category: "Mocktails",
    level: 2,
    station: "Bar",
    prepMinutes: 7,
    allergens: [],
    createdOn: "2026-02-09",
    imageFile: "passionfruit-ginger-collins.png",
    note: "Passionfruit puree, ginger cordial, and lemon tonic.",
  },
  {
    id: "mock-rose-lemonade",
    title: "Rose & Citrus Lemonade",
    category: "Mocktails",
    level: 2,
    station: "Bar",
    prepMinutes: 6,
    allergens: [],
    createdOn: "2026-02-10",
    imageFile: "rose-citrus-lemonade.png",
    note: "Fresh lemonade with rose water, mint, and pink grapefruit.",
  },
];

const baseUsdPriceByRecipeId: Record<string, number> = {
  "acs-salade-nicoise": 32,
  "acs-burrata-provencale": 28,
  "acs-crab-avocado-salad": 34,
  "acs-tomato-tartare": 26,
  "acs-anchovy-poivron-salad": 27,
  "car-seabass-carpaccio": 31,
  "car-tuna-carpaccio": 34,
  "car-beef-carpaccio": 36,
  "car-bluefin-tuna-carpaccio": 42,
  "car-salmon-carpaccio": 33,
  "des-tarte-tropezienne": 19,
  "des-chocolate-mousse": 18,
  "des-creme-brulee": 17,
  "des-citrus-millefeuille": 21,
  "des-tarte-citron": 18,
  "fs-grilled-seabass": 48,
  "fs-black-cod": 54,
  "fs-saffron-prawn-risotto": 46,
  "fs-lobster-linguine": 62,
  "fs-octopus-a-la-plancha": 52,
  "hs-truffle-arancini": 27,
  "hs-prawn-croquettes": 29,
  "hs-escargot-garlic-butter": 32,
  "hs-baked-camembert": 25,
  "hs-stuffed-zucchini-flowers": 26,
  "meat-lamb-cutlets": 56,
  "meat-beef-au-poivre": 64,
  "meat-chicken-paillard": 42,
  "meat-braised-veal-cheeks": 58,
  "meat-duck-breast-orange-jus": 52,
  "mock-riviera-spritz": 14,
  "mock-cucumber-basil-cooler": 13,
  "mock-pomegranate-fizz": 16,
  "mock-passionfruit-collins": 15,
  "mock-rose-lemonade": 14,
};

const defaultBaseUsdPriceByCategory: Record<RecipeCategory, number> = {
  "Appetizers & Cold Starters": 29,
  Carpaccios: 34,
  Desserts: 19,
  "Fish & Seafood": 52,
  "Hot Starters": 27,
  Meat: 56,
  Mocktails: 15,
};

const recipes: RecipeSummary[] = recipeSeeds.map((recipe) => {
  const basePriceUsd =
    baseUsdPriceByRecipeId[recipe.id] ??
    defaultBaseUsdPriceByCategory[recipe.category];

  return {
    ...recipe,
    prices: buildRecipePrices(basePriceUsd),
  };
});

const categories = [...new Set(recipes.map((recipe) => recipe.category))];
const statusOptions: RecipeStatus[] = ["Active", "Archived", "Draft"];
const restaurantOptions = appRestaurants.filter(
  (restaurant) => !restaurant.disabled,
);
const defaultRestaurantId = restaurantOptions[0]?.id ?? "";
const conceptOrder = [
  "La Petite Maison",
  "LPM RESTAURANT & BAR",
  "Le CAFE",
] as const;
const restaurantGroups = conceptOrder
  .map((concept) => ({
    concept,
    items: restaurantOptions.filter(
      (restaurant) => restaurant.concept === concept,
    ),
  }))
  .filter((group) => group.items.length > 0);
const recipesByCategory = categories.reduce(
  (acc, category) => {
    acc[category] = recipes.filter((recipe) => recipe.category === category);
    return acc;
  },
  {} as Record<RecipeCategory, RecipeSummary[]>,
);

function hashToPositiveInt(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function isRecipeAvailableAtRestaurant(
  recipe: RecipeSummary,
  restaurantId: string,
) {
  const categoryRecipes = recipesByCategory[recipe.category];
  const recipeIndex = categoryRecipes.findIndex(
    (item) => item.id === recipe.id,
  );
  if (recipeIndex < 0) {
    return false;
  }

  // Keep at least 4 recipes visible per category, allowing 4-6 depending on category size.
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

  return !hiddenIndexes.has(recipeIndex);
}

function restaurantLabel(restaurantId: string) {
  const restaurant = restaurantOptions.find((item) => item.id === restaurantId);
  if (!restaurant) {
    return "Restaurant";
  }

  const duplicateTitleCount = restaurantOptions.filter(
    (item) => item.title === restaurant.title,
  ).length;
  return duplicateTitleCount > 1
    ? `${restaurant.title} (${restaurant.concept})`
    : restaurant.title;
}

function recipeStatus(recipe: RecipeSummary): RecipeStatus {
  if (recipe.createdOn >= "2026-02-10") {
    return "Active";
  }
  if (recipe.createdOn >= "2026-02-06") {
    return "Draft";
  }
  return "Archived";
}

function statusBadgeClass(status: RecipeStatus) {
  if (status === "Active") {
    return "border-emerald-600/55 text-emerald-700 bg-emerald-500/8";
  }
  if (status === "Draft") {
    return "border-blue-600/55 text-blue-700 bg-blue-500/8";
  }
  return "border-border text-muted-foreground bg-muted/35";
}

const outlinedSecondaryBadgeClass =
  "border-secondary/55 text-secondary bg-transparent";

export function RecipeLibraryContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState<string>(defaultRestaurantId);
  const [selectedStatus, setSelectedStatus] = useState<RecipeStatus | null>(
    null,
  );
  const [selectedCategories, setSelectedCategories] = useState<
    RecipeCategory[]
  >([]);

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const visible = recipes.filter((recipe) => {
      const matchesSearch =
        query.length === 0 ||
        [recipe.title, recipe.category, recipe.note, recipe.station]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(recipe.category);
      const matchesRestaurant = selectedRestaurantId
        ? isRecipeAvailableAtRestaurant(recipe, selectedRestaurantId)
        : true;
      const matchesStatus =
        selectedStatus === null || recipeStatus(recipe) === selectedStatus;

      return (
        matchesSearch && matchesCategory && matchesRestaurant && matchesStatus
      );
    });

    return [...visible].sort(
      (a, b) =>
        new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
    );
  }, [searchQuery, selectedCategories, selectedRestaurantId, selectedStatus]);

  const groupedRecipes = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: filteredRecipes.filter((recipe) => recipe.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredRecipes]);

  const categoryFilterLabel =
    selectedCategories.length === 0
      ? "Categories"
      : selectedCategories.length === 1
        ? selectedCategories[0]
        : `${selectedCategories[0]} +${selectedCategories.length - 1}`;
  const restaurantFilterLabel = restaurantLabel(selectedRestaurantId);
  const statusFilterLabel = selectedStatus ?? "Status";

  const toggleCategory = (category: RecipeCategory) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category],
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WebAppPageHeader
        title="Recipe Library"
        actions={
          <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
            {filteredRecipes.length} Recipes
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
              placeholder="Search recipe title, category, or station..."
              aria-label="Search recipes"
            />
          </div>

          <DropdownMenu>
            <ButtonGroup>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-8 min-w-[180px] max-w-[260px] items-center justify-between gap-2 border px-2.5 text-xs",
                      "border-primary/45 bg-primary/10 text-foreground",
                    )}
                  />
                }
              >
                <span className="truncate text-left">
                  {restaurantFilterLabel}
                </span>
                <ChevronsUpDownIcon className="size-3.5 shrink-0" />
              </DropdownMenuTrigger>
            </ButtonGroup>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuRadioGroup
                value={selectedRestaurantId}
                onValueChange={(value) => {
                  if (value) {
                    setSelectedRestaurantId(value);
                  }
                }}
              >
                {restaurantGroups.map((group, index) => (
                  <div key={group.concept}>
                    {index > 0 ? <DropdownMenuSeparator /> : null}
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{group.concept}</DropdownMenuLabel>
                      {group.items.map((restaurant) => (
                        <DropdownMenuRadioItem
                          key={restaurant.id}
                          value={restaurant.id}
                        >
                          {restaurantLabel(restaurant.id)}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuGroup>
                  </div>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <ButtonGroup>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-8 min-w-[140px] max-w-[180px] items-center justify-between gap-2 border px-2.5 text-xs",
                      selectedStatus === null
                        ? "border-border bg-background text-muted-foreground"
                        : "border-primary/45 bg-primary/10 text-foreground",
                      selectedStatus !== null ? "border-r-0" : "",
                    )}
                  />
                }
              >
                <span className="truncate text-left">{statusFilterLabel}</span>
                <ChevronsUpDownIcon className="size-3.5 shrink-0" />
              </DropdownMenuTrigger>
              {selectedStatus !== null ? (
                <button
                  type="button"
                  aria-label="Clear selected status"
                  onClick={() => setSelectedStatus(null)}
                  className="border-primary/45 bg-primary/10 text-foreground inline-flex h-8 w-8 items-center justify-center border border-l px-0"
                >
                  <XIcon className="size-3.5" />
                </button>
              ) : null}
            </ButtonGroup>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={selectedStatus ?? ""}
                  onValueChange={(value) =>
                    setSelectedStatus((value as RecipeStatus | "") || null)
                  }
                >
                  {statusOptions.map((status) => (
                    <DropdownMenuRadioItem key={status} value={status}>
                      {status}
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
                      "inline-flex h-8 min-w-[220px] max-w-[280px] items-center justify-between gap-2 border px-2.5 text-xs",
                      selectedCategories.length === 0
                        ? "border-border bg-background text-muted-foreground"
                        : "border-primary/45 bg-primary/10 text-foreground",
                      selectedCategories.length > 0 ? "border-r-0" : "",
                    )}
                  />
                }
              >
                <span className="truncate text-left">
                  {categoryFilterLabel}
                </span>
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
                {categories.map((category) => (
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
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_26%,white_74%),var(--background))]">
        <div className="space-y-5 p-4">
          {groupedRecipes.length === 0 ? (
            <div className="border border-border bg-background p-5 text-xs">
              No recipes match the current search and filters.
            </div>
          ) : (
            groupedRecipes.map((group) => (
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
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {group.items.map((recipe) => {
                    const status = recipeStatus(recipe);
                    const menuPrice = recipePriceForRestaurant(
                      recipe,
                      selectedRestaurantId,
                    );
                    return (
                      <article
                        key={recipe.id}
                        className="border border-border bg-background"
                      >
                        <RecipeCardImage imageFile={recipe.imageFile} />
                        <div className="space-y-2 p-3">
                          <div className="flex min-w-0 items-start justify-between gap-2">
                            <p className="line-clamp-1 min-w-0 flex-1 truncate text-sm leading-tight">
                              {recipe.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={statusBadgeClass(status)}
                            >
                              {status}
                            </Badge>
                          </div>
                          <p className="text-xs leading-none">
                            {formatRecipePrice(menuPrice)}
                          </p>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {recipe.note}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <Badge
                              variant="outline"
                              className={`${outlinedSecondaryBadgeClass} gap-1`}
                            >
                              <Layers3Icon className="size-3" />
                              {recipe.station}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${outlinedSecondaryBadgeClass} gap-1`}
                            >
                              <Clock3Icon className="size-3" />
                              {recipe.prepMinutes} min
                            </Badge>
                            {(recipe.allergens.length > 0
                              ? recipe.allergens
                              : ["No allergens listed"]
                            ).map((allergen) => (
                              <Badge
                                key={`${recipe.id}-${allergen}`}
                                variant="outline"
                                className={`${outlinedSecondaryBadgeClass} gap-1`}
                              >
                                <AlertTriangleIcon className="size-3" />
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function RecipeCardImage({ imageFile }: { imageFile: string }) {
  const imageCandidates = useMemo(
    () => [`/recipes/${imageFile}`, `/${imageFile}`],
    [imageFile],
  );
  const [imageCandidateIndex, setImageCandidateIndex] = useState(0);
  const imageSrc = imageCandidates[imageCandidateIndex];
  const hasImageSource = typeof imageSrc === "string";

  return (
    <div className="border-border/70 relative overflow-hidden border-b bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--primary)_24%,transparent),transparent_48%),linear-gradient(145deg,color-mix(in_oklch,var(--muted)_70%,white_30%),color-mix(in_oklch,var(--background)_88%,var(--muted)_12%))]">
      <div className="p-3">
        <div className="border-border/60 relative aspect-16/10 overflow-hidden border bg-background/65">
          {hasImageSource ? (
            <Image
              src={imageSrc}
              alt={`${imageFile} recipe photo`}
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover"
              onError={() =>
                setImageCandidateIndex((currentIndex) => currentIndex + 1)
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
