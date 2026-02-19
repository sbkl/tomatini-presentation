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
  const recipeIndex = categoryRecipes.findIndex((item) => item.id === recipe.id);
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

function recipeStatus(recipe: RecipeSummary): RecipeStatus {
  if (recipe.createdOn >= "2026-02-10") {
    return "Active";
  }
  if (recipe.createdOn >= "2026-02-06") {
    return "Draft";
  }
  return "Archived";
}

const DUBAI_RESTAURANT_ID = "dubai";

export type {
  CurrencyCode,
  RecipeCategory,
  RecipeLevel,
  RecipePrice,
  RecipeStation,
  RecipeStatus,
  RecipeSummary,
};

export {
  DUBAI_RESTAURANT_ID,
  categories,
  formatRecipePrice,
  isRecipeAvailableAtRestaurant,
  recipePriceForRestaurant,
  recipeStatus,
  recipes,
  statusOptions,
};
