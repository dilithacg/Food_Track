import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeService } from "../api/recipeService";
import RecipeCard from "../components/RecipeCard";
import RecipeDetails from "./RecipeDetails"; // Import the Details component
import Navbar from "../components/Navbar";
import { ArrowLeft, Search, Loader2, Utensils } from "lucide-react";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Track selected recipe
  const navigate = useNavigate();

  // 1. Fetch All Recipes
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await RecipeService.getAllRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 2. Filter logic
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 3. NAVIGATION LOGIC: If a user clicks a recipe, show the Details view
  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)} // This button will now reset the view to the list
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex font-sans antialiased">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-green-800 font-black hover:gap-3 transition-all group"
            >
              <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-green-800 group-hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </div>
              Back to Home
            </button>

            <div className="relative flex-1 max-w-md group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search all recipes..."
                className="w-full pl-12 pr-4 py-4 rounded-[2rem] border-none shadow-sm focus:ring-2 focus:ring-green-100 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2 tracking-tight">
              All Recipes
            </h1>
            <p className="text-gray-500 font-medium italic">
              Explore our full collection of {recipes.length} culinary
              masterpieces.
            </p>
          </div>

          {/* GRID SECTION */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-green-800">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p className="font-bold">Loading cookbook...</p>
            </div>
          ) : (
            <>
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      {...recipe}
                      matchCount={0}
                      onClick={() => setSelectedRecipe(recipe)} // Sets the state to show details
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                  <Utensils className="mx-auto text-gray-300 mb-4" size={40} />
                  <p className="text-gray-400 font-bold text-lg">
                    No recipes match your search.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
