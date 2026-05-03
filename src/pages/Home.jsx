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
  Clock,
} from "lucide-react";
import About from "./About";
import RecommendedRecipe from "../components/RecommendedRecipe";
import RecipeDetails from "./RecipeDetails";
import AddLeftoverModal from "../components/AddLeftoverModal";
import NotificationDisplay from "../components/NotificationDisplay";
import { useAuth } from "../context/AuthContext";
import { RecipeService } from "../api/recipeService";
import { PantryService } from "../api/pantryService";
import ChatAssistant from "../components/ChatAssistant";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Core States
  const [recipes, setRecipes] = useState([]);
  const [pantry, setPantry] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");

  // Leftover States
  const [isLeftoverModalOpen, setIsLeftoverModalOpen] = useState(false);
  const [leftovers, setLeftovers] = useState([]);

  // Notification States
  const [showNotifs, setShowNotifs] = useState(false);
  const [expiringItems, setExpiringItems] = useState([]);

  // 1. Fetch Recipes and Sync Pantry
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

  // 2. Notification Logic: Monitor leftovers for expiry
  useEffect(() => {
    const urgent = leftovers.filter((item) => Number(item.daysLeft) === 1);
    setExpiringItems(urgent);
  }, [leftovers]);

  // Handlers
  const handleAddIngredient = async (e) => {
    e.preventDefault();
    if (!newItem.trim() || !user) return;
    await PantryService.addIngredient(user.uid, newItem.trim().toLowerCase());
    setNewItem("");
  };

  const handleRemoveIngredient = async (item) => {
    if (!user) return;
    await PantryService.removeIngredient(user.uid, item);
  };

  const handleAddLeftover = (item) => {
    setLeftovers((prev) => [item, ...prev]);
  };

  const handleRemoveLeftover = (id) => {
    setLeftovers((prev) => prev.filter((item) => item.id !== id));
  };

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
          {/* HEADER SECTION */}
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

              {/* NOTIFICATION BELL */}
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 border transition-all ${
                  expiringItems.length > 0
                    ? "border-orange-200"
                    : "border-gray-50"
                }`}
              >
                <Bell
                  className={
                    expiringItems.length > 0
                      ? "text-orange-500 animate-pulse"
                      : "text-gray-700"
                  }
                  size={24}
                />
                {expiringItems.length > 0 && (
                  <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                )}
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 border border-gray-50 transition-colors"
              >
                <User className="text-gray-700" size={24} />
              </button>
            </div>
          </div>

          {/* HERO SECTION */}
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

          {/* PANTRY & LEFTOVERS GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
            {/* Standard Pantry */}
            <section className="xl:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-800 text-xl">My Pantry</h3>
                <form
                  onSubmit={handleAddIngredient}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Add ingredient..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-600 outline-none w-40"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </form>
              </div>
              <div className="flex flex-wrap gap-3">
                {pantry.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">
                    Pantry is empty
                  </p>
                ) : (
                  pantry.map((item) => (
                    <span
                      key={item}
                      className="bg-gray-50 px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-3 border border-gray-100 group"
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
              </div>
            </section>

            {/* Leftovers Tracker */}
            <section className="bg-orange-50/50 border border-orange-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-black text-orange-900 text-xl">
                  Leftovers
                </h3>
                <button
                  onClick={() => setIsLeftoverModalOpen(true)}
                  className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="space-y-3 relative z-10">
                {leftovers.length === 0 ? (
                  <p className="text-orange-300 italic text-sm">
                    No leftovers logged
                  </p>
                ) : (
                  leftovers.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-orange-100 group"
                    >
                      <div>
                        <p className="font-black text-gray-800 text-sm">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock
                            size={12}
                            className={
                              item.daysLeft === 1
                                ? "text-red-500"
                                : "text-gray-400"
                            }
                          />
                          <span
                            className={`text-[10px] font-bold ${item.daysLeft === 1 ? "text-red-500" : "text-gray-400"}`}
                          >
                            {item.daysLeft}{" "}
                            {item.daysLeft === 1 ? "day" : "days"} left
                          </span>
                        </div>
                      </div>
                      <X
                        size={14}
                        className="cursor-pointer text-gray-300 hover:text-red-500"
                        onClick={() => handleRemoveLeftover(item.id)}
                      />
                    </div>
                  ))
                )}
              </div>
              <div className="absolute right-[-10%] top-[-10%] text-8xl opacity-5 pointer-events-none">
                🥗
              </div>
            </section>
          </div>

          {/* RECOMMENDED RECIPES */}
          <RecommendedRecipe
            recipes={recipes}
            pantry={[...pantry, ...leftovers.map((l) => l.name)]}
            loading={loading}
            onRecipeClick={(recipe) => setSelectedRecipe(recipe)}
          />

          <About />
        </div>
      </main>

      {/* OVERLAYS & MODALS */}
      {showNotifs && (
        <NotificationDisplay
          items={expiringItems}
          onClose={() => setShowNotifs(false)}
        />
      )}

      <AddLeftoverModal
        isOpen={isLeftoverModalOpen}
        onClose={() => setIsLeftoverModalOpen(false)}
        onAdd={handleAddLeftover}
      />

      <ChatAssistant />
    </div>
  );
}
