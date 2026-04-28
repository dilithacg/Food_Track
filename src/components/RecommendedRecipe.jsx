import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import RecipeCard from "./RecipeCard";
import { Loader2, Sparkles, ChefHat, ArrowRight } from "lucide-react";

export default function RecommendedRecipe({
  recipes,
  pantry,
  loading,
  onRecipeClick,
}) {
  const navigate = useNavigate();

  // 1. Logic to calculate matches
  const calculateMatches = (recipeIngredients, pantryItems) => {
    if (!recipeIngredients || pantryItems.length === 0) return 0;
    const lowerPantry = pantryItems.map((p) => p.toLowerCase());

    return recipeIngredients.filter((ing) =>
      lowerPantry.some((pItem) => ing.name.toLowerCase().includes(pItem)),
    ).length;
  };

  // 2. Main Logic Process (Memoized for performance)
  const displayList = useMemo(() => {
    if (loading || recipes.length === 0) return [];

    // CASE A: If Pantry is Empty -> Show 8 Random Recipes (Featured Mode)
    if (pantry.length === 0) {
      return [...recipes]
        .sort(() => 0.5 - Math.random())
        .slice(0, 8)
        .map((r) => ({ ...r, currentMatchCount: 0 }));
    }

    // CASE B: If Pantry has items -> Show ONLY matching recipes (Smart Mode)
    return recipes
      .map((recipe) => ({
        ...recipe,
        currentMatchCount: calculateMatches(recipe.ingredients, pantry),
      }))
      .filter((recipe) => recipe.currentMatchCount > 0)
      .sort((a, b) => b.currentMatchCount - a.currentMatchCount);
  }, [recipes, pantry, loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-green-800">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold">Loading recipes...</p>
      </div>
    );
  }

  const isFiltering = pantry.length > 0;

  return (
    <section className="mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            {isFiltering ? "What you can cook" : "Featured Recipes"}
            {isFiltering ? (
              <Sparkles className="text-yellow-500" size={24} />
            ) : (
              <ChefHat className="text-green-600" size={24} />
            )}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isFiltering
              ? `We found ${displayList.length} recipes matching your pantry.`
              : "Explore our hand-picked favorites for you."}
          </p>
        </div>

        {/* View All Recipes Grid Button */}
        <button
          onClick={() => navigate("/all-recipes")}
          className="group flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:bg-green-50 transition-all active:scale-95"
        >
          <span className="text-sm font-bold text-gray-700 group-hover:text-green-700">
            View All Recipes
          </span>
          <ArrowRight
            size={18}
            className="text-gray-400 group-hover:text-green-700"
          />
        </button>
      </div>

      {/* Grid Section */}
      {displayList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {displayList.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              {...recipe}
              matchCount={recipe.currentMatchCount}
              onClick={() => onRecipeClick(recipe)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100 px-6">
          <p className="text-gray-400 font-bold max-w-xs mx-auto">
            No recipes found for those ingredients. Try adding basic items like
            "oil" or "salt"!
          </p>
        </div>
      )}
    </section>
  );
}
