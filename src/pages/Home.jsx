import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Bell, Plus, X, User, Clock, HeartIcon } from "lucide-react";
import About from "./About";
import RecommendedRecipe from "../components/RecommendedRecipe";
import RecipeDetails from "./RecipeDetails";
import AddLeftoverModal from "../components/AddLeftoverModal";
import NotificationDisplay from "../components/NotificationDisplay";
import { useAuth } from "../context/AuthContext";
import { RecipeService } from "../api/recipeService";
import { PantryService } from "../api/pantryService";
import ChatAssistant from "../components/ChatAssistant";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import SectionHero from "../components/SectionHero";

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

  // 1. Fetch Recipes
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
  }, []);

  // 2. Real-time Sync
  useEffect(() => {
    let unsubscribePantry;
    let unsubscribeLeftovers;

    if (user) {
      unsubscribePantry = PantryService.subscribeToPantry(user.uid, (data) => {
        setPantry(data);
      });

      const q = query(
        collection(db, "pantry"),
        where("userId", "==", user.uid),
        where("type", "==", "leftover"),
      );

      unsubscribeLeftovers = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeftovers(items);
      });
    }

    return () => {
      if (unsubscribePantry) unsubscribePantry();
      if (unsubscribeLeftovers) unsubscribeLeftovers();
    };
  }, [user]);

  // 3. Expiry Check
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

  const handleAddLeftover = () => {
    setIsLeftoverModalOpen(false);
  };

  const handleRemoveLeftover = async (id) => {
    try {
      await deleteDoc(doc(db, "pantry", id));
    } catch (error) {
      console.error("Error removing leftover:", error);
    }
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
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col md:flex-row font-sans antialiased overflow-x-hidden">
      <Navbar />

      <main className="flex-1 bg-[#f4f1ea] p-4 md:p-8 w-full transition-all duration-500 min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 px-2">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
                FoodTrack
              </h1>
              <p className="text-gray-500 font-medium">Cooking made smarter.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100 transition-colors"
              >
                <HeartIcon className="text-gray-700" size={20} />
              </button>

              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 border transition-all ${expiringItems.length > 0 ? "border-orange-200" : "border-gray-100"}`}
              >
                <Bell
                  className={
                    expiringItems.length > 0
                      ? "text-orange-500 animate-pulse"
                      : "text-gray-700"
                  }
                  size={20}
                />
                {expiringItems.length > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                )}
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100 transition-colors"
              >
                <User className="text-gray-700" size={20} />
              </button>
            </div>
          </div>

          {/* HERO SECTION */}
          <div className="mb-10">
            <SectionHero />
          </div>

          {/* PANTRY & LEFTOVERS GRID - "items-start" prevents stretching */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-start">
            {/* My Pantry - Takes 8 columns */}
            <section className="lg:col-span-8 bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-black text-gray-800 text-xl">My Pantry</h3>
                <form
                  onSubmit={handleAddIngredient}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <input
                    type="text"
                    placeholder="Add ingredient..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none flex-1 sm:w-48"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </form>
              </div>
              <div className="flex flex-wrap gap-2">
                {pantry.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">
                    Pantry is empty
                  </p>
                ) : (
                  pantry.map((item) => (
                    <span
                      key={item}
                      className="bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 flex items-center gap-2 border border-gray-100 group"
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

            {/* Leftovers - Takes 4 columns */}
            <section className="lg:col-span-4 bg-orange-50/50 border border-orange-100 rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-black text-orange-900 text-xl">
                  Leftovers
                </h3>
                <button
                  onClick={() => setIsLeftoverModalOpen(true)}
                  className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  <Plus size={20} />
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
                      className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-orange-100"
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
            </section>
          </div>

          {/* RECOMMENDED RECIPES SECTION */}
          <div className="px-2">
            <RecommendedRecipe
              recipes={recipes}
              pantry={[...pantry, ...leftovers.map((l) => l.name)]}
              loading={loading}
              onRecipeClick={(recipe) => setSelectedRecipe(recipe)}
            />
          </div>

          <div className="mt-12">
            <About />
          </div>
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

      <ChatAssistant currentRecipe={selectedRecipe} />
    </div>
  );
}
