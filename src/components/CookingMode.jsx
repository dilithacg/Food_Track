import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Timer, CheckCircle } from "lucide-react";

export default function CookingMode({ recipe, onExit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 1. REMOVED DUMMY DATA: Now using the steps array from Firestore
  // Fallback to empty array to prevent "undefined" errors
  const steps = recipe.steps || [];

  const progress =
    steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  // 2. HELPER: Extract minutes from the text (e.g., "Boil for 10 minutes" -> 10)
  const getStepTime = (text) => {
    const match = text.match(/(\d+)\s*minute/i);
    return match ? parseInt(match[1]) * 60 : 600; // default to 10m if not found
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      // Optional: Add a sound notification here
      alert("Time is up!");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startTimer = () => {
    const seconds = getStepTime(steps[currentStep]);
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  // Safety check if steps haven't loaded yet
  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
        <p className="font-bold text-gray-400">Loading recipe steps...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col font-sans antialiased">
      {/* TOP PROGRESS BAR */}
      <div className="h-2 bg-gray-100 w-full">
        <div
          className="h-full bg-green-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* HEADER */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
          <div>
            <h2 className="font-black text-gray-800 uppercase text-xs tracking-widest">
              Cooking Mode
            </h2>
            <p className="font-bold text-sm text-green-600">{recipe.title}</p>
          </div>
        </div>
        <div className="text-sm font-black text-gray-400">
          STEP {currentStep + 1} <span className="text-gray-200 mx-1">/</span>{" "}
          {steps.length}
        </div>
      </header>

      {/* MAIN STEP CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full">
        <div className="space-y-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-3xl text-green-600 mb-4">
            <span className="text-3xl font-black">{currentStep + 1}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gray-800 leading-tight">
            {steps[currentStep]}
          </h1>

          {/* DYNAMIC TIMER */}
          {steps[currentStep].toLowerCase().includes("minute") && (
            <div className="mt-12 p-8 bg-[#fcfaf7] rounded-[3rem] border-2 border-dashed border-green-200 flex flex-col items-center">
              {timeLeft !== null ? (
                <div className="text-6xl font-black text-gray-800 mb-4 font-mono">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </div>
              ) : (
                <Timer size={48} className="text-green-600 mb-4" />
              )}

              <button
                onClick={() =>
                  isTimerRunning ? setIsTimerRunning(false) : startTimer()
                }
                className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg"
              >
                {isTimerRunning
                  ? "Pause Timer"
                  : `Start ${getStepTime(steps[currentStep]) / 60}m Timer`}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="p-8 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex gap-4">
          <button
            disabled={currentStep === 0}
            onClick={() => {
              setCurrentStep((prev) => prev - 1);
              setTimeLeft(null);
              setIsTimerRunning(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-5 bg-gray-100 rounded-[2rem] font-black text-gray-500 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={24} /> Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={onExit}
              className="flex-[2] flex items-center justify-center gap-2 py-5 bg-green-900 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-green-900/20"
            >
              <CheckCircle size={24} /> Finish & Enjoy
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentStep((prev) => prev + 1);
                setTimeLeft(null);
                setIsTimerRunning(false);
              }}
              className="flex-[2] flex items-center justify-center gap-2 py-5 bg-green-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-green-600/20"
            >
              Next Step <ChevronRight size={24} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
