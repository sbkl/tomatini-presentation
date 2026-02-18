import { DashboardPage } from "@/components/dashboard-page";
import { RecipeCreationPage } from "@/components/recipe-creation-page";
import { RecipeLibraryPage } from "@/components/recipe-library-page";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-12">
      <DashboardPage />
      <RecipeCreationPage />
      <RecipeLibraryPage />
    </div>
  );
}
