import { useState } from "react";
import { motion } from "motion/react";
import { X, Sparkles, ChevronLeft, ChevronRight, RotateCcw, Plus, Minus, Trash2 } from "lucide-react";
import { DecorItem, StoreItem } from "../types";
import soundEngine from "../utils/audio";

interface RoomCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  placedItems: DecorItem[];
  onUpdateItem: (updated: DecorItem) => void;
  onRemoveItem: (id: string) => void;
  onPlaceNewItem: (item: Omit<DecorItem, "id" | "x" | "y" | "rotation" | "scale">) => void;
  purchasedCatalog: StoreItem[];
}

export default function RoomCustomizer({
  isOpen,
  onClose,
  placedItems,
  onUpdateItem,
  onRemoveItem,
  onPlaceNewItem,
  purchasedCatalog,
}: RoomCustomizerProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedItem = placedItems.find((item) => item.id === selectedItemId);

  const handlePlaceStoreItem = (store: StoreItem) => {
    soundEngine.playChime();
    onPlaceNewItem({
      name: store.name,
      emoji: store.emoji,
      category: store.category as any,
    });
  };

  const adjustPosition = (axis: "x" | "y", delta: number) => {
    if (!selectedItem) return;
    const current = selectedItem[axis];
    let next = current + delta;
    if (next < 5) next = 5;
    if (next > 95) next = 95;
    
    soundEngine.playPetSparkle();
    onUpdateItem({
      ...selectedItem,
      [axis]: Math.round(next),
    });
  };

  const adjustRotation = (delta: number) => {
    if (!selectedItem) return;
    let next = (selectedItem.rotation + delta) % 360;
    if (next < 0) next += 360;

    soundEngine.playPetSparkle();
    onUpdateItem({
      ...selectedItem,
      rotation: next,
    });
  };

  const adjustScale = (factor: number) => {
    if (!selectedItem) return;
    let next = selectedItem.scale + factor;
    if (next < 0.5) next = 0.5;
    if (next > 2.0) next = 2.0;

    soundEngine.playPetSparkle();
    onUpdateItem({
      ...selectedItem,
      scale: parseFloat(next.toFixed(2)),
    });
  };

  return (
    <div className="absolute right-4 top-20 bottom-4 w-80 glass-panel rounded-3xl p-5 text-white border border-white/10 shadow-2xl flex flex-col z-40">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <Sparkles className="text-dream-cyan" size={16} />
          <h3 className="font-bold font-display text-sm tracking-wide">Design Studio</h3>
        </div>
        <button
          onClick={() => {
            soundEngine.playChime();
            onClose();
          }}
          className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          id="close-design-studio"
        >
          <X size={14} />
        </button>
      </div>

      {/* Main inventory list */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
        {/* Spawnable items section */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-dream-cyan mb-2">
            Decor Inventory Box
          </h4>
          
          {purchasedCatalog.filter(i => i.category !== "music").length === 0 ? (
            <div className="p-3 text-[10px] bg-white/2 border border-white/5 rounded-xl text-white/40 italic">
              Inventory box is empty. Go buy cozy pillows, sofas, or lanterns in the Bazaar first!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {purchasedCatalog.filter(i => i.category !== "music").map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePlaceStoreItem(item)}
                  className="p-2 bg-white/5 border border-white/5 hover:border-dream-cyan/30 rounded-xl flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer relative group"
                  title={`Spawn ${item.name}`}
                  id={`spawn-decor-${item.id}`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[8px] text-white/30 truncate w-full text-center mt-1">Place</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Existing room elements list */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-dream-purple mb-2">
            Active Room Elements
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {placedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playChime();
                    setSelectedItemId(isSelected ? null : item.id);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "border-dream-purple bg-dream-purple/10 text-white font-semibold"
                      : "border-white/5 bg-white/2 text-white/60 hover:bg-white/5 hover:border-white/10"
                  }`}
                  id={`room-item-${item.id}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{item.emoji}</span>
                    <span className="truncate max-w-[120px]">{item.name}</span>
                  </span>
                  <span className="text-[9px] font-mono text-white/30">
                    x:{item.x}% y:{item.y}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Precise tactile controls for selected item */}
        {selectedItem && (
          <div className="p-4 rounded-2xl bg-white/5 border border-dream-purple/20 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-dream-purple flex items-center gap-1.5">
                <span>{selectedItem.emoji}</span> {selectedItem.name}
              </span>
              <button
                onClick={() => {
                  soundEngine.playChime();
                  onRemoveItem(selectedItem.id);
                  setSelectedItemId(null);
                }}
                className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-950/20 transition-all cursor-pointer"
                title="Remove back to catalog"
                id="remove-item-studio"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Position controls */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Position</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between bg-black/20 rounded-xl p-1 px-2 border border-white/5">
                  <span className="text-[10px] font-mono text-white/50">H-Axis</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => adjustPosition("x", -5)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button
                      onClick={() => adjustPosition("x", 5)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/20 rounded-xl p-1 px-2 border border-white/5">
                  <span className="text-[10px] font-mono text-white/50">V-Axis</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => adjustPosition("y", -5)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => adjustPosition("y", 5)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rotation and Scale */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Rotation</span>
                <div className="flex items-center justify-between bg-black/20 rounded-xl p-1.5 px-2.5 border border-white/5">
                  <span className="text-[10px] font-mono">{selectedItem.rotation}°</span>
                  <button
                    onClick={() => adjustRotation(45)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-dream-purple cursor-pointer"
                    title="Rotate 45°"
                  >
                    <RotateCcw size={12} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Scale</span>
                <div className="flex items-center justify-between bg-black/20 rounded-xl p-1 px-2 border border-white/5">
                  <span className="text-[10px] font-mono">{selectedItem.scale}x</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => adjustScale(0.1)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer text-dream-purple"
                    >
                      <Plus size={10} />
                    </button>
                    <button
                      onClick={() => adjustScale(-0.1)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer text-dream-purple"
                    >
                      <Minus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-[9px] text-center text-white/20 font-mono border-t border-white/5 pt-3 leading-relaxed">
        Select any item from the room or box to scale, rotate, slide, or return it.
      </div>
    </div>
  );
}
