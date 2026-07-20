import { DecorItem, StoreItem, Achievement, PetState } from "./types";

export const DEFAULT_DECOR: DecorItem[] = [
  { id: "def-bed", name: "Starry Bed", emoji: "🛏️", category: "furniture", x: 20, y: 75, rotation: 0, scale: 1.2 },
  { id: "def-desk", name: "Floating Desk", emoji: "🗄️", category: "furniture", x: 80, y: 75, rotation: 0, scale: 1.1 },
  { id: "def-computer", name: "Retro Dream Portal Computer", emoji: "💻", category: "furniture", x: 80, y: 65, rotation: -5, scale: 0.9 },
  { id: "def-bookshelf", name: "Celestial Bookshelf", emoji: "📚", category: "furniture", x: 50, y: 45, rotation: 0, scale: 1.0 },
  { id: "def-lamp", name: "Moonlight Lamp", emoji: "🏮", category: "lights", x: 82, y: 55, rotation: 10, scale: 0.85 },
  { id: "def-plant", name: "Stardust Bonsai", emoji: "🪴", category: "plants", x: 50, y: 35, rotation: 0, scale: 0.8 },
  { id: "def-plush", name: "Dream Bear Plush", emoji: "🧸", category: "accessories", x: 25, y: 68, rotation: 15, scale: 0.9 },
  { id: "def-aquarium", name: "Comet Aquarium", emoji: "🐠", category: "accessories", x: 15, y: 45, rotation: 0, scale: 1.0 },
];

export const INITIAL_STORE: StoreItem[] = [
  // Furniture
  { id: "store-carpet", name: "Nebula Star Rug", emoji: "🌌", category: "furniture", price: 150, purchased: false, description: "A velvet rug woven from cosmic stardust." },
  { id: "store-sofa", name: "Fluffy Cloud Sofa", emoji: "🛋️", category: "furniture", price: 300, purchased: false, description: "A couch so fluffy, you float a little when sitting on it." },
  { id: "store-crystal", name: "Amethyst Spire Crystal", emoji: "🔮", category: "lights", price: 200, purchased: false, description: "Emits a relaxing purple glow that wards off bad dreams." },
  { id: "store-lava", name: "Nebula Lava Lamp", emoji: "💡", category: "lights", price: 120, purchased: false, description: "Slowly rotating stars inside warm oil." },
  { id: "store-window", name: "Astral Projection Window", emoji: "🪟", category: "accessories", price: 400, purchased: false, description: "Allows peering into alternative solar systems." },
  
  // Plants
  { id: "store-cherry", name: "Starlit Sakura", emoji: "🌸", category: "plants", price: 180, purchased: false, description: "Petals occasionally float down into the room." },
  { id: "store-terrarium", name: "Glowing Moss Globe", emoji: "🧪", category: "plants", price: 90, purchased: false, description: "A micro-ecosystem with bioluminescent organisms." },
  
  // Music & Ambiance
  { id: "store-music-space", name: "Stardust Symphony", emoji: "🎵", category: "music", price: 100, purchased: false, description: "An orchestral ambient soundscape with gentle bells." },
  { id: "store-music-fire", name: "Ghibli Fireplace", emoji: "🔥", category: "music", price: 80, purchased: false, description: "Relaxing crackles with soft accordion chords." },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-welcome", title: "Astral Awakening", description: "Woke up in Dream Space for the first time.", icon: "✨", unlocked: true, unlockedAt: new Date().toLocaleDateString() },
  { id: "ach-water", title: "Botanist of the Stars", description: "Watered your magical plants 3 times.", icon: "💧", unlocked: false },
  { id: "ach-fish", title: "Stardust Angler", description: "Caught a rare Comet Trout from the cosmic void.", icon: "🎣", unlocked: false },
  { id: "ach-designer", title: "Stellar Architect", description: "Placed or customized 5 furniture items.", icon: "📐", unlocked: false },
  { id: "ach-journal", title: "Scribe of the Cosmos", description: "Logged a dream or daily journal entry.", icon: "✍️", unlocked: false },
  { id: "ach-pet", title: "Creature Whisperer", description: "Adopted a magical companion pet.", icon: "🐾", unlocked: false },
];

export const AMBIENT_SOUNDS = [
  { id: "lofi", name: "Lo-fi Starry Chill", emoji: "🎹", description: "Relaxing piano and lo-fi beats" },
  { id: "rain", name: "Cozy Cosmic Rain", emoji: "🌧️", description: "Heavy rain pattering against glass" },
  { id: "forest", name: "Whispering Woods", emoji: "🌲", description: "Breeze through dream foliage" },
  { id: "fireplace", name: "Campfire Embers", emoji: "🔥", description: "Cozy fireside warmth" },
  { id: "fantasy", name: "Ghibli Melodies", emoji: "🪄", description: "Peaceful accordion & harp" },
];

export const PET_CATALOG: Omit<PetState, "id" | "hunger" | "energy" | "level" | "xp" | "activity">[] = [
  { name: "Cosmic Kitty", type: "Cosmic Cat", emoji: "🐱" },
  { name: "Nebula Shibe", type: "Starry Dog", emoji: "🐶" },
  { name: "Ethereal Kitsune", type: "Nebula Fox", emoji: "🦊" },
  { name: "Lil' Pyre", type: "Dream Dragon", emoji: "🐉" },
  { name: "Luna", type: "Astral Owl", emoji: "🦉" },
];
