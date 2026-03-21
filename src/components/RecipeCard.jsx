import { Clock, Flame, Star, ChevronRight, Leaf } from "lucide-react";

export default function RecipeCard({
  title,
  time,
  kcal,
  rating,
  matchCount,
  image,
  isVeg,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-50 flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-bold text-gray-700">
            {matchCount} matched
          </span>
        </div>
      </div>

      <div className="aspect-4/3 bg-[#fcfaf7] rounded-2xl flex items-center justify-center mb-5 overflow-hidden">
        <span className="text-6xl group-hover:scale-125 transition-transform duration-500">
          {image}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800 text-base leading-snug group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          {isVeg && <Leaf size={16} className="text-green-600 shrink-0" />}
        </div>

        <div className="flex items-center gap-4 text-gray-400 border-b border-gray-50 pb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span className="text-xs font-medium">{time} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={14} />
            <span className="text-xs font-medium">{kcal} kcal</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-gray-700">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-green-600 group-hover:gap-2 transition-all">
            View Details <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
