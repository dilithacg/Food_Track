import React, { useState } from "react";
import { X, Calendar, Package } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddLeftoverModal({ isOpen, onClose }) {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDays, setExpiryDays] = useState(3);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName || !auth.currentUser) return;

    setLoading(true);
    try {
      // Create a Date object for expiry
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + parseInt(expiryDays));

      const itemData = {
        userId: auth.currentUser.uid,
        name: foodName.trim(),
        quantity: quantity.trim() || "1 unit",
        expiryDate: expDate, // Stored as Timestamp in Firestore
        type: "pantry_item",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "pantry"), itemData);

      // Reset & Close
      setFoodName("");
      setQuantity("");
      setExpiryDays(3);
      onClose();
    } catch (error) {
      console.error("Error saving to pantry:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:rotate-90 transition-transform"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black text-gray-800 mb-1">
          Add to Pantry
        </h2>
        <p className="text-gray-400 font-medium mb-8">
          Keep track of your food items.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">
              Item Name
            </label>
            <div className="relative">
              <Package
                className="absolute left-4 top-4 text-gray-300"
                size={18}
              />
              <input
                required
                placeholder="e.g. Cooked Rice"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 font-bold outline-none border-2 border-transparent focus:border-orange-500 transition-all"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">
                Quantity
              </label>
              <input
                required
                placeholder="e.g. 500g"
                className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">
                Fresh For
              </label>
              <div className="relative">
                <select
                  className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none appearance-none cursor-pointer"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                >
                  {[1, 2, 3, 5, 7, 14].map((d) => (
                    <option key={d} value={d}>
                      {d} {d === 1 ? "Day" : "Days"}
                    </option>
                  ))}
                </select>
                <Calendar
                  className="absolute right-4 top-4 text-gray-300 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 transition-all ${
              loading
                ? "bg-gray-200 text-gray-400"
                : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
            }`}
          >
            {loading ? "Saving..." : "Add to Pantry"}
          </button>
        </form>
      </div>
    </div>
  );
}
