import React, { useState } from "react";
import { ChatService } from "../api/geminiService";
import {
  Upload,
  X,
  Camera,
  Flame,
  Activity,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function FoodScanner() {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setAnalysisResult("");
    setLoading(true);
    try {
      const data = await ChatService.analyzeFoodImage(file);
      setAnalysisResult(data);
    } catch (err) {
      alert("Could not analyze image.");
    } finally {
      setLoading(false);
    }
  };

  const getCalories = () =>
    analysisResult.match(/Calories:\s*(\d+)/)?.[1] || "---";

  const getRating = () => {
    const res = analysisResult.toLowerCase();
    if (res.includes("good"))
      return {
        text: "Healthy",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        icon: <ShieldCheck size={18} />,
      };
    if (res.includes("medium"))
      return {
        text: "Moderate",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        icon: <Activity size={18} />,
      };
    if (res.includes("bad"))
      return {
        text: "Unhealthy",
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100",
        icon: <Activity size={18} />,
      };
    return {
      text: "Unknown",
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: null,
    };
  };

  const rating = getRating();

  return (
    <div className=" mt-10 mb-10 max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 text-white text-center">
        <div className="flex justify-center mb-2">
          <Camera size={28} className="opacity-90" />
        </div>
        <h3 className="text-xl font-black tracking-tight">AI Food Scanner</h3>
        <p className="text-green-100 text-xs font-medium">
          Scan your meal for instant health insights
        </p>
      </div>

      <div className="p-6">
        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-gray-50 hover:border-green-300 transition-all group">
            <div className="bg-green-50 p-4 rounded-full group-hover:scale-110 transition-transform">
              <Upload className="text-green-700" size={24} />
            </div>
            <span className="mt-3 text-sm font-bold text-gray-500">
              Upload food photo
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover rounded-[2rem] shadow-md"
            />
            {!loading && (
              <button
                onClick={() => {
                  setPreview(null);
                  setAnalysisResult("");
                }}
                className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-lg text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-10 animate-pulse">
            <Loader2 className="text-green-600 animate-spin mb-3" size={32} />
            <p className="text-green-700 font-black text-sm uppercase tracking-widest">
              Analyzing Nutrients...
            </p>
          </div>
        )}

        {analysisResult && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Quick Stats Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sky-50 border border-sky-100 p-4 rounded-3xl flex flex-col items-center justify-center">
                <Flame className="text-sky-600 mb-1" size={20} />
                <span className="text-[10px] uppercase font-black text-sky-400 tracking-tighter">
                  Calories
                </span>
                <span className="text-lg font-black text-sky-900">
                  {getCalories()} kcal
                </span>
              </div>

              <div
                className={`${rating.bg} ${rating.border} p-4 rounded-3xl flex flex-col items-center justify-center`}
              >
                <div className={`${rating.color} mb-1`}>{rating.icon}</div>
                <span className="text-[10px] uppercase font-black opacity-50 tracking-tighter">
                  Health Grade
                </span>
                <span className={`text-lg font-black ${rating.color}`}>
                  {rating.text}
                </span>
              </div>
            </div>

            {/* Detailed Analysis Box */}
            <div className="bg-gray-50 rounded-[2rem] p-5 border border-gray-100 shadow-inner">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>{" "}
                Breakdown
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
