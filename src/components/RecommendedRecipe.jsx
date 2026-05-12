import React, { useMemo } from "react";
import RecipeCard from "./RecipeCard";
import { Sparkles, ChefHat, Loader2 } from "lucide-react";
import SectionHero from "./SectionHero";
import About from "./../pages/About";

export default function RecommendedRecipe({
  recipes,
  pantry,
  loading,
  onRecipeClick,
}) {
  const calculateMatches = (recipeIngredients, pantryItems) => {
    if (!recipeIngredients || !pantryItems || pantryItems.length === 0)
      return 0;

    const lowerPantry = pantryItems.map((p) =>
      (typeof p === "string" ? p : p.name || "").toLowerCase(),
    );

    return recipeIngredients.filter((ing) => {
      const ingName = (
        typeof ing === "string" ? ing : ing.name || ""
      ).toLowerCase();
      return lowerPantry.some(
        (pItem) => ingName.includes(pItem) || pItem.includes(ingName),
      );
    }).length;
  };

  const displayList = useMemo(() => {
    if (loading || !recipes) return [];
    if (pantry.length === 0)
      return recipes.slice(0, 8).map((r) => ({ ...r, matchCount: 0 }));

    return recipes
      .map((r) => ({
        ...r,
        matchCount: calculateMatches(r.ingredients, pantry),
      }))
      .filter((r) => r.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  }, [recipes, pantry, loading]);

  if (loading)
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-orange-500" size={40} />
      </div>
    );

  return (
    <section className="pt-10">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
          {pantry.length > 0 ? "What you can cook" : "Featured Recipes"}
          <Sparkles className="text-yellow-500" />
        </h2>
        <p className="text-gray-500 font-medium">
          Suggestions based on your full pantry.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayList.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            {...recipe}
            matchCount={recipe.matchCount}
            onClick={() => onRecipeClick(recipe)}
          />
        ))}
      </div>
    </section>
  );
}
