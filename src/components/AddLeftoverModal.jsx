import React, { useState } from "react";
import { X, Clock, Calendar } from "lucide-react";

export default function AddLeftoverModal({ isOpen, onClose, onAdd }) {
  const [foodName, setFoodName] = useState("");
  const [expiryDays, setExpiryDays] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodName) return;

    // නව leftover අයිතමය නිර්මාණය කිරීම
    onAdd({
      id: Date.now(),
      name: foodName,
      daysLeft: parseInt(expiryDays),
      type: "leftover",
      addedAt: new Date().toLocaleDateString(),
    });

    setFoodName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-300 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black text-gray-800 mb-2">Add Leftover</h2>
        <p className="text-gray-500 mb-8 font-medium">
          What's in your fridge that needs using?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">
              Food Item Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Cooked Chicken, Fish Curry"
              className="w-full p-5 rounded-2xl bg-gray-50 border-none ring-2 ring-transparent focus:ring-green-500 transition-all outline-none font-bold text-gray-700"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">
              Fresh for how many days?
            </label>
            <div className="relative">
              <select
                className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none ring-2 ring-transparent focus:ring-green-500 font-bold text-gray-700 appearance-none"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
              >
                <option value="1">1 Day (Eat by tomorrow)</option>
                <option value="2">2 Days (Fridge)</option>
                <option value="3">3 Days (Fridge)</option>
                <option value="7">1 Week (Freezer)</option>
              </select>
              <Clock
                className="absolute right-5 top-5 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all"
          >
            Add to My Pantry
          </button>
        </form>
      </div>
    </div>
  );
}
