import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X, Trophy, Sparkles, Anchor, Palette, Trash2, Heart } from "lucide-react";
import soundEngine from "../utils/audio";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnShards: (amount: number) => void;
}

const COSMIC_CREATURES = [
  { name: "Comet Trout", rarity: "Common", value: 15, emoji: "🐟" },
  { name: "Stardust Jellyfish", rarity: "Uncommon", value: 30, emoji: "🪼" },
  { name: "Moonlight Crab", rarity: "Uncommon", value: 35, emoji: "🦀" },
  { name: "Astral Anglerfish", rarity: "Rare", value: 60, emoji: "🐠" },
  { name: "Cosmic Void Whale", rarity: "Legendary", value: 120, emoji: "🐋" },
];

export default function GameModal({ isOpen, onClose, onEarnShards }: GameModalProps) {
  const [activeTab, setActiveTab] = useState<"fishing" | "painting">("fishing");

  // Fishing game variables
  const [isFishing, setIsFishing] = useState(false);
  const [needlePos, setNeedlePos] = useState(0); // 0 to 100
  const [needleDir, setNeedleDir] = useState(1); // 1 = right, -1 = left
  const [catchResult, setCatchResult] = useState<string | null>(null);
  const [caughtCreature, setCaughtCreature] = useState<any | null>(null);

  // Painting game variables
  const [canvasGrid, setCanvasGrid] = useState<string[]>(Array(64).fill("#ffffff05")); // 8x8 pixel grid
  const [selectedColor, setSelectedColor] = useState("#c084fc"); // default purple

  const PALETTE_COLORS = [
    "#c084fc", // Purple
    "#f472b6", // Pink
    "#22d3ee", // Cyan
    "#34d399", // Emerald
    "#fbbf24", // Amber
    "#ffffff", // Star white
    "#070710", // Space void
  ];

  if (!isOpen) return null;

  // Timed loop for fishing needle movement
  useEffect(() => {
    let animationFrameId: number;

    if (isFishing && !catchResult) {
      const updateNeedle = () => {
        setNeedlePos((prev) => {
          let next = prev + needleDir * 2.8;
          if (next >= 100) {
            setNeedleDir(-1);
            return 100;
          }
          if (next <= 0) {
            setNeedleDir(1);
            return 0;
          }
          return next;
        });
        animationFrameId = requestAnimationFrame(updateNeedle);
      };
      animationFrameId = requestAnimationFrame(updateNeedle);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isFishing, needleDir, catchResult]);

  const startFishingExpedition = () => {
    soundEngine.playChime();
    setIsFishing(true);
    setCatchResult(null);
    setCaughtCreature(null);
    setNeedlePos(0);
    setNeedleDir(1);
  };

  const pullFishingReel = () => {
    if (!isFishing || catchResult) return;
    
    // Sweet spot is between 45% and 55%
    const isSuccess = needlePos >= 42 && needlePos <= 58;

    if (isSuccess) {
      soundEngine.playChime();
      const randVal = Math.random();
      let selected: any;
      
      // Rarity threshold selector
      if (randVal < 0.45) selected = COSMIC_CREATURES[0]; // Comet Trout
      else if (randVal < 0.75) selected = COSMIC_CREATURES[Math.floor(Math.random() * 2) + 1]; // Jellyfish / Crab
      else if (randVal < 0.94) selected = COSMIC_CREATURES[3]; // Angler
      else selected = COSMIC_CREATURES[4]; // Legendary Void Whale

      setCaughtCreature(selected);
      setCatchResult("success");
      onEarnShards(selected.value);
    } else {
      soundEngine.playWaterBubble();
      setCatchResult("fail");
    }
  };

  // Painting functions
  const handlePixelClick = (index: number) => {
    soundEngine.playChime();
    const newGrid = [...canvasGrid];
    newGrid[index] = selectedColor;
    setCanvasGrid(newGrid);
  };

  const clearStarryCanvas = () => {
    soundEngine.playWaterBubble();
    setCanvasGrid(Array(64).fill("#ffffff05"));
  };

  const pinPaintingToWall = () => {
    soundEngine.playChime();
    alert("🎨 Beautiful! You pinned your hand-drawn glowing constellation onto the Memory Wall! The AI Companion applauded your creativity.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-[#090916] glass-panel rounded-3xl p-6 md:p-8 text-white border border-white/10 shadow-2xl flex flex-col h-[75vh]"
        id="mini-games-modal-card"
      >
        <button
          onClick={() => {
            soundEngine.playChime();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full glass-button hover:bg-white/10 text-white/70 hover:text-white"
          id="close-game-modal"
        >
          <X size={18} />
        </button>

        {/* Tab selection */}
        <div className="flex gap-4 mb-6 border-b border-white/5 pb-3">
          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveTab("fishing");
            }}
            className={`flex items-center gap-2 pb-2 text-sm font-bold font-display border-b-2 transition-all cursor-pointer ${
              activeTab === "fishing" ? "border-dream-cyan text-dream-cyan" : "border-transparent text-white/40 hover:text-white"
            }`}
            id="tab-fishing"
          >
            <Anchor size={16} /> Cosmic Void Fishing
          </button>

          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveTab("painting");
            }}
            className={`flex items-center gap-2 pb-2 text-sm font-bold font-display border-b-2 transition-all cursor-pointer ${
              activeTab === "painting" ? "border-dream-purple text-dream-purple" : "border-transparent text-white/40 hover:text-white"
            }`}
            id="tab-painting"
          >
            <Palette size={16} /> Constellation Painting
          </button>
        </div>

        {activeTab === "fishing" ? (
          /* Fishing Game Panel */
          <div className="flex-1 flex flex-col justify-between items-center text-center">
            <div>
              <h3 className="text-xl font-bold font-display mb-1 text-dream-cyan">Void Angler Expedition</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                Drop your stellar line directly into the raw cosmic ocean. Hit pull when the needle centers on the gold spark reef!
              </p>
            </div>

            <div className="my-8 w-full max-w-sm space-y-8 flex flex-col items-center">
              {isFishing ? (
                <>
                  {/* Timing Bar Gauge */}
                  <div className="w-full h-8 bg-black/40 rounded-2xl relative overflow-hidden border border-white/10 shadow-inner flex items-center">
                    {/* Gold sweet spot in center (42% to 58%) */}
                    <div className="absolute inset-y-0 left-[42%] right-[42%] bg-gradient-to-r from-dream-amber to-dream-pink opacity-40 animate-pulse border-x border-dream-amber" />
                    
                    {/* Sparkle icon at center */}
                    <div className="absolute left-[50%] -translate-x-1/2 text-dream-amber">
                      <Sparkles size={16} className="animate-spin" />
                    </div>

                    {/* Sliding Needle */}
                    <div
                      className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_#fff] transition-all duration-75"
                      style={{ left: `${needlePos}%` }}
                    />
                  </div>

                  {/* Pull Reel Buttons */}
                  {!catchResult ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={pullFishingReel}
                      className="px-8 py-4 bg-gradient-to-r from-dream-cyan to-dream-purple rounded-2xl font-display font-semibold shadow-lg hover:shadow-dream-cyan/20 cursor-pointer"
                      id="pull-reel-fishing"
                    >
                      🎣 PULL REEL NOW!
                    </motion.button>
                  ) : (
                    <div className="space-y-4">
                      {catchResult === "success" && caughtCreature ? (
                        <motion.div
                          initial={{ scale: 0.8, rotate: -5 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="p-5 rounded-2xl bg-dream-purple/10 border border-dream-purple/30 text-center"
                        >
                          <span className="text-6xl inline-block mb-3 animate-float">{caughtCreature.emoji}</span>
                          <h4 className="font-bold text-lg font-display text-dream-amber">
                            You Caught a {caughtCreature.name}!
                          </h4>
                          <p className="text-xs text-white/60">
                            Rarity: <b className="text-dream-purple font-mono">{caughtCreature.rarity}</b>
                          </p>
                          <p className="text-xs text-dream-amber font-semibold mt-1">
                            +{caughtCreature.value} Dream Shards deposited!
                          </p>
                        </motion.div>
                      ) : (
                        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-300 text-xs font-mono">
                          💨 Ah, the creature slipped back into the nebula stream... Try again!
                        </div>
                      )}

                      <button
                        onClick={startFishingExpedition}
                        className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-white/70 hover:text-white bg-white/5 cursor-pointer"
                        id="retry-fishing"
                      >
                        Cast Line Again
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={startFishingExpedition}
                  className="px-8 py-5 bg-gradient-to-r from-dream-cyan to-dream-purple text-white rounded-3xl font-display font-bold text-sm shadow-xl hover:shadow-dream-cyan/30 flex items-center gap-3 cursor-pointer"
                  id="cast-fishing-line"
                >
                  <Anchor size={18} /> Cast Reel into Void
                </button>
              )}
            </div>

            <div className="text-[10px] text-white/30 font-mono">
              Daily quota: Unlimted cast times. Rarer species have narrower catch margins.
            </div>
          </div>
        ) : (
          /* Painting Game Panel */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold font-display text-dream-purple">Constellation Sketcher</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Draw glittering constellations, neon comets, or Ghibli starry shapes onto your space grid.
              </p>
            </div>

            {/* Grid Paintboard */}
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-8 grid-rows-8 gap-1.5 p-3 rounded-2xl bg-black/40 border border-white/10 w-64 h-64 shadow-inner">
                {canvasGrid.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePixelClick(idx)}
                    className="w-full h-full rounded transition-all border border-white/2 cursor-pointer"
                    style={{ backgroundColor: color }}
                    id={`canvas-pixel-${idx}`}
                  />
                ))}
              </div>
            </div>

            {/* Colors Palette & Controls */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center gap-4">
              <div className="flex gap-1.5 overflow-x-auto">
                {PALETTE_COLORS.map((col) => (
                  <button
                    key={col}
                    onClick={() => {
                      soundEngine.playChime();
                      setSelectedColor(col);
                    }}
                    className={`w-7 h-7 rounded-full border cursor-pointer transition-transform ${
                      selectedColor === col ? "scale-110 ring-2 ring-white/50" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: col }}
                    id={`paint-color-${col.replace("#", "")}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearStarryCanvas}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Wipe canvas"
                  id="clear-canvas"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={pinPaintingToWall}
                  className="px-4 py-2 bg-dream-purple text-white text-xs font-semibold rounded-xl hover:shadow hover:shadow-dream-purple/20 cursor-pointer"
                  id="pin-canvas"
                >
                  Pin Constellation
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
