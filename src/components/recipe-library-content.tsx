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
import {
  categories,
  formatRecipePrice,
  isRecipeAvailableAtRestaurant,
  recipePriceForRestaurant,
  recipeStatus,
  recipes,
  statusOptions,
  type RecipeCategory,
  type RecipeStatus,
} from "@/lib/menu-mock-data";
import { cn } from "@/lib/utils";

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
        title="Menus"
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
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
