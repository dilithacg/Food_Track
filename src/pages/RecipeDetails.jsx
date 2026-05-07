import React, { useState, useEffect } from "react";
import { ChevronLeft, Clock, Flame, Star, Utensils, Heart } from "lucide-react";
import CookingMode from "../components/CookingMode";
import { db, auth } from "../firebase";
import { doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export default function RecipeDetails({ recipe, onBack }) {
  const [isCooking, setIsCooking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // 1. Check if this recipe is already in favorites
  useEffect(() => {
    if (!recipe || !auth.currentUser) return;

    // We create a unique ID based on UserID + RecipeTitle/ID
    const favId = `${auth.currentUser.uid}_${recipe.id || recipe.title.replace(/\s+/g, "")}`;
    const favRef = doc(db, "favorites", favId);

    const unsubscribe = onSnapshot(favRef, (doc) => {
      setIsFavorite(doc.exists());
    });

    return () => unsubscribe();
  }, [recipe]);

  // 2. Toggle Favorite Handler
  const toggleFavorite = async () => {
    if (!auth.currentUser) return alert("Please login to save recipes!");

    setFavLoading(true);
    const favId = `${auth.currentUser.uid}_${recipe.id || recipe.title.replace(/\s+/g, "")}`;
    const favRef = doc(db, "favorites", favId);

    try {
      if (isFavorite) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          userId: auth.currentUser.uid,
          recipeId: recipe.id || recipe.title,
          recipeTitle: recipe.title,
          recipeImage: recipe.image,
          addedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavLoading(false);
    }
  };

  if (!recipe) return null;

  if (isCooking) {
    return <CookingMode recipe={recipe} onExit={() => setIsCooking(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-12 lg:p-16 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-800 font-bold mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} /> Back to Recipes
        </button>

        <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100">
          <div className="relative h-64 md:h-96 bg-green-50 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />

            {/* FAVORITE BUTTON */}
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              className="absolute top-6 left-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all group"
            >
              <Heart
                className={`transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-400"}`}
                size={24}
              />
            </button>

            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
              <Star className="text-yellow-500 fill-yellow-500" size={18} />
              <span className="font-black text-gray-800">{recipe.rating}</span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 bg-[#fcfaf7] px-4 py-2 rounded-xl border border-gray-50">
                <Clock className="text-green-600" size={20} />
                <span className="font-bold text-gray-700">
                  {recipe.time} mins
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[#fcfaf7] px-4 py-2 rounded-xl border border-gray-50">
                <Flame className="text-orange-500" size={20} />
                <span className="font-bold text-gray-700">
                  {recipe.kcal} kcal
                </span>
              </div>

              <div
                className={`px-4 py-2 rounded-xl font-bold ${recipe.isVeg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {recipe.isVeg ? "Vegetarian" : "Non-Veg"}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">
              {recipe.title}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-12">
              {recipe.description}
            </p>

            <div>
              <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                <Utensils className="text-green-700" /> Ingredients
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.ingredients?.map((ing, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-green-100 transition-colors"
                  >
                    <span className="font-bold text-gray-700">{ing.name}</span>
                    <span className="text-green-700 font-black text-sm">
                      {ing.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsCooking(true)}
              className="w-full mt-12 bg-green-800 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-green-900/20 hover:bg-green-900 active:scale-[0.98] transition-all"
            >
              Start Cooking Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
