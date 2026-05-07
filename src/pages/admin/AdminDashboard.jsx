import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Utensils,
  Users,
  LogOut,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Add New Recipe",
      icon: <PlusCircle size={32} />,
      path: "/admin/add-recipe",
      color: "bg-green-600",
    },
    {
      title: "Manage Recipes",
      icon: <Utensils size={32} />,
      path: "/home",
      color: "bg-blue-600",
    },
    {
      title: "Add shop",
      icon: <ShoppingBag size={32} />,
      path: "/AdminAddShop",
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-gray-800">Admin Panel</h1>
          <div className="w-12"></div> {/* Spacer */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 hover:scale-[1.02] transition-all text-left group"
            >
              <div
                className={`${item.color} p-4 rounded-2xl text-white group-hover:rotate-12 transition-transform`}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm font-bold">
                  Manage your cloud database
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
