import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Bell, User, HeartIcon, Sparkles } from "lucide-react";
import About from "./About";
import RecommendedRecipe from "../components/RecommendedRecipe";
import RecipeDetails from "./RecipeDetails";
import AddLeftoverModal from "../components/AddLeftoverModal";
import NotificationDisplay from "../components/NotificationDisplay";
import { useAuth } from "../context/AuthContext";
import { RecipeService } from "../api/recipeService";
import { PantryService } from "../api/pantryService";
import ChatAssistant from "../components/ChatAssistant";
import SectionHero from "../components/SectionHero";
import PantryList from "../components/PantryList";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [pantryTags, setPantryTags] = useState([]);
  const [smartItems, setSmartItems] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [expiringItems, setExpiringItems] = useState([]);

  useEffect(() => {
    const initHome = async () => {
      try {
        const recipeData = await RecipeService.getAllRecipes();
        setRecipes(recipeData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initHome();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = PantryService.subscribeToTags(
        user.uid,
        setPantryTags,
      );
      return () => unsubscribe();
    }
  }, [user]);

  const combinedPantry = useMemo(() => {
    const smartNames = smartItems.map((item) => item.name.toLowerCase());
    return [...pantryTags, ...smartNames];
  }, [pantryTags, smartItems]);

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

      <main className="flex-1 bg-[#f4f1ea] p-4 md:p-8 w-full transition-all duration-500">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* HEADER */}
          <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 px-2">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-gray-800 tracking-tight">
                FoodTrack
              </h1>
              <p className="text-gray-500 font-medium">
                Smart kitchen, happy cooking.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/favorite-list")}
                className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 border border-gray-100 transition-all active:scale-90"
              >
                <HeartIcon
                  className="text-rose-500"
                  size={22}
                  fill={user ? "currentColor" : "none"}
                />
              </button>

              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-3 bg-white rounded-2xl shadow-sm border transition-all ${expiringItems.length > 0 ? "border-orange-200" : "border-gray-100"}`}
              >
                <Bell
                  className={
                    expiringItems.length > 0
                      ? "text-orange-500 animate-pulse"
                      : "text-gray-700"
                  }
                  size={22}
                />
                {expiringItems.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                )}
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <User className="text-gray-700" size={22} />
              </button>
            </div>
          </header>

          <div className="mb-12">
            <SectionHero />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
            <div className="lg:col-span-8">
              <PantryList
                onOpenModal={() => setIsModalOpen(true)}
                onExpiringChange={setExpiringItems}
                onSmartItemsChange={setSmartItems}
              />
            </div>

            <div className="lg:col-span-4">
              <div className="bg-orange-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-orange-100 sticky top-8">
                <h3 className="text-2xl font-black mb-3 flex items-center gap-2">
                  <Sparkles size={24} /> Smart Matching
                </h3>
                <p className="text-orange-100 text-sm mb-8 leading-relaxed">
                  Analyzing {combinedPantry.length} ingredients to find your
                  next meal.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-white text-orange-600 py-4 rounded-2xl font-black hover:bg-orange-50 transition-all shadow-lg"
                >
                  + Add Item
                </button>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <RecommendedRecipe
              recipes={recipes}
              pantry={combinedPantry}
              loading={loading}
              onRecipeClick={setSelectedRecipe}
            />
          </div>
          {/* <About /> */}
          <div className="mb-16">
            <About />
          </div>
        </div>
      </main>

      {showNotifs && (
        <NotificationDisplay
          items={expiringItems}
          onClose={() => setShowNotifs(false)}
        />
      )}
      <AddLeftoverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ChatAssistant currentRecipe={selectedRecipe} />
    </div>
  );
}
