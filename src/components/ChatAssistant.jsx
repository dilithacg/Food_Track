import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
// Import your custom icon
import ChefIcon from "../assets/images/chef.png";
import { ChatService } from "../api/geminiService";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "bot",
      text: "Hey! I'm Chef Track. Need help with a recipe, a substitute, or food safety tips?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const botResponse = await ChatService.getChefResponse(userMsg);
      setChatHistory((prev) => [...prev, { role: "bot", text: botResponse }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I'm having trouble connecting to my kitchen brain. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] font-sans">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-green-700 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className=" p-1 rounded-xl w-10 h-10 flex items-center justify-center overflow-hidden">
                {/* CUSTOM CHEF ICON USED HERE */}
                <img
                  src={ChefIcon}
                  alt="Chef"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-wider">
                  Chef Assistant
                </h3>
                <p className="text-[10px] opacity-80">
                  Online | Kitchen Expert
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:rotate-90 transition-transform"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fcfaf7]">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <Loader2 size={18} className="animate-spin text-green-600" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white border-t border-gray-100 flex gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about cooking..."
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-5 rounded-3xl shadow-2xl transition-all duration-300 flex items-center gap-3 active:scale-95 ${
          isOpen
            ? "bg-red-500 text-white rotate-90"
            : "bg-green-900 text-white hover:bg-green-800"
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && <span className="font-black text-sm pr-2">Ask Chef</span>}
      </button>
    </div>
  );
}
