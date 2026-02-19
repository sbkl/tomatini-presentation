"use client";

import { useMemo, useState } from "react";
import { Clock3Icon, Layers3Icon, MapPinIcon } from "lucide-react";
import Image from "next/image";

import { appRestaurants } from "@/components/web-app-layout";
import { Badge } from "@/components/ui/badge";
import {
  DUBAI_RESTAURANT_ID,
  categories,
  formatRecipePrice,
  isRecipeAvailableAtRestaurant,
  recipePriceForRestaurant,
  recipes,
} from "@/lib/menu-mock-data";

const outlinedSecondaryBadgeClass =
  "border-secondary/55 text-secondary bg-transparent";
const compactBadgeClass = `${outlinedSecondaryBadgeClass} gap-1 px-1.5 py-0.5 text-[10px]`;

const dubaiRestaurant =
  appRestaurants.find((restaurant) => restaurant.id === DUBAI_RESTAURANT_ID) ??
  null;
const dubaiRecipes = recipes.filter((recipe) =>
  isRecipeAvailableAtRestaurant(recipe, DUBAI_RESTAURANT_ID),
);
const groupedDubaiRecipes = categories
  .map((category) => ({
    category,
    items: dubaiRecipes.filter((recipe) => recipe.category === category),
  }))
  .filter((group) => group.items.length > 0);

export function MobileMenusContent() {
  return (
    <div className="space-y-3">
      <section className="border-border/70 space-y-2 border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_35%,white_65%),color-mix(in_oklch,var(--background)_90%,var(--muted)_10%))] p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm leading-none">{dubaiRestaurant?.title ?? "Dubai"}</p>
          <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
            {dubaiRecipes.length} Dishes
          </Badge>
        </div>
        <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
          <MapPinIcon className="size-3" />
          {dubaiRestaurant?.subtitle ?? "DIFC, Gate Village 08"}
        </p>
      </section>

      {groupedDubaiRecipes.map((group) => (
        <section key={group.category} className="space-y-2">
          <div className="border-border/70 sticky top-[5.5rem] z-20 border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_42%,white_58%),color-mix(in_oklch,var(--background)_88%,var(--muted)_12%))] px-2.5 py-1.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[11px] uppercase tracking-[0.12em]">
                {group.category}
              </h3>
              <Badge variant="outline" className={outlinedSecondaryBadgeClass}>
                {group.items.length}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {group.items.map((recipe) => {
              const menuPrice = recipePriceForRestaurant(recipe, DUBAI_RESTAURANT_ID);
              return (
                <article
                  key={recipe.id}
                  className="border-border/70 overflow-hidden border bg-background"
                >
                  <DishCardImage imageFile={recipe.imageFile} />

                  <div className="space-y-1.5 p-2">
                    <p className="line-clamp-2 text-[11px] leading-tight">{recipe.title}</p>
                    <p className="text-[10px] leading-none">
                      {formatRecipePrice(menuPrice)}
                    </p>
                    <p className="text-muted-foreground line-clamp-2 text-[10px] leading-snug">
                      {recipe.note}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className={compactBadgeClass}>
                        <Clock3Icon className="size-2.5" />
                        {recipe.prepMinutes}m
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${compactBadgeClass} min-w-0 max-w-full`}
                      >
                        <Layers3Icon className="size-2.5 shrink-0" />
                        <span className="truncate">{recipe.station}</span>
                      </Badge>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function DishCardImage({ imageFile }: { imageFile: string }) {
  const imageCandidates = useMemo(
    () => [`/recipes/${imageFile}`, `/${imageFile}`],
    [imageFile],
  );
  const [imageCandidateIndex, setImageCandidateIndex] = useState(0);
  const imageSrc = imageCandidates[imageCandidateIndex];
  const hasImageSource = typeof imageSrc === "string";

  return (
    <div className="border-border/70 relative overflow-hidden border-b bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--primary)_24%,transparent),transparent_48%),linear-gradient(145deg,color-mix(in_oklch,var(--muted)_70%,white_30%),color-mix(in_oklch,var(--background)_88%,var(--muted)_12%))]">
      <div className="p-1.5">
        <div className="border-border/60 relative aspect-4/3 overflow-hidden border bg-background/65">
          {hasImageSource ? (
            <Image
              src={imageSrc}
              alt={`${imageFile} recipe photo`}
              fill
              sizes="(max-width: 430px) 50vw, 220px"
              className="object-cover"
              onError={() =>
                setImageCandidateIndex((currentIndex) => currentIndex + 1)
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center">
              <p className="text-muted-foreground text-[10px] leading-tight">
                Placeholder image
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
