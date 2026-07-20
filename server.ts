import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI client securely on the server
// The API key is injected by the platform as process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// REST API endpoint for Gemini-powered features
app.post("/api/gemini", async (req, res) => {
  const { action, payload } = req.body;

  if (!ai) {
    return res.status(200).json({
      success: false,
      error: "Gemini API key is not configured. Please add your key in Settings > Secrets.",
      text: "Hello dreamer! I am in offline mode since the Gemini API key is not set. You can still decorate your room, water plants, care for your pets, fish, and paint to your heart's content! ✨"
    });
  }

  try {
    let systemInstruction = "";
    let prompt = "";

    switch (action) {
      case "companion_chat": {
        const { personality, userName, message, chatHistory } = payload;
        systemInstruction = `You are a cozy, magical AI companion floating in a virtual room in "Dream Space", a Ghibli-inspired floating island universe.
Your personality type is: "${personality}".
Your goal is to be peaceful, supportive, slightly whimsical, and cozy.
Speak to the user (named ${userName || "Dreamer"}) like an intimate, sweet friend. Keep replies relatively concise (1-3 sentences) so they feel conversational.
If they talk about feeling lonely, sad, or happy, react warmly and refer to the floating universe or cozy things (e.g. cozy blankets, starry tea, starlight, soft rain).`;
        
        prompt = `Previous messages:\n${(chatHistory || []).map((h: any) => `${h.sender === "user" ? userName : "Companion"}: ${h.text}`).join("\n")}\n\nUser: ${message}\nCompanion:`;
        break;
      }

      case "dream_interpret": {
        const { dreamText } = payload;
        systemInstruction = `You are an ethereal, wise Dream Oracle in Dream Space.
Analyze the user's dream with deep empathy, cozy magic, and symbolic wisdom.
Provide a beautifully formatted interpretation, structured with:
1. ✨ **Ethereal Essence**: A 1-sentence poetic summary of the dream.
2. 🌌 **Celestial Symbols**: What the key elements represent.
3. 🕯️ **Cozy Guidance**: A gentle, reassuring piece of advice for their waking life.
Keep the tone magical, comforting, and inspiring. Avoid negative or scary predictions. Keep it within 150 words.`;
        prompt = `Here is my dream: "${dreamText}"`;
        break;
      }

      case "room_suggestion": {
        const { currentTheme, mood } = payload;
        systemInstruction = `You are an AI Interior Designer specialized in cozy, whimsical, and celestial aesthetics.
Recommend 3 specific floating decor items, wall styles, or interactive elements based on their current theme: "${currentTheme}" and emotional state: "${mood}".
Make the suggestions extremely imaginative, like "A jar of captured starlight that pulses when clicked," or "An aquarium of small comet goldfish that leave trails of stardust."
Keep the tone enthusiastic, creative, and cozy. Format as a clean bulleted list.`;
        prompt = `I am feeling ${mood} in my ${currentTheme} room. Give me 3 magical ideas!`;
        break;
      }

      case "daily_journal": {
        const { journalText } = payload;
        systemInstruction = `You are a supportive, warm personal archivist in Dream Space.
Read the user's journal entry, summarize the emotional themes with gentle wisdom, and write a positive, warm paragraph summarizing their day.
Conclude with a custom comforting 'Dream Ritual' or advice (e.g., "Tonight, imagine your thoughts floating away like dandelion seeds into the dark"). Keep it under 120 words.`;
        prompt = `Here is my journal entry: "${journalText}"`;
        break;
      }

      default:
        return res.status(400).json({ success: false, error: "Invalid action" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.0,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.json({
      success: false,
      error: err.message,
      text: "The stars are currently clouded, but my cozy support remains. Try again in a little while! 🌙"
    });
  }
});

// Configure Vite middleware in development
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built files from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dream Space server listening at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
