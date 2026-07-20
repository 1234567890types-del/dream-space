import { motion } from "motion/react";
import { X, BookOpen, Sparkles } from "lucide-react";
import soundEngine from "../utils/audio";

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnShards: (amount: number) => void;
}

const DREAM_STORIES = [
  {
    title: "The Floating Tea Shop",
    text: "At the edge of the Orion belt, there floats a tiny tea shop styled with paper lanterns. The tea master, an elderly fox spirit, serves celestial matcha that tastes like warm memories. When you drink it, your feet lightly leave the ground, and you float back into your dream room with a pocketful of stardust.",
    reward: 25,
  },
  {
    title: "The Whale of Whispering Clouds",
    text: "Once every century, an enormous cosmic whale made entirely of soft white mist sails over our floating rooms. It sings a deep, resonant cello melody that sweeps away any loneliness. If you listen closely, you can hear it whispers: 'You are safe, little star, in the wide open blue.'",
    reward: 30,
  },
  {
    title: "The Observatory on the Moon-Crescent",
    text: "In the dreamscape, you can walk on a staircase of solid light directly onto the crescent tip of the moon. There rests a brass telescope. Peering through it, you do not see stars, but rather your own childhood home, covered in golden morning warmth and peace.",
    reward: 25,
  },
];

const DAILY_WISDOM = [
  "You do not have to carry the whole weight of the world tonight. Let your thoughts float like glowing cherry blossoms.",
  "Every star in the sky was once quiet dust. It took time to shine. Give yourself that same gentle time.",
  "In this quiet room, you are completely free. No expectations, no deadlines. Just you and the soft hum of the universe.",
  "Like a quiet tide under the moonlight, let peace flow in and carry away the busy noises of your waking day.",
];

export default function LibraryModal({ isOpen, onClose, onEarnShards }: LibraryModalProps) {
  if (!isOpen) return null;

  const handleReadStory = (reward: number) => {
    soundEngine.playChime();
    onEarnShards(reward);
    alert(`✨ You spent a quiet moment reading and found ${reward} Dream Shards buried in the pages!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden glass-panel rounded-3xl p-6 md:p-8 flex flex-col text-white border border-white/10 shadow-2xl"
        id="library-modal-card"
      >
        <button
          onClick={() => {
            soundEngine.playChime();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full glass-button hover:bg-white/10 text-white/70 hover:text-white"
          id="close-library-button"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-dream-purple animate-pulse" size={28} />
          <div>
            <h2 className="text-2xl font-bold font-display tracking-tight">The Starry Archive</h2>
            <p className="text-xs text-white/50">Cozy tales and stardust wisdom compiled from the floating universe.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2">
          {/* Daily Wisdom Section */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-dream-amber opacity-30">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-dream-purple mb-2">
              Tonight's Stardust Wisdom
            </h3>
            <p className="text-sm italic text-white/80 leading-relaxed font-sans">
              "{DAILY_WISDOM[Math.floor(new Date().getDate() % DAILY_WISDOM.length)]}"
            </p>
          </div>

          {/* Dream Stories Section */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-widest text-dream-pink mb-4">
              Cosmic Dream Journals
            </h3>
            <div className="grid md:grid-cols-1 gap-4">
              {DREAM_STORIES.map((story, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h4 className="text-lg font-bold font-display text-dream-cyan group-hover:text-white transition-colors">
                      {story.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-dream-purple/20 text-dream-purple">
                      +{story.reward} Shards
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">{story.text}</p>
                  <button
                    onClick={() => handleReadStory(story.reward)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-dream-purple/20 text-dream-purple hover:bg-dream-purple/30 border border-dream-purple/30 transition-all cursor-pointer"
                  >
                    <Sparkles size={12} /> Reflect & Collect Shards
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
