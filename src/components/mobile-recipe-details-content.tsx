"use client";

import Image from "next/image";

import { saladeNicoiseRecipe } from "@/lib/salade-nicoise-recipe";
import { cn } from "@/lib/utils";

type RecipeInfoSection = {
  title: string;
  lines: string[];
  className?: string;
};

const recipeInfoSections: RecipeInfoSection[] = [
  {
    title: "Dish Announcement",
    lines: [saladeNicoiseRecipe.dishAnnouncement],
  },
  {
    title: "Ingredients",
    lines: saladeNicoiseRecipe.ingredients,
  },
  {
    title: "Dressing / Sauce",
    lines: saladeNicoiseRecipe.dressing,
  },
  {
    title: "Garnish",
    lines: saladeNicoiseRecipe.garnish,
  },
  {
    title: "Allergens",
    lines: saladeNicoiseRecipe.allergens,
  },
  {
    title: "Service Tools",
    lines: saladeNicoiseRecipe.serviceTools,
  },
  {
    title: "Restaurants",
    lines: saladeNicoiseRecipe.restaurants,
  },
  {
    title: "Preparation Steps",
    lines: saladeNicoiseRecipe.preparationSteps,
    className: "min-h-32",
  },
  {
    title: "Chef Notes",
    lines: saladeNicoiseRecipe.chefNotes,
    className: "min-h-32",
  },
];

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
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

export function MobileRecipeDetailsContent() {
  const embedUrl = toYouTubeEmbedUrl(saladeNicoiseRecipe.youtubeUrl);

  return (
    <div className="space-y-3">
      <section className="space-y-2">
        <p className="text-muted-foreground text-[10px] uppercase tracking-[0.16em]">
          Medias
        </p>
        <div className="overflow-x-auto pb-1">
          <div className="flex w-max gap-2 pr-1">
            <article className="w-[292px] shrink-0 border border-border bg-background">
              <div className="border-b border-border/70 px-3 py-2">
                <p className="text-xs">Video</p>
              </div>
              <div className="p-2">
                {embedUrl ? (
                  <div className="border-border/60 aspect-video overflow-hidden border bg-black">
                    <iframe
                      title={`${saladeNicoiseRecipe.title} video`}
                      src={embedUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="border-border/60 bg-muted/20 p-3 text-[11px] text-muted-foreground border">
                    Unable to load YouTube preview.
                  </div>
                )}
              </div>
            </article>

            <article className="w-[292px] shrink-0 border border-border bg-background">
              <div className="border-b border-border/70 px-3 py-2">
                <p className="text-xs">Dish Picture</p>
              </div>
              <div className="p-2">
                <div className="border-border/60 relative aspect-video overflow-hidden border bg-muted/20">
                  <Image
                    src={`/${saladeNicoiseRecipe.imageFile}`}
                    alt="Salade Nicoise dish"
                    fill
                    sizes="(max-width: 430px) 82vw, 292px"
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {saladeNicoiseRecipe.description}
      </p>

      <div className="grid gap-2">
        {recipeInfoSections.map((section) => (
          <RecipeInfoCard
            key={section.title}
            title={section.title}
            lines={section.lines}
            className={section.className}
          />
        ))}
      </div>
    </div>
  );
}

function RecipeInfoCard({
  title,
  lines,
  className,
}: {
  title: string;
  lines: string[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative border border-border bg-background p-0",
        "min-h-24",
        className,
      )}
    >
      <p className="text-muted-foreground pointer-events-none absolute top-3 left-3 z-10 text-[10px] uppercase tracking-[0.16em]">
        {title}
      </p>
      <div className="space-y-1.5 px-3 pb-3 pt-8 text-xs leading-relaxed">
        {lines.map((line) => (
          <p key={`${title}-${line}`}>{line}</p>
        ))}
      </div>
    </section>
  );
}
