import React, { useState } from "react"; // Added useState
import {
  ChevronLeft,
  Clock,
  Flame,
  Star,
  Leaf,
  Share2,
  Heart,
  PlayCircle,
  CheckCircle2,
  Utensils,
} from "lucide-react";
import CookingMode from "./../components/CookingMode"; // 1. Import your CookingMode component

export default function RecipeDetails({ recipe, onBack }) {
  // 2. Add state to toggle between Details and Cooking Mode
  const [isCookingMode, setIsCookingMode] = useState(false);

  if (!recipe) return null;

  // 3. Conditional Return: If in cooking mode, show the step-by-step UI
  if (isCookingMode) {
    return (
      <CookingMode recipe={recipe} onExit={() => setIsCookingMode(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] pb-20 font-sans antialiased">
      {/* STICKY TOP NAV */}
      <nav className="sticky top-0 z-50 bg-[#f4f1ea]/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 group px-4 py-2 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <ChevronLeft
              className="text-gray-800 group-hover:-translate-x-1 transition-transform"
              size={20}
            />
            <span className="font-bold text-gray-700 text-sm">
              Back to Recipes
            </span>
          </button>

          <div className="flex gap-3">
            <button className="p-3 bg-white rounded-2xl shadow-sm hover:text-red-500 hover:shadow-md transition-all">
              <Heart size={20} />
            </button>
            <button className="p-3 bg-white rounded-2xl shadow-sm hover:text-green-600 hover:shadow-md transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: HERO IMAGE & STATS */}
        <div className="lg:col-span-5 space-y-8">
          <div className="aspect-square bg-white rounded-[4rem] flex items-center justify-center text-[12rem] shadow-2xl shadow-green-900/10 border border-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent" />
            <span className="relative z-10 group-hover:scale-110 transition-transform duration-700 ease-out">
              {recipe.image}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: <Clock size={18} />,
                label: "Time",
                value: `${recipe.time} min`,
                color: "text-blue-600",
              },
              {
                icon: <Flame size={18} />,
                label: "Cals",
                value: `${recipe.kcal} kcal`,
                color: "text-orange-600",
              },
              {
                icon: <Star size={18} />,
                label: "Rating",
                value: recipe.rating,
                color: "text-yellow-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 text-center border border-gray-100 shadow-sm"
              >
                <div className={`flex justify-center mb-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm font-black text-gray-800">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT */}
        <div className="lg:col-span-7 space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-6">
              {recipe.isVeg && (
                <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                  <Leaf size={14} /> Vegetarian
                </span>
              )}
              <span className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                Dinner Choice
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-800 leading-tight mb-6">
              {recipe.title}
            </h1>
            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-2xl">
              {recipe.description}
            </p>
          </section>

          {/* INGREDIENTS CHECKLIST */}
          <section className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                <Utensils className="text-green-600" /> Ingredients
              </h2>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-4 py-1.5 rounded-2xl">
                {recipe.ingredients?.length || 0} items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.ingredients?.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#fcfaf7] border border-transparent hover:border-green-200 transition-all cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg border-2 border-gray-200 flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-500 transition-all">
                    <CheckCircle2
                      size={14}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 leading-none mb-1">
                      {ing.name}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {ing.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ACTION BUTTON */}
          <div className="pt-4">
            <button
              onClick={() => setIsCookingMode(true)} // 4. Trigger the state change
              className="w-full bg-green-900 text-white py-6 rounded-[2.5rem] font-black text-xl hover:bg-green-800 transition-all shadow-xl hover:shadow-green-900/20 flex items-center justify-center gap-4 group"
            >
              <PlayCircle
                size={28}
                className="group-hover:scale-110 transition-transform"
              />
              Start Cooking Mode
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
