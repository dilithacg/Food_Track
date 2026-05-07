import React, { useState } from "react";
import { X, Clock } from "lucide-react"; // Removed non-standard icons
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddLeftoverModal({ isOpen, onClose, onAdd }) {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDays, setExpiryDays] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName || !auth.currentUser) return;

    setLoading(true);
    try {
      const leftoverData = {
        userId: auth.currentUser.uid,
        name: foodName,
        quantity: quantity,
        daysLeft: parseInt(expiryDays),
        type: "leftover",
        status: "fresh",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "pantry"), leftoverData);

      onAdd({
        id: docRef.id,
        ...leftoverData,
        addedAt: new Date().toLocaleDateString(),
      });

      setFoodName("");
      setQuantity("");
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black text-gray-800 mb-2">Add Leftover</h2>
        <p className="text-gray-500 mb-8 font-medium">What's in your fridge?</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase">
                Food Name
              </label>
              <input
                required
                placeholder="Rice, Chicken, etc."
                className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">
                  Amount
                </label>
                <input
                  required
                  placeholder="e.g. 500g"
                  className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">
                  Fresh For
                </label>
                <select
                  className="w-full p-4 rounded-2xl bg-gray-50 font-bold outline-none"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                >
                  <option value="1">1 Day</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[1.5rem] font-black text-lg shadow-xl transition-all ${
              loading
                ? "bg-gray-400"
                : "bg-orange-500 text-white active:scale-95"
            }`}
          >
            {loading ? "Saving..." : "Add to My Pantry"}
          </button>
        </form>
      </div>
    </div>
  );
}
