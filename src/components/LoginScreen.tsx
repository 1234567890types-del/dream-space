import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Moon, Volume2, VolumeX } from "lucide-react";
import soundEngine from "../utils/audio";

interface LoginScreenProps {
  onLogin: (userName: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleIntroMusic = () => {
    soundEngine.init();
    if (isPlaying) {
      soundEngine.stopAmbiance();
      setIsPlaying(false);
    } else {
      soundEngine.startAmbiance();
      soundEngine.playChime();
      setIsPlaying(true);
    }
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || "Dreamer";
    soundEngine.playChime();
    onLogin(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-dream-bg aurora-bg font-sans">
      {/* Floating Sparkles in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-80"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animation: `float ${Math.random() * 5 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full max-w-md p-8 mx-4 glass-panel rounded-3xl shadow-2xl text-center border border-white/10"
        id="login-card"
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-dream-purple/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-dream-cyan/15 blur-3xl pointer-events-none" />

        {/* Music button */}
        <button
          onClick={toggleIntroMusic}
          className="absolute top-6 right-6 p-2 rounded-full glass-button text-white/70 hover:text-white"
          id="toggle-music-login"
          title="Toggle peaceful ambient music"
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-dream-purple via-dream-pink to-dream-cyan opacity-45 blur-md"
            />
            <div className="relative p-4 rounded-full bg-[#0d0d21] border border-white/20 text-dream-purple shadow-inner">
              <Moon size={36} className="animate-pulse" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold font-display tracking-wide text-white mb-2">
          DREAM SPACE
        </h1>
        <p className="text-sm text-white/60 mb-8 max-w-xs mx-auto">
          Your cozy magical sanctuary floating in the quiet pocket of the universe.
        </p>

        <form onSubmit={handleGuestLogin} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your dreamer name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-dream-purple/50 focus:ring-1 focus:ring-dream-purple/30 transition-all font-sans text-sm text-center"
              maxLength={20}
              id="dreamer-name-input"
            />
            <Sparkles size={16} className="absolute right-4 top-4 text-white/30 pointer-events-none animate-pulse" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 rounded-2xl font-display font-semibold text-white bg-gradient-to-r from-dream-purple via-dream-pink to-dream-cyan hover:shadow-lg hover:shadow-dream-purple/20 transition-all text-sm cursor-pointer shadow-md"
            id="enter-dreamspace-button"
          >
            Awake Inside My Room
          </motion.button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-xs text-white/30">Or sign in with</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Mock Oauth options for gorgeous immersive fidelity */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {["Google", "Apple", "Email"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => {
                soundEngine.playChime();
                onLogin(`${method} ${method === "Email" ? "User" : "Dreamer"}`);
              }}
              className="py-2.5 rounded-xl glass-button text-xs font-sans text-white/70 hover:text-white"
              id={`login-method-${method.toLowerCase()}`}
            >
              {method}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-white/40 max-w-xs mx-auto leading-relaxed">
          Dream Space protects your peaceful vibes. Progress is stored locally in your stardust cloud database (localStorage).
        </p>
      </motion.div>
    </div>
  );
}
