import React from "react";
import { Bell, X, AlertTriangle, Clock } from "lucide-react";

export default function NotificationDisplay({ items, onClose }) {
  if (items.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] w-80 animate-in slide-in-from-right duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-orange-100 overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
            <Bell size={16} strokeWidth={3} /> Notifications
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-4 bg-orange-50 rounded-3xl border border-orange-100 group hover:border-orange-200 transition-all"
            >
              <div className="bg-orange-200 p-2.5 rounded-2xl h-fit">
                <AlertTriangle size={18} className="text-orange-700" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-tighter mb-1">
                  Expiring Soon
                </p>
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  Your <span className="text-orange-700">{item.name}</span>{" "}
                  needs to be used!
                </p>
                <div className="flex items-center gap-1 mt-2 text-orange-600/70">
                  <Clock size={10} />
                  <span className="text-[10px] font-bold">1 day remaining</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 text-center">
          <button
            onClick={onClose}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
