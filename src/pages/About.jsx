import React from "react";
import Navbar from "../components/Navbar";
import { Users, Globe, Award, ChevronRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-green-600 flex font-sans antialiased">
      <Navbar />
      <main className="flex-1 p-6 md:p-12 lg:p-16 w-full">
        <div className="max-w-4xl mx-auto py-12">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-black text-gray-800 mb-4 tracking-tighter">Our Mission</h1>
            <p className="text-gray-500 text-lg font-medium">Making home cooking smarter and more fun.</p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: <Users />, label: "Community", val: "50k+" },
              { icon: <Globe />, label: "Global Recipes", val: "5,000" },
              { icon: <Award />, label: "Best App 2024", val: "Winner" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl text-center border border-gray-50 shadow-sm hover:shadow-md transition-all">
                <div className="text-green-600 flex justify-center mb-4">{stat.icon}</div>
                <div className="text-2xl font-black text-gray-800">{stat.val}</div>
                <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          <article className="prose prose-lg text-gray-600 font-medium leading-relaxed space-y-6">
            <p>
              FoodTrack started in a small kitchen with a big problem: "What do I cook with these 3 ingredients?" 
              Today, we serve thousands of users by reducing food waste through smart matching.
            </p>
          </article>
        </div>
      </main>
    </div>
  );
}