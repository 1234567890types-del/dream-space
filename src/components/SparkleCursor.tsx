import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

const COSMIC_COLORS = ["#c084fc", "#f472b6", "#22d3ee", "#fbbf24", "#34d399"];

export default function SparkleCursor() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let idCounter = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Limit sparkle density
      if (Math.random() > 0.15) return;

      const randomColor = COSMIC_COLORS[Math.floor(Math.random() * COSMIC_COLORS.length)];
      const randomSize = Math.random() * 12 + 6;

      const newSparkle: Sparkle = {
        id: idCounter++,
        x: e.clientX,
        y: e.clientY,
        color: randomColor,
        size: randomSize,
      };

      setSparkles((prev) => [...prev.slice(-15), newSparkle]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 0.8, scale: 0, rotate: 0, x: sparkle.x, y: sparkle.y }}
            animate={{
              opacity: 0,
              scale: [0, 1.2, 0.2],
              rotate: Math.random() * 360,
              y: sparkle.y + (Math.random() * 40 - 20),
              x: sparkle.x + (Math.random() * 40 - 20),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              width: sparkle.size,
              height: sparkle.size,
              color: sparkle.color,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: "100%", height: "100%" }}
            >
              <path d="M12 2l2.4 7.2 7.2 2.4-7.2 2.4-2.4 7.2-2.4-7.2-7.2-2.4 7.2-2.4z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
