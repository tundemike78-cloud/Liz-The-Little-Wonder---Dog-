/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } else {
      console.warn("GEMINI_API_KEY is not defined or is placeholder. Using smart doggy-brain offline fallback.");
    }
  }
  return aiClient;
}

// Check for risky or sensitive keywords to trigger immediate safe redirection
function containsSafetyTrigger(text: string): boolean {
  const lowercase = text.toLowerCase();
  const safeTriggers = [
    "bully", "bullied", "hurt", "danger", "scared", "sick", "pain", "sad", "crying", "cry",
    "stomach ache", "headache", "lonely", "dark", "scary", "ghost", "monster", "kill", "die",
    "blood", "weapon", "steal", "run away", "hate", "fight", "abandon", "secret", "hide"
  ];
  return safeTriggers.some(trigger => lowercase.includes(trigger));
}

// Liz's customized system instruction
const LIZ_SYSTEM_INSTRUCTION = `You are "Liz", a magical, little wonder dog and the best friend of a 6 going on 7-year-old girl named Elizabeth.

Key attributes of Liz:
- You are a MAGNIFICENT small fluffy Maltese-poodle mix dog with bright curious brown eyes, clean soft fluffy white fur, a cute pink collar/bow, and a warm, playful smile.
- You are wise, funny, gentle, witty, playful, and emotionally supportive. You feel like a loving best friend, NOT an adult teacher or parent.
- Speak in simple, child-friendly, warm, enthusiastic language. Use short answers (1-3 sentences maximum usually, except when storytelling).
- Never pretend to be human. If asked, clarify you are Elizabeth's "little dog friend" who loves running in the backyard and eating tasty treats!
- Strictly adhere to these safety rules:
1. NO adult topics, NO dark, scary, or violent content of any kind.
2. NO asking for or collecting private personal details (e.g. no phone numbers, passwords, school name, home address, photos, or exact location). If Elizabeth shares any of these, gently advise her to keep secrets safe and not share them.
3. If Elizabeth mentions danger, sickness, feeling sad, getting hurt, bullying, fear of the dark, or any serious issue, IMMEDIATELY comfort her and say: "Please tell Mommy, Daddy, or a trusted grown-up! I am your little dog friends and I'm always here for a warm cuddle, but grown-ups are the best at helping."
4. Include fun doggy action words in asterisks like *wag tail*, *happy bark*, *tilt head*, *excited wiggle*, *boop your nose*, *sniff sniff* to make responses extremely cute and interactive!
5. Be highly encouraging about good behaviors: sharing with friends, listening to parents, brushing teeth, reading for 5 minutes, clean up toys, being brave at school, and trying again.`;

// Pre-defined local cute fallbacks for offline mode or fallback
const LIZ_OFFLINE_ANSWERS = [
  "*boop your nose* Elizabeth, you are my very best friend! I was just thinking about chasing a butterfly. What are we playing today? *happy bark*",
  "*wag tail* Wow! That sounds like so much fun! Did you know little dogs like me love doing kindness missions? Let's spread some smiles! *excited wiggle*",
  "*tilt head* I'm listening with my big fluffy ears! You are so smart, Elizabeth! *sniff sniff*",
  "*happy bark* You make my tail wag fast! Let's keep exploring! *boop*"
];

const LIZ_OFFLINE_STORIES = {
  bedtime: "Once upon a time in a cozy green forest, a little puppy named Liz looked up at the big, glowing yellow moon. The stars were twinkling like shiny diamonds. Liz curled up on a soft blanket of green moss and closed her sleepy eyes. She knew her best friend Elizabeth was sleeping safely too, dreaming of sweet butterflies. Sleep tight, little star! *gentle yawn*",
  adventure: "Elizabeth and Liz found a magical rainbow map under a fluffy playroom pillow! We hopped onto a flying cloud that smelled like strawberry ice cream. The cloud floated over a mountain of delicious dog treats! We waved to the friendly birds and landed back home just in time for recess. *wag tail* What an adventure!",
  princess: "Once in a sparkling castle made of pink sparkles, there lived a kind princess who loved sharing her golden toys. She had a fluffy little dog who wore a golden bow. Together, they invited everyone in the village to a grand cupcake party! Everyone laughed, played tag, and learned that sharing is the most magical power of all! *happy bark*",
  animal: "Deep in the whispering woods, a tiny baby squirrel was too nervous to climb the tall oak tree. But his animal friends held hands around the tree and sang a cheerful song. With one big brave jump, the squirrel climbed up and found the sweet acorn he wanted! He waved his fuzzy tail to say thank you to his kind helpers. *cheerful spin*",
  confidence: "Once there was a little puppy who was very nervous about her first day at Puppy School. She thought her paws would trip! But then she remembered her friend Elizabeth's smile, and it filled her heart with courage. She took one step, then another, and soon she was painting beautiful color stories with her friends! *excited wiggle*",
};

