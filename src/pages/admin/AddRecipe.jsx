import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Clock,
  Flame,
  Image as ImageIcon,
} from "lucide-react";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Initial State matching your Firestore structure
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    time: "",
    kcal: "",
    rating: 5.0,
    image: "",
    isVeg: true,
    ingredients: [{ name: "", amount: "" }],
    steps: [""],
  });

  // Handlers for Dynamic Inputs
  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: "", amount: "" }],
    });
  };

  const removeIngredient = (index) => {
    const newIng = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIng });
  };

  const addStep = () => {
    setRecipe({ ...recipe, steps: [...recipe.steps, ""] });
  };

  const removeStep = (index) => {
    const newSteps = recipe.steps.filter((_, i) => i !== index);
    setRecipe({ ...recipe, steps: newSteps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "recipes"), {
        ...recipe,
        time: Number(recipe.time),
        kcal: Number(recipe.kcal),
        rating: Number(recipe.rating),
        createdAt: new Date(),
      });
      alert("Recipe Published to Cloud! 🥘");
      navigate("/admin");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-green-800 font-bold"
          >
            <ArrowLeft size={20} /> Dashboard
          </button>
          <h1 className="text-2xl font-black text-gray-800">New Recipe</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
            <input
              required
              placeholder="Recipe Title (e.g., Parippu Curry)"
              className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-xl"
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            />
            <textarea
              placeholder="Short Description..."
              className="w-full p-4 bg-gray-50 rounded-2xl border-none min-h-24"
              onChange={(e) =>
                setRecipe({ ...recipe, description: e.target.value })
              }
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative">
                <Clock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  placeholder="Mins"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none font-bold"
                  onChange={(e) =>
                    setRecipe({ ...recipe, time: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Flame
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  placeholder="Kcal"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none font-bold"
                  onChange={(e) =>
                    setRecipe({ ...recipe, kcal: e.target.value })
                  }
                />
              </div>
              <select
                className="w-full p-3 bg-gray-50 rounded-xl border-none font-bold"
                onChange={(e) =>
                  setRecipe({ ...recipe, isVeg: e.target.value === "true" })
                }
              >
                <option value="true">Vegetarian</option>
                <option value="false">Non-Veg</option>
              </select>
            </div>
          </div>

          {/* Image Link Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <label className="block font-black text-gray-700 mb-2 flex items-center gap-2">
              <ImageIcon size={18} /> Image URL
            </label>
            <input
              placeholder="https://images.unsplash.com/..."
              className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-mono"
              onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
            />
          </div>

          {/* Ingredients Grid */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-6">Ingredients</h3>
            <div className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    placeholder="Item"
                    className="flex-[2] p-3 bg-gray-50 rounded-xl border-none"
                    value={ing.name}
                    onChange={(e) => {
                      const newIng = [...recipe.ingredients];
                      newIng[i].name = e.target.value;
                      setRecipe({ ...recipe, ingredients: newIng });
                    }}
                  />
                  <input
                    placeholder="Amt"
                    className="flex-1 p-3 bg-gray-50 rounded-xl border-none"
                    value={ing.amount}
                    onChange={(e) => {
                      const newIng = [...recipe.ingredients];
                      newIng[i].amount = e.target.value;
                      setRecipe({ ...recipe, ingredients: newIng });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="p-3 text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-2 text-green-700 font-bold pt-2"
              >
                <Plus size={18} /> Add Ingredient
              </button>
            </div>
          </div>

          {/* Steps Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-6">Cooking Steps</h3>
            <div className="space-y-4">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-black shrink-0">
                    {i + 1}
                  </div>
                  <textarea
                    placeholder={`Step ${i + 1} details...`}
                    className="flex-1 p-3 bg-gray-50 rounded-xl border-none"
                    value={step}
                    onChange={(e) => {
                      const newSteps = [...recipe.steps];
                      newSteps[i] = e.target.value;
                      setRecipe({ ...recipe, steps: newSteps });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="p-3 text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-2 text-green-700 font-bold pt-2"
              >
                <Plus size={18} /> Add Step
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Save size={24} /> {loading ? "Uploading..." : "Publish Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}
