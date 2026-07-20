import { useState } from "react";
import { motion } from "motion/react";
import { X, ShoppingBag, Sparkles } from "lucide-react";
import { StoreItem } from "../types";
import soundEngine from "../utils/audio";

interface MarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  shards: number;
  onBuyItem: (item: StoreItem) => void;
  storeCatalog: StoreItem[];
}

export default function MarketModal({ isOpen, onClose, shards, onBuyItem, storeCatalog }: MarketModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "furniture" | "plants" | "lights" | "music">("all");

  if (!isOpen) return null;

  const filteredItems = storeCatalog.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  const handlePurchase = (item: StoreItem) => {
    if (item.purchased) return;
    if (shards < item.price) {
      alert("🌌 You do not have enough Dream Shards. Explore, fish, water plants, or read quiet cosmic archives to earn more!");
      return;
    }
    soundEngine.playChime();
    onBuyItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl h-[80vh] bg-[#090918] glass-panel rounded-3xl p-6 md:p-8 text-white border border-white/10 shadow-2xl flex flex-col"
        id="marketplace-modal-card"
      >
        <button
          onClick={() => {
            soundEngine.playChime();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full glass-button hover:bg-white/10 text-white/70 hover:text-white"
          id="close-market-button"
        >
          <X size={18} />
        </button>

        {/* Header containing current Shard Balance */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-dream-pink animate-pulse" size={28} />
            <div>
              <h2 className="text-2xl font-bold font-display tracking-tight">Stardust Bazaar</h2>
              <p className="text-xs text-white/50">Trade your celestial shards for rare universe trinkets.</p>
            </div>
          </div>

          {/* Shards tracker pill */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-dream-amber self-start md:self-auto shadow-inner">
            <Sparkles size={16} className="animate-spin text-dream-amber" />
            <span className="font-mono text-sm font-semibold">{shards} Shards</span>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-white/5 scrollbar-thin">
          {(["all", "furniture", "plants", "lights", "music"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundEngine.playChime();
                setActiveTab(tab);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono capitalize tracking-wide transition-all border shrink-0 cursor-pointer ${
                activeTab === tab
                  ? "bg-dream-pink text-white border-dream-pink shadow-md"
                  : "bg-white/2 border-white/5 text-white/60 hover:text-white hover:border-white/10"
              }`}
              id={`shop-tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Store items catalog grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                item.purchased
                  ? "bg-white/2 border-white/5 opacity-65"
                  : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
              }`}
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold font-display text-sm text-white group-hover:text-dream-pink">{item.name}</h4>
                  <p className="text-[10px] text-white/30 font-mono capitalize mt-0.5">{item.category}</p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <div className="text-dream-amber font-mono text-xs flex items-center gap-1 font-semibold">
                  {!item.purchased && (
                    <>
                      <Sparkles size={12} />
                      {item.price} Shards
                    </>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  disabled={item.purchased}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    item.purchased
                      ? "bg-white/5 border border-white/5 text-white/30 cursor-not-allowed"
                      : "bg-white/10 text-white hover:bg-dream-pink hover:text-white border border-white/10 hover:border-dream-pink shadow-sm"
                  }`}
                  id={`purchase-item-${item.id}`}
                >
                  {item.purchased ? "Unlocked" : "Buy Item"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
