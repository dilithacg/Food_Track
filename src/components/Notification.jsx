import React from "react";
import { Bell, X, AlertTriangle } from "lucide-react";

export default function Notification({ items, onClose }) {
  if (items.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] w-80 animate-in slide-in-from-right duration-500">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-orange-100 overflow-hidden">
        <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
            <Bell size={18} /> Notifications
          </div>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 max-h-60 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 mb-2 bg-orange-50 rounded-2xl border border-orange-100"
            >
              <div className="bg-orange-200 p-2 rounded-xl h-fit">
                <AlertTriangle size={16} className="text-orange-700" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-800 uppercase">
                  Expiry Alert!
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Your{" "}
                  <span className="font-bold text-orange-700">{item.name}</span>{" "}
                  expires tomorrow. Cook it now!
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
