export type SaladeNicoiseRecipe = {
  title: string;
  description: string;
  dishAnnouncement: string;
  ingredients: string[];
  dressing: string[];
  garnish: string[];
  allergens: string[];
  serviceTools: string[];
  preparationSteps: string[];
  chefNotes: string[];
  restaurants: string[];
  imageFile: string;
  youtubeUrl: string;
};

export const saladeNicoiseRecipe: SaladeNicoiseRecipe = {
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
  serviceTools: ["Big fork", "Big spoon"],
  preparationSteps: [
    "Marinate tuna lightly with olive oil, sea salt, and lemon zest.",
    "Arrange vegetables and lettuce in a chilled shallow bowl.",
    "Place sliced tuna on top and finish with dressing and garnish.",
  ],
  chefNotes: [
    "Keep tuna cold until final plating.",
    "Dressing should be served fresh and emulsified.",
  ],
  restaurants: ["London", "Dubai"],
  imageFile: "salade-nicoise.png",
  youtubeUrl: "https://youtu.be/DzYS7J0V6qk",
};
