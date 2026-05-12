import React, { useEffect, useState } from "react";
import { Heart, Trash2, Clock, Star, ChefHat } from "lucide-react";

import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

export default function FavoriteList({ onSelectRecipe }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH FAVORITES
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", auth.currentUser.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFavorites(favs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // REMOVE FAVORITE
  const removeFavorite = async (id) => {
    try {
      await deleteDoc(doc(db, "favorites", id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-green-700"></div>
      </div>
    );
  }

  // EMPTY
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] flex flex-col items-center justify-center text-center p-6">
        <div className="bg-red-100 p-6 rounded-full mb-6">
          <Heart className="text-red-500 fill-red-500" size={50} />
        </div>

        <h2 className="text-4xl font-black text-gray-800 mb-3">
          No Favorite Recipes
        </h2>

        <p className="text-gray-500 text-lg">
          Save recipes and they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-red-100 p-4 rounded-3xl">
            <Heart className="text-red-500 fill-red-500" size={34} />
          </div>

          <div>
            <h1 className="text-4xl font-black text-gray-800">
              Favorite Recipes
            </h1>

            <p className="text-gray-500 mt-1">Your saved delicious recipes</p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 hover:-translate-y-2 transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={recipe.recipeImage}
                  alt={recipe.recipeTitle}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />

                {/* DELETE BUTTON */}
                <button
                  onClick={() => removeFavorite(recipe.id)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-md hover:scale-110 active:scale-95 transition-all"
                >
                  <Trash2 className="text-red-500" size={20} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h2 className="text-2xl font-black text-gray-800 mb-4 line-clamp-2">
                  {recipe.recipeTitle}
                </h2>

                <div className="flex items-center gap-4 text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span className="font-semibold">{recipe.time} mins</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star
                      className="fill-yellow-400 text-yellow-400"
                      size={18}
                    />
                    <span className="font-semibold">{recipe.rating}</span>
                  </div>
                </div>

                {/* VIEW BUTTON */}
                <button
                  onClick={() =>
                    onSelectRecipe({
                      id: recipe.recipeId,
                      title: recipe.recipeTitle,
                      image: recipe.recipeImage,
                      description: recipe.description,
                      ingredients: recipe.ingredients,
                      rating: recipe.rating,
                      time: recipe.time,
                      kcal: recipe.kcal,
                      isVeg: recipe.isVeg,
                    })
                  }
                  className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-green-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <ChefHat size={22} />
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
