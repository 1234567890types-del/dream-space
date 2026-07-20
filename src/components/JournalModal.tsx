import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Award, Sparkles, Plus, Trash2, Heart } from "lucide-react";
import { JournalEntry } from "../types";
import soundEngine from "../utils/audio";

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, "id" | "date">) => void;
  onDeleteEntry: (id: string) => void;
  shards: number;
}

const MOODS = ["Happy", "Sad", "Excited", "Romantic", "Lonely", "Dreamy"] as const;

export default function JournalModal({ isOpen, onClose, entries, onAddEntry, onDeleteEntry, shards }: JournalModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<"constellation" | "list">("constellation");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[number]>("Dreamy");

  if (!isOpen) return null;

  const getCoordinatesForEntry = (index: number, total: number) => {
    if (total <= 1) return { x: 50, y: 50 };
    // Arrange them in a beautiful starry orbit/constellation winding wave
    const angle = (index / total) * Math.PI * 1.5 + 0.35; // curved arc
    const radius = 24 + (index % 2) * 7; // spiral winding variation
    const x = 50 + Math.cos(angle) * radius;
    const y = 48 + Math.sin(angle) * radius;
    return { x, y };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    onAddEntry({
      title: title.trim(),
      text: text.trim(),
      mood: selectedMood,
    });

    setTitle("");
    setText("");
    setSelectedMood("Dreamy");
    setShowAddForm(false);
    soundEngine.playChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl h-[80vh] bg-[#080816] glass-panel rounded-3xl p-6 md:p-8 text-white border border-white/10 shadow-2xl flex flex-col"
        id="journal-modal-card"
      >
        <button
          onClick={() => {
            soundEngine.playChime();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full glass-button hover:bg-white/10 text-white/70 hover:text-white"
          id="close-journal-button"
        >
          <X size={18} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="text-dream-purple animate-pulse" size={28} />
            <div>
              <h2 className="text-2xl font-bold font-display tracking-tight">The Memory Wall</h2>
              <p className="text-xs text-white/50">Your personal chronicle of stardust dreams, feelings, and thoughts.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!showAddForm && entries.length > 0 && (
              <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/5 mr-1">
                <button
                  onClick={() => {
                    soundEngine.playChime();
                    setViewMode("constellation");
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-lg cursor-pointer transition-all ${
                    viewMode === "constellation" ? "bg-dream-purple text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => {
                    soundEngine.playChime();
                    setViewMode("list");
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-lg cursor-pointer transition-all ${
                    viewMode === "list" ? "bg-dream-purple text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  List
                </button>
              </div>
            )}

            <button
              onClick={() => {
                soundEngine.playChime();
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-dream-purple to-dream-pink text-white hover:opacity-90 transition-all cursor-pointer shadow-sm"
              id="toggle-add-journal-form"
            >
              <Plus size={14} /> {showAddForm ? "View Board" : "Write Log"}
            </button>
          </div>
        </div>

        {showAddForm ? (
          /* Create entry form */
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-4 overflow-y-auto pr-1">
            <h3 className="text-sm font-mono uppercase tracking-widest text-dream-purple">Draft Memory</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Log Title</label>
              <input
                type="text"
                placeholder="Name your slumber or daily moment..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={40}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-dream-purple/40"
                id="journal-title-input"
              />
            </div>

            <div className="space-y-1 flex-grow flex flex-col">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Your Feelings / slumbers</label>
              <textarea
                placeholder="Write your peaceful, quiet reflections or a strange night dream..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
                className="w-full flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-dream-purple/40 resize-none font-sans"
                id="journal-text-textarea"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Select Vibe Resonance</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      soundEngine.playChime();
                      setSelectedMood(m);
                    }}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                      selectedMood === m
                        ? "bg-dream-purple text-white border-dream-purple shadow"
                        : "bg-white/2 border-white/5 text-white/60 hover:text-white"
                    }`}
                    id={`journal-mood-${m.toLowerCase()}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-dream-purple to-dream-pink text-white font-display font-semibold hover:opacity-95 transition-all text-sm cursor-pointer shadow mt-4"
              id="save-journal-entry-button"
            >
              Pin to Wall & Earn 30 Shards
            </button>
          </form>
        ) : (
          /* Grid list of Polaroid-like notes or Constellation map */
          <div className="flex-1 flex flex-col overflow-hidden">
            {entries.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-white/40 flex-1">
                <Heart size={44} className="mb-3 stroke-1 animate-pulse" />
                <p className="text-sm font-display font-semibold">Your Memory Wall is quiet.</p>
                <p className="text-xs max-w-xs mt-1">Tap 'Write Log' or use your retro portal computer to record your first dream or journal entry!</p>
              </div>
            ) : viewMode === "constellation" ? (
              /* Connected Constellation Star Map */
              <div className="flex-1 relative rounded-2xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center p-4">
                {/* Twinkling starry background */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  {[...Array(15)].map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${idx * 0.3}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Dashed connecting star lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: "drop-shadow(0 0 4px rgba(192, 132, 252, 0.4))" }}>
                  {entries.map((entry, idx) => {
                    if (idx === 0) return null;
                    const p1 = getCoordinatesForEntry(idx - 1, entries.length);
                    const p2 = getCoordinatesForEntry(idx, entries.length);
                    return (
                      <line
                        key={entry.id}
                        x1={`${p1.x}%`}
                        y1={`${p1.y}%`}
                        x2={`${p2.x}%`}
                        y2={`${p2.y}%`}
                        stroke="rgba(192, 132, 252, 0.45)"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="animate-pulse"
                      />
                    );
                  })}
                </svg>

                {/* Glowing memory stars */}
                {entries.map((entry, idx) => {
                  const coords = getCoordinatesForEntry(idx, entries.length);
                  const isInspected = selectedEntry?.id === entry.id;

                  return (
                    <div
                      key={entry.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                      style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                    >
                      <button
                        onClick={() => {
                          soundEngine.playChime();
                          setSelectedEntry(isInspected ? null : entry);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                          isInspected
                            ? "bg-gradient-to-r from-dream-purple to-dream-pink text-white scale-125 ring-2 ring-white/20"
                            : "bg-white/5 hover:bg-white/10 text-dream-purple border border-dream-purple/25 hover:scale-115"
                        }`}
                        title={entry.title}
                      >
                        <span className="text-sm">✦</span>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono bg-black/60 px-1 py-0.5 rounded text-white/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {entry.title}
                        </span>
                      </button>
                    </div>
                  );
                })}

                {/* Inspector Polaroid Card Popup */}
                <AnimatePresence>
                  {selectedEntry && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="absolute bottom-4 left-4 right-4 p-4 bg-[#0a0a1c]/95 border border-white/10 rounded-2xl glass-panel shadow-2xl z-30 flex flex-col justify-between max-h-[75%] overflow-hidden text-left"
                    >
                      <div className="overflow-y-auto mb-2 pr-1 flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-dream-purple/20 text-dream-purple font-semibold uppercase">
                              {selectedEntry.mood}
                            </span>
                            <span className="text-[10px] font-mono text-white/40">{selectedEntry.date}</span>
                          </div>

                          <button
                            onClick={() => {
                              soundEngine.playChime();
                              onDeleteEntry(selectedEntry.id);
                              setSelectedEntry(null);
                            }}
                            className="p-1.5 rounded-full bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-950/20 cursor-pointer"
                            title="Delete memory star"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <h4 className="font-bold font-display text-sm text-white mb-2">{selectedEntry.title}</h4>
                        <p className="text-xs text-white/80 leading-relaxed font-sans whitespace-pre-line bg-white/2 p-3 rounded-xl border border-white/5 mb-2">
                          {selectedEntry.text}
                        </p>

                        {selectedEntry.interpretation && (
                          <div className="p-3 rounded-xl bg-dream-purple/5 border border-dream-purple/10">
                            <h5 className="text-[10px] font-mono text-dream-purple flex items-center gap-1">
                              <Sparkles size={10} /> AI Star Whisperer:
                            </h5>
                            <p className="text-[11px] text-white/60 mt-1 italic leading-relaxed">
                              {selectedEntry.interpretation}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playChime();
                          setSelectedEntry(null);
                        }}
                        className="py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono font-semibold hover:bg-white/10 transition-colors text-center w-full"
                      >
                        Close Star Inspection
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interaction prompt text */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/30 tracking-widest uppercase pointer-events-none whitespace-nowrap">
                  ✦ Click any Memory Star to inspect ✦
                </div>
              </div>
            ) : (
              /* Traditional list view of cards */
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid md:grid-cols-2 gap-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all shadow-sm"
                    >
                      {/* Floating trash button */}
                      <button
                        onClick={() => {
                          soundEngine.playChime();
                          onDeleteEntry(entry.id);
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Erase log"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-dream-purple/20 text-dream-purple font-semibold uppercase">
                            {entry.mood}
                          </span>
                          <span className="text-[10px] font-mono text-white/30">{entry.date}</span>
                        </div>
                        
                        <h4 className="font-bold font-display text-sm text-white">{entry.title}</h4>
                        <p className="text-xs text-white/70 mt-2 font-sans leading-relaxed whitespace-pre-line">
                          {entry.text}
                        </p>

                        {entry.interpretation && (
                          <div className="mt-4 p-3 rounded-xl bg-dream-purple/5 border border-dream-purple/10">
                            <h5 className="text-[10px] font-mono text-dream-purple flex items-center gap-1">
                              <Sparkles size={10} /> AI Interpretation & Sleep Counsel:
                            </h5>
                            <p className="text-[11px] text-white/60 mt-1 italic leading-relaxed">
                              {entry.interpretation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
