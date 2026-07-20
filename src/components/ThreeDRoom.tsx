import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, HelpCircle, Heart, Flame, CloudSun } from "lucide-react";
import soundEngine from "../utils/audio";
import { DecorItem, PetState, CompanionState } from "../types";

interface ThreeDRoomProps {
  activeWeather: "Clear Starry" | "Rainy" | "Snowy" | "Aurora Borealis" | "Meteor Shower" | "Cherry Blossom" | "Foggy Mist";
  currentMood: "Happy" | "Sad" | "Excited" | "Romantic" | "Lonely" | "Dreamy" | "Calm" | "Focused";
  lampColor: "gold" | "purple" | "cyan" | "none";
  isSleepMode: boolean;
  setIsSleepMode: (val: boolean) => void;
  placedItems: DecorItem[];
  activePet: PetState | null;
  companion: CompanionState;
  companionBubble: string;
  setCompanionBubble: (bubble: string) => void;
  onWaterPlant: () => void;
  onCycleLamp: () => void;
  setActiveModal: (modal: string) => void;
  activeModal: string;
}

// 3D Extruded Box Face Component helper
function ThreeDBox({
  width,
  height,
  depth,
  className = "",
  style = {},
  frontContent,
  topColor = "bg-white/5",
  sideColor = "bg-white/3",
  frontColor = "bg-white/2",
}: {
  width: number;
  height: number;
  depth: number;
  className?: string;
  style?: React.CSSProperties;
  frontContent?: React.ReactNode;
  topColor?: string;
  sideColor?: string;
  frontColor?: string;
}) {
  const halfD = depth / 2;
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width,
        height,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Front Face */}
      <div
        className={`absolute inset-0 ${frontColor} border border-white/10 rounded-lg flex items-center justify-center`}
        style={{
          transform: `translateZ(${halfD}px)`,
          backfaceVisibility: "hidden",
        }}
      >
        {frontContent}
      </div>

      {/* Back Face */}
      <div
        className="absolute inset-0 bg-black/40 border border-white/5 rounded-lg"
        style={{
          transform: `translateZ(${-halfD}px) rotateY(180deg)`,
          backfaceVisibility: "hidden",
        }}
      />

      {/* Left Face */}
      <div
        className={`absolute top-0 bottom-0 ${sideColor} border border-white/5 rounded-lg`}
        style={{
          width: depth,
          left: -halfD,
          transform: `translateX(${halfW}px) rotateY(-90deg)`,
          backfaceVisibility: "hidden",
        }}
      />

      {/* Right Face */}
      <div
        className={`absolute top-0 bottom-0 ${sideColor} border border-white/5 rounded-lg`}
        style={{
          width: depth,
          right: -halfD,
          transform: `translateX(${-halfW}px) rotateY(90deg)`,
          backfaceVisibility: "hidden",
        }}
      />

      {/* Top Face */}
      <div
        className={`absolute left-0 right-0 ${topColor} border border-white/5 rounded-lg`}
        style={{
          height: depth,
          top: -halfD,
          transform: `translateY(${halfH}px) rotateX(90deg)`,
          backfaceVisibility: "hidden",
        }}
      />

      {/* Bottom Face */}
      <div
        className="absolute left-0 right-0 bg-black/50 border border-white/5 rounded-lg"
        style={{
          height: depth,
          bottom: -halfD,
          transform: `translateY(${-halfH}px) rotateX(-90deg)`,
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}

export default function ThreeDRoom({
  activeWeather,
  currentMood,
  lampColor,
  isSleepMode,
  setIsSleepMode,
  placedItems,
  activePet,
  companion,
  companionBubble,
  setCompanionBubble,
  onWaterPlant,
  onCycleLamp,
  setActiveModal,
  activeModal,
}: ThreeDRoomProps) {
  // 3D Orbital Rotation Drag State
  const [rotation, setRotation] = useState({ x: 20, y: -25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic state elements
  const [bookshelfSlide, setBookshelfSlide] = useState(false);
  const [tapSparkles, setTapSparkles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [butterflyPos, setButterflyPos] = useState({ x: 45, y: 35, z: 20 });
  const [spiritOrbPos, setSpiritOrbPos] = useState({ x: 20, y: 40, z: 60 });
  const [flowerBloomPercent, setFlowerBloomPercent] = useState(100);
  const [lastCompanionTapTime, setLastCompanionTapTime] = useState(0);

  // Sparkle generator helper
  const spawnSparklesAt = (e: React.MouseEvent, emoji = "✨") => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setTapSparkles((prev) => [...prev, { id, x, y, emoji }]);
    setTimeout(() => {
      setTapSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 1500);
  };

  // Drag interaction handlers to rotate entire deck in 3D
  const handleMouseDown = (e: React.MouseEvent) => {
    // Avoid dragging room if clicked on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest(".interactive-3d")) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    setRotation((prev) => ({
      x: Math.max(5, Math.min(60, prev.x - dy * 0.4)), // keep realistic bounds
      y: prev.y + dx * 0.4,
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Handle auto-orbit and idle breathing of rotation
  useEffect(() => {
    if (isDragging) return;
    let frameId: number;
    let time = 0;

    const tick = () => {
      time += 0.0012;
      setRotation((prev) => ({
        ...prev,
        // gentle cinematic floating orbit loop
        y: prev.y + Math.sin(time) * 0.03,
        x: 20 + Math.cos(time * 0.8) * 1.5,
      }));
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isDragging]);

  // Butterfly random curves generator
  useEffect(() => {
    const interval = setInterval(() => {
      setButterflyPos({
        x: 35 + Math.random() * 30,
        y: 20 + Math.random() * 25,
        z: 10 + Math.random() * 40,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Spirit orb coordinates wandering
  useEffect(() => {
    const interval = setInterval(() => {
      setSpiritOrbPos({
        x: 15 + Math.random() * 60,
        y: 30 + Math.random() * 40,
        z: 40 + Math.random() * 50,
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Flower bloom cycles based on simulated daylight (time of day is affected by mood)
  useEffect(() => {
    if (currentMood === "Happy") {
      setFlowerBloomPercent(100);
    } else if (currentMood === "Sad") {
      setFlowerBloomPercent(35);
    } else {
      setFlowerBloomPercent(80);
    }
  }, [currentMood]);

  // Companion customized tap response phrases based on character types
  const handleTapCompanion = (e: React.MouseEvent) => {
    soundEngine.playChime();
    spawnSparklesAt(e, "✨");
    const now = Date.now();
    if (now - lastCompanionTapTime < 2000) return;
    setLastCompanionTapTime(now);

    const companionGreetings: Record<string, string[]> = {
      Cute: [
        "Hehe! That tickled! Shall we watch the meteor showers together? ☄️",
        "Your star aura is extremely soft today. I love it! 🥰",
        "Look, I painted a mini smiley face on our cosmic window pane! 🎨",
      ],
      FoxSpirit: [
        "A soft rustle of golden leaves... My spirit flames burn warm with you. 🦊",
        "The nebulas align in beautiful ribbons today, stardust child. 🌌",
        "Did you know Fox Spirits can hear the singing of silent crystals? Listen... 🎵",
      ],
      Robot: [
        "SYSTEM_CHECK: Joy parameters at 100%. Hologram array fully calibrated. 🤖",
        "Scanning room... Detection: Infinite coziness. Recalibrating heater. ⚡",
        "BZZT! Interactive touch detected. Initiating happy spark protocol! 🔌",
      ],
      Wizard: [
        "Ah! You interrupted my levitation spell... and created stardust instead! 🔮",
        "Let me conjure a minor spell of comfort. *Fidelius Slumberus!* 🪄",
        "This old scroll contains records of a thousand tranquil dream spaces. 📜",
      ],
      Dragon: [
        "A playful poke? Proud dream dragons require high-quality stardust snacks! 🐉",
        "My starry breath warms the celestial teapot automatically. Have some! 🍵",
        "Let us wrap ourselves in the cozy violet cosmic cloud. Safe and warm. ☁️",
      ],
    };

    const list = companionGreetings[companion.personality] || companionGreetings["Cute"];
    const randomGreet = list[Math.floor(Math.random() * list.length)];
    setCompanionBubble(randomGreet);
  };

  // Companion custom avatar rendering based on activity
  const renderCompanionActivity = () => {
    if (companion.activity === "sleeping" || isSleepMode) {
      return "💤🛌";
    }
    const companionAvatars: Record<string, string> = {
      Cute: "✨🧙‍♀️",
      FoxSpirit: "🦊✨",
      Robot: "🤖🛰️",
      Wizard: "🔮🧙‍♂️",
      Dragon: "🐲⭐",
    };
    return companionAvatars[companion.personality] || "🧙‍♂️";
  };

  // Ambient lighting overlay based on active mood & weather
  const getAmbientShadows = () => {
    if (isSleepMode) return "rgba(10, 10, 30, 0.95)";
    switch (currentMood) {
      case "Happy":
        return "radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, rgba(0,0,0,0.4) 100%)";
      case "Sad":
        return "radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(0,0,0,0.5) 100%)";
      case "Focused":
        return "radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(0,0,0,0.4) 100%)";
      case "Romantic":
        return "radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, rgba(0,0,0,0.45) 100%)";
      case "Lonely":
        return "radial-gradient(circle, rgba(147, 51, 234, 0.16) 0%, rgba(0,0,0,0.55) 100%)";
      default:
        return "radial-gradient(circle, rgba(192, 132, 252, 0.15) 0%, rgba(0,0,0,0.4) 100%)";
    }
  };

  // Sound mapping for unique object clicks
  const playObjectSound = (itemType: string) => {
    switch (itemType) {
      case "bonsai":
        soundEngine.playWaterBubble();
        break;
      case "crystal":
        soundEngine.playPetSparkle();
        break;
      case "fireplace":
        soundEngine.playChime();
        break;
      default:
        soundEngine.playChime();
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="relative w-full max-w-5xl h-[68vh] flex items-center justify-center pointer-events-auto select-none overflow-visible cursor-grab active:cursor-grabbing"
      id="three-d-world-viewport"
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Drag Rotation Guide Overlay */}
      <div className="absolute top-0 left-4 text-[9px] font-mono text-white/30 bg-black/45 p-1.5 px-3 rounded-full border border-white/5 flex items-center gap-1.5 pointer-events-none select-none z-40">
        <HelpCircle size={10} className="animate-pulse text-dream-purple" />
        <span>DRAG TO ORBIT ROOM IN 3D</span>
      </div>

      {/* 3D WORLD CONTAINER DECK */}
      <motion.div
        animate={{
          y: isDragging ? 0 : [0, -6, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
        }}
        className="relative w-[350px] md:w-[500px] h-[310px] md:h-[410px] transition-transform duration-100 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* ROOM BOUNDING WALLS AND FLOOR DECK */}

        {/* 1. Floor Base Plate (Floating Glass Island) */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-purple-950/30 to-black/60 rounded-3xl border border-white/10 shadow-2xl overflow-visible shadow-indigo-900/10"
          style={{
            transform: "rotateX(90deg) translateZ(-160px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Dynamic mood color floor accent line */}
          <div
            className={`absolute inset-4 rounded-2xl border transition-all duration-1000 ${
              currentMood === "Happy"
                ? "border-pink-500/20 bg-pink-500/5 shadow-[0_0_20px_rgba(244,114,182,0.1)]"
                : currentMood === "Sad"
                ? "border-blue-500/20 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                : currentMood === "Focused"
                ? "border-amber-500/20 bg-amber-500/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                : "border-dream-purple/20 bg-dream-purple/5 shadow-[0_0_20px_rgba(192,132,252,0.1)]"
            }`}
          />

          {/* Glowing stardust grids on the floor */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl" />

          {/* Soft Shadow Beneath Bed & Furniture */}
          <div className="absolute bottom-20 left-12 w-32 h-14 bg-black/60 rounded-full blur-md" />
          <div className="absolute top-20 right-16 w-24 h-24 bg-black/60 rounded-full blur-md" />
        </div>

        {/* 2. Back-Left Vertical Wall */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-[#0a0a20]/80 border-r border-white/5 flex items-center justify-center"
          style={{
            width: 320,
            transform: "rotateY(90deg) translateZ(-160px) translateX(-80px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#04040d]/90 to-[#121235]/60" />

          {/* Vertical light ribbons */}
          <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-gradient-to-b from-transparent via-dream-purple/20 to-transparent" />
          <div className="absolute top-0 bottom-0 right-1/3 w-[1px] bg-gradient-to-b from-transparent via-dream-cyan/15 to-transparent" />
        </div>

        {/* 3. Back-Right Vertical Wall */}
        <div
          className="absolute inset-0 bg-[#070718]/85 rounded-l-2xl border-l border-white/5"
          style={{
            transform: "translateZ(-160px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#02020a]/95 via-[#0e0e29]/75 to-[#050510]/95" />

          {/* Dynamic mood-based color ambient glow spotlight */}
          <div
            className="absolute top-10 left-1/4 w-44 h-44 rounded-full blur-3xl opacity-30 transition-all duration-1000"
            style={{
              background:
                currentMood === "Happy"
                  ? "#f472b6"
                  : currentMood === "Sad"
                  ? "#3b82f6"
                  : currentMood === "Focused"
                  ? "#fbbf24"
                  : "#c084fc",
            }}
          />
        </div>

        {/* INTERACTIVE 3D FURNITURE & OBJECTS (Billboard style with preserve-3d) */}

        {/* A. 3D Window (Back Right wall) */}
        <div
          className="absolute top-8 left-16 w-32 h-24 rounded-2xl bg-black/45 border border-white/10 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-all group shadow-2xl interactive-3d"
          style={{
            transform: "translateZ(-150px)",
          }}
          onClick={(e) => {
            playObjectSound("window");
            spawnSparklesAt(e, "⭐");
            setActiveModal("weather");
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/2 to-white/8 opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="absolute top-1 right-2 text-[8px] font-mono text-white/30 group-hover:text-white/60">WEATHER</div>

          {/* Weather visualizer */}
          <span className="text-4xl animate-float">
            {activeWeather === "Rainy"
              ? "🌧️"
              : activeWeather === "Snowy"
              ? "❄️"
              : activeWeather === "Cherry Blossom"
              ? "🌸"
              : activeWeather === "Foggy Mist"
              ? "🌫️"
              : activeWeather === "Meteor Shower"
              ? "☄️"
              : "⭐"}
          </span>
          <span className="text-[8px] font-mono tracking-widest text-white/50 uppercase mt-1 group-hover:text-white">
            {activeWeather}
          </span>
        </div>

        {/* B. 3D Bookshelf (Back Wall Left) */}
        <div
          className="absolute top-10 right-28 cursor-pointer interactive-3d group"
          style={{
            transform: "translateZ(-155px) scale(0.95)",
          }}
          onClick={(e) => {
            soundEngine.playChime();
            spawnSparklesAt(e, "📖");
            setBookshelfSlide(!bookshelfSlide);
            setTimeout(() => {
              setActiveModal("journal");
            }, 500);
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/30 group-hover:text-white/60 tracking-wider">MEMORIES</span>
            {/* Sliding books personality visual feedback */}
            <span
              className={`text-5xl block transition-transform duration-500 ${
                bookshelfSlide ? "translate-x-2 rotate-6 scale-110" : "group-hover:scale-105"
              }`}
            >
              📚
            </span>
          </div>
        </div>

        {/* C. Interactive Magic Constellation Stars (Back right top) */}
        <div
          className="absolute top-6 right-8 cursor-pointer interactive-3d animate-pulse"
          style={{
            transform: "translateZ(-158px)",
          }}
          onClick={(e) => {
            playObjectSound("stars");
            spawnSparklesAt(e, "✨");
            setActiveModal("game");
          }}
          title="Twinkle Games"
        >
          <span className="text-3xl hover:scale-125 transition-transform block">✨✦</span>
        </div>

        {/* D. Steaming Lavender Chamomile Tea (Left Corner Floor) */}
        <div
          className="absolute bottom-16 left-12 flex flex-col items-center select-none pointer-events-none"
          style={{
            transform: "translateZ(-40px) rotateY(-20deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Animated 3D Steam Trails */}
          <div className="absolute -top-7 flex flex-col items-center">
            <span className="text-[11px] text-white/40 select-none animate-steam opacity-60">◌</span>
            <span className="text-[9px] text-white/30 select-none animate-steam opacity-40" style={{ animationDelay: "1s" }}>░</span>
            <span className="text-[7px] text-white/20 select-none animate-steam opacity-20" style={{ animationDelay: "2s" }}>♨</span>
          </div>
          <span className="text-3xl block filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">🍵</span>
        </div>

        {/* E. Cozy Slumber Bed with Pillow Compress & Blanket Move (Bottom Right) */}
        <div
          className="absolute bottom-10 right-28 cursor-pointer interactive-3d group"
          style={{
            transform: "translateZ(30px) scale(1.05)",
          }}
          onClick={(e) => {
            soundEngine.playChime();
            spawnSparklesAt(e, "💤");
            setIsSleepMode(true);
            soundEngine.startSleepDrone();
          }}
          title="Sleep Slumber"
        >
          <motion.div
            whileTap={{ scale: 0.94, y: 3 }}
            className="flex flex-col items-center relative"
          >
            {/* Sleeping letter indicators floating */}
            <span className="absolute -top-6 -right-2 text-[10px] font-mono font-bold text-dream-purple/60 animate-pulse animate-bounce">Zzz</span>
            <span className="text-5xl md:text-6xl block group-hover:scale-105 transition-transform filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]">
              🛏️
            </span>
            <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase mt-1 group-hover:text-white">SLUMBER</span>
          </motion.div>
        </div>

        {/* F. Retro computer terminal web browser (Bottom Left Front) */}
        <div
          className="absolute bottom-12 left-28 cursor-pointer interactive-3d group"
          style={{
            transform: "translateZ(50px) rotateY(15deg)",
          }}
          onClick={(e) => {
            soundEngine.playChime();
            spawnSparklesAt(e, "💾");
            setActiveModal("browser");
          }}
          title="Open Web Terminal"
        >
          <motion.div whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
            {/* Tiny retro neon screen glow overlay */}
            <div className="absolute inset-0 bg-cyan-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-4xl md:text-5xl block group-hover:scale-108 transition-transform filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]">
              💻
            </span>
            <span className="text-[8px] font-mono text-cyan-400/40 uppercase mt-1 group-hover:text-cyan-300">TERMINAL</span>
          </motion.div>
        </div>

        {/* G. Interactive Star Bonsai Plant (Center Floor) */}
        <div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 cursor-pointer interactive-3d group"
          style={{
            transform: "translateZ(-10px) scale(1.15)",
          }}
          onClick={(e) => {
            onWaterPlant();
            spawnSparklesAt(e, "💧");
            // React with a leaf shake physical animation
            const el = document.getElementById("watering-bonsai-node");
            if (el) {
              el.classList.add("animate-ping");
              setTimeout(() => el.classList.remove("animate-ping"), 600);
            }
          }}
          title="Water Starry Bonsai"
        >
          <div className="flex flex-col items-center text-center">
            <span
              id="watering-bonsai-node"
              className="text-5xl block group-hover:scale-110 group-active:skew-y-12 transition-transform filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]"
            >
              🪴
            </span>
            <span className="text-[8px] font-mono tracking-wider text-green-400/40 uppercase group-hover:text-green-300">BONSAI</span>
          </div>
        </div>

        {/* H. Cozy Fireplace / Hearth (Bottom Right Corner) */}
        <div
          className="absolute bottom-12 right-10 flex flex-col items-center select-none pointer-events-none"
          style={{
            transform: "translateZ(-20px) rotateY(-15deg)",
          }}
        >
          {/* Flame flickering heartbeat */}
          <span className="text-3xl block animate-flicker filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">🔥</span>
          <span className="text-[8px] font-mono text-white/20 tracking-widest mt-1">HEARTH</span>
        </div>

        {/* I. Interactive Heartbeat Magic Crystal (Center Floor Side) */}
        <div
          className="absolute bottom-28 left-40 cursor-pointer interactive-3d group"
          style={{
            transform: "translateZ(10px)",
          }}
          onClick={(e) => {
            playObjectSound("crystal");
            spawnSparklesAt(e, "🔮");
          }}
          title="Heartbeat Crystal"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl block animate-bounce animate-pulse group-hover:scale-125 transition-transform filter drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]">
              🔮
            </span>
            <span className="text-[7px] font-mono text-purple-400/30 tracking-widest mt-1">CRYSTAL</span>
          </div>
        </div>

        {/* J. Floating Lamp Lantern (Back Top Left) */}
        <div
          className="absolute top-28 left-6 cursor-pointer interactive-3d group"
          style={{
            transform: "translateZ(-145px)",
          }}
          onClick={(e) => {
            onCycleLamp();
            spawnSparklesAt(e, "💡");
          }}
          title="Cycle Lamp Light"
        >
          <div className="flex flex-col items-center">
            {/* Dynamic visual aura based on lampColor */}
            <div
              className={`absolute -inset-2 rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-all duration-500 ${
                lampColor === "purple"
                  ? "bg-purple-500"
                  : lampColor === "cyan"
                  ? "bg-cyan-400"
                  : lampColor === "none"
                  ? "bg-transparent opacity-0"
                  : "bg-amber-400"
              }`}
            />
            <span className="text-4xl block animate-sway hover:scale-110 transition-transform">
              🏮
            </span>
          </div>
        </div>

        {/* K. Flowers Blooming/Closing (Left Deck border) */}
        <div
          className="absolute bottom-20 left-4 cursor-pointer interactive-3d group"
          style={{
            transform: "translateZ(-80px)",
          }}
          onClick={(e) => {
            playObjectSound("flowers");
            spawnSparklesAt(e, "🌸");
          }}
        >
          <div className="flex items-center gap-1">
            <span
              className="text-2xl block transition-all duration-1000"
              style={{
                transform: `scale(${flowerBloomPercent / 100}) rotate(${bookshelfSlide ? 12 : 0}deg)`,
                opacity: flowerBloomPercent / 100 * 0.7 + 0.3,
              }}
            >
              🌸
            </span>
            <span
              className="text-xl block transition-all duration-1000 delay-100"
              style={{
                transform: `scale(${(flowerBloomPercent * 0.9) / 100})`,
                opacity: flowerBloomPercent / 100 * 0.7 + 0.3,
              }}
            >
              🌼
            </span>
          </div>
        </div>

        {/* L. Deep Aquarium with Independent Swimming Fish (Left wall side floor) */}
        <div
          className="absolute bottom-16 right-4 w-20 h-14 rounded-xl bg-cyan-950/40 border border-cyan-400/20 p-1 overflow-hidden cursor-pointer hover:border-cyan-400/40 transition-colors interactive-3d flex flex-col justify-end"
          style={{
            transform: "translateZ(-100px)",
            transformStyle: "preserve-3d",
          }}
          onClick={(e) => {
            soundEngine.playWaterBubble();
            spawnSparklesAt(e, "🐠");
          }}
          title="Tap Aquarium"
        >
          <div className="absolute top-1 left-2 text-[6px] font-mono text-cyan-400/40 tracking-widest">AQUA</div>
          {/* Independent swimming orbits of 3D fish */}
          <div className="absolute top-4 left-1 text-xs animate-swim">🐠</div>
          <div className="absolute bottom-2 left-6 text-xs animate-swim" style={{ animationDelay: "2.5s" }}>🐡</div>
          <div className="absolute bottom-1 left-3 w-1 h-1 bg-cyan-300/40 rounded-full animate-bounce" />
        </div>

        {/* M. Placed Custom Shop Items (Drawn in 3D perspective space) */}
        {placedItems.map((item) => (
          <div
            key={item.id}
            className="absolute select-none interactive-3d group transition-transform duration-300"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate3d(-50%, -50%, ${10 + (item.scale * 15)}px) rotate(${item.rotation}deg) scale(${item.scale})`,
              transformStyle: "preserve-3d",
            }}
            onClick={(e) => {
              playObjectSound(item.id);
              spawnSparklesAt(e, item.emoji);
            }}
          >
            <motion.span
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="text-4xl md:text-5xl block select-none cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
            >
              {item.emoji}
            </motion.span>
          </div>
        ))}

        {/* CREATURES & PETS WITH PERSONALITIES */}

        {/* 1. AI COMPANION AVATAR (Interactive & Animated based on unique state/personality) */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: "easeInOut",
          }}
          onClick={handleTapCompanion}
          className="absolute bottom-28 left-20 cursor-pointer z-30 flex flex-col items-center group interactive-3d"
          id="ai-companion-avatar"
          style={{
            transform: "translateZ(80px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Bubble overlay */}
          <AnimatePresence>
            {companionBubble && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-full mb-3 w-40 p-3 rounded-2xl bg-[#09091b]/95 border border-white/10 text-[10px] text-white/80 leading-relaxed shadow-2xl backdrop-blur-md pointer-events-none select-none"
              >
                <div className="absolute top-full left-1/3 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white/10" />
                {companionBubble}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-dream-purple/20 via-dream-pink/20 to-dream-cyan/20 border border-white/20 flex items-center justify-center text-4xl soft-glow group-hover:scale-110 transition-transform relative">
            <span className="absolute -top-1 -right-1 text-xs animate-pulse text-yellow-300">✨</span>
            <span className="block animate-float">{renderCompanionActivity()}</span>
          </div>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/55 border border-white/5 text-white/60 mt-1.5 uppercase tracking-wider group-hover:text-white">
            {companion.personality}
          </span>
        </motion.div>

        {/* 2. ADOPTED ACTIVE COMPANION PET (Animate based on type) */}
        {activePet && (
          <div
            className="absolute bottom-16 right-20 cursor-pointer z-20 flex flex-col items-center interactive-3d group"
            onClick={(e) => {
              playObjectSound("pet");
              spawnSparklesAt(e, "🐾");
              setActiveModal("pet");
            }}
            style={{
              transform: "translateZ(60px)",
            }}
            title={`Care for ${activePet.name}`}
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center"
            >
              {/* Distinctive animations based on Pet type */}
              <span
                className={`text-4xl block filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] ${
                  activePet.type === "Dream Dragon"
                    ? "animate-float-fast text-red-300"
                    : activePet.type === "Nebula Fox"
                    ? "animate-sway text-amber-300"
                    : activePet.type === "Astral Owl"
                    ? "animate-bounce"
                    : "animate-float-slow"
                }`}
              >
                {activePet.emoji}
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/5 text-white/70 mt-1 uppercase tracking-widest group-hover:text-white">
                {activePet.name}
              </span>
            </motion.div>
          </div>
        )}

        {/* 3. WANDERING GHOSTLY SPIRIT ORB (Interactive floating, orbits) */}
        <div
          className="absolute pointer-events-auto cursor-pointer z-30 select-none transition-all duration-[4000ms] ease-in-out"
          style={{
            left: `${spiritOrbPos.x}%`,
            top: `${spiritOrbPos.y}%`,
            transform: `translate3d(-50%, -50%, ${spiritOrbPos.z}px)`,
          }}
          onClick={(e) => {
            soundEngine.playChime();
            spawnSparklesAt(e, "🔮");
            setCompanionBubble("Oh! A Spirit Orb... It floats gracefully, carrying whispers of cozy cosmic magic.");
          }}
        >
          <div className="w-5 h-5 rounded-full bg-cyan-300/30 border border-cyan-400/40 shadow-[0_0_15px_#22d3ee] flex items-center justify-center animate-pulse">
            <span className="text-[7px] text-cyan-200 animate-ping">◌</span>
          </div>
        </div>

        {/* 4. DRAGONS & BUTTERFLIES WANDERING PATH (Cherry Blossom / Happy mood overlay) */}
        <div
          className="absolute pointer-events-none select-none transition-all duration-[3000ms] ease-in-out z-20"
          style={{
            left: `${butterflyPos.x}%`,
            top: `${butterflyPos.y}%`,
            transform: `translate3d(-50%, -50%, ${butterflyPos.z}px)`,
          }}
        >
          {/* Shifting visual based on active weather */}
          <span className="text-xl block animate-bounce filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {activeWeather === "Cherry Blossom" ? "🦋" : "✨"}
          </span>
        </div>
      </motion.div>

      {/* 3D PARTICLE OVERLAY SPARKLES IN CONTAINER VIEWPORT */}
      <AnimatePresence>
        {tapSparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0, x: sparkle.x, y: sparkle.y }}
            animate={{
              opacity: 0,
              scale: [0, 1.6, 0.4],
              y: sparkle.y - 45 - Math.random() * 20,
              x: sparkle.x + (Math.random() * 40 - 20),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 text-xl select-none"
          >
            {sparkle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
