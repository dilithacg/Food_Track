import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Search,
  SlidersHorizontal,
  Bell,
  ChevronRight,
  Plus,
  X,
  User,
} from "lucide-react";
import About from "./About";
import RecommendedRecipe from "../components/RecommendedRecipe"; // New Import
import RecipeDetails from "./RecipeDetails";
import { useAuth } from "../context/AuthContext";
import { RecipeService } from "../api/recipeService";
import { PantryService } from "../api/pantryService";
import ChatAssistant from "../components/ChatAssistant";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [recipes, setRecipes] = useState([]);
  const [pantry, setPantry] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");

  // 1. Fetch Recipes and Sync Pantry on Mount
  useEffect(() => {
    const initHome = async () => {
      try {
        const recipeData = await RecipeService.getAllRecipes();
        setRecipes(recipeData);
      } catch (err) {
        console.error("Failed to load recipes", err);
      } finally {
        setLoading(false);
      }
    };

    initHome();

    // 2. Real-time Pantry Subscription
    let unsubscribePantry;
    if (user) {
      unsubscribePantry = PantryService.subscribeToPantry(user.uid, (data) => {
        setPantry(data);
      });
    }

    return () => {
      if (unsubscribePantry) unsubscribePantry();
    };
  }, [user]);

  // Handlers
  const handleAddIngredient = async (e) => {
    e.preventDefault();
    if (!newItem.trim() || !user) return;
    // Standardize to lowercase for better matching logic
    await PantryService.addIngredient(user.uid, newItem.trim().toLowerCase());
    setNewItem("");
  };

  const handleRemoveIngredient = async (item) => {
    if (!user) return;
    await PantryService.removeIngredient(user.uid, item);
  };

  // NAVIGATION LOGIC: Show Details overlay if a recipe is selected
  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex font-sans antialiased overflow-x-hidden">
      <Navbar />

      <main className="flex-1 bg-[#f4f1ea] p-6 md:p-12 lg:p-16 w-full transition-all duration-500 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
            <div className="w-full lg:w-auto text-center lg:text-left">
              <h1 className="text-4xl font-black text-gray-800 tracking-tight">
                FoodTrack
              </h1>
              <p className="text-gray-500 font-medium">Cooking made smarter.</p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative group flex-1 lg:w-96">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full bg-white border-none rounded-2xl py-4 pl-14 shadow-sm outline-none focus:ring-2 focus:ring-green-100 transition-all"
                />
                <SlidersHorizontal
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-600"
                  size={20}
                />
              </div>
              <button className="p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 border border-gray-50 transition-colors">
                <Bell className="text-gray-700" size={24} />
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 border border-gray-50 transition-colors"
              >
                <User className="text-gray-700" size={24} />
              </button>
            </div>
          </div>

          {/* HERO */}
          <section className="relative overflow-hidden bg-green-900 rounded-[3.5rem] p-10 md:p-16 text-white mb-16 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <span className="bg-green-700/50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                Weekly Feature
              </span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Master the Art of <br />{" "}
                <span className="text-green-400">Authentic Kottu</span>
              </h2>
              <button className="bg-white text-green-900 px-10 py-4 rounded-3xl font-black hover:bg-green-50 transition-all flex items-center gap-3 active:scale-95">
                Cook This Now <ChevronRight size={20} />
              </button>
            </div>
            <div className="absolute right-[-5%] bottom-[-10%] text-[300px] opacity-10 rotate-12 pointer-events-none select-none">
              🥘
            </div>
          </section>

          {/* PANTRY SECTION */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-6 mb-16 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="font-black text-gray-800 mr-4">Your Pantry:</div>

              {pantry.length === 0 ? (
                <span className="text-gray-400 text-sm italic">
                  Pantry is empty
                </span>
              ) : (
                pantry.map((item) => (
                  <span
                    key={item}
                    className="bg-[#fcfaf7] px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-3 border border-gray-50 hover:border-red-100 transition-all group"
                  >
                    {item}
                    <X
                      size={14}
                      className="cursor-pointer text-gray-300 group-hover:text-red-500 transition-colors"
                      onClick={() => handleRemoveIngredient(item)}
                    />
                  </span>
                ))
              )}

              <form
                onSubmit={handleAddIngredient}
                className="flex items-center gap-2 ml-auto"
              >
                <input
                  type="text"
                  placeholder="Add to pantry..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-600 outline-none w-40"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-50 text-green-600 font-black text-sm px-4 py-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                >
                  <Plus size={18} />
                </button>
              </form>
            </div>
          </section>

          {/* INTEGRATED RECOMMENDED RECIPES SECTION */}
          <RecommendedRecipe
            recipes={recipes}
            pantry={pantry}
            loading={loading}
            onRecipeClick={(recipe) => setSelectedRecipe(recipe)}
          />

          <About />
        </div>
      </main>
      <ChatAssistant />
    </div>
  );
}
