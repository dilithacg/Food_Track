import React, { useState } from "react";
import {
  ChefHat,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { ChatService } from "../api/geminiService";

export default function SmartRecipe() {
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (!ingredient.trim()) return;
    setIngredients([...ingredients, ingredient.trim()]);
    setIngredient("");
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) return;
    try {
      setLoading(true);
      setRecipe("");
      const response = await ChatService.generateRecipe(ingredients);
      setRecipe(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 selection:bg-orange-100">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-yellow-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-12">
        {/* HEADER */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white shadow-sm border border-orange-100 rounded-2xl mb-6">
            <ChefHat className="text-orange-500" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Smart Recipe <span className="text-orange-500">AI</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg">
            Turn your leftover ingredients into a culinary masterpiece.
          </p>
        </header>

        {/* INPUT SECTION */}
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-orange-200/20 rounded-[2rem] p-8 transition-all hover:shadow-orange-200/40">
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            What's in your kitchen?
          </label>

          <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500/40 transition-all">
            <input
              type="text"
              placeholder="e.g. Garlic, Chicken, Spinach..."
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIngredient()}
              className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700 placeholder:text-slate-400"
            />
            <button
              onClick={addIngredient}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white p-3 rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* INGREDIENT CHIPS */}
          <div className="mt-6 min-h-[60px]">
            {ingredients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-slate-300 italic">
                <UtensilsCrossed size={20} className="mb-2 opacity-20" />
                <span className="text-sm">No ingredients added yet</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 bg-white border border-slate-200 hover:border-orange-200 hover:bg-orange-50 px-4 py-2 rounded-xl transition-all duration-200 animate-in fade-in zoom-in slide-in-from-bottom-2"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-orange-700">
                      {item}
                    </span>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerateRecipe}
            disabled={loading || ingredients.length === 0}
            className={`w-full mt-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
              loading || ingredients.length === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-200 hover:shadow-slate-300 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                <span>Creating magic...</span>
              </>
            ) : (
              <>
                <Sparkles
                  className={ingredients.length > 0 ? "animate-pulse" : ""}
                  size={22}
                />
                <span>Generate Recipe</span>
              </>
            )}
          </button>
        </div>

        {/* RECIPE RESULT */}
        {recipe && (
          <div className="mt-12 bg-white border border-orange-100 rounded-[2rem] p-8 shadow-xl animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <UtensilsCrossed size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Your Custom Recipe
              </h2>
            </div>

            <div className="prose prose-orange max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-600">
                {recipe}
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="mt-8 text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-2"
            >
              Print this recipe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
