import { motion } from "motion/react";
import { X, CloudRain, Sun, CloudSnow, Sparkles, Flame } from "lucide-react";
import soundEngine from "../utils/audio";

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWeather: string;
  onChangeWeather: (weather: "Clear Starry" | "Rainy" | "Snowy" | "Aurora Borealis" | "Meteor Shower" | "Cherry Blossom" | "Foggy Mist") => void;
}

const WEATHER_OPTIONS = [
  { id: "Clear Starry", name: "Starry Night", emoji: "🌌", icon: Sun, desc: "A quiet, glittering sky of deep indigo, speckled with infinite distant galaxies.", color: "text-dream-purple border-dream-purple/30 bg-dream-purple/5" },
  { id: "Rainy", name: "Cosmic Rain", icon: CloudRain, emoji: "🌧️", desc: "Soothing meteor droplets patter against the window. Triggers relaxing rain sounds.", color: "text-dream-cyan border-dream-cyan/30 bg-dream-cyan/5" },
  { id: "Snowy", name: "Glacier Dust", icon: CloudSnow, emoji: "🌨️", desc: "Soft, frozen stardust crystals drift gracefully through the cosmic void, cooling the soul.", color: "text-blue-300 border-blue-300/30 bg-blue-300/5" },
  { id: "Aurora Borealis", name: "Northern Lights", icon: Sparkles, emoji: "🟢", desc: "Waves of vibrant solar winds paint the cosmos in shifting, magical shades of emerald and magenta.", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5" },
  { id: "Meteor Shower", name: "Stardust Rain", icon: Flame, emoji: "☄️", desc: "Shooting stars stream across the sky, offering wishes and granting peaceful energy.", color: "text-dream-amber border-dream-amber/30 bg-dream-amber/5" },
  { id: "Cherry Blossom", name: "Blossom Breeze", icon: Sparkles, emoji: "🌸", desc: "Delicate cherry blossom petals float around, filling the cosmic deck with warm flower fragrance.", color: "text-dream-pink border-dream-pink/30 bg-dream-pink/5" },
  { id: "Foggy Mist", name: "Volumetric Mist", icon: CloudRain, emoji: "🌫️", desc: "A peaceful, deep white fog wraps around the bedroom, creating an ultra-private slumber atmosphere.", color: "text-gray-300 border-gray-300/30 bg-gray-300/5" },
];

export default function WeatherModal({ isOpen, onClose, activeWeather, onChangeWeather }: WeatherModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-[#0a0a16] glass-panel rounded-3xl p-6 md:p-8 text-white border border-white/10 shadow-2xl"
        id="weather-modal-card"
      >
        <button
          onClick={() => {
            soundEngine.playChime();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full glass-button hover:bg-white/10 text-white/70 hover:text-white"
          id="close-weather-button"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-dream-cyan animate-pulse" size={26} />
          <div>
            <h2 className="text-2xl font-bold font-display tracking-tight">The Celestial Skyway</h2>
            <p className="text-xs text-white/50">Tune the environment outside your window to suit your emotional state.</p>
          </div>
        </div>

        <div className="space-y-4">
          {WEATHER_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeWeather === opt.id;
            
            return (
              <button
                key={opt.id}
                onClick={() => {
                  soundEngine.playChime();
                  onChangeWeather(opt.id as any);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? "border-dream-cyan bg-dream-cyan/10 ring-1 ring-dream-cyan/40" 
                    : "border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/15"
                }`}
                id={`weather-option-${opt.id.toLowerCase().replace(" ", "-")}`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-dream-cyan m-3 animate-ping" />
                )}
                
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${isSelected ? "text-dream-cyan bg-dream-cyan/10" : "text-white/60 group-hover:text-white"}`}>
                  <Icon size={24} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold font-display text-white">{opt.name}</h4>
                    <span className="text-sm">{opt.emoji}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-center text-white/30 mt-6 font-mono leading-relaxed">
          Tuning the cosmos adjusts particles, soundscape frequencies, and room light balances.
        </p>
      </motion.div>
    </div>
  );
}
