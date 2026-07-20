import { useState } from "react";
import { motion } from "motion/react";
import { X, Monitor, Send, Sparkles, RefreshCw, Compass, Moon, Palette } from "lucide-react";
import soundEngine from "../utils/audio";

interface BrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  currentMood: string;
  onAddJournalEntry?: (title: string, text: string, interpretation: string, mood: string) => void;
}

export default function BrowserModal({ isOpen, onClose, currentTheme, currentMood, onAddJournalEntry }: BrowserModalProps) {
  const [activeTab, setActiveTab] = useState<"dream" | "designer" | "journal">("dream");
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleAISubmit = async () => {
    if (!inputText.trim() && activeTab !== "designer") return;
    
    soundEngine.playChime();
    setIsLoading(true);
    setErrorMsg("");
    setResponse("");

    let payload: any = {};
    let action = "";

    if (activeTab === "dream") {
      action = "dream_interpret";
      payload = { dreamText: inputText };
    } else if (activeTab === "designer") {
      action = "room_suggestion";
      payload = { currentTheme, mood: currentMood };
    } else if (activeTab === "journal") {
      action = "daily_journal";
      payload = { journalText: inputText };
    }

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, payload }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.text);
        
        // If it's a journal entry, automatically save it to the memory wall
        if (activeTab === "journal" && onAddJournalEntry) {
          onAddJournalEntry("Stardust Journal Entry", inputText, data.text, currentMood);
        }
      } else {
        // Fallback for offline or key-missing states
        setResponse(data.text || "Connection to the stars interrupted. Let me help from my backup circuits! 📡");
        if (data.error) {
          setErrorMsg(data.error);
        }
      }
    } catch (err: any) {
      setErrorMsg("Failed to sync with the celestial mainframe. Using local stardust emulator instead.");
      setResponse("The stellar dust is thick tonight, blocking my deep-space transceivers. Let's imagine together! ✨");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-2xl h-[85vh] flex flex-col bg-[#070714] glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl text-white"
        id="retro-computer-card"
      >
        {/* Terminal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-dream-purple/20 rounded-xl text-dream-purple animate-pulse">
              <Monitor size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display">Dream-Net Core v1.95</h2>
              <p className="text-[10px] text-white/40 font-mono">STATUS: CELESTIAL CONNECTION STABLE</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              soundEngine.playChime();
              onClose();
            }}
            className="p-1.5 rounded-full glass-button hover:bg-white/10 text-white/70 hover:text-white"
            id="close-computer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/5 bg-white/2">
          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveTab("dream");
              setInputText("");
              setResponse("");
              setErrorMsg("");
            }}
            className={`flex-1 py-3 text-xs font-mono tracking-wider uppercase border-b-2 transition-all ${
              activeTab === "dream"
                ? "border-dream-purple text-dream-purple bg-dream-purple/5"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Moon size={14} /> Dream Interpreter
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveTab("designer");
              setInputText("");
              setResponse("");
              setErrorMsg("");
            }}
            className={`flex-1 py-3 text-xs font-mono tracking-wider uppercase border-b-2 transition-all ${
              activeTab === "designer"
                ? "border-dream-cyan text-dream-cyan bg-dream-cyan/5"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Palette size={14} /> AI Interior Designer
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveTab("journal");
              setInputText("");
              setResponse("");
              setErrorMsg("");
            }}
            className={`flex-1 py-3 text-xs font-mono tracking-wider uppercase border-b-2 transition-all ${
              activeTab === "journal"
                ? "border-dream-pink text-dream-pink bg-dream-pink/5"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Compass size={14} /> Daily Journal AI
            </span>
          </button>
        </div>

        {/* Terminal Screen Interface */}
        <div className="flex-1 p-6 flex flex-col overflow-hidden bg-black/30">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1 font-sans text-sm">
            {/* Guide bubble */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/80">
              {activeTab === "dream" && (
                <p className="leading-relaxed">
                  🔮 **Welcome, Wanderer.** Speak of what you saw in your nocturnal slumber. No detail is too small. I shall extract symbols and provide cosmic guidance.
                </p>
              )}
              {activeTab === "designer" && (
                <p className="leading-relaxed">
                  📐 **Space Architect Module.** I will look at your current aesthetic and emotional vibration to formulate 3 custom magical items and lighting combinations.
                  <br />
                  <span className="text-[11px] text-white/50">Current room vibe: Theme = <b className="text-dream-cyan">{currentTheme}</b>, Mood = <b className="text-dream-pink">{currentMood}</b>.</span>
                </p>
              )}
              {activeTab === "journal" && (
                <p className="leading-relaxed">
                  ✍️ **Daily Stardust Chronicler.** Pour out your feelings, struggles, and mini-successes. I will synthesize them into an emotional stardust record and suggest a soothing bedtime ritual.
                </p>
              )}
            </div>

            {/* AI Response Block */}
            {(response || isLoading) && (
              <div className="p-5 rounded-2xl bg-[#090918] border border-dream-purple/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-dream-purple opacity-20">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xs font-mono text-dream-purple mb-3 flex items-center gap-2">
                  <Sparkles size={12} className="animate-spin" /> TERMINAL RESPONSE OUTPUT:
                </h3>
                
                {isLoading ? (
                  <div className="flex items-center gap-3 py-4 text-white/60">
                    <RefreshCw className="animate-spin text-dream-purple" size={18} />
                    <span className="font-mono text-xs">Consulting celestial databases...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-white/90 leading-relaxed font-sans text-sm whitespace-pre-line">
                    {response}
                  </div>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 text-xs bg-red-950/40 border border-red-900/50 rounded-xl text-red-300 font-mono">
                ℹ️ {errorMsg}
              </div>
            )}
          </div>

          {/* User Input Drawer */}
          {activeTab !== "designer" ? (
            <div className="flex gap-2 items-center p-2 bg-white/5 border border-white/10 rounded-2xl">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeTab === "dream"
                    ? "Explain your dream (e.g., I was floating through a sky of purple cherry blossoms...)"
                    : "Write about your day today..."
                }
                rows={2}
                disabled={isLoading}
                className="flex-grow bg-transparent border-none text-white placeholder-white/30 text-sm focus:outline-none resize-none px-3 font-sans"
                id="ai-terminal-input"
              />
              <button
                onClick={handleAISubmit}
                disabled={isLoading || !inputText.trim()}
                className="p-3 bg-gradient-to-r from-dream-purple to-dream-pink rounded-xl text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                id="send-ai-terminal"
              >
                <Send size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAISubmit}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-dream-cyan to-dream-purple rounded-2xl text-white font-display font-semibold hover:shadow-lg hover:shadow-dream-cyan/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
              id="generate-interior-suggestions"
            >
              <Sparkles size={16} className="animate-pulse" /> Re-Analyze Vibe & Generate Recommendations
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
