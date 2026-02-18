import { DashboardPage } from "@/components/dashboard-page";
import { Logo } from "@/components/logo";
import { RecipeCreationPage } from "@/components/recipe-creation-page";
import { RecipeLibraryPage } from "@/components/recipe-library-page";
import { TrainingModuleDetailsPage } from "@/components/training-module-details-page";
import { TrainingModulesPage } from "@/components/training-modules-page";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
      <header className="rounded-[12px] border border-border/70 bg-[radial-gradient(circle_at_top,oklch(0.97_0.02_32),transparent_50%),radial-gradient(circle_at_top_right,oklch(0.6489_0.1708_28.21/0.1),transparent_45%),linear-gradient(oklch(0.99_0.004_95),oklch(0.97_0.012_80))] p-6 sm:p-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Logo className="size-24 shrink-0 border-none p-0 shadow-none sm:size-28" />
          <div className="space-y-1 sm:space-y-2">
            <h1 className="font-versailles text-4xl leading-none sm:text-6xl">
              Tomatini
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              The Agents Driven Training Platform.
            </p>
          </div>
        </div>
      </header>
      <DashboardPage />
      <RecipeLibraryPage />
      <RecipeCreationPage />
      <TrainingModulesPage />
      <TrainingModuleDetailsPage />
    </div>
  );
}
