import React from "react";
import {
  Settings,
  Edit3,
  Award,
  Bookmark,
  History,
  PieChart,
  ChevronRight,
  LogOut,
  Shield,
  Bell,
  ChefHat,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Profile() {
  const STATS = [
    {
      label: "Cooked",
      value: "24",
      icon: <ChefHat size={20} />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "Saved",
      value: "128",
      icon: <Bookmark size={20} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Points",
      size: 20,
      value: "1.2k",
      icon: <Award size={20} />,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const MENU_ITEMS = [
    {
      title: "Cooking History",
      icon: <History size={20} />,
      subtitle: "Review your past meals",
    },
    {
      title: "Dietary Preferences",
      icon: <PieChart size={20} />,
      subtitle: "Vegan, Keto, Allergies",
    },
    {
      title: "Notifications",
      icon: <Bell size={20} />,
      subtitle: "Daily reminders & alerts",
    },
    {
      title: "Privacy & Security",
      icon: <Shield size={20} />,
      subtitle: "Manage your data",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex font-sans antialiased overflow-x-hidden">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              My Profile
            </h1>
            <button className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 border border-gray-100 transition-all">
              <Settings className="text-gray-600" size={22} />
            </button>
          </div>

          {/* USER CARD */}
          <section className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <button className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors">
                <Edit3 size={16} /> Edit
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar with Ring */}
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] bg-green-900 flex items-center justify-center text-5xl border-4 border-white shadow-xl">
                  👨‍🍳
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-lg border-4 border-white shadow-lg">
                  <Award size={20} className="text-white" />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-gray-800 mb-1">
                  Alex Thompson
                </h2>
                <p className="text-gray-400 font-medium mb-6">
                  Master Home Chef • Member since 2024
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {STATS.map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-[#fcfaf7] px-5 py-3 rounded-2xl border border-gray-50"
                    >
                      <div className={`p-2 rounded-xl ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase leading-none">
                          {stat.label}
                        </p>
                        <p className="text-lg font-black text-gray-800">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SETTINGS MENU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {MENU_ITEMS.map((item, i) => (
              <button
                key={i}
                className="flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left"
              >
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-[#fcfaf7] rounded-2xl text-gray-400 group-hover:text-green-600 group-hover:bg-green-50 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className="text-gray-300 group-hover:text-green-600 transition-colors"
                  size={20}
                />
              </button>
            ))}
          </div>

          {/* LOGOUT */}
          <button className="w-full flex items-center justify-center gap-3 p-6 text-red-500 font-black hover:bg-red-50 rounded-[2.5rem] transition-colors border-2 border-dashed border-red-100">
            <LogOut size={20} /> Log Out Account
          </button>
        </div>
      </main>
    </div>
  );
}
