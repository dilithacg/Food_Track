import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Search,
  SlidersHorizontal,
  Bell,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import About from "./About";
import RecipeCard from "../components/RecipeCard";
import RecipeDetails from "./RecipeDetails"; // Import your details component
import { RECIPES } from "../data/recipeData"; // Import your dummy data

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const PANTRY_ITEMS = ["Onions", "Garlic", "Chicken", "Coconut Milk"];

  // NAVIGATION LOGIC: If a recipe is clicked, show Details instead of Home
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
                  placeholder="Search..."
                  className="w-full bg-white border-none rounded-2xl py-4 pl-14 shadow-sm outline-none"
                />
                <SlidersHorizontal
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-600"
                  size={20}
                />
              </div>
              <button className="p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 border border-gray-50">
                <Bell className="text-gray-700" size={24} />
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
              <button className="bg-white text-green-900 px-10 py-4 rounded-3xl font-black hover:bg-green-50 transition-all flex items-center gap-3">
                Cook This Now <ChevronRight size={20} />
              </button>
            </div>
            <div className="absolute right-[-5%] bottom-[-10%] text-[300px] opacity-10 rotate-12 pointer-events-none select-none">
              🥘
            </div>
          </section>

          {/* PANTRY */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-6 mb-16 flex flex-wrap items-center gap-4 shadow-sm">
            <div className="font-black text-gray-800 mr-4">Your Pantry:</div>
            {PANTRY_ITEMS.map((item) => (
              <span
                key={item}
                className="bg-[#fcfaf7] px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-3 border border-gray-50"
              >
                {item}{" "}
                <X size={14} className="cursor-pointer hover:text-red-500" />
              </span>
            ))}
            <button className="flex items-center gap-2 text-green-600 font-black text-sm border-2 border-dashed border-green-100 px-6 py-2.5 rounded-2xl hover:bg-green-50 ml-auto">
              <Plus size={18} /> Add Ingredient
            </button>
          </section>

          {/* RECIPE GRID (Using Dummy Data) */}
          <section className="mb-20">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                Recommended for you
              </h2>
              <span className="text-gray-400 font-bold bg-white px-6 py-2 rounded-full text-sm shadow-sm border border-gray-50">
                {RECIPES.length} results
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {RECIPES.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  {...recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </section>
          <About />
        </div>
      </main>
    </div>
  );
}