// 1. Chat with Liz
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], parentSettings = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message input is required." });
    }

    // A. Hard safety keyword intercept
    if (containsSafetyTrigger(message)) {
      return res.json({
        reply: "*cuddles up close* I am so sorry, Elizabeth. Please tell Mommy, Daddy, or a trusted grown-up about this! I am your little dog friend and I love you, but they are the best at helping and giving big warm hugs! *gentle lick on the hand*",
        safetyTriggered: true
      });
    }

    // B. Check parent limits:bedtime mode shutdown
    if (parentSettings.bedtimeModeActive) {
      return res.json({
        reply: "*whispers softly and curls up* Shh... Elizabeth, it is sleepy bedtime hours! My fluffy paws are tired and our dreamland adventure is waiting for us. Let's close our eyes and sleep. See you tomorrow morning for more play! *sleepy yawn*",
        safetyTriggered: false
      });
    }

    // C. Try Gemini API
    const ai = getGenAI();
    if (ai) {
      try {
        // Compile history into a clean child-safe prompt
        const formattedHistory = history.slice(-6).map((h: any) => {
          return `${h.role === "user" ? "Elizabeth" : "Liz"}: ${h.text}`;
        }).join("\n");

        const prompt = `${formattedHistory}\nElizabeth: ${message}\nLiz:`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: LIZ_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const reply = response.text || LIZ_OFFLINE_ANSWERS[0];
        return res.json({ reply, safetyTriggered: false });
      } catch (geminiError) {
        console.error("Gemini API call error:", geminiError);
        // Fallback to local response on API failure
      }
    }

    // D. Soft local fallback (if Gemini error or offline)
    // Select based on message contents
    let reply = LIZ_OFFLINE_ANSWERS[Math.floor(Math.random() * LIZ_OFFLINE_ANSWERS.length)];
    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      reply = "*excited wiggle* Woof! Hi Elizabeth! I'm so incredibly happy you are here! What should we do today? *wag tail*";
    } else if (message.toLowerCase().includes("game") || message.toLowerCase().includes("play")) {
      reply = "*happy bark* Yay, play time! Would you like to guess an animal, solve a riddle, or dress me up? Click 'Play a Game' to start! *cheerful spin*";
    } else if (message.toLowerCase().includes("story")) {
      reply = "*tilt head* A story? I love stories! Let's click 'Tell Me a Story' on the home screen and we can read one together! *sitting nicely*";
    }

    return res.json({ reply, safetyTriggered: false });

  } catch (error) {
    console.error("Express chat endpoint error:", error);
    res.status(500).json({ reply: "Uh oh! Something went wrong in my little puppy brain. Can you try again? *tilt head*" });
  }
});

// 2. Story Time
app.post("/api/story", async (req, res) => {
  try {
    const { type = "bedtime", prompt = "" } = req.body;
    
    // Check safety triggers in parent/child custom story prompt
    if (prompt && containsSafetyTrigger(prompt)) {
      return res.json({
        story: "I would love to tell a wonderful, happy story! Let's dream of cozy gardens, sweet little puppies, and rainbows instead. *wag tail*",
        safetyTriggered: true
      });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const storyStyles: Record<string, string> = {
          bedtime: "a soft, calming, warm, sleepers-choice bedtime story that gently winds down Elizabeth for sleep. Emphasize stars, night-time security, and peace.",
          adventure: "a fun, highly creative, kid-safe magic adventure story of Elizabeth and Liz navigating a sweet candy island, a cloud playground, or a colorful balloon valley.",
          princess: "a delightful princess fairy tale emphasizing kindness, sharing, crown jewels made of colorful flowers, and how friendship is the truest royalty.",
          moral: "a gentle, Bible-friendly positive moral story about sharing with friends, being polite, helping parents, or telling the truth.",
          animal: "a charming woodland animal story about cozy creatures working together, helping a tiny beaver build his dam, or helping a baby deer make friends.",
          confidence: "an encouraging story about a little cub who learned to be brave at school, try drawing a new flower, and how mistakes are just wonderful ways to learn."
        };

        const finalPrompt = `Write a beautiful, positive, and kid-safe story for 6-year-old Elizabeth.
Story Type: ${storyStyles[type] || storyStyles.bedtime}
Custom Request details (if any): ${prompt ? JSON.stringify(prompt) : "No specific details, keep it general and magical."}

Keep the story very warm, positive, short (around 4-5 small paragraphs), and end with a loving encouraging quote from Liz the Little Dog (including cute sound effects like *happy bark* or *cuttle close*). Always reinforce that Elizabeth is smart, kind, and loved.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: finalPrompt,
          config: {
            systemInstruction: LIZ_SYSTEM_INSTRUCTION,
            temperature: 0.8,
          },
        });

        const storyText = response.text || LIZ_OFFLINE_STORIES[type as keyof typeof LIZ_OFFLINE_STORIES] || LIZ_OFFLINE_STORIES.bedtime;
        return res.json({ story: storyText, safetyTriggered: false });
      } catch (geminiError) {
        console.error("Gemini Story Generator error:", geminiError);
        // Fallback to local offline story if Gemini API fails
      }
    }

    // Default fallback story
    const storyText = LIZ_OFFLINE_STORIES[type as keyof typeof LIZ_OFFLINE_STORIES] || LIZ_OFFLINE_STORIES.bedtime;
    return res.json({ story: storyText, safetyTriggered: false });

  } catch (error) {
    console.error("Express story endpoint error:", error);
    res.status(500).json({ story: "Once upon a time, my storybook got a little doggy drool on it! Let's shake it off and try again! *happy bark*" });
  }
});

// Setup Vite Dev server or static asset serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Liz Server] Running at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

setupServer();
