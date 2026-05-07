import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, Sparkles, ShieldCheck } from "lucide-react";

export default function SectionHero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-white px-6 py-12 md:px-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 -skew-x-12 translate-x-20 z-0 hidden md:block"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full shadow-sm">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Sustainable Dining v1.0
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
            Don't Waste, <br />
            <span className="text-orange-500">Re-Food</span> Your Taste.
          </h1>

          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Join the revolution. Convert your leftovers into professional meals
            while saving money and earning exclusive{" "}
            <span className="text-blue-500 font-bold italic">Gems</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/request-process")}
              className="group bg-gray-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-gray-200"
            >
              Start Recycling Now
              <ArrowRight
                size={18}
                className="group-hover:translate-x-2 transition-transform"
              />
            </button>

            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="user"
                  />
                </div>
              ))}
              <div className="pl-6 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-900 leading-none">
                  500+ Users
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Saving the planet
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 pt-8 justify-center lg:justify-start border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-400">
              <Leaf size={16} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Eco-Friendly
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck size={16} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Safe Processing
              </span>
            </div>
          </div>
        </div>

        {/* Right Content - Visual Section */}
        <div className="relative">
          {/* Main Large Image */}
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white rotate-2 hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000"
              alt="Healthy Food"
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Floating Card 1: Revenue/Gems */}
          <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 animate-bounce-slow">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Total Saved
                </p>
                <p className="text-xl font-black text-gray-900">LKR 12,450</p>
              </div>
            </div>
          </div>

          {/* Floating Card 2: Status */}
          <div className="absolute top-10 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 hidden md:block">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">
                Chef Processing Now
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
