import React, { useEffect, useState } from "react";
import { PantryService } from "../api/pantryService";
import { useAuth } from "../context/AuthContext";
import { X, Plus, Zap, Trash2 } from "lucide-react";

export default function PantryList({
  onOpenModal,
  onExpiringChange,
  onSmartItemsChange,
}) {
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [smartItems, setSmartItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Tags Sync
    const unsubTags = PantryService.subscribeToTags(user.uid, setTags);

    // Smart Items Sync
    const unsubSmart = PantryService.subscribeToSmartItems(
      user.uid,
      (items) => {
        setSmartItems(items);

        // 1. Notification
        const urgent = items.filter((item) => {
          const diff = item.expiryDate.toDate() - new Date();
          return Math.ceil(diff / (1000 * 60 * 60 * 24)) <= 1;
        });
        if (onExpiringChange) onExpiringChange(urgent);

        // 2. Recipe Recommendation
        if (onSmartItemsChange) onSmartItemsChange(items);
      },
    );

    return () => {
      unsubTags();
      unsubSmart();
    };
  }, [user]);

  const getStatus = (expiryDate) => {
    const diff = expiryDate.toDate() - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: "Expired", css: "bg-red-50 text-red-600" };
    if (days <= 1)
      return { label: "Expires Today", css: "bg-orange-50 text-orange-600" };
    return { label: `In ${days} days`, css: "bg-green-50 text-green-600" };
  };

  return (
    <div className="space-y-6">
      {/* Smart Pantry Section */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Zap className="text-orange-500" fill="currentColor" size={24} />{" "}
            Smart Pantry
          </h3>
          <button
            onClick={onOpenModal}
            className="bg-orange-500 text-white p-2 rounded-xl hover:scale-105 transition-all shadow-lg shadow-orange-100"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="grid gap-3">
          {smartItems.map((item) => {
            const status = getStatus(item.expiryDate);
            return (
              <div
                key={item.id}
                className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-200 transition-all"
              >
                <div>
                  <p className="font-bold text-gray-800 capitalize">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase ${status.css}`}
                  >
                    {status.label}
                  </div>
                  <button
                    onClick={() => PantryService.removeSmartItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* General Tags Section */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-800 mb-6">
          General Ingredients
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 border border-gray-200 capitalize"
            >
              {tag}{" "}
              <X
                size={14}
                className="cursor-pointer hover:text-red-500"
                onClick={() => PantryService.removeTag(user.uid, tag)}
              />
            </span>
          ))}
          <input
            placeholder="+ Add Ingredient"
            className="px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:border-solid w-36 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                PantryService.addTag(user.uid, e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
