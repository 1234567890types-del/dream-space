import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Heart, Sparkles, Flame, Moon } from "lucide-react";
import { PetState } from "../types";
import { PET_CATALOG } from "../data";
import soundEngine from "../utils/audio";

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePet: PetState | null;
  onAdoptPet: (pet: PetState) => void;
  onFeedPet: () => void;
  onPlayPet: () => void;
  onTrainPet: () => void;
  shards: number;
}

export default function PetModal({
  isOpen,
  onClose,
  activePet,
  onAdoptPet,
  onFeedPet,
  onPlayPet,
  onTrainPet,
  shards,
}: PetModalProps) {
  const [selectedToAdopt, setSelectedToAdopt] = useState<number | null>(null);
  const [adoptName, setAdoptName] = useState("");

  if (!isOpen) return null;

  const handleAdoptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedToAdopt === null) return;
    const template = PET_CATALOG[selectedToAdopt];
    const finalName = adoptName.trim() || template.name;

    const newPet: PetState = {
      id: `pet-${Date.now()}`,
      name: finalName,
      type: template.type as any,
      emoji: template.emoji,
      hunger: 60,
      energy: 50,
      level: 1,
      xp: 0,
      activity: "playing",
    };

    soundEngine.playChime();
    onAdoptPet(newPet);
    setAdoptName("");
    setSelectedToAdopt(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-[#070715] glass-panel rounded-3xl p-6 md:p-8 text-white border border-white/10 shadow-2xl"
        id="pet-modal-card"
      >
        <button
          onClick={() => {
            soundEngine.playChime();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full glass-button hover:bg-white/10 text-white/70 hover:text-white"
          id="close-pet-modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Heart className="text-dream-pink animate-pulse fill-dream-pink" size={26} />
          <div>
            <h2 className="text-2xl font-bold font-display tracking-tight">The Celestial Menagerie</h2>
            <p className="text-xs text-white/50">Adopt and nurture a magical companion that walks in your dream room.</p>
          </div>
        </div>

        {activePet ? (
          /* Nurturing Panel if already adopted */
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-dream-purple/20">
                <Sparkles size={36} />
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-dream-purple/20 to-dream-pink/20 border border-white/10 flex items-center justify-center text-5xl soft-glow">
                {activePet.emoji}
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-dream-pink/20 text-dream-pink uppercase font-semibold">
                  Lv. {activePet.level} {activePet.type}
                </span>
                <h3 className="text-xl font-bold font-display text-white mt-1">{activePet.name}</h3>
                <p className="text-xs text-white/50 capitalize font-mono">Current state: {activePet.activity}</p>
              </div>
            </div>

            {/* EXP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-white/60">
                <span>XP Progress</span>
                <span>{activePet.xp} / 100</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-dream-purple to-dream-pink transition-all duration-500"
                  style={{ width: `${activePet.xp}%` }}
                />
              </div>
            </div>

            {/* Vital Stats (Hunger and Energy) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Hunger</span>
                  <span className={activePet.hunger < 30 ? "text-red-400 font-semibold" : "text-white"}>
                    {activePet.hunger}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      activePet.hunger < 30 ? "bg-red-400" : "bg-dream-cyan"
                    }`}
                    style={{ width: `${activePet.hunger}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Energy</span>
                  <span>{activePet.energy}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-dream-amber transition-all duration-500" style={{ width: `${activePet.energy}%` }} />
                </div>
              </div>
            </div>

            {/* Care Actions */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => {
                  if (shards < 10) {
                    alert("Not enough Shards!");
                    return;
                  }
                  soundEngine.playWaterBubble();
                  onFeedPet();
                }}
                className="py-3 px-2 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 hover:bg-dream-purple/10 hover:border-dream-purple/30 transition-all flex flex-col items-center gap-1.5 cursor-pointer"
                id="feed-pet-button"
              >
                <span className="text-xl">🍪</span>
                <span>Feed (10 Sh.)</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playPetSparkle();
                  onPlayPet();
                }}
                className="py-3 px-2 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 hover:bg-dream-pink/10 hover:border-dream-pink/30 transition-all flex flex-col items-center gap-1.5 cursor-pointer"
                id="play-pet-button"
              >
                <span className="text-xl">🧸</span>
                <span>Play & Cuddle</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playChime();
                  onTrainPet();
                }}
                className="py-3 px-2 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 hover:bg-dream-cyan/10 hover:border-dream-cyan/30 transition-all flex flex-col items-center gap-1.5 cursor-pointer"
                id="train-pet-button"
              >
                <span className="text-xl">🪄</span>
                <span>Train Trick</span>
              </button>
            </div>
          </div>
        ) : (
          /* Adoption Catalog Panel if no active pet */
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-dream-purple mb-2">
              Available Companions
            </h3>
            
            {selectedToAdopt === null ? (
              <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-1">
                {PET_CATALOG.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEngine.playChime();
                      setSelectedToAdopt(idx);
                    }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-dream-pink/30 hover:bg-white/10 text-left transition-all cursor-pointer flex items-center gap-3"
                    id={`pet-catalog-${idx}`}
                  >
                    <div className="text-4xl">{p.emoji}</div>
                    <div>
                      <h4 className="font-bold font-display text-sm">{p.name}</h4>
                      <p className="text-[10px] text-white/40 font-mono">{p.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Name Form after selecting a pet */
              <form onSubmit={handleAdoptSubmit} className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-5xl">{PET_CATALOG[selectedToAdopt].emoji}</div>
                  <div>
                    <h4 className="font-bold font-display">Naming your {PET_CATALOG[selectedToAdopt].type}</h4>
                    <p className="text-xs text-white/50">Give your new stardust companion a sweet name.</p>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder={PET_CATALOG[selectedToAdopt].name}
                  value={adoptName}
                  onChange={(e) => setAdoptName(e.target.value)}
                  maxLength={15}
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-dream-pink/40"
                  id="pet-name-input"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playChime();
                      setSelectedToAdopt(null);
                    }}
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer"
                    id="cancel-adoption"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-dream-purple to-dream-pink rounded-xl text-xs font-semibold cursor-pointer"
                    id="confirm-adoption"
                  >
                    Complete Adoption (Free)
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
