export type DecorCategory = "walls" | "floors" | "furniture" | "plants" | "lights" | "accessories";

export interface DecorItem {
  id: string;
  name: string;
  emoji: string;
  category: DecorCategory;
  x: number; // percentage coordinate (0-100)
  y: number; // percentage coordinate (0-100)
  rotation: number; // degrees
  scale: number; // multiplier (0.5 to 2.0)
  color?: string; // custom theme hex or tailwind text class
}

export type CompanionPersonality = "Cute" | "Funny" | "Teacher" | "Big Sister" | "Big Brother" | "Boyfriend" | "Girlfriend" | "Cat" | "Fox Spirit" | "Robot" | "Wizard" | "Dragon";

export interface CompanionState {
  personality: CompanionPersonality;
  mood: string;
  x: number; // percentage
  y: number; // percentage
  activity: "standing" | "sitting" | "reading" | "sleeping" | "watering" | "stargazing";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "companion";
  text: string;
  timestamp: string;
}

export interface PetState {
  id: string;
  name: string;
  type: "Cosmic Cat" | "Starry Dog" | "Nebula Fox" | "Dream Dragon" | "Astral Owl";
  emoji: string;
  hunger: number; // 0 - 100
  energy: number; // 0 - 100
  level: number;
  xp: number;
  activity: "playing" | "sleeping" | "eating" | "snuggling";
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  text: string;
  interpretation?: string;
  mood: "Happy" | "Sad" | "Excited" | "Romantic" | "Lonely" | "Dreamy";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  emoji: string;
  category: DecorCategory | "music" | "pet";
  price: number;
  purchased: boolean;
  description: string;
}

export interface WeatherCycle {
  type: "Clear Starry" | "Rainy" | "Snowy" | "Aurora Borealis" | "Meteor Shower";
  soundUrl?: string;
  ambientSound: string;
}
