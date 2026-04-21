import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Timer,
  CheckCircle,
  Volume2,
} from "lucide-react";

export default function CookingMode({ recipe, onExit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Ref to hold the AudioContext for the tik-tik sound
  const audioCtx = useRef(null);

  const steps = recipe.steps || [];
  const progress =
    steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  // --- 1. TIK-TIK SOUND LOGIC ---
  const playTik = useCallback(() => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }

      // Create oscillator for a short "click" sound
      const osc = audioCtx.current.createOscillator();
      const envelope = audioCtx.current.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtx.current.currentTime); // High pitch click

      envelope.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
      envelope.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.current.currentTime + 0.05,
      );

      osc.connect(envelope);
      envelope.connect(audioCtx.current.destination);

      osc.start();
      osc.stop(audioCtx.current.currentTime + 0.05);
    } catch (e) {
      console.error("Audio not supported", e);
    }
  }, []);

  // --- 2. TTS LOGIC ---
  const speak = useCallback((text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) => v.name.includes("Google US English") || v.name.includes("Female"),
    );
    if (femaleVoice) utterance.voice = femaleVoice;

    window.speechSynthesis.speak(utterance);
  }, []);

  // Auto-speak on step change
  useEffect(() => {
    if (steps[currentStep]) {
      speak(`Step ${currentStep + 1}. ${steps[currentStep]}`);
    }
    return () => window.speechSynthesis.cancel();
  }, [currentStep, steps, speak]);

  const getStepTime = (text) => {
    const match = text.match(/(\d+)\s*minute/i);
    return match ? parseInt(match[1]) * 60 : 600;
  };

  // --- 3. TIMER SYNC WITH TIK-TIK ---
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        playTik(); // Play sound every second
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      speak("Time is up! Please proceed to the next step.");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, speak, playTik]);

  const startTimer = () => {
    // Resume audio context (browsers block sound until user interaction)
    if (audioCtx.current && audioCtx.current.state === "suspended") {
      audioCtx.current.resume();
    }
    const seconds = getStepTime(steps[currentStep]);
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
        <p className="font-bold text-gray-400">Loading recipe steps...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col font-sans antialiased animate-in fade-in duration-300">
      <div className="h-2 bg-gray-100 w-full">
        <div
          className="h-full bg-green-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              onExit();
            }}
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

      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full">
        <div className="space-y-8 text-center">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-3xl text-green-600 flex items-center justify-center">
              <span className="text-3xl font-black">{currentStep + 1}</span>
            </div>
            <button
              onClick={() => speak(steps[currentStep])}
              className="absolute -right-12 p-3 bg-white shadow-md border border-gray-100 rounded-full hover:scale-110 transition-all text-green-600"
              title="Repeat instruction"
            >
              <Volume2 size={20} />
            </button>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gray-800 leading-tight">
            {steps[currentStep]}
          </h1>

          {steps[currentStep].toLowerCase().includes("minute") && (
            <div
              className={`mt-12 p-8 rounded-[3rem] border-2 border-dashed transition-all duration-500 ${isTimerRunning ? "bg-green-50 border-green-400" : "bg-[#fcfaf7] border-green-200"}`}
            >
              {timeLeft !== null ? (
                <div
                  className={`text-6xl font-black mb-4 font-mono ${isTimerRunning ? "text-green-600 animate-pulse" : "text-gray-800"}`}
                >
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
                className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-lg text-white ${isTimerRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
              >
                {isTimerRunning
                  ? "Pause Timer"
                  : `Start ${getStepTime(steps[currentStep]) / 60}m Timer`}
              </button>
            </div>
          )}
        </div>
      </main>

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
              onClick={() => {
                window.speechSynthesis.cancel();
                onExit();
              }}
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
