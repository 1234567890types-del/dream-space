import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Moon, Sun, CloudRain, Volume2, VolumeX, Eye, BookOpen, 
  Monitor, Award, Heart, ShoppingBag, Palette, HelpCircle, LogOut, Coffee, X
} from "lucide-react";

import { DecorItem, CompanionState, ChatMessage, PetState, JournalEntry, Achievement, StoreItem } from "./types";
import { DEFAULT_DECOR, INITIAL_STORE, INITIAL_ACHIEVEMENTS, AMBIENT_SOUNDS } from "./data";
import soundEngine from "./utils/audio";

// Modular modal imports
import LoginScreen from "./components/LoginScreen";
import LibraryModal from "./components/LibraryModal";
import BrowserModal from "./components/BrowserModal";
import WeatherModal from "./components/WeatherModal";
import MarketModal from "./components/MarketModal";
import JournalModal from "./components/JournalModal";
import PetModal from "./components/PetModal";
import GameModal from "./components/GameModal";
import RoomCustomizer from "./components/RoomCustomizer";
import SparkleCursor from "./components/SparkleCursor";
import ThreeDRoom from "./components/ThreeDRoom";

export default function App() {
  // Login Profile State
  const [dreamerName, setDreamerName] = useState<string | null>(() => {
    return localStorage.getItem("dream_space_user");
  });

  // Core Game State
  const [shards, setShards] = useState<number>(() => {
    const cached = localStorage.getItem("dream_space_shards");
    return cached ? parseInt(cached) : 100;
  });

  const [placedItems, setPlacedItems] = useState<DecorItem[]>(() => {
    const cached = localStorage.getItem("dream_space_placed");
    return cached ? JSON.parse(cached) : DEFAULT_DECOR;
  });

  const [storeCatalog, setStoreCatalog] = useState<StoreItem[]>(() => {
    const cached = localStorage.getItem("dream_space_store");
    return cached ? JSON.parse(cached) : INITIAL_STORE;
  });

  const [activePet, setActivePet] = useState<PetState | null>(() => {
    const cached = localStorage.getItem("dream_space_pet");
    return cached ? JSON.parse(cached) : null;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const cached = localStorage.getItem("dream_space_journal");
    return cached ? JSON.parse(cached) : [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const cached = localStorage.getItem("dream_space_achievements");
    return cached ? JSON.parse(cached) : INITIAL_ACHIEVEMENTS;
  });

  // Cosmetic Environments
  const [activeWeather, setActiveWeather] = useState<"Clear Starry" | "Rainy" | "Snowy" | "Aurora Borealis" | "Meteor Shower" | "Cherry Blossom" | "Foggy Mist">("Clear Starry");
  const [currentMood, setCurrentMood] = useState<"Happy" | "Sad" | "Excited" | "Romantic" | "Lonely" | "Dreamy">("Dreamy");
  const [lampColor, setLampColor] = useState<"gold" | "purple" | "cyan" | "none">("gold");
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Cinematic Camera & Parallax states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [driftOffset, setDriftOffset] = useState({ x: 0, y: 0 });
  const [isWakingUp, setIsWakingUp] = useState(true);

  // Time & Clock Simulation
  const [timeOfDay, setTimeOfDay] = useState<"sunrise" | "day" | "sunset" | "night">("night");
  const [simulatedTime, setSimulatedTime] = useState("");

  // AI Companion state
  const [companion, setCompanion] = useState<CompanionState>({
    personality: "Wizard",
    mood: "peaceful",
    x: 50,
    y: 55,
    activity: "standing",
  });
  const [companionChat, setCompanionChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isCompanionChatOpen, setIsCompanionChatOpen] = useState(false);
  const [isCompanionLoading, setIsCompanionLoading] = useState(false);
  const [companionBubble, setCompanionBubble] = useState<string | null>(
    "Greetings, dreamer! Welcome to your floating sanctuary. Tap me to talk, or decorate our room. ✨"
  );

  // Modal Dialog UI state
  const [activeModal, setActiveModal] = useState<
    "none" | "library" | "browser" | "weather" | "market" | "journal" | "pet" | "game"
  >("none");
  const [isDesignStudioOpen, setIsDesignStudioOpen] = useState(false);

  // Sync cache with localStorage on updates
  useEffect(() => {
    if (dreamerName) {
      localStorage.setItem("dream_space_user", dreamerName);
    } else {
      localStorage.removeItem("dream_space_user");
    }
  }, [dreamerName]);

  useEffect(() => {
    localStorage.setItem("dream_space_shards", shards.toString());
  }, [shards]);

  useEffect(() => {
    localStorage.setItem("dream_space_placed", JSON.stringify(placedItems));
  }, [placedItems]);

  useEffect(() => {
    localStorage.setItem("dream_space_store", JSON.stringify(storeCatalog));
  }, [storeCatalog]);

  useEffect(() => {
    localStorage.setItem("dream_space_pet", activePet ? JSON.stringify(activePet) : "");
  }, [activePet]);

  useEffect(() => {
    localStorage.setItem("dream_space_journal", JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem("dream_space_achievements", JSON.stringify(achievements));
  }, [achievements]);

  // Handle Dynamic Clock & Time Cycles
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, "0");
      setSimulatedTime(`${String(hours).padStart(2, "0")}:${mins}`);

      // Map hour cycles
      if (hours >= 5 && hours < 8) {
        setTimeOfDay("sunrise");
      } else if (hours >= 8 && hours < 17) {
        setTimeOfDay("day");
      } else if (hours >= 17 && hours < 20) {
        setTimeOfDay("sunset");
      } else {
        setTimeOfDay("night");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Cinematic Camera & Parallax Effects
  useEffect(() => {
    let frameId: number;
    let time = 0;
    
    const tick = () => {
      time += 0.003;
      const dx = Math.sin(time * 2.2) * 5; // slow breathing drift
      const dy = Math.cos(time * 1.5) * 3;
      setDriftOffset({ x: dx, y: dy });
      frameId = requestAnimationFrame(tick);
    };
    
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14; // subtle parallax bounds
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Opening Waking Up transition
  useEffect(() => {
    if (dreamerName) {
      const timer = setTimeout(() => {
        setIsWakingUp(false);
        setCompanionBubble(`Welcome home, dreamer ${dreamerName}. Look, the cozy stars are waiting for us! ✨`);
        soundEngine.playPetSparkle();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [dreamerName]);

  // AI companion dynamic action scheduler
  useEffect(() => {
    const actions = [
      { act: "watering plants", text: "Just watering our starry bonsai... It responds beautifully to loving attention! 🌱" },
      { act: "reading books", text: "I'm reading the stories of old earth dreamers. Do you believe in magic? 📖" },
      { act: "cooking tea", text: "Ah, the hot lavender chamomile is brewing. Smells like stardust! 🍵" },
      { act: "listening to music", text: "Listening to celestial lo-fi beats... It keeps my floating spirit balanced. 🎧" },
      { act: "stretching", text: "Stretching my starry wings! Let's take a deep breath together. In... and out. 🧘" },
      { act: "stargazing", text: "Admiring the gorgeous nebulous bands outside our window. Look at those colors! 🌌" },
    ];

    const interval = setInterval(() => {
      if (isSleepMode) {
        setCompanion(prev => ({ ...prev, activity: "sleeping" }));
        setCompanionBubble("Sshh... Sweet dreams, stardust traveler. Let's drift away... 💤");
        return;
      }
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setCompanion(prev => ({ ...prev, activity: randomAction.act }));
      setCompanionBubble(randomAction.text);
      soundEngine.playPetSparkle();
    }, 15000);

    return () => clearInterval(interval);
  }, [isSleepMode]);

  // Handle Weather Soundscape triggers
  useEffect(() => {
    if (isMuted) {
      soundEngine.stopAmbiance();
      soundEngine.stopRain();
    } else {
      soundEngine.startAmbiance();
      if (activeWeather === "Rainy") {
        soundEngine.startRain();
      } else {
        soundEngine.stopRain();
      }
    }
  }, [isMuted, activeWeather]);

  // AI Companion self-initiated whispers on intervals
  useEffect(() => {
    const whispers: Record<string, string[]> = {
      Wizard: [
        "The ancient scrolls say that dreams are doors to alternate realities.",
        "I am mixing a stardust elixir. Would you like a sip of cozy tea?",
        "Look outside! The celestial lines are dancing beautifully tonight."
      ],
      "Fox Spirit": [
        "A little bird told me you had a long day. Put down your worries.",
        "Let's play a game! Or maybe we can just sit and watch the shooting stars.",
        "Your room has such a warm, comforting aura. I love staying here."
      ],
      Robot: [
        "SYSTEM HEALTH: OPTIMAL. Emotional index: supportive and cozy.",
        "Scanning room configuration... Cozy level is approximately 99.8%.",
        "Beep-boop. I have compiled 3 warm thoughts for you. You are loved!"
      ],
      Cat: [
        "Meow... Can I nap on your warm stardust bed?",
        "Purr... Let's watch the meteor droplets dance outside.",
        "Did you know watering plants makes them glow brighter? Meow!"
      ]
    };

    const interval = setInterval(() => {
      const currentWhispers = whispers[companion.personality as any] || whispers["Wizard"];
      const selected = currentWhispers[Math.floor(Math.random() * currentWhispers.length)];
      setCompanionBubble(selected);
      soundEngine.playPetSparkle();
    }, 45000);

    return () => clearInterval(interval);
  }, [companion.personality]);

  // Helper action: water plant
  const handleWaterPlant = () => {
    soundEngine.playWaterBubble();
    soundEngine.playChime();
    setShards(prev => prev + 15);
    setCompanionBubble("Oh! Thank you for hydrating our bonsai. See how beautifully it glows? 🌱");
    
    // Unlock botanical achievement
    unlockAchievement("Botanist of the Stars");
  };

  // Helper action: water plants or trigger light lamp cycle
  const handleCycleLamp = () => {
    soundEngine.playChime();
    const cycleMap: Record<typeof lampColor, typeof lampColor> = {
      gold: "purple",
      purple: "cyan",
      cyan: "none",
      none: "gold",
    };
    setLampColor(cycleMap[lampColor]);
  };

  const handleEarnShards = (amount: number) => {
    setShards((prev) => prev + amount);
    // Check for stardust angler achievement
    if (amount >= 120) {
      unlockAchievement("Stardust Angler");
    }
  };

  const unlockAchievement = (title: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.title === title && !ach.unlocked) {
          soundEngine.playChime();
          alert(`🏆 ACHIEVEMENT UNLOCKED: "${title}"! ✨`);
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        return ach;
      })
    );
  };

  // Furniture placement operations
  const handleUpdatePlacedItem = (updated: DecorItem) => {
    setPlacedItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    unlockAchievement("Stellar Architect");
  };

  const handleRemovePlacedItem = (id: string) => {
    soundEngine.playWaterBubble();
    setPlacedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePlaceNewItem = (itemTemplate: Omit<DecorItem, "id" | "x" | "y" | "rotation" | "scale">) => {
    const newItem: DecorItem = {
      id: `placed-${Date.now()}`,
      ...itemTemplate,
      x: 50,
      y: 50,
      rotation: 0,
      scale: 1.0,
    };
    setPlacedItems((prev) => [...prev, newItem]);
  };

  const handleBuyMarketItem = (store: StoreItem) => {
    setStoreCatalog((prev) =>
      prev.map((item) => (item.id === store.id ? { ...item, purchased: true } : item))
    );
    setShards((prev) => prev - store.price);
  };

  // Pet Care operations
  const handleAdoptPet = (pet: PetState) => {
    setActivePet(pet);
    unlockAchievement("Creature Whisperer");
  };

  const handleFeedPet = () => {
    if (!activePet) return;
    setShards((prev) => prev - 10);
    setActivePet((prev) => {
      if (!prev) return null;
      let nextHunger = Math.min(prev.hunger + 20, 100);
      return { ...prev, hunger: nextHunger, activity: "eating" };
    });
  };

  const handlePlayPet = () => {
    if (!activePet) return;
    setActivePet((prev) => {
      if (!prev) return null;
      let nextEnergy = Math.min(prev.energy + 20, 100);
      let nextXp = prev.xp + 15;
      let nextLevel = prev.level;
      if (nextXp >= 100) {
        nextXp -= 100;
        nextLevel += 1;
        soundEngine.playChime();
        alert(`🌟 ${prev.name} grew closer to you and reached Level ${nextLevel}! 🎉`);
      }
      return { ...prev, energy: nextEnergy, xp: nextXp, level: nextLevel, activity: "playing" };
    });
  };

  const handleTrainPet = () => {
    if (!activePet) return;
    setActivePet((prev) => {
      if (!prev) return null;
      let nextXp = prev.xp + 25;
      let nextLevel = prev.level;
      if (nextXp >= 100) {
        nextXp -= 100;
        nextLevel += 1;
        soundEngine.playChime();
        alert(`🌟 ${prev.name} mastered a new cosmic trick! Now Level ${nextLevel}!`);
      }
      return { ...prev, xp: nextXp, level: nextLevel, activity: "playing" };
    });
    setCompanionBubble(`Look, ${dreamerName}! ${activePet.name} is performing a cute stellar backflip! 🐾`);
  };

  // Journal adding operations
  const handleAddJournal = (entryTemplate: Omit<JournalEntry, "id" | "date">) => {
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      ...entryTemplate,
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    setShards((prev) => prev + 30);
    unlockAchievement("Scribe of the Cosmos");
  };

  // AI companion chat trigger
  const handleSendCompanionChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    soundEngine.playChime();
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "user",
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...companionChat, userMsg];
    setCompanionChat(updatedHistory);
    setChatInput("");
    setIsCompanionLoading(true);
    setCompanionBubble("Let me consult the starry alignment...");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "companion_chat",
          payload: {
            personality: companion.personality,
            userName: dreamerName,
            message: userMsg.text,
            chatHistory: updatedHistory.slice(-10), // pass sliding window
          },
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        sender: "companion",
        text: data.text || "I am connected to your sweet spirit, dreamer. Let us rest our minds.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setCompanionChat((prev) => [...prev, botMsg]);
      setCompanionBubble(botMsg.text);
    } catch (e) {
      setCompanionBubble("The cosmic transmission wavered, but my cozy heart is right here beside you. 💖");
    } finally {
      setIsCompanionLoading(false);
    }
  };

  // Dynamic style mappings for backdrops
  const weatherBackdrops = {
    "Clear Starry": "aurora-bg",
    Rainy: "aurora-bg bg-indigo-950/20",
    Snowy: "aurora-bg bg-sky-950/15",
    "Aurora Borealis": "aurora-nebula-green",
    "Meteor Shower": "aurora-nebula-sunset",
  };

  const themeOverlays = {
    gold: "shadow-[inset_0_0_80px_rgba(251,191,36,0.18)] bg-amber-950/5",
    purple: "shadow-[inset_0_0_80px_rgba(192,132,252,0.18)] bg-purple-950/5",
    cyan: "shadow-[inset_0_0_80px_rgba(34,211,238,0.18)] bg-cyan-950/5",
    none: "",
  };

  const companionAvatars: Record<string, string> = {
    Wizard: "🧙‍♂️",
    "Fox Spirit": "🦊",
    Robot: "🤖",
    Cat: "🐱",
    Cute: "✨",
    Funny: "🤡",
    Teacher: "🧑‍🏫",
    "Big Sister": "👩",
    "Big Brother": "🧑",
    Boyfriend: "💖",
    Girlfriend: "💝",
    Dragon: "🐉"
  };

  if (!dreamerName) {
    return <LoginScreen onLogin={(name) => setDreamerName(name)} />;
  }

  return (
    <div className={`fixed inset-0 select-none overflow-hidden text-white font-sans transition-all duration-1000 ${weatherBackdrops[activeWeather]}`}>
      
      {/* Visual Ambiance Filters */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${themeOverlays[lampColor]}`} />
      
      {/* Day / Night Shift overlays */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
        timeOfDay === "sunrise" ? "bg-amber-500/5 mix-blend-overlay" :
        timeOfDay === "sunset" ? "bg-orange-500/10 mix-blend-color-burn" :
        timeOfDay === "night" ? "bg-black/20" : ""
      }`} />

      {/* Sleep Mode Overlay */}
      {isSleepMode && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-xl transition-all duration-1000 flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="text-dream-purple mb-6"
          >
            <Moon size={64} className="soft-glow" />
          </motion.div>
          <h2 className="text-2xl font-bold font-display tracking-wider text-white">Cozy Slumber Activated</h2>
          <p className="text-sm text-white/50 max-w-sm mt-2 leading-relaxed">
            The screens are dimmed. Breathe slowly. Let the synthesized stardust piano and cosmic rain drift your mind into gentle dreams.
          </p>

          <button
            onClick={() => {
              soundEngine.playChime();
              setIsSleepMode(false);
            }}
            className="mt-8 px-6 py-3 rounded-2xl glass-button text-xs font-mono tracking-wider uppercase text-dream-purple cursor-pointer"
            id="awake-from-sleep"
          >
            Awake Softly
          </button>
        </div>
      )}

      {/* Celestial Particle Weather Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {activeWeather === "Rainy" && (
          <div className="absolute inset-0 opacity-40">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-gradient-to-b from-transparent to-dream-cyan w-[1.5px] h-12"
                style={{
                  top: `${Math.random() * -20}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 1.5 + 1.2}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {activeWeather === "Snowy" && (
          <div className="absolute inset-0 opacity-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-blue-100 text-xs"
                style={{
                  top: `${Math.random() * -10}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 4}s`,
                }}
              >
                ❄️
              </div>
            ))}
          </div>
        )}

        {activeWeather === "Meteor Shower" && (
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-36 h-[1.5px] bg-gradient-to-r from-transparent via-dream-amber to-white rotate-[-35deg]"
                style={{
                  top: `${Math.random() * 40}%`,
                  left: `${Math.random() * -20}%`,
                  animation: `float ${Math.random() * 3 + 2}s linear infinite`,
                  animationDelay: `${Math.random() * 8}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* HEADER HUD (Tactile glass navbar) */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 p-2 px-4 rounded-2xl glass-panel">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-dream-purple to-dream-pink flex items-center justify-center text-sm font-semibold">
            {dreamerName[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-display tracking-wide">{dreamerName}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/40">Room #811</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-dream-amber font-mono font-semibold">
              <Sparkles size={10} className="animate-spin" />
              <span>{shards} Shards</span>
            </div>
          </div>
        </div>

        {/* Dynamic Vibe / Mood Alignment Tuner */}
        <div className="hidden lg:flex items-center gap-1.5 p-2 px-3 rounded-2xl glass-panel shadow-lg border border-white/5">
          <span className="text-[9px] font-mono tracking-widest text-white/45 mr-1">VIBE ALIGN:</span>
          {(["Happy", "Calm", "Focused", "Romantic", "Lonely", "Dreamy"] as const).map((mood) => (
            <button
              key={mood}
              onClick={() => {
                soundEngine.playChime();
                setCurrentMood(mood);
                if (mood === "Happy") {
                  setActiveWeather("Cherry Blossom");
                  setCompanionBubble(`🌸 Blossoms are dancing in the breeze! Let us make a beautiful, cheerful day, ${dreamerName}!`);
                } else if (mood === "Calm") {
                  setActiveWeather("Rainy");
                  setCompanionBubble(`🌧️ Warm stardust rain is drumming. Sit back, close your eyes, and listen with me.`);
                } else if (mood === "Focused") {
                  setActiveWeather("Clear Starry");
                  setCompanionBubble(`💡 Pure space-time focus is activated. I will keep the stellar background waves perfectly quiet.`);
                } else if (mood === "Romantic") {
                  setActiveWeather("Meteor Shower");
                  setCompanionBubble(`☄️ The meteor showers are sparkling. Make a sweet, warm wish into the cosmic void!`);
                } else if (mood === "Lonely") {
                  setActiveWeather("Foggy Mist");
                  setCompanionBubble(`🌫️ A gentle, quiet fog wraps around. No matter how deep the void feels, I am right here with you.`);
                } else {
                  setActiveWeather("Aurora Borealis");
                  setCompanionBubble(`🟢 The emerald northern lights are waving beautifully. Let's just breathe and dream.`);
                }
              }}
              className={`text-[9px] font-mono font-semibold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                currentMood === mood
                  ? "bg-gradient-to-r from-dream-purple to-dream-pink text-white shadow-md shadow-dream-purple/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Status Center (Clock & Controls) */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 px-4 rounded-2xl glass-panel text-center flex items-center gap-2 font-mono text-xs">
            {timeOfDay === "night" ? <Moon size={14} className="text-dream-purple" /> : <Sun size={14} className="text-dream-amber" />}
            <span className="font-semibold">{simulatedTime} UTC</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-2xl glass-panel text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            id="toggle-global-music"
            title="Toggle peaceful room soundtracks"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="animate-pulse" />}
          </button>

          <button
            onClick={() => {
              soundEngine.playWaterBubble();
              setDreamerName(null);
            }}
            className="p-3 rounded-2xl glass-panel text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all cursor-pointer"
            id="user-logout"
            title="Leave Dream Space"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* THE FLOATING ROOM DECK (Central virtual island staging) */}
      <main className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* Floating universe background circle */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-b from-dream-purple/5 to-transparent blur-2xl animate-float-slow pointer-events-none" />

        <ThreeDRoom
          activeWeather={activeWeather}
          currentMood={currentMood}
          lampColor={lampColor}
          isSleepMode={isSleepMode}
          setIsSleepMode={setIsSleepMode}
          placedItems={placedItems}
          activePet={activePet}
          companion={companion}
          companionBubble={companionBubble}
          setCompanionBubble={setCompanionBubble}
          onWaterPlant={handleWaterPlant}
          onCycleLamp={handleCycleLamp}
          setActiveModal={setActiveModal}
          activeModal={activeModal}
        />
      </main>

      {/* DOCK BAR (Whimsical HUD layout button tray) */}
      <nav className="absolute bottom-6 left-4 right-4 z-30 flex justify-center pointer-events-auto">
        <div className="p-3 px-5 rounded-3xl glass-panel flex items-center gap-2 md:gap-4 overflow-x-auto max-w-full shadow-2xl border border-white/10">
          
          {/* Bed Trigger (Sleep Mode) */}
          <button
            onClick={() => {
              soundEngine.playChime();
              setIsSleepMode(true);
              soundEngine.startSleepDrone();
            }}
            className="p-3 rounded-2xl glass-button text-dream-purple flex flex-col items-center justify-center hover:scale-105 transition-transform"
            title="Cozy Sleep Mode"
            id="dock-bed-mode"
          >
            <Coffee size={20} />
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 hidden md:block">Sleep</span>
          </button>

          {/* Library Button */}
          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveModal("library");
            }}
            className="p-3 rounded-2xl glass-button text-dream-cyan flex flex-col items-center justify-center hover:scale-105 transition-transform"
            title="Starry Archive"
            id="dock-library"
          >
            <BookOpen size={20} />
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 hidden md:block">Library</span>
          </button>

          {/* Computer Button */}
          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveModal("browser");
            }}
            className="p-3 rounded-2xl glass-button text-dream-pink flex flex-col items-center justify-center hover:scale-105 transition-transform"
            title="Dream-Net Computer Core"
            id="dock-computer"
          >
            <Monitor size={20} />
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 hidden md:block">Computer</span>
          </button>

          {/* Memory Wall Journal Button */}
          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveModal("journal");
            }}
            className="p-3 rounded-2xl glass-button text-dream-amber flex flex-col items-center justify-center hover:scale-105 transition-transform"
            title="Memory Wall Journal"
            id="dock-journal"
          >
            <Award size={20} />
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 hidden md:block">Memories</span>
          </button>

          {/* Pet Menagerie Button */}
          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveModal("pet");
            }}
            className="p-3 rounded-2xl glass-button text-rose-400 flex flex-col items-center justify-center hover:scale-105 transition-transform"
            title="Manage Companion Pets"
            id="dock-pet"
          >
            <Heart size={20} />
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 hidden md:block">Pets</span>
          </button>

          {/* Mini-Games Button */}
          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveModal("game");
            }}
            className="p-3 rounded-2xl glass-button text-emerald-400 flex flex-col items-center justify-center hover:scale-105 transition-transform"
            title="Cosmic Games"
            id="dock-game"
          >
            <Sparkles size={20} />
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 hidden md:block">Games</span>
          </button>

          <div className="w-[1px] h-8 bg-white/10 mx-1 hidden md:block" />

          {/* Decor Design Studio Toggle */}
          <button
            onClick={() => {
              soundEngine.playChime();
              setIsDesignStudioOpen(!isDesignStudioOpen);
            }}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all cursor-pointer ${
              isDesignStudioOpen 
                ? "bg-dream-purple text-white shadow-lg shadow-dream-purple/20 border border-dream-purple/30" 
                : "glass-button text-white/70"
            }`}
            title="Open Design Studio"
            id="dock-decor"
          >
            <Palette size={20} />
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 hidden md:block">Decor Box</span>
          </button>

          {/* Store Bazaar Button */}
          <button
            onClick={() => {
              soundEngine.playChime();
              setActiveModal("market");
            }}
            className="p-3 rounded-2xl glass-button text-dream-amber flex flex-col items-center justify-center hover:scale-105 transition-transform"
            title="Stardust Bazaar Shop"
            id="dock-market"
          >
            <ShoppingBag size={20} />
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1 hidden md:block">Bazaar</span>
          </button>
        </div>
      </nav>

      {/* COMPANION INTERACTIVE CHAT PANEL (Floating side drawer) */}
      <AnimatePresence>
        {isCompanionChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: -320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -320 }}
            className="absolute left-4 top-20 bottom-4 w-80 glass-panel rounded-3xl p-5 text-white border border-white/10 shadow-2xl flex flex-col z-40 font-sans pointer-events-auto"
            id="companion-chat-drawer"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{companionAvatars[companion.personality] || "🧙‍♂️"}</span>
                <div>
                  <h3 className="font-bold font-display text-sm leading-tight">Companion Spirit</h3>
                  <div className="flex gap-1 mt-0.5">
                    {(["Wizard", "Fox Spirit", "Robot", "Cat"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          soundEngine.playChime();
                          setCompanion(prev => ({ ...prev, personality: p }));
                          setCompanionBubble(`Hi! I am now your cute ${p}. Let's chat! ✨`);
                        }}
                        className={`text-[8px] font-mono px-1.5 py-0.5 rounded cursor-pointer uppercase ${
                          companion.personality === p ? "bg-dream-purple text-white" : "bg-white/5 text-white/50"
                        }`}
                        id={`select-personality-${p.toLowerCase().replace(" ", "-")}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playChime();
                  setIsCompanionChatOpen(false);
                }}
                className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                id="close-companion-chat"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-1">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-xs text-white/70 leading-relaxed font-sans">
                🧚 **Personality: {companion.personality}**. She knows your name, remembers sleep slumbers, and responds with stardust wisdom. Speak anything.
              </div>

              {companionChat.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className={`p-3 max-w-[85%] rounded-2xl text-xs leading-relaxed font-sans ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-dream-purple to-dream-pink text-white rounded-tr-none"
                      : "bg-[#090918] text-white/95 border border-white/10 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-mono text-white/30 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isCompanionLoading && (
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono py-2">
                  <span className="animate-spin text-dream-purple">✨</span> Companion is scripting celestial response...
                </div>
              )}
            </div>

            {/* Quick Suggestions Drawer */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 border-t border-white/5 pt-2 scrollbar-none mb-2">
              {[
                "Tell me a cosmic secret 🔮",
                "I had a stressful day 🕯️",
                "Sing me a quiet lullaby 🎵"
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChatInput(sug);
                  }}
                  className="px-2.5 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] hover:bg-white/10 text-white/70 hover:text-white cursor-pointer whitespace-nowrap"
                  id={`chat-suggestion-${i}`}
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Message input field */}
            <form onSubmit={handleSendCompanionChat} className="flex gap-1.5 items-center bg-white/5 border border-white/10 rounded-xl p-1">
              <input
                type="text"
                placeholder="Say something sweet..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isCompanionLoading}
                className="flex-grow bg-transparent border-none text-xs text-white placeholder-white/30 focus:outline-none px-2 font-sans py-1.5"
                id="companion-chat-input"
              />
              <button
                type="submit"
                disabled={isCompanionLoading || !chatInput.trim()}
                className="p-1.5 bg-dream-purple rounded-lg text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                id="send-companion-message"
              >
                <Sparkles size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modular Modals renderer */}
      <AnimatePresence>
        {activeModal === "library" && (
          <LibraryModal
            isOpen={true}
            onClose={() => setActiveModal("none")}
            onEarnShards={handleEarnShards}
          />
        )}

        {activeModal === "browser" && (
          <BrowserModal
            isOpen={true}
            onClose={() => setActiveModal("none")}
            currentTheme={activeWeather}
            currentMood={currentMood}
            onAddJournalEntry={(title, text, interpretation, mood) => {
              handleAddJournal({
                title,
                text,
                interpretation,
                mood: mood as any,
              });
            }}
          />
        )}

        {activeModal === "weather" && (
          <WeatherModal
            isOpen={true}
            onClose={() => setActiveModal("none")}
            activeWeather={activeWeather}
            onChangeWeather={(weather) => {
              setActiveWeather(weather);
              // Set appropriate background soundtrack name inside active companion chatter
              setCompanionBubble(`Updating the celestial weather to ${weather}! Feel the quiet energy change. 🌌`);
            }}
          />
        )}

        {activeModal === "market" && (
          <MarketModal
            isOpen={true}
            onClose={() => setActiveModal("none")}
            shards={shards}
            storeCatalog={storeCatalog}
            onBuyItem={handleBuyMarketItem}
          />
        )}

        {activeModal === "journal" && (
          <JournalModal
            isOpen={true}
            onClose={() => setActiveModal("none")}
            entries={journalEntries}
            onAddEntry={handleAddJournal}
            onDeleteEntry={(id) => setJournalEntries(prev => prev.filter(e => e.id !== id))}
            shards={shards}
          />
        )}

        {activeModal === "pet" && (
          <PetModal
            isOpen={true}
            onClose={() => setActiveModal("none")}
            activePet={activePet}
            onAdoptPet={handleAdoptPet}
            onFeedPet={handleFeedPet}
            onPlayPet={handlePlayPet}
            onTrainPet={handleTrainPet}
            shards={shards}
          />
        )}

        {activeModal === "game" && (
          <GameModal
            isOpen={true}
            onClose={() => setActiveModal("none")}
            onEarnShards={handleEarnShards}
          />
        )}
      </AnimatePresence>

      {/* Floating Design Studio Panel */}
      <AnimatePresence>
        {isDesignStudioOpen && (
          <RoomCustomizer
            isOpen={true}
            onClose={() => setIsDesignStudioOpen(false)}
            placedItems={placedItems}
            onUpdateItem={handleUpdatePlacedItem}
            onRemoveItem={handleRemovePlacedItem}
            onPlaceNewItem={handlePlaceNewItem}
            purchasedCatalog={storeCatalog.filter((item) => item.purchased)}
          />
        )}
      </AnimatePresence>

      {/* Interactive Cursor Stardust */}
      <SparkleCursor />

      {/* Opening Wakeup overlay */}
      <AnimatePresence>
        {isWakingUp && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center pointer-events-auto select-none"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-white/40 text-xs font-mono tracking-widest flex flex-col items-center gap-3"
            >
              <div className="text-3xl animate-spin text-dream-purple">✨</div>
              <span className="font-display text-sm tracking-[0.25em] text-white">DREAM SPACE IS AWAKENING</span>
              <span className="text-[10px] text-white/30">CONJECTURING NEBULAS & STARDUST ALIGNMENT...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
