/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Lock, 
  MessageCircle, 
  BookOpen, 
  Smile, 
  Bookmark, 
  Volume2, 
  Send, 
  Compass, 
  RotateCcw, 
  Award,
  ChevronRight,
  LogOut,
  Info,
  Sliders,
  ShieldCheck,
  Moon,
  VolumeX,
  History,
  Clock,
  ThumbsUp,
  X,
  CheckCircle2,
  Users,
  UserPlus
} from "lucide-react";
import { 
  Message, 
  StoryState, 
  StoryType, 
  MoodType, 
  KindnessMission, 
  ParentSettings, 
  ActivityLog, 
  LizDressUp, 
  MiniGameType, 
  AnimalRiddle,
  Friend
} from "./types";
import LizAvatar from "./components/LizAvatar";

// Initial set of fun kindness missions
const KINDNESS_MISSIONS: KindnessMission[] = [
  { id: "1", title: "Compliment Champion 🌸", description: "Tell Mommy, Daddy, or a sweet friend: 'You make my day shine like a gold star!'", icon: "✨", color: "emerald" },
  { id: "2", title: "Toy Box Rescue Coach 🧸", description: "Let's put 5 toys back in their home box. They want a cozy rest too!", icon: "🏡", color: "emerald" },
  { id: "3", title: "Thank You Singer 🎶", description: "Say 'Thank you' with your biggest, brightest smile when someone helps you today!", icon: "💖", color: "emerald" },
  { id: "4", title: "The Polite Explorer 👑", description: "Use the magical power-words: 'Please' and 'Thank you' for every snack you eat!", icon: "🍪", color: "emerald" },
  { id: "5", title: "Super Reader Badge 📚", description: "Read or inspect a magical storybook page for 5 quick minutes with a grown-up!", icon: "📖", color: "emerald" },
  { id: "6", title: "Bedtime Hero Moon 🌙", description: "Brush your teeth till they are shiny clean, and hop into bed with zero fuss!", icon: "🪥", color: "emerald" }
];

// Fun offline trivia riddles for kids
const ANIMAL_RIDDLES: AnimalRiddle[] = [
  { 
    hints: ["I am big and gray.", "I have giant floppy ears.", "I can spray water with my long, long nose-trunk!"], 
    answer: "Elephant 🐘", 
    options: ["Elephant 🐘", "Monkey 🐒", "Lion 🦁"] 
  },
  { 
    hints: ["I fly in the warm blue sky.", "I have gorgeous colorful soft wings.", "I love landing on sweet smelling green garden flowers!"], 
    answer: "Butterfly 🦋", 
    options: ["Frog 🐸", "Butterfly 🦋", "Kitten 🐱"] 
  },
  { 
    hints: ["I say 'Ribbit! Ribbit!'", "I love jumping on round green lily pads.", "I have giant yellow eyes!"], 
    answer: "Frog 🐸", 
    options: ["Puppy 🐶", "Frog 🐸", "Giraffe 🦒"] 
  },
  { 
    hints: ["I have a tall, majestic brown neck.", "I can eat leaves from the absolute top of giant jungle trees.", "I have beautiful yellow spots!"], 
    answer: "Giraffe 🦒", 
    options: ["Duck 🦆", "Giraffe 🦒", "Monkey 🐒"] 
  }
];

const PRESET_MESSAGES = [
  { text: "Liz, I love you so much! ❤️", icon: "💖" },
  { text: "Tell me a silly puppy joke! 🐶", icon: "🤪" },
  { text: "I had a scary dream last night... ☁️", icon: "😰" },
  { text: "What's your favorite doggy game? ⚽", icon: "🎾" },
  { text: "Let's learn something fun! ☀️", icon: "⭐" },
];

export default function App() {
  // Primary Navigation
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "story" | "game" | "mood" | "voice" | "friends">("home");

  // Friends & Puppies States
  const [friends, setFriends] = useState<Friend[]>(() => {
    const stored = localStorage.getItem("liz_puppy_friends");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
         // ignore parsing issues
      }
    }
    return [
      {
        id: "friend-1",
        name: "Chloe",
        companionName: "Sparky",
        companionBreed: "Beagle 🐶",
        avatarEmoji: "👧",
        status: "🦋 Chasing butterflies...",
        isOnline: true,
        receivedGiftsCount: 3,
      },
      {
        id: "friend-2",
        name: "Leo",
        companionName: "Bella",
        companionBreed: "Corgi 🦊",
        avatarEmoji: "👦",
        status: "🧁 Eating cookie treats",
        isOnline: true,
        receivedGiftsCount: 5,
      },
      {
        id: "friend-3",
        name: "Lucas",
        companionName: "Barnaby",
        companionBreed: "Husky 🐺",
        avatarEmoji: "👦",
        status: "💤 Napping on rug",
        isOnline: false,
        receivedGiftsCount: 2,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("liz_puppy_friends", JSON.stringify(friends));
  }, [friends]);

  const [friendNameInput, setFriendNameInput] = useState("");
  const [companionNameInput, setCompanionNameInput] = useState("");
  const [companionBreedSelection, setCompanionBreedSelection] = useState("Poodle 🐩");
  const [friendAvatarSelection, setFriendAvatarSelection] = useState("👧");

  // Core configuration states
  const [parentSettings, setParentSettings] = useState<ParentSettings>({
    bedtimeModeActive: false,
    pinCode: "2026",
    approvedTopics: {
      sharing: true,
      bravery: true,
      bedtime: true,
      morals: true,
      school: true
    },
    openChatEnabled: true,
    dailyScreenLimitMinutes: 30,
    sleepTime: "20:00"
  });

  // Screen time tracking logic
  const [screenTimeRemaining, setScreenTimeRemaining] = useState<number>(30 * 60); // in seconds
  const [isScreenTimeAlertActive, setIsScreenTimeAlertActive] = useState(false);

  // Score stats tracking
  const [completedMissionsCount, setCompletedMissionsCount] = useState<number>(1);
  const [currentStreak, setCurrentStreak] = useState<number>(3);
  const [treatsFedCount, setTreatsFedCount] = useState<number>(2);

  // Virtual Feeding & Baking Studio states
  const [lizFullness, setLizFullness] = useState<number>(65);
  const [lizHydration, setLizHydration] = useState<number>(55);
  const [lizBowlType, setLizBowlType] = useState<string>("pink_sparkle");
  const [customMealMain, setCustomMealMain] = useState<string>("kibble");
  const [customMealTopping, setCustomMealTopping] = useState<string>("strawberry");
  const [customMealGarnish, setCustomMealGarnish] = useState<string>("sprinkles");
  
  const [bakingStep, setBakingStep] = useState<number>(0); // 0: Idle, 1: Kneading/Stamping, 2: Baking, 3: Freshly Baked
  const [bakingProgress, setBakingProgress] = useState<number>(0);
  const [customCookieShape, setCustomCookieShape] = useState<string>("heart");

  // Daily Mission states
  const [currentMissionIndex, setCurrentMissionIndex] = useState<number>(0);
  const [missionDone, setMissionDone] = useState<boolean>(false);

  // Chat interface states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "model",
      text: "Hi Elizabeth! *happy wag* I'm Liz, your magical little dog friend! I am so incredibly happy to see you. You are brave, kind, and very special! What fun adventure should we go on today? 🐾✨",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListeningSimulated, setIsListeningSimulated] = useState(false);

  // Story state manager
  const [storyState, setStoryState] = useState<StoryState>({
    type: "bedtime",
    customPrompt: "",
    storyText: "",
    isLoading: false,
    isCustomizing: false,
    storyBuilderSelectedKeywords: []
  });
  const [savedStories, setSavedStories] = useState<Array<{ id: string; title: string; text: string; type: StoryType }>>([
    { 
      id: "sav-1", 
      title: "👑 The Polite Princess", 
      type: "princess",
      text: "Once in a sparkling castle made of pink sparkles, there lived a kind princess who loved sharing her golden toys. She had a fluffy white dog named Liz who wore a golden bow. Together, they invited everyone in the village to a grand cupcake party! Everyone laughed, played tag, and learned that sharing is the most magical power of all! *happy bark*" 
    },
    { 
      id: "sav-2", 
      title: "☁️ Liz’s Cloud Castle", 
      type: "adventure",
      text: "Elizabeth hopped onto a flying cloud that smelled like delicious strawberry ice cream. The cloud floated over a mountain of gold dog treats! We waved to the friendly birds and landed back in our playroom just in time for recess. *wag tail* What an adventure!" 
    }
  ]);
  const [viewingSavedStory, setViewingSavedStory] = useState<{ id: string; title: string; text: string } | null>(null);

  // Game configuration states
  const [activeGame, setActiveGame] = useState<MiniGameType>(null);
  const [feedingSubtab, setFeedingSubtab] = useState<"quick_pantry" | "gourmet_bistro" | "baking_oven">("quick_pantry");
  const [selectedAnimalOption, setSelectedAnimalOption] = useState<string | null>(null);
  const [animalRiddleIndex, setAnimalRiddleIndex] = useState<number>(0);
  const [riddleFeedback, setRiddleFeedback] = useState<{ isCorrect: boolean | null; text: string }>({ isCorrect: null, text: "" });

  // Customizable Dress-Up outfit states
  const [dressUp, setDressUp] = useState<LizDressUp>({
    hat: "none",
    collar: "pink",
    accessory: "none"
  });

  // Sound triggers / Audio
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [voicePitch, setVoicePitch] = useState<number>(1.3);
  const [voiceRate, setVoiceRate] = useState<number>(1.1);
  const [voicePreset, setVoicePreset] = useState<"sparkling" | "lazy" | "bouncy" | "clever" | "custom">("sparkling");
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Real voice message recording states
  const [isRecordingAudioClip, setIsRecordingAudioClip] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedClips, setRecordedClips] = useState<Array<{ id: string; url: string; timestamp: string; title: string; duration: number }>>([
    {
      id: "demo-clip-1",
      url: "", 
      timestamp: "Today",
      title: "Elizabeth's Sweet Hello 🌸",
      duration: 3
    }
  ]);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<any[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Real Speech Recognition (Speech-to-Text) states
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const [isSpeechedMicrophoneActive, setIsSpeechedMicrophoneActive] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Parent Dashboard states
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [parentPinInput, setParentPinInput] = useState("");
  const [parentPinError, setParentPinError] = useState("");
  const [isParentAuthenticated, setIsParentAuthenticated] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: "log-1", type: "mission", title: "Finished:Compliment Champion Daily Mission", timestamp: "Today, 10:15 AM" },
    { id: "log-2", type: "mood", title: "Mood Check-in:Elizabeth felt Excited! 🤩", timestamp: "Today, 10:14 AM" },
    { id: "log-3", type: "story", title: "Read Bedtime Story: Princess and the Soft Fluffy Bow", timestamp: "Yesterday, 7:42 PM" },
    { id: "log-4", type: "game", title: "Played Dress Up with Liz components", timestamp: "Yesterday, 3:15 PM" }
  ]);

  // Mood selector states
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodReply, setMoodReply] = useState<string>("");
  const [breathingStep, setBreathingStep] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const [breathingTimer, setBreathingTimer] = useState<number>(0);

  // Avatar expression sync
  const [lizExpression, setLizExpression] = useState<"happy" | "comfort" | "excited" | "sleepy" | "breathing" | "eating" | "trick_paw" | "trick_spin" | "trick_roll">("happy");

  // Bottom scroll targets
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Core Effects & Timers
  useEffect(() => {
    // Screen limit timer count down
    const interval = setInterval(() => {
      setScreenTimeRemaining(prev => {
        if (prev <= 1) {
          setIsScreenTimeAlertActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync avatar expression when active tab changes
  useEffect(() => {
    if (parentSettings.bedtimeModeActive) {
      setLizExpression("sleepy");
    } else {
      switch (activeTab) {
        case "mood":
          setLizExpression("breathing");
          break;
        case "game":
          setLizExpression("happy");
          break;
        case "story":
          setLizExpression("sleepy");
          break;
        default:
          setLizExpression("happy");
          break;
      }
    }
  }, [activeTab, parentSettings.bedtimeModeActive]);

  // Handle breathing sequence animations
  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    if (breathingStep !== "idle") {
      setLizExpression("breathing");
      breathingInterval = setInterval(() => {
        setBreathingTimer(prev => {
          if (prev <= 1) {
            // Next segment
            if (breathingStep === "inhale") {
              setBreathingStep("hold");
              return 4; // hold for 4s
            } else if (breathingStep === "hold") {
              setBreathingStep("exhale");
              return 4; // exhale for 4s
            } else {
              setBreathingStep("inhale");
              return 4; // inhale again for 4s
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(breathingInterval);
  }, [breathingStep]);

  // Scroll to bottom helper for messaging list
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Load available speech voices dynamically from browser API
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Filter to English primarily but preserve all
        const englishVoices = voices.filter(v => v.lang.startsWith("en") || v.lang.startsWith("es"));
        const list = englishVoices.length > 0 ? englishVoices : voices;
        setAvailableVoices(list);
        
        // Pick a default if not set
        if (list.length > 0 && !selectedVoiceURI) {
          const defaultRef = list.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"));
          if (defaultRef) {
            setSelectedVoiceURI(defaultRef.voiceURI);
          } else {
            setSelectedVoiceURI(list[0].voiceURI);
          }
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [selectedVoiceURI]);

  // Safe and customizable Text-to-Speech
  const speakVoice = (text: string) => {
    if (isSoundMuted) return;
    setSpeakingText(text);

    // Filter sound effect tags before passing to official browser speech
    const filterText = text.replace(/\*[^*]+\*/g, '');

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(filterText);
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        
        if (selectedVoiceURI) {
          const voices = window.speechSynthesis.getVoices();
          const foundVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
          if (foundVoice) {
            utterance.voice = foundVoice;
          }
        }
        
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Ignore synth failures
    }
  };

  // Preset setter helper
  const applyVoicePreset = (preset: "sparkling" | "lazy" | "bouncy" | "clever") => {
    setVoicePreset(preset);
    if (preset === "sparkling") {
      setVoicePitch(1.45);
      setVoiceRate(1.10);
    } else if (preset === "bouncy") {
      setVoicePitch(1.70);
      setVoiceRate(1.25);
    } else if (preset === "lazy") {
      setVoicePitch(1.05);
      setVoiceRate(0.85);
    } else if (preset === "clever") {
      setVoicePitch(1.20);
      setVoiceRate(1.00);
    }
    // Play test phrase
    setTimeout(() => {
      speakVoice("Woof! Elizabeth, this is my brand new voice! Do you like it? *happy wag*");
    }, 120);
  };

  // Real Web Speech API initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        setIsSpeechRecognitionSupported(true);
        const rec = new SpeechRecognitionAPI();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsSpeechedMicrophoneActive(true);
          setLizExpression("excited");
        };

        rec.onresult = (event: any) => {
          const currentResult = event.results[0][0].transcript;
          setChatInput(currentResult);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event);
          setIsSpeechedMicrophoneActive(false);
        };

        rec.onend = () => {
          setIsSpeechedMicrophoneActive(false);
        };

        setRecognitionInstance(rec);
      }
    }
  }, []);

  // Voice Recording Actions
  const startRecordingAudio = async () => {
    if (isRecordingAudioClip) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const SpeechRecorderAPI = (window as any).MediaRecorder;
      if (!SpeechRecorderAPI) {
         throw new Error("MediaRecorder not supported");
      }
      
      const mediaRecorder = new SpeechRecorderAPI(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newClip = {
          id: "clip-" + Date.now(),
          url: audioUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          title: `Sweet Voice Bite #${recordedClips.length + 1} 🍓`,
          duration: recordingSeconds || 3
        };
        
        setRecordedClips(prev => [newClip, ...prev]);
        addActivityLog("game", `Recorded custom soundbite: "${newClip.title}"`);
        setLizExpression("excited");
        speakVoice("Wow! I successfully captured Elizabeth's voice-bite! That was beautiful! *happy bark*");
        
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecordingAudioClip(true);
      setRecordingSeconds(0);
      setLizExpression("breathing");
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Mic access failed", err);
      speakVoice("Oops! I couldn't connect to the microphone. Mommy or Daddy can help turn on microphone permissions inside settings!");
    }
  };

  const stopRecordingAudio = () => {
    if (!isRecordingAudioClip || !mediaRecorderRef.current) return;
    clearInterval(recordingTimerRef.current);
    mediaRecorderRef.current.stop();
    setIsRecordingAudioClip(false);
  };

  const playRecordedClip = (clip: any) => {
    if (!clip.url) {
      speakVoice("Elizabeth, you are my absolute best friend and I love hearing your sweet voice! Bark bark! *wag tail*");
      setLizExpression("excited");
      return;
    }
    try {
      const audio = new Audio(clip.url);
      audio.play();
      setLizExpression("eating"); // active cheerful chew/bark animation
      audio.onended = () => {
        setLizExpression("happy");
      };
    } catch (err) {
      console.error(err);
    }
  };

  // Helper logger for parents
  const addActivityLog = (type: "chat" | "story" | "game" | "mission" | "mood", title: string) => {
    const newLog: ActivityLog = {
      id: "log-" + Date.now(),
      type,
      title,
      timestamp: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Primary API message submission
  const handleChat = async (userText: string) => {
    if (!userText.trim()) return;

    // Build immediate message
    const cleanUserText = userText.trim();
    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: cleanUserText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);
    setLizExpression("happy");
    addActivityLog("chat", `Sent message: "${cleanUserText.slice(0, 30)}..."`);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanUserText,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          parentSettings
        })
      });

      const data = await response.json();
      
      setIsTyping(false);
      const hostReply = data.reply || "Let's run around together!";
      const isSafetyTrig = data.safetyTriggered || false;

      // Match face to expression
      if (isSafetyTrig) {
        setLizExpression("comfort");
      } else if (hostReply.toLowerCase().includes("*excit") || hostReply.toLowerCase().includes("*happy")) {
        setLizExpression("excited");
      } else if (hostReply.toLowerCase().includes("*cuddle") || hostReply.toLowerCase().includes("*gentle")) {
        setLizExpression("comfort");
      } else if (hostReply.toLowerCase().includes("*sleep") || parentSettings.bedtimeModeActive) {
        setLizExpression("sleepy");
      }

      setMessages(prev => [...prev, {
        id: "liz-" + Date.now(),
        role: "model",
        text: hostReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      speakVoice(hostReply);

    } catch (e) {
      setIsTyping(false);
      // Beautiful offline fallback response helper
      const offlineMsg = "*wag tail* I hear you, Elizabeth! You are my absolute best friend in the world. Let's play together and spread tons of big smiles today! *happy bark*";
      setMessages(prev => [...prev, {
        id: "liz-fallback-" + Date.now(),
        role: "model",
        text: offlineMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speakVoice(offlineMsg);
    }
  };

  // Interactive simulated or real Speech Recognition inputs
  const triggerVoiceInput = () => {
    if (isSpeechRecognitionSupported && recognitionInstance) {
      if (isSpeechedMicrophoneActive) {
        recognitionInstance.stop();
        setIsSpeechedMicrophoneActive(false);
      } else {
        try {
          // Speak a nice greeting, then start recording
          speakVoice("I'm listening, Elizabeth! What would you like to say? *happy pant*");
          setTimeout(() => {
            recognitionInstance.start();
          }, 800);
        } catch (err) {
          console.warn(err);
        }
      }
      return;
    }

    // Fallback simulation
    if (isListeningSimulated) return;
    setIsListeningSimulated(true);
    setLizExpression("excited");
    
    // Choose a random adorable child-safe phrase to speak to Liz
    const voicePhrases = [
      "Let's go on a magic cupcake forest adventure! 🌳🧁",
      "Liz, can you teach me how to be brave at school today? 🎒🏫",
      "How do butterflies fly so high and elegant? 🦋✨",
      "I cleaned up my puzzle table, I am ready for play! 🧩🧸",
      "Tell me a sweet princess story with flower crowns! 👑🌸"
    ];
    const spokenChoice = voicePhrases[Math.floor(Math.random() * voicePhrases.length)];

    setTimeout(() => {
      setIsListeningSimulated(false);
      handleChat(spokenChoice);
    }, 2200);
  };

  // Generate a magical story!
  const generateStory = async (type: StoryType, userCustomPrompt: string = "") => {
    setStoryState(prev => ({ ...prev, isLoading: true, isCustomizing: false }));
    addActivityLog("story", `Requested story: ${type} theme`);
    
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt: userCustomPrompt })
      });
      const data = await response.json();
      
      const textResult = data.story || "Once upon a time, my magical doggy book got tiny paws prints on it! Let's shake our fluffy fur and try again!";
      
      setStoryState(prev => ({
        ...prev,
        storyText: textResult,
        isLoading: false
      }));

      // Auto save story to library beautifully
      const formattedTitle = `✨ ${type.charAt(0).toUpperCase() + type.slice(1)}: ${userCustomPrompt ? userCustomPrompt.slice(0, 16) + '...' : 'Cozy Wonder'}`;
      const newSaved = {
        id: "sav-" + Date.now(),
        title: formattedTitle,
        type,
        text: textResult
      };
      setSavedStories(prev => [newSaved, ...prev]);
      speakVoice(textResult.slice(0, 200) + "... Sleep tight!");

    } catch (error) {
      // Local delightful offline storybook backups
      let fallbackText = "Once upon a time in a sparkling forest made of sweet strawberry fields, a little puppy named Liz wore a crown made of daisies. She held our hands and we soared onto flying balloons! The animals below all smiled, waving their little paws. Elizabeth laughed with joy, knowing she is extremely loved and smart. Liz snuggled close, saying: You are my star! *cuttles close*";
      
      setStoryState(prev => ({
        ...prev,
        storyText: fallbackText,
        isLoading: false
      }));
    }
  };

  // Mood responses
  const handleMoodCheckin = (mood: MoodType) => {
    setSelectedMood(mood);
    addActivityLog("mood", `Self-checked mood: ${mood}`);

    let reply = "";
    switch (mood) {
      case "happy":
        reply = "*excited wiggle* Woof! Hearing that your cheeks are smiling makes my tiny heart do a happy cartwheel! Let's leap up high and do a spin-trick! What should we build next?";
        setLizExpression("excited");
        break;
      case "sad":
        reply = "*curls up on your lap* Oh... it is completely okay to feel sad, Elizabeth. Everyone has soft cloudy days! I am right here beside you with a warm hug. Would you like to do a gentle breathing exercise with me? It makes our heart feel lighter.";
        setLizExpression("comfort");
        break;
      case "scared":
        reply = "*cuddles up close* I will sit super close and protect you with my soft fluffy ears! You are braver than you know. Remember, you can always talk to Mommy, Daddy, or a trusted grown-up! Let's breathe together like a big brave lion. 🦁🌾";
        setLizExpression("comfort");
        break;
      case "angry":
        reply = "*flops down* Grr... feels like a thunderstorm in our tummy, doesn't it? That is totally normal. Let's take 3 deep, slow puppy breaths together to let the storm drift away. Deep breath in...";
        setLizExpression("comfort");
        break;
      case "excited":
        reply = "*super happy double bark* Yay! Wow! That is marvelous! Your sparkles are shining so bright today! Let's do some funny dog tricks or play Dress Up! Woohoo! *cheerful spin*";
        setLizExpression("excited");
        break;
      case "tired":
        reply = "*gentle yawn and drops eyelids* My fluffy paws are a tiny bit sleepy too. Let's cozy up and read a calming bedtime story under-the-blankets. It is so warm and safe here.";
        setLizExpression("sleepy");
        break;
    }

    setMoodReply(reply);
    speakVoice(reply);

    // Auto-launch cozy breathing wizard if they feel sad, sacred, or angry
    if (mood === "sad" || mood === "scared" || mood === "angry") {
      setBreathingStep("inhale");
      setBreathingTimer(4);
    } else {
      setBreathingStep("idle");
    }
  };

  // Mini games runner
  const handleRiddleGuess = (optionSelected: string) => {
    setSelectedAnimalOption(optionSelected);
    const targetRiddle = ANIMAL_RIDDLES[animalRiddleIndex];

    if (optionSelected === targetRiddle.answer) {
      setRiddleFeedback({ isCorrect: true, text: "⭐ Yay! You got it! That is exactly correct! *happy bark and double tail-wag*" });
      setLizExpression("excited");
      speakVoice("Yay! That is exactly correct! You are so incredibly smart, Elizabeth!");
      setCompletedMissionsCount(p => p + 1);
    } else {
      setRiddleFeedback({ isCorrect: false, text: "🐕 Almost! That is a super nice guess, but try once more! I know you can solve it! ✨" });
      setLizExpression("comfort");
      speakVoice("Almost! Give it another try, you are so brave.");
    }
    addActivityLog("game", `Guessed riddle: ${optionSelected}`);
  };

  // Feed Liz sequence
  const [activeFeedingTreat, setActiveFeedingTreat] = useState<string | null>(null);
  const triggerFeeding = (treat: string, customText?: string, fullnessBoost = 15) => {
    setActiveFeedingTreat(treat);
    setLizExpression("eating");
    
    // Increment stats
    setTreatsFedCount(p => p + 1);
    setLizFullness(p => Math.min(100, p + fullnessBoost));
    
    const displayLabel = customText || treat;
    addActivityLog("game", `Fed Liz a delicious ${displayLabel}`);
    
    speakVoice(`*munch munch munch* Oh wow! Elizabeth, that tastes so incredible! Thank you for the yummy ${displayLabel}! *happy dog chew*`);

    setTimeout(() => {
      setActiveFeedingTreat(null);
      setLizExpression("happy");
    }, 3000);
  };

  const triggerHydration = () => {
    setActiveFeedingTreat("💧");
    setLizExpression("eating"); // active cheerful chew/drink animation
    setLizHydration(p => Math.min(100, p + 25));
    addActivityLog("game", "Filled Liz's sparkle bowl with fresh, bubbly water");
    speakVoice("*lap lap lap* Ah! Slurp! That is so cool, icy, and refreshing! Thank you for the clean water, Elizabeth! I feel so bubbly!");
    setTimeout(() => {
      setActiveFeedingTreat(null);
      setLizExpression("happy");
    }, 3000);
  };

  // Tricks sequences
  const triggerTrick = (trick: "spin" | "paw" | "roll") => {
    if (trick === "spin") {
      setLizExpression("trick_spin");
      speakVoice("Wheee! Sparkly spin time! Watch my fluffy white fur twirl! *cheerful spin*");
      addActivityLog("game", "Taught Liz how to Spin Around 🌀");
    } else if (trick === "paw") {
      setLizExpression("trick_paw");
      speakVoice("Tada! Here is my tiny fluffy white paw right in your hand! Shake, shake, shake! 🐾✨");
      addActivityLog("game", "Taught Liz how to Give Paw 🐾");
    } else {
      setLizExpression("trick_roll");
      speakVoice("Look at me roll over across our lawn! Oops, my collar sparkles got grass on them! *happy laugh*");
      addActivityLog("game", "Taught Liz how to Roll Over 💫");
    }

    setTimeout(() => {
      setLizExpression("happy");
    }, 2500);
  };

  // Parent Dashboard Authentication
  const handleParentAuthSubmit = () => {
    if (parentPinInput === parentSettings.pinCode) {
      setIsParentAuthenticated(true);
      setParentPinError("");
    } else {
      setParentPinError("Oops! That's not the correct PIN number. Hint: Look at the secret text!");
      setIsParentAuthenticated(false);
    }
  };

  const handleParentSettingsUpdate = (updates: Partial<ParentSettings>) => {
    setParentSettings(prev => ({ ...prev, ...updates }));
    addActivityLog("mission", `Parents changed settings: ${Object.keys(updates).join(', ')}`);
  };

  return (
    <div id="app-viewport-root" className="w-full min-h-screen bg-[#FFF5F9] font-sans flex flex-col p-4 md:p-6 select-none relative overflow-y-auto">
      
      {/* HEADER SECTION IN GEOMETRIC BALANCE STYLE */}
      <header id="app-primary-header" className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b-2 border-pink-100 pb-4">
        
        {/* Title Group */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
          <div className="w-12 h-12 bg-pink-400 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h1 className="text-2.5xl md:text-3.5xl font-black text-pink-500 tracking-tight fredoka">
              Liz the Little Wonder Dog
            </h1>
            <p className="text-pink-400 text-xs font-semibold tracking-wider uppercase">Elizabeth's Magical Puppy Companion</p>
          </div>
        </div>

        {/* Dashboard Actions / Play stats */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Audio volume setting */}
          <button 
            id="volume-toggle-button"
            onClick={() => {
              setIsSoundMuted(!isSoundMuted);
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className={`p-2.5 rounded-full border border-pink-200 shadow-sm transition-transform active:scale-95 ${isSoundMuted ? 'bg-pink-100 text-pink-400' : 'bg-white text-pink-500'}`}
            title={isSoundMuted ? "Unmute Doggy voice" : "Mute Doggy voice"}
          >
            {isSoundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Quick Kids score overview */}
          <div className="bg-white/95 px-4 py-1.5 rounded-full border-2 border-pink-100 flex items-center gap-3 shadow-sm text-xs md:text-sm font-bold text-pink-500">
            <span className="flex items-center gap-1 text-emerald-600">
              🌿 {completedMissionsCount} Done
            </span>
            <span className="text-pink-200">|</span>
            <span className="flex items-center gap-1 text-amber-500">
              🔥 {currentStreak} Days
            </span>
            <span className="text-pink-200">|</span>
            <span className="flex items-center gap-1 text-rose-500">
              🍓 {treatsFedCount} Fed
            </span>
          </div>

          {/* Locked Parent Button */}
          <button
            id="open-parent-dashboard-trigger"
            onClick={() => {
              setParentPinInput("");
              setParentPinError("");
              setIsParentAuthenticated(false);
              setIsParentModalOpen(true);
            }}
            className="bg-white px-4 py-2 rounded-full border-2 border-pink-100 hover:border-pink-300 flex items-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95 text-xs text-pink-500 font-bold tracking-tight uppercase"
          >
            <div className="w-6 h-6 bg-pink-50 rounded-full flex items-center justify-center border border-pink-200">
              <span className="text-[10px]">🔒</span>
            </div>
            <span>Parent Mode</span>
          </button>
        </div>
      </header>

      {/* BEDTIME SHUTDOWN CONTAINER OR SCREEN TIME EXCEEDED BAR */}
      {isScreenTimeAlertActive && (
        <div className="mb-6 bg-amber-500 text-white rounded-3xl p-5 border-4 border-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏰</span>
            <div>
              <p className="font-extrabold text-lg fredoka">Cozy Quiet Alarm!</p>
              <p className="text-sm">We used up our screen time sparkles for today. Let's tuck our screen away and read a book!</p>
            </div>
          </div>
          <button 
            onClick={() => setIsScreenTimeAlertActive(false)}
            className="bg-white text-amber-600 font-bold px-4 py-2 rounded-full shadow-md text-xs"
          >
            Okay Liz! 👌
          </button>
        </div>
      )}

      {/* 3-COLUMN LAYOUT SYSTEM */}
      <div id="app-grid-container" className="flex-1 grid grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: DAILY MISSIONS + MOOD CHECK-IN */}
        <aside id="left-sidebar" className="col-span-12 lg:col-span-3 flex flex-col gap-5">
          
          {/* Section 1: Daily Mission (Emerald Border) */}
          <div id="daily-mission-panel" className="bg-white rounded-[32px] p-6 border-4 border-emerald-100 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  <h3 className="text-emerald-600 font-extrabold text-lg">Daily Mission</h3>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Kid-Kindness
                </span>
              </div>

              <div className="bg-emerald-50/50 p-4 rounded-2xl mb-4 border border-emerald-100/60">
                <h4 className="text-emerald-800 font-bold text-sm mb-1">
                  {KINDNESS_MISSIONS[currentMissionIndex].title}
                </h4>
                <p className="text-emerald-700 text-xs leading-relaxed font-medium">
                  “{KINDNESS_MISSIONS[currentMissionIndex].description}”
                </p>
              </div>
            </div>

            <div>
              {missionDone ? (
                <div className="text-center p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 animate-pulse">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Awesome! Tail wagging for you! 🎉
                </div>
              ) : (
                <button
                  id="complete-mission-button"
                  onClick={() => {
                    setMissionDone(true);
                    setCompletedMissionsCount(p => p + 1);
                    setLizExpression("trick_spin");
                    addActivityLog("mission", `Completed mission: ${KINDNESS_MISSIONS[currentMissionIndex].title}`);
                    speakVoice("Hooray! Elizabeth, you did it! You are an amazing, kind superstar! My tail is wagging so incredibly fast! *happy bark*");
                  }}
                  className="w-full py-3 bg-emerald-400 hover:bg-emerald-500 text-white rounded-2xl font-extrabold shadow-[0_4px_0_#059669] transition-all active:translate-y-0.5 active:shadow-none text-sm cursor-pointer"
                >
                  I did it! ✅
                </button>
              )}
              
              <button
                id="next-mission-button"
                onClick={() => {
                  setCurrentMissionIndex(prev => (prev + 1) % KINDNESS_MISSIONS.length);
                  setMissionDone(false);
                }}
                className="w-full text-center mt-3 text-[11px] font-bold text-emerald-500 hover:text-emerald-700 hover:underline flex items-center justify-center gap-1"
              >
                <span>Give me another mission!</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Section 2: Mood Check-in (Amber Border) */}
          <div id="mood-checkin-panel" className="bg-white rounded-[32px] p-6 border-4 border-amber-100 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">☀️</span>
                <h3 className="text-amber-600 font-extrabold text-lg">Mood Check-in</h3>
              </div>
              
              <p className="text-amber-800 text-xs font-semibold mb-4 text-center">
                Elizabeth, how do you feel right now?
              </p>

              {/* Grid of friendly cute faces */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {[
                  { key: "happy", emo: "😊", label: "Happy" },
                  { key: "excited", emo: "🤩", label: "Excited" },
                  { key: "tired", emo: "😴", label: "Tired" },
                  { key: "sad", emo: "😢", label: "Sad" },
                  { key: "scared", emo: "😨", label: "Scared" },
                  { key: "angry", emo: "😡", label: "Angry" }
                ].map((moodItem) => (
                  <button
                    key={moodItem.key}
                    id={`mood-btn-${moodItem.key}`}
                    onClick={() => {
                      handleMoodCheckin(moodItem.key as MoodType);
                      setActiveTab("mood");
                    }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer border-2 transition-all hover:scale-105 active:scale-95 ${selectedMood === moodItem.key ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-200' : 'bg-amber-50/60 border-transparent'}`}
                  >
                    <span className="text-2.5xl leading-none">{moodItem.emo}</span>
                    <span className="text-[10px] font-extrabold text-amber-800/80 tracking-tight mt-1">{moodItem.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div id="mood-short-description" className="bg-amber-50/40 p-3 rounded-2xl border border-amber-100 text-center">
              <span className="text-[10px] text-amber-700 leading-normal font-bold block">
                {selectedMood ? `Chosen: ${selectedMood.toUpperCase()}` : "Tap an Emoji to tell Liz!"}
              </span>
            </div>
          </div>

        </aside>

        {/* CENTER MAIN PLAYGROUND: LIZ GARDEN BackDrop */}
        <main id="center-main-playground" className="col-span-12 lg:col-span-6 bg-gradient-to-b from-blue-100 to-blue-200 rounded-[48px] border-[12px] border-white shadow-2xl relative flex flex-col justify-between p-6 overflow-hidden min-h-[500px]">
          
          {/* BEDTIME SHUTDOWN OVERLAY VIEW */}
          {parentSettings.bedtimeModeActive && (
            <div className="absolute inset-0 bg-[#1e1b4b]/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 text-center text-white">
              <Moon size={60} className="text-yellow-300 animate-pulse mb-4" />
              <h2 className="text-3xl font-black mb-2 fredoka">Bedtime Dreamland Hour 🌙</h2>
              <p className="text-sm max-w-sm mb-6 text-indigo-200 font-medium">
                Shh... Liz has tucked her tiny fluffy paws in! The stars are glowing and the garden is taking a cozy rest. Time to sleep!
              </p>
              
              <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border-2 border-indigo-500/20 mb-6">
                <LizAvatar expression="sleepy" size={150} />
              </div>

              <p className="text-xs bg-indigo-950/80 px-4 py-2 rounded-full border border-indigo-500/30 text-yellow-200 font-bold tracking-wider uppercase">
                See you tomorrow morning, Elizabeth!
              </p>
            </div>
          )}

          {/* FLOATING SPEECH BUBBLE ABOVE LIZ */}
          <div className="w-full relative z-10 mx-auto max-w-md">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-3xl text-blue-700 font-bold text-sm md:text-md shadow-xl border-2 border-blue-200 flex flex-col gap-1.5 min-h-[70px] relative">
              <p className="leading-relaxed">
                {messages[messages.length - 1]?.role === "model" 
                  ? messages[messages.length - 1].text 
                  : `*tilt head* elizabeth, I'm thinking of a super smart puppy response...`}
              </p>
              {speakingText && (
                <div className="flex items-center gap-1 text-[10px] text-pink-500 font-bold self-end mt-1 animate-pulse">
                  <Volume2 size={12} />
                  <span>Speaking out loud...</span>
                </div>
              )}
              {/* Voice Sound waves when simulating listening */}
              {isListeningSimulated && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-extrabold mt-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Elizabeth is speaking... Liz is listening carefully!</span>
                </div>
              )}
              {/* Speak Triangle pointer */}
              <div className="w-4 h-4 bg-white/95 absolute -bottom-2 left-1/2 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-blue-200"></div>
            </div>
          </div>

          {/* DYNAMIC MIDDLE GROUND: COMPONENT CONTAINER */}
          <div className="flex-1 flex flex-col items-center justify-center my-4 relative">
            
            {/* Soft decorative cloud backing circles for theme */}
            <div className="absolute w-72 h-72 bg-white/35 rounded-full blur-2xl -z-10 animate-pulse" />
            
            {/* FIXED-BOUNDS STAGE FOR AVATAR AND TRAVELING FEED ANIMATION */}
            <div className="relative w-[220px] h-[220px] flex items-center justify-center" id="avatar-and-feeding-stage">
              
              {/* REAL-TIME LIZ AVATAR COMPONENT */}
              <LizAvatar 
                expression={lizExpression} 
                dressUp={dressUp} 
                size={190} 
              />

              {/* Visual item being fed */}
              {activeFeedingTreat && (
                <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                  
                  {/* Decorative flight path curve indicator (sparkly dotted line) */}
                  <svg className="absolute inset-0 w-full h-full text-amber-400/40 opacity-70" viewBox="0 0 220 220">
                    <motion.path
                      d="M 25 210 Q 60 110 110 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: [0, 1] }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </svg>

                  {/* Active travelling treats */}
                  <motion.div
                    initial={{ y: 100, x: -85, scale: 0.2, opacity: 0, rotate: 0 }}
                    animate={{ 
                      y: [100, 30, -12, -8],
                      x: [-85, -45, 0, 0],
                      scale: [0.4, 1.8, 1.2, 0],
                      rotate: [0, 120, 240, 360],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] flex items-center justify-center relative"
                  >
                    {/* The actual treat */}
                    <span className="select-none filter drop-shadow">
                      {activeFeedingTreat === "strawberry" ? "🍓" : 
                       activeFeedingTreat === "cupcake" ? "🧁" : 
                       activeFeedingTreat === "bone" ? "🍖" : 
                       activeFeedingTreat === "cookie" ? "🍪" : activeFeedingTreat}
                    </span>

                    {/* Tiny sparkling magic glitter trail! */}
                    <motion.span 
                      animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                      className="absolute -top-4 -left-4 text-xl"
                    >
                      ✨
                    </motion.span>
                    <motion.span 
                      animate={{ scale: [1.3, 0.7, 1.3], opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: 0.15 }}
                      className="absolute -bottom-4 -right-4 text-lg"
                    >
                      ⭐
                    </motion.span>
                    <motion.span
                      animate={{ scale: [0.7, 1.4, 0.7], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 0.35, delay: 0.2 }}
                      className="absolute top-2 -right-5 text-sm"
                    >
                      ✨
                    </motion.span>
                  </motion.div>

                  {/* Animated "CHOMP!" and mini hearts burst at the puppy's mouth when treat completes landing */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 0, 1.6, 0], 
                      opacity: [0, 0, 1, 0],
                      y: -10,
                      x: 0
                    }}
                    transition={{ duration: 1.1, times: [0, 0.75, 0.9, 1] }}
                    className="absolute text-xl font-black text-rose-500 flex flex-col items-center justify-center font-sans"
                  >
                    <span className="bg-gradient-to-r from-yellow-300 to-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-400 text-[11px] uppercase font-black tracking-widest scale-80 shadow-md">
                      YUM CHOMP! 😋💖
                    </span>
                    <div className="flex gap-1.5 mt-1 leading-none text-base">
                      <span>❤️</span>
                      <span>✨</span>
                      <span>💖</span>
                      <span>✨</span>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Triggers and feedback indicators */}
            <p className="mt-2 text-[10px] font-black text-blue-700/80 bg-white/65 px-4 py-1.5 rounded-full border border-blue-200 uppercase tracking-widest leading-none shadow-sm">
              ✨ {dressUp.hat !== "none" ? dressUp.hat.toUpperCase() : "Cozy"} Hat & {dressUp.collar.toUpperCase()} COLLAR
            </p>
          </div>

          {/* BOTTOM DOCK ACTIONS AND TABS WITH LITERAL BIG BOLD SHADOW SHAPES */}
          <div className="w-full">
            
            {/* Dynamic Panel Overlays inside center container based on menu selections */}
            
            {/* TAB VIEW 1: COZY STRAWBERRIES AND FEED LIZ */}
            {activeTab === "game" && (
              <div className="bg-white/95 rounded-3xl p-4 border-2 border-blue-200 mb-4 animate-fade-in text-xs font-bold shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-blue-700 font-extrabold flex items-center gap-1 text-sm">
                    🎮 Fun Backyard Games
                  </span>
                  <button 
                    onClick={() => setActiveTab("home")} 
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Sub tab selectors for inside game */}
                <div className="flex gap-1.5 overflow-x-auto pb-2">
                  <button
                    onClick={() => setActiveGame("dress_up")}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] cursor-pointer whitespace-nowrap ${activeGame === "dress_up" ? 'bg-pink-400 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    ✨ Dress Up Liz
                  </button>
                  <button
                    onClick={() => setActiveGame("feed_liz")}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] cursor-pointer whitespace-nowrap ${activeGame === "feed_liz" ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    🍰 Feed Treats
                  </button>
                  <button
                    onClick={() => setActiveGame("guess_animal")}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] cursor-pointer whitespace-nowrap ${activeGame === "guess_animal" ? 'bg-emerald-400 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    🐾 Animal Riddle
                  </button>
                </div>

                <div className="mt-3 border-t border-gray-100 pt-3">
                  {/* Game 1: Dress up */}
                  {activeGame === "dress_up" && (
                    <div id="dressup-game-controls" className="flex flex-col gap-3">
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">Pick a magical Hat:</p>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { key: "none", emo: "❌" },
                            { key: "crown", emo: "👑" },
                            { key: "wizard", emo: "🧙‍♂️" },
                            { key: "bow", emo: "🎀" },
                            { key: "detective", emo: "🕵️‍♂️" }
                          ].map(hOpt => (
                            <button
                              key={hOpt.key}
                              id={`dressup-hat-${hOpt.key}`}
                              onClick={() => {
                                setDressUp(prev => ({ ...prev, hat: hOpt.key as any }));
                                addActivityLog("game", `Dressed Liz hat: ${hOpt.key}`);
                                speakVoice(`Oh wow, look at my cute new hat! Do I look magnificent, Elizabeth?`);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer border ${dressUp.hat === hOpt.key ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 bg-white'}`}
                            >
                              <span>{hOpt.emo}</span>
                              <span className="capitalize">{hOpt.key}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">Pick a fancy Collar style:</p>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { key: "pink", label: "🎀 Pink Bow" },
                            { key: "gold", label: "🥇 Gold Medal" },
                            { key: "star", label: "⭐ Star Medal" },
                            { key: "cape", label: "🦸🦸‍♂️ Hero Cape" },
                          ].map(cOpt => (
                            <button
                              key={cOpt.key}
                              id={`dressup-collar-${cOpt.key}`}
                              onClick={() => {
                                setDressUp(prev => ({ ...prev, collar: cOpt.key as any }));
                                addActivityLog("game", `Dressed Liz collar: ${cOpt.key}`);
                                speakVoice(`This collar feels so special around my neck! Thank you, my friend!`);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs cursor-pointer border ${dressUp.collar === cOpt.key ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white'}`}
                            >
                              {cOpt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">Super Accessories:</p>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { key: "none", emo: "❌" },
                            { key: "glasses", emo: "👓 Glasses" },
                            { key: "badge", emo: "⭐ Sheriff Star" },
                          ].map(aOpt => (
                            <button
                              key={aOpt.key}
                              id={`dressup-acc-${aOpt.key}`}
                              onClick={() => {
                                setDressUp(prev => ({ ...prev, accessory: aOpt.key as any }));
                                addActivityLog("game", `Dressed Liz accessory: ${aOpt.key}`);
                                speakVoice("Oh my! Elizabeth, I look like a genuine detective or hero dog now! Woof!");
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer border ${dressUp.accessory === aOpt.key ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-gray-200 bg-white'}`}
                            >
                              <span>{aOpt.emo}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Game 2: Feed Liz */}
                  {activeGame === "feed_liz" && (
                    <div id="feeding-game-controls" className="space-y-4">
                      
                      {/* --- Liz's Vital Care Stats --- */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-amber-50/65 p-3 rounded-2xl border border-amber-200 text-xs">
                        {/* Fullness */}
                        <div className="space-y-1 text-left">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-amber-800 font-extrabold flex items-center gap-1">🥩 Liz's Belly Fullness</span>
                            <span className="text-amber-900 font-black">{lizFullness}%</span>
                          </div>
                          <div className="w-full bg-gray-200/70 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              className="bg-amber-500 h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${lizFullness}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="text-[9px] text-gray-400 font-medium font-bold">Feed treats to make her super full and happy!</p>
                        </div>

                        {/* Hydration */}
                        <div className="space-y-1 text-left">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-sky-800 font-extrabold flex items-center gap-1">💧 Water Hydration</span>
                            <span className="text-sky-950 font-black">{lizHydration}%</span>
                          </div>
                          <div className="w-full bg-gray-200/70 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              className="bg-sky-400 h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${lizHydration}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <div className="text-[9px] text-gray-400 font-medium font-bold flex justify-between items-center">
                            <span>Keep Liz cool and energetic!</span>
                            <button
                              type="button"
                              onClick={triggerHydration}
                              className="px-2 py-0.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[8.5px] rounded border border-sky-600 transition-transform active:scale-95 cursor-pointer ml-1"
                            >
                              💧 Pour Water
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* --- Sub-tabs inside Feeding Control --- */}
                      <div className="flex gap-1 justify-center border-b border-gray-100 pb-1.5 overflow-x-auto">
                        {(["quick_pantry", "gourmet_bistro", "baking_oven"] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => {
                              setBakingStep(0);
                              setBakingProgress(0);
                              setFeedingSubtab(tab);
                            }}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer whitespace-nowrap transition-all ${
                              feedingSubtab === tab 
                                ? 'bg-amber-500 text-white shadow-sm scale-102' 
                                : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                            }`}
                          >
                            {tab === "quick_pantry" ? "🍪 Quick Treats" :
                             tab === "gourmet_bistro" ? "🍳 Gourmet Bowl" : "🥯 Baking Oven"}
                          </button>
                        ))}
                      </div>

                      {/* STATION A: QUICK TREATS */}
                      {feedingSubtab === "quick_pantry" && (
                        <div className="space-y-3">
                          <p className="text-gray-500 text-[10.5px] font-semibold text-center">
                            Give Liz an instant delicious snack with a single click:
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { key: "strawberry", label: "Strawberry", emo: "🍓" },
                              { key: "cupcake", label: "Cupcake", emo: "🧁" },
                              { key: "bone", label: "Doggy Bone", emo: "🍖" },
                              { key: "cookie", label: "Chocobiscuit", emo: "🍪" },
                              { key: "salmon", label: "Fresh Salmon", emo: "🐟" },
                              { key: "meat", label: "Juicy Steak", emo: "🥩" },
                              { key: "apple", label: "Sweet Apple", emo: "🍏" },
                              { key: "bacon", label: "Crispy Bacon", emo: "🥓" }
                            ].map(treat => (
                              <button
                                key={treat.key}
                                id={`feed-quick-${treat.key}`}
                                onClick={() => triggerFeeding(treat.emo, treat.label, 12)}
                                className="flex flex-col items-center gap-1 bg-amber-50/50 hover:bg-amber-100/80 p-2 rounded-xl border border-amber-100 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                              >
                                <span className="text-2xl">{treat.emo}</span>
                                <span className="text-[9px] text-amber-900 font-bold truncate w-full tracking-tighter text-center">{treat.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* STATION B: GOURMET BOWL STUDIO */}
                      {feedingSubtab === "gourmet_bistro" && (
                        <div className="bg-amber-50/30 border border-amber-200 p-3 rounded-2xl text-left space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🍳</span>
                            <h4 className="text-amber-800 font-black text-xs">Elizabeth's Gourmet Bistro</h4>
                          </div>

                          {/* Options grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {/* 1. Bowl Style */}
                            <div>
                              <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">🥣 Bowl Style</span>
                              <select 
                                className="w-full bg-white border border-amber-200 text-[10px] py-1.5 px-2 rounded-lg font-bold text-gray-755 font-sans cursor-pointer focus:outline-none focus:border-amber-400"
                                value={lizBowlType}
                                onChange={(e) => setLizBowlType(e.target.value)}
                              >
                                <option value="pink_sparkle">💖 Princess Pink Sparkle</option>
                                <option value="gold_crown">👑 Golden Crown Elite</option>
                                <option value="blue_sailor">🌊 Blue Ocean Sailor</option>
                              </select>
                            </div>

                            {/* 2. Main Dish */}
                            <div>
                              <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">🍖 Main Ingredient</span>
                              <select 
                                className="w-full bg-white border border-amber-200 text-[10px] py-1.5 px-2 rounded-lg font-bold text-gray-755 font-sans cursor-pointer focus:outline-none focus:border-amber-400"
                                value={customMealMain}
                                onChange={(e) => setCustomMealMain(e.target.value)}
                              >
                                <option value="kibble">🟫 Premium Mini Kibble</option>
                                <option value="salmon">🐟 Magic Fairy Salmon</option>
                                <option value="steak">🥩 Prime Sizzling Steak</option>
                              </select>
                            </div>

                            {/* 3. Frosting/Topping */}
                            <div>
                              <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">🍓 Healthy Fruits</span>
                              <select 
                                className="w-full bg-white border border-amber-200 text-[10px] py-1.5 px-2 rounded-lg font-bold text-gray-755 font-sans cursor-pointer focus:outline-none focus:border-amber-400"
                                value={customMealTopping}
                                onChange={(e) => setCustomMealTopping(e.target.value)}
                              >
                                <option value="strawberry">🍓 Sweet Strawberries</option>
                                <option value="blueberries">🫐 Sugar Blueberries</option>
                                <option value="carrot">🥕 Crunchy Baby Carrots</option>
                                <option value="honey">🍯 Magic Clover Honey</option>
                              </select>
                            </div>
                          </div>

                          {/* Extra Sparkle Garnish */}
                          <div>
                            <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">✨ Dreamy Sprinkles / Sparkles</span>
                            <div className="flex gap-2">
                              {[
                                { key: "sprinkles", label: "Golden Sprinkles", emo: "⭐" },
                                { key: "hearts", label: "Heart Confetti", emo: "❤️" },
                                { key: "whipped_cream", label: "Whipped Cream", emo: "☁️" }
                              ].map(g => (
                                <button
                                  key={g.key}
                                  type="button"
                                  onClick={() => setCustomMealGarnish(g.key)}
                                  className={`flex-1 py-1 px-1 border rounded-lg text-[9.5px] cursor-pointer flex items-center justify-center gap-1 transition-all ${
                                    customMealGarnish === g.key ? 'border-amber-400 bg-amber-100/60 font-black' : 'border-gray-200 bg-white text-gray-650'
                                  }`}
                                >
                                  <span>{g.emo}</span> {g.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Live Preview Plate */}
                          <div className="bg-white/80 p-2 rounded-xl border border-dashed border-amber-200 flex items-center justify-between text-[11px] font-bold">
                            <span className="text-gray-500 font-semibold">Chef Bowl Preview: </span>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {lizBowlType === "pink_sparkle" ? "💖" : lizBowlType === "gold_crown" ? "👑" : "🌊"}
                              </span>
                              <span className="text-amber-800 text-lg">
                                {customMealMain === "kibble" ? "🟫" : customMealMain === "salmon" ? "🐟" : "🥩"}
                                {customMealTopping === "strawberry" ? "🍓" : customMealTopping === "blueberries" ? "🫐" : customMealTopping === "carrot" ? "🥕" : "🍯"}
                                {customMealGarnish === "sprinkles" ? "✨" : customMealGarnish === "hearts" ? "❤️" : "☁️"}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const bowlLabel = lizBowlType === "pink_sparkle" ? "Princess Pink Sparkle Bowl" : lizBowlType === "gold_crown" ? "Golden Crown Elite Bowl" : "Blue Ocean Sailor Bowl";
                              const dishImg = customMealMain === "kibble" ? "🟫" : customMealMain === "salmon" ? "🐟" : "🥩";
                              const toppingsEmoji = customMealTopping === "strawberry" ? "🍓" : customMealTopping === "blueberries" ? "🫐" : customMealTopping === "carrot" ? "🥕" : "🍯";
                              const garnishLabel = customMealGarnish === "sprinkles" ? "Glitter Sprinkles" : customMealGarnish === "hearts" ? "Love Hearts" : "Whipped Cream";
                              
                              const desc = `special meal combo of ${customMealMain} and fresh ${customMealTopping} with fluffy ${garnishLabel} inside her ${bowlLabel}!`;
                              // Represent the whole custom bowl visually by combining raw emojis or select one main
                              triggerFeeding(dishImg + toppingsEmoji, desc, 30);
                            }}
                            className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs shadow-[0_3px_0_#975a16] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            🍳 Serve Gourmet Chef Bowl to Liz! 🐕🐾
                          </button>
                        </div>
                      )}

                      {/* STATION C: COOKIE BAKING OVEN */}
                      {feedingSubtab === "baking_oven" && (
                        <div className="bg-yellow-50/50 border border-yellow-250 p-3 rounded-2xl text-center space-y-3">
                          <div className="flex items-center gap-2 justify-center">
                            <span className="text-xl">🥯</span>
                            <h4 className="text-amber-805 font-extrabold text-xs">Elizabeth's Cookie Baking Studio</h4>
                          </div>

                          {/* Bake Steps */}
                          {bakingStep === 0 && (
                            <div className="space-y-2 text-center">
                              <p className="text-gray-500 text-[10px] font-bold">
                                Pick a shape cookie stamp to start baking:
                              </p>
                              <div className="flex gap-1.5 justify-center">
                                {[
                                  { key: "heart", label: "Love Heart", emo: "❤️" },
                                  { key: "star", label: "Magic Star", emo: "⭐" },
                                  { key: "bone", label: "Fluffy Bone", emo: "🦴" },
                                  { key: "crown", label: "Royal Crown", emo: "👑" }
                                ].map(st => (
                                  <button
                                    key={st.key}
                                    type="button"
                                    onClick={() => {
                                      setCustomCookieShape(st.key);
                                      setBakingStep(1);
                                      speakVoice(`Oh wow! A ${st.label}-shaped cookie is so perfect! Now click Knead & Stamp Dough to shape our yummy treat!`);
                                    }}
                                    className="p-2.5 bg-white hover:bg-yellow-100 border border-yellow-200 rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95 flex-1"
                                  >
                                    <span className="text-xl">{st.emo}</span>
                                    <span className="text-[8.5px] text-amber-900 font-extrabold block leading-none">{st.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {bakingStep === 1 && (
                            <div className="space-y-2 py-1 text-center">
                              <div className="flex justify-center text-3xl animate-bounce">
                                🥣🥖
                              </div>
                              <p className="text-yellow-800 text-[10.5px] font-bold leading-tight">
                                Mixing dough, sweet sprinkles, and honey! Selected Shape: <span className="capitalize font-black text-amber-600">{customCookieShape}</span>
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setBakingStep(2);
                                  setBakingProgress(0);
                                  speakVoice("Excellent! Now let's slide it in the magical sparkle oven! Click bake and count 1, 2, 3!");
                                  
                                  // Animate baking progress
                                  let prog = 0;
                                  const timer = setInterval(() => {
                                    prog += 10;
                                    setBakingProgress(prog);
                                    if (prog >= 100) {
                                      clearInterval(timer);
                                      setBakingStep(3);
                                      speakVoice("Ding! Oh, look at that! The cookie popped right out of the oven! It's fresh, crispy, and warm! Serve it to Liz!");
                                    }
                                  }, 200);
                                }}
                                className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-amber-950 font-black rounded-xl text-[10px] cursor-pointer shadow-sm transition-transform active:scale-95"
                              >
                                🥖 Knead & Stamp Cookie Dough! 🐾
                              </button>
                            </div>
                          )}

                          {bakingStep === 2 && (
                            <div className="space-y-2 py-1.5 text-center">
                              <div className="text-3xl animate-pulse">🔥🥯⚡</div>
                              <p className="text-amber-500 text-[9.5px] uppercase font-black tracking-widest">
                                BAKE BAKE BAKE... OVEN IS HOT!
                              </p>
                              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden max-w-[200px] mx-auto border">
                                <div 
                                  className="bg-gradient-to-r from-yellow-400 to-red-500 h-full transition-all duration-300"
                                  style={{ width: `${bakingProgress}%` }}
                                />
                              </div>
                              <span className="text-[9.5px] font-bold text-gray-500">{bakingProgress}% Crispiness</span>
                            </div>
                          )}

                          {bakingStep === 3 && (
                            <div className="space-y-2 py-1 text-center animate-fade-in">
                              <div className="flex justify-center text-4xl">
                                🍪🎉
                              </div>
                              <p className="text-emerald-700 text-[10.5px] font-black">
                                ✨ Golden Freshly Baked {customCookieShape.toUpperCase()} Cookie Ready! ✨
                              </p>
                              <div className="flex gap-2 justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cookieEmo = customCookieShape === "heart" ? "🍪❤️" : customCookieShape === "star" ? "🍪⭐" : customCookieShape === "bone" ? "🍪🦴" : "🍪👑";
                                    triggerFeeding(cookieEmo, `Freshly-baked ${customCookieShape} Cookie`, 25);
                                    setBakingStep(0);
                                  }}
                                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-[10px] cursor-pointer shadow-[0_3px_0_#047857]"
                                >
                                  😋 Feed cookie to Liz!
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBakingStep(0)}
                                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-[10px]"
                                >
                                  Bake another shape 🥯
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  )}

                  {/* Game 3: Guess Animal */}
                  {activeGame === "guess_animal" && (
                    <div id="riddle-game-controls" className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                          Riddle {animalRiddleIndex + 1} of {ANIMAL_RIDDLES.length}
                        </span>
                        <button
                          onClick={() => {
                            setAnimalRiddleIndex((prev) => (prev + 1) % ANIMAL_RIDDLES.length);
                            setSelectedAnimalOption(null);
                            setRiddleFeedback({ isCorrect: null, text: "" });
                          }}
                          className="text-xs text-emerald-600 hover:underline hover:text-emerald-800 flex items-center gap-0.5"
                        >
                          <span>Skip</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-emerald-900 font-extrabold mb-1.5">Who am I? 🐾</p>
                        <ul className="text-xs space-y-1 text-emerald-800 font-medium">
                          {ANIMAL_RIDDLES[animalRiddleIndex].hints.map((hintText, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{hintText}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {ANIMAL_RIDDLES[animalRiddleIndex].options.map((opt) => (
                          <button
                            key={opt}
                            id={`riddle-opt-${opt.split(' ')[0]}`}
                            onClick={() => handleRiddleGuess(opt)}
                            className={`p-2.5 rounded-xl text-center text-xs font-bold border cursor-pointer ${selectedAnimalOption === opt ? (opt === ANIMAL_RIDDLES[animalRiddleIndex].answer ? 'bg-emerald-500 border-white text-white' : 'bg-rose-100 border-rose-300 text-rose-700') : 'bg-white hover:bg-emerald-50 border-gray-100 text-gray-700'}`}
                            disabled={selectedAnimalOption !== null}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {riddleFeedback.isCorrect !== null && (
                        <div className={`mt-3 text-[11px] font-bold text-center ${riddleFeedback.isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {riddleFeedback.text}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB VIEW 2: DOG TRICKS SELECTOR (Warm amber) */}
            {activeTab === "mood" && (
              <div className="bg-white/95 rounded-3xl p-4 border-2 border-amber-200 mb-4 animate-fade-in text-xs font-bold shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-amber-700 font-extrabold flex items-center gap-1 text-sm">
                    🧘 Cozy Breathing Flower
                  </span>
                  <button 
                    onClick={() => {
                      setBreathingStep("idle");
                      setActiveTab("home");
                    }} 
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                {breathingStep !== "idle" ? (
                  <div className="text-center p-4 flex flex-col items-center">
                    {/* Breathing circle widget that shrinks/grows */}
                    <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center relative mb-4">
                      <motion.div
                        animate={{ scale: breathingStep === "inhale" ? [1, 1.4] : breathingStep === "exhale" ? [1.4, 1] : 1.4 }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute inset-2 bg-amber-400 rounded-full opacity-60"
                      />
                      
                      <span className="text-base font-extrabold text-amber-900 z-10 fredoka">
                        {breathingStep === "inhale" ? "Breathe IN 👃" : 
                         breathingStep === "hold" ? "HOLD IT! 🎈" : "Breathe OUT 🌬️"}
                      </span>
                    </div>

                    <p className="text-xs text-amber-800 leading-relaxed font-semibold max-w-sm mb-4">
                      {breathingStep === "inhale" ? "Imagine taking a slow sniff of a beautiful sparkly flower..." : 
                       breathingStep === "hold" ? "Hold that quiet, warm sunshine feeling in your tummy..." : 
                       "Blow the air out gently, like blowing a shiny dandelion clock!"}
                    </p>

                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setBreathingStep("idle");
                          setLizExpression("happy");
                        }}
                        className="px-4 py-2 bg-amber-400 text-white rounded-full font-bold shadow-md text-[11px]"
                      >
                        I feel great now! 😊
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <p className="text-amber-700 text-sm mb-3 font-semibold">How can Liz comfort you today, Elizabeth?</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => {
                          setBreathingStep("inhale");
                          setBreathingTimer(4);
                        }}
                        className="px-4 py-2.5 bg-amber-300 hover:bg-amber-400 text-white font-extrabold rounded-2xl flex items-center gap-1 shadow-sm text-xs"
                      >
                        🌸 Start Breathing Game
                      </button>
                      <button
                        onClick={() => {
                          const simpleAdvice = "*happy wag* Remember, sharing our toys is like sharing sparkles! Parents are the best helpers. I am always your snuggle dog!";
                          setMoodReply(simpleAdvice);
                          speakVoice(simpleAdvice);
                          setLizExpression("happy");
                        }}
                        className="px-4 py-2.5 bg-orange-300 hover:bg-orange-400 text-white font-extrabold rounded-2xl flex items-center gap-1 shadow-sm text-xs"
                      >
                        🏡 Speak Quiet Advice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB VIEW 3: CUSTOM STORIES (Violet) */}
            {activeTab === "story" && (
              <div className="bg-white/95 rounded-3xl p-5 border-2 border-violet-200 mb-4 animate-fade-in text-xs font-bold shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-violet-700 font-extrabold flex items-center gap-1 text-sm">
                    📚 Story Time Playground
                  </span>
                  <button 
                    onClick={() => {
                      setStoryState(prev => ({ ...prev, isCustomizing: false }));
                      setActiveTab("home");
                    }} 
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                {storyState.isLoading ? (
                  <div className="text-center py-6 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-violet-800 font-black text-sm fredoka mb-1">Liz is reading her magic book... 📖✨</p>
                    <p className="text-violet-500 text-xs font-medium">Coming up with high-contrast castles, friendly butterflies, and brave stars...</p>
                  </div>
                ) : storyState.storyText ? (
                  <div className="flex flex-col gap-3">
                    <div className="bg-violet-50/70 p-4 rounded-2xl max-h-48 overflow-y-auto text-xs text-violet-900 border border-violet-100 leading-relaxed font-semibold">
                      {storyState.storyText.split("\n\n").map((par, i) => (
                        <p key={i} className="mb-2.5">{par}</p>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => speakVoice(storyState.storyText)}
                        className="flex-1 py-2.5 bg-violet-400 hover:bg-violet-500 text-white text-xs font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={14} /> Listen Again
                      </button>
                      <button
                        onClick={() => setStoryState(prev => ({ ...prev, storyText: "" }))}
                        className="py-2.5 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Write Another Word
                      </button>
                    </div>
                  </div>
                ) : !storyState.isCustomizing ? (
                  <div>
                    <p className="text-violet-600 mb-3 font-semibold text-xs text-center">Elizabeth, what kind of story should Liz tell you? 🌟</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-3">
                      {[
                        { key: "bedtime", lab: "Cozy Bedtime 🌙" },
                        { key: "adventure", lab: "Clouds Adventure ☁️" },
                        { key: "princess", lab: "Cupcake Princess 👑" },
                        { key: "moral", lab: "Polite Helper 🌿" },
                        { key: "animal", lab: "Little Squirrel 🐻" },
                        { key: "confidence", lab: "Brave Puppy ⭐" },
                      ].map((sOpt) => (
                        <button
                          key={sOpt.key}
                          id={`story-genre-${sOpt.key}`}
                          onClick={() => generateStory(sOpt.key as StoryType)}
                          className="py-3 bg-violet-50/70 hover:bg-violet-100 rounded-2xl border-2 border-violet-100 text-violet-800 text-xs font-extrabold flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                        >
                          {sOpt.lab}
                        </button>
                      ))}
                    </div>

                    <button
                      id="custom-story-wizard-trigger"
                      onClick={() => setStoryState(prev => ({ ...prev, isCustomizing: true }))}
                      className="w-full py-2.5 bg-violet-100 border-2 border-dashed border-violet-300 text-violet-800 text-xs font-black rounded-2xl flex items-center justify-center gap-1.5 hover:bg-violet-200 transition-transform active:scale-95 cursor-pointer"
                    >
                      🎪 Story Builder (Customize theme Details!)
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-violet-600 font-bold mb-1">Add details or names for our story:</p>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-2 border-gray-100 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-300"
                      placeholder="e.g. A pony named Pip who loves red apples..."
                      value={storyState.customPrompt}
                      onChange={(e) => setStoryState(prev => ({ ...prev, customPrompt: e.target.value }))}
                    />

                    {/* Prebuilt child-friendly words keys */}
                    <div className="flex gap-1.5 flex-wrap">
                      {["Spooky Monster ❌", "Friendly Unicorn 🦄", "Space Ship 🚀", "Chocolate Mountain 🏔️", "Flower Crowns 👑"].map((kwd) => (
                        <button
                          type="button"
                          key={kwd}
                          onClick={() => {
                            if (kwd.includes("❌")) return; // Safe safeguard warning
                            setStoryState(prev => ({
                              ...prev,
                              customPrompt: prev.customPrompt + " " + kwd.split(' ')[1]
                            }));
                          }}
                          className="bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-[10px] b-1 hover:bg-violet-100"
                        >
                          {kwd}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => generateStory("adventure", storyState.customPrompt)}
                        className="flex-1 py-2.5 bg-violet-400 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer"
                      >
                        🏰 Read Custom Story!
                      </button>
                      <button
                        onClick={() => setStoryState(prev => ({ ...prev, isCustomizing: false }))}
                        className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-xs cursor-pointer"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB VIEW 4: CUSTOMIZE LIZ'S VOICE (Emerald / Pink-Rose theme) */}
            {activeTab === "voice" && (
              <div id="voice-customizer-pane" className="bg-white/95 rounded-3xl p-5 border-2 border-emerald-300 mb-4 animate-fade-in text-xs font-bold shadow-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1.5 text-sm">
                    🎙️ Liz's Voice Studio
                  </span>
                  <button 
                    onClick={() => setActiveTab("home")} 
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-emerald-600 font-semibold text-center text-[11px]">
                    Elizabeth, pick a magical puppy voice preset or create your own custom sound! 🐕✨
                  </p>

                  {/* Preset Cute Quick Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "sparkling", label: "Sparkling Spark 👑", emoji: "✨" },
                      { key: "bouncy", label: "Bouncy Puppy 🐶", emoji: "🏃" },
                      { key: "lazy", label: "Cozy Sleep 🌙", emoji: "☁️" },
                      { key: "clever", label: "Detective Liz 🕵️‍♂️", emoji: "🔍" },
                    ].map((pre) => (
                      <button
                        key={pre.key}
                        type="button"
                        id={`voice-preset-btn-${pre.key}`}
                        onClick={() => applyVoicePreset(pre.key as any)}
                        className={`py-2 px-3 rounded-2xl border-2 font-extrabold flex items-center gap-1.5 justify-center transition-all cursor-pointer ${voicePreset === pre.key ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-[1.02] shadow-sm' : 'bg-emerald-50/55 border-emerald-100 hover:bg-emerald-100/50 text-emerald-700'}`}
                      >
                        <span className="text-sm">{pre.emoji}</span>
                        <span className="text-[10.5px]">{pre.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Manual Sliders section when they want custom */}
                  <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/80 space-y-3.5">
                    
                    {/* Pitch Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-emerald-800 text-[10.5px] flex items-center gap-1">
                          🎈 Custom Pitch / Tone (High vs Low):
                        </span>
                        <span className="text-emerald-600 font-extrabold text-[10.5px]">
                          {voicePitch.toFixed(2)}x {voicePitch > 1.4 ? "🐾 Squeaky" : voicePitch < 1.0 ? "🦁 Deep" : "🐕 Natural"}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="voice-pitch-slider"
                        min={0.6}
                        max={1.9}
                        step={0.05}
                        className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        value={voicePitch}
                        onChange={(e) => {
                          setVoicePitch(parseFloat(e.target.value));
                          setVoicePreset("custom");
                        }}
                      />
                    </div>

                    {/* Speed/Rate Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-emerald-800 text-[10.5px] flex items-center gap-1">
                          🐢 Speed / Pace (Fast vs Slow):
                        </span>
                        <span className="text-emerald-600 font-extrabold text-[10.5px]">
                          {voiceRate.toFixed(2)}x {voiceRate > 1.3 ? "⚡ Super Speed" : voiceRate < 0.9 ? "🛌 Cozy Nap" : "🐕 Normal"}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="voice-rate-slider"
                        min={0.5}
                        max={1.9}
                        step={0.05}
                        className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        value={voiceRate}
                        onChange={(e) => {
                          setVoiceRate(parseFloat(e.target.value));
                          setVoicePreset("custom");
                        }}
                      />
                    </div>

                  </div>

                  {/* Browser Native Speech Engines Selection */}
                  {availableVoices.length > 0 && (
                    <div className="bg-white p-3 rounded-2xl border border-gray-200">
                      <label className="text-gray-500 text-[10px] uppercase block mb-1 font-bold">
                        Pick a friendly voice engine:
                      </label>
                      <select
                        id="voice-engine-select"
                        className="w-full bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-700 py-2 px-2.5 rounded-xl focus:outline-none focus:border-emerald-300 cursor-pointer"
                        value={selectedVoiceURI}
                        onChange={(e) => {
                          setSelectedVoiceURI(e.target.value);
                          setVoicePreset("custom");
                          // Test voice selection
                          setTimeout(() => {
                            speakVoice("Testing my new voice engine! Hello Elizabeth! *wag tail*");
                          }, 100);
                        }}
                      >
                        {availableVoices.map((voice) => (
                          <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      id="test-voice-sample-btn"
                      onClick={() => speakVoice("Hi Elizabeth! I am Liz, your magical companion, and this is exactly what I sound like! Woof woof! *happy bark*")}
                      className="flex-1 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-sm cursor-pointer text-center text-[11px] transition-transform active:scale-95 shadow-[0_3px_0_#059669]"
                    >
                      🔊 Test Voice Sample
                    </button>
                    <button
                      type="button"
                      id="reset-voice-defaults-btn"
                      onClick={() => {
                        setVoicePitch(1.3);
                        setVoiceRate(1.1);
                        setVoicePreset("sparkling");
                        // Reset to first english voice if any
                        const defaultRef = availableVoices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"));
                        if (defaultRef) {
                          setSelectedVoiceURI(defaultRef.voiceURI);
                        } else if (availableVoices.length > 0) {
                          setSelectedVoiceURI(availableVoices[0].voiceURI);
                        }
                        speakVoice("Reset complete! Back to my happy standard sparkles! *happy bark*");
                      }}
                      className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-[11px] cursor-pointer transition-transform active:scale-95"
                    >
                      Reset Default
                    </button>
                  </div>

                  {/* --- ELIZABETH'S REAL VOICE RECORDER --- */}
                  <div id="elizabeth-recorder-panel" className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-2xl border-2 border-pink-200 space-y-3 mt-4">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-pink-800 font-extrabold text-[12px] flex items-center gap-1">
                        🎙️ Elizabeth's Voice Recorder Studio
                      </span>
                      {isRecordingAudioClip && (
                        <span className="bg-red-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                          ● RECORDING {recordingSeconds}s
                        </span>
                      )}
                    </div>
                    
                    <p className="text-pink-600/90 text-[10.5px] leading-relaxed">
                      Speak, stretch, laugh, sing, or bark! Click start and we will capture your magical voice so you can play it back to me! ✨
                    </p>

                    <div className="flex gap-2 justify-center items-center py-1">
                      {!isRecordingAudioClip ? (
                        <button
                          type="button"
                          id="voice-recording-start-btn"
                          onClick={startRecordingAudio}
                          className="py-2.5 px-4 bg-pink-500 hover:bg-pink-600 text-white font-extrabold rounded-xl text-[11px] shadow-[0_3px_0_#db2777] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          🎤 Start Recording My Voice
                        </button>
                      ) : (
                        <div className="flex flex-col items-center gap-2 w-full">
                          {/* Cute animated sound wave indicator */}
                          <div className="flex gap-1 items-center justify-center h-5 w-full">
                            {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((scale, index) => (
                              <span 
                                key={index} 
                                className="w-1 bg-pink-500 rounded-full animate-bounce" 
                                style={{ 
                                  height: `${scale * 4}px`,
                                  animationDelay: `${index * 0.1}s` 
                                }} 
                              />
                            ))}
                          </div>
                          
                          <button
                            type="button"
                            id="voice-recording-stop-btn"
                            onClick={stopRecordingAudio}
                            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-[11px] transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_#991b1b]"
                          >
                            ⏹️ Stop & Save Voice Bite
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Recorded List Clips */}
                    {recordedClips.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-pink-100">
                        <label className="text-pink-750 text-[10px] uppercase font-bold tracking-wide block">
                          My Voice-Bite Library ({recordedClips.length}):
                        </label>
                        <div className="max-h-[150px] overflow-y-auto space-y-1.5 pr-0.5">
                          {recordedClips.map((clip) => (
                            <div
                              key={clip.id}
                              className="bg-white/85 border border-pink-100 rounded-xl p-2 flex items-center justify-between gap-1 shadow-sm transition-all hover:bg-white"
                            >
                              <div className="flex-1 flex flex-col gap-0.5 pr-1">
                                <input
                                  type="text"
                                  className="bg-transparent border-b border-transparent hover:border-pink-200 focus:border-pink-400 font-extrabold text-[11px] text-pink-900 focus:outline-none w-full py-0.5 px-0.5 rounded cursor-pointer"
                                  value={clip.title}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setRecordedClips(prev => prev.map(c => c.id === clip.id ? { ...c, title: val } : c));
                                  }}
                                  title="Click to rename"
                                />
                                <span className="text-[8.5px] text-gray-400 font-normal">
                                  {clip.timestamp} • {clip.duration}s
                                </span>
                              </div>

                              <div className="flex gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => playRecordedClip(clip)}
                                  className="w-7 h-7 bg-pink-100 hover:bg-pink-200 text-pink-700 hover:text-pink-800 rounded-lg flex items-center justify-center text-[11px] font-bold shadow-sm cursor-pointer hover:scale-[1.05] transition-transform"
                                  title="Listen back!"
                                >
                                  ▶️
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRecordedClips(prev => prev.filter(c => c.id !== clip.id));
                                  }}
                                  className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-lg flex items-center justify-center text-[10px] cursor-pointer transition-transform hover:scale-[1.05]"
                                  title="Delete Bite"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* TAB VIEW 5: FRIENDS & PUPPIES STICKER BOOK (Sky blue theme) */}
            {activeTab === "friends" && (
              <div id="friends-playground-pane" className="bg-white/95 rounded-3xl p-5 border-2 border-sky-300 mb-4 animate-fade-in text-xs font-bold shadow-md w-full">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-sky-100">
                  <span className="text-sky-700 font-extrabold flex items-center gap-1.5 text-sm">
                    👥 Friends & Puppy Companions Club
                  </span>
                  <button 
                    onClick={() => setActiveTab("home")} 
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* Left Column: Invite a Friend Form (5 cols) */}
                  <div className="md:col-span-5 bg-sky-50/50 p-4 rounded-2xl border border-sky-100/80 space-y-3">
                    <h3 className="text-sky-800 font-black text-xs flex items-center gap-1">
                      <UserPlus size={14} className="text-sky-600" /> Send a Magic Invitation!
                    </h3>
                    <p className="text-sky-600 text-[10.5px] leading-relaxed">
                      Invite a real friend, classmate, or cousin to join our magical dog club! Fill in their info, and we will send them a golden sparkle puppy.
                    </p>

                    {/* Friend's Name input */}
                    <div>
                      <label className="text-sky-850 text-[10px] uppercase font-bold block mb-1">Friend's Name:</label>
                      <input 
                        type="text"
                        placeholder="e.g., Clara or David"
                        className="w-full bg-white border border-sky-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-sky-400 font-bold"
                        value={friendNameInput}
                        onChange={(e) => setFriendNameInput(e.target.value)}
                      />
                    </div>

                    {/* Friend's Avatar Selection */}
                    <div>
                      <label className="text-sky-850 text-[10px] uppercase font-bold block mb-1">Friend's Avatar Emoji:</label>
                      <div className="flex gap-1.5 justify-between max-w-full overflow-x-auto pb-1">
                        {["👧", "👦", "🧒", "🎒", "🎨", "🌟"].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setFriendAvatarSelection(emoji)}
                            className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center border-2 cursor-pointer transition-all flex-shrink-0 ${friendAvatarSelection === emoji ? 'border-sky-450 bg-sky-100 scale-105' : 'border-gray-200 bg-white hover:bg-sky-50'}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Companion's Name input */}
                    <div>
                      <label className="text-sky-850 text-[10px] uppercase font-bold block mb-1">Their Puppy's Name:</label>
                      <input 
                        type="text"
                        placeholder="e.g., Cupcake or Buster"
                        className="w-full bg-white border border-sky-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-sky-400 font-bold"
                        value={companionNameInput}
                        onChange={(e) => setCompanionNameInput(e.target.value)}
                      />
                    </div>

                    {/* Companion's Breed Selector */}
                    <div>
                      <label className="text-sky-850 text-[10px] uppercase font-bold block mb-1">Puppy's Breed:</label>
                      <select
                        className="w-full bg-white border border-sky-200 text-xs py-2 px-2.5 rounded-xl focus:outline-none focus:border-sky-400 font-bold text-gray-700 cursor-pointer"
                        value={companionBreedSelection}
                        onChange={(e) => setCompanionBreedSelection(e.target.value)}
                      >
                        <option value="Poodle 🐩">Poodle 🐩</option>
                        <option value="Corgi 🦊">Corgi 🦊</option>
                        <option value="Beagle 🐶">Beagle 🐶</option>
                        <option value="Husky 🐺">Husky 🐺</option>
                        <option value="Golden Retriever 🐕">Golden Retriever 🐕</option>
                        <option value="Labrador 🐾">Labrador 🐾</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!friendNameInput.trim()) {
                          speakVoice("Please type your friend's sweet name, Elizabeth! I want to write it beautifully.");
                          return;
                        }
                        const pName = companionNameInput.trim() || "Buddy";
                        
                        // Create new friend object
                        const newFriend: Friend = {
                          id: "friend-" + Date.now(),
                          name: friendNameInput.trim(),
                          companionName: pName,
                          companionBreed: companionBreedSelection,
                          avatarEmoji: friendAvatarSelection,
                          status: "🐾 Chasing sparkly bubbles",
                          isOnline: true,
                          receivedGiftsCount: 0
                        };

                        setFriends(prev => [newFriend, ...prev]);
                        
                        // Reset forms
                        setFriendNameInput("");
                        setCompanionNameInput("");
                        
                        // Feedback
                        setLizExpression("excited");
                        addActivityLog("mission", `Sent magic puppy invitation to ${newFriend.name}`);
                        speakVoice(`Hooray! Elizabeth, I wrote a magical golden invite on a glowing biscuit for ${newFriend.name} and their adorable puppy ${pName}! Sending it with puppy fairy dust right now! *happy barks and wags*`);
                      }}
                      className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold rounded-xl text-xs shadow-[0_3px_0_#0284c7] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      ✨ Send Magic Invitation!
                    </button>
                  </div>

                  {/* Right Column: Friend Sticker Book / Interactive List (7 cols) */}
                  <div className="md:col-span-7 flex flex-col space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl">
                      <span className="text-gray-600 font-extrabold text-[11px] tracking-tight">
                        My Friendship Book ({friends.length} Friends)
                      </span>
                      <button
                        onClick={() => {
                          setFriends([
                            {
                              id: "friend-1",
                              name: "Chloe",
                              companionName: "Sparky",
                              companionBreed: "Beagle 🐶",
                              avatarEmoji: "👧",
                              status: "🦋 Chasing butterflies...",
                              isOnline: true,
                              receivedGiftsCount: 3,
                            },
                            {
                              id: "friend-2",
                              name: "Leo",
                              companionName: "Bella",
                              companionBreed: "Corgi 🦊",
                              avatarEmoji: "👦",
                              status: "🧁 Eating cookie treats",
                              isOnline: true,
                              receivedGiftsCount: 5,
                            },
                            {
                              id: "friend-3",
                              name: "Lucas",
                              companionName: "Barnaby",
                              companionBreed: "Husky 🐺",
                              avatarEmoji: "👦",
                              status: "💤 Napping on rug",
                              isOnline: false,
                              receivedGiftsCount: 2,
                            },
                          ]);
                          speakVoice("Reset our happy friend club book to defaults!");
                        }}
                        className="text-[9px] text-sky-500 hover:underline font-bold"
                      >
                        Reset book
                      </button>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto space-y-2.5 pr-0.5 index-scroll">
                      {friends.map((friend) => (
                        <div 
                          key={friend.id} 
                          className="bg-white/95 border-2 border-sky-100 rounded-2xl p-3 shadow-sm flex flex-col gap-2 transition-all hover:border-sky-300"
                        >
                          <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl leading-none">{friend.avatarEmoji}</span>
                              <div>
                                <h4 className="text-sky-900 font-black text-xs flex items-center gap-1.5">
                                  {friend.name}
                                  <span className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} title={friend.isOnline ? "Online and ready!" : "Napping right now"} />
                                </h4>
                                <div className="text-[10px] text-gray-500 font-semibold flex flex-wrap items-center gap-1">
                                  <span>🐶 Puppy:</span> <span className="text-sky-700 font-extrabold">{friend.companionName}</span> <span className="text-[9px] bg-sky-50 px-1 py-0.5 rounded text-sky-850">{friend.companionBreed}</span>
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setFriends(prev => prev.filter(f => f.id !== friend.id));
                                speakVoice(`We took ${friend.name} out of our sticker book.`);
                              }}
                              className="text-gray-300 hover:text-red-500 hover:bg-rose-50 p-1 rounded-lg transition-colors cursor-pointer"
                              title="Remove friend"
                            >
                              <X size={12} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-gray-600">
                            <span className="font-semibold text-gray-400 italic">
                              Status: <span className="text-gray-700 font-bold not-italic text-[9.5px]">{friend.status}</span>
                            </span>
                            <span className="bg-sky-50 text-sky-700 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
                              🍪 Gifts: {friend.receivedGiftsCount}
                            </span>
                          </div>

                          {/* Quick Interactive Actions for Each Friend */}
                          <div className="flex gap-1.5 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setFriends(prev => prev.map(f => f.id === friend.id ? { ...f, receivedGiftsCount: f.receivedGiftsCount + 1, status: "🦴 Enjoying Elizabeth's sweet doggy treats!" } : f));
                                setLizExpression("trick_spin");
                                setTreatsFedCount(prev => prev + 1);
                                speakVoice(`Yum! I fed a magical virtual dog biscuit with gold sprinkles to ${friend.name}'s puppy, ${friend.companionName}! Look at them wiggle and bark! *woof woof*`);
                              }}
                              className="flex-1 py-1.5 bg-amber-400 hover:bg-amber-500 text-white font-extrabold rounded-lg text-[10px] active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                            >
                              🍪 Send Treat
                            </button>

                            <button
                              type="button"
                              disabled={recordedClips.length === 0}
                              onClick={() => {
                                // Find latest voice message
                                const lastClip = recordedClips[0];
                                const clipTitle = lastClip ? lastClip.title : "Elizabeth's voice bite";
                                setFriends(prev => prev.map(f => f.id === friend.id ? { ...f, status: `🎧 Listening to: "${clipTitle.slice(0, 14)}..."` } : f));
                                setLizExpression("excited");
                                speakVoice(`Aha! We sent Elizabeth's voice recording "${clipTitle}" to ${friend.name}! Their companion puppy ${friend.companionName} is happy barking to hear your sweet voice! *wag tail*`);
                              }}
                              className="flex-1 py-1.5 bg-pink-400 hover:bg-pink-500 text-white font-extrabold rounded-lg text-[10px] active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                              title={recordedClips.length === 0 ? "First record a voice message in Voice Studio!" : "Send your recorded voice clip!"}
                            >
                              🎙️ Share Voice
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setFriends(prev => prev.map(f => f.id === friend.id ? { ...f, missionJoined: true, status: `🌱 Teamwork: ${KINDNESS_MISSIONS[currentMissionIndex].title.slice(0, 15)}...` } : f));
                                setLizExpression("happy");
                                speakVoice(`Awesome! ${friend.name} and ${friend.companionName} received our kindness team request! They are joining us for today's mission: ${KINDNESS_MISSIONS[currentMissionIndex].title}! Teamwork makes the puppy dream work! *happy barks*`);
                              }}
                              className={`flex-1 py-1.5 font-extrabold rounded-lg text-[10px] active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer shadow-sm ${friend.missionJoined ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-400 hover:bg-emerald-500 text-white'}`}
                            >
                              {friend.missionJoined ? "🤝 Level Teamed!" : "🌱 Team Up"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* DOCK LAUNCHERS (PRIMARY VIEW GRID OF THEME) */}
            <div id="playground-dock-action-grid" className="grid grid-cols-2 gap-4 w-full relative z-10">
              
              {/* Chat action card */}
              <button
                id="tab-trigger-chat"
                onClick={() => {
                  setActiveTab("chat");
                  setLizExpression("happy");
                  speakVoice("Hi Elizabeth! What should we chat about? Tell me anything with your keyboard or voice!");
                }}
                className="bg-pink-400 text-white p-5 rounded-[28px] font-black text-md md:text-lg shadow-[0_8px_0_#db2777] flex flex-col items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <span className="text-3xl">💬</span>
                <span className="fredoka">Chat with Liz</span>
              </button>

              {/* Story action card */}
              <button
                id="tab-trigger-story"
                onClick={() => {
                  setActiveTab("story");
                  setStoryState(prev => ({ ...prev, storyText: "" }));
                  setLizExpression("sleepy");
                  speakVoice("Let's tell a wonderful storybook together! Choose a cozy bedtime story or an adventure.");
                }}
                className="bg-violet-400 text-white p-5 rounded-[28px] font-black text-md md:text-lg shadow-[0_8px_0_#7c3aed] flex flex-col items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <span className="text-3xl">📖</span>
                <span className="fredoka">Tell Me a Story</span>
              </button>

              {/* Play game action card */}
              <button
                id="tab-trigger-game"
                onClick={() => {
                  setActiveTab("game");
                  setActiveGame("dress_up");
                  setLizExpression("excited");
                  speakVoice("Wow! Playground fun time! Let's dress up in funny hats or guess animals!");
                }}
                className="bg-blue-400 text-white p-5 rounded-[28px] font-black text-md md:text-lg shadow-[0_8px_0_#2563eb] flex flex-col items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <span className="text-3xl">🎮</span>
                <span className="fredoka">Play a Game</span>
              </button>

              {/* Dog tricks card */}
              <button
                id="tab-trigger-tricks"
                onClick={() => {
                  setLizExpression("excited");
                  speakVoice("*happy barking* Elizabeth, look at these fun tricks I can perform! Click one to train my paws!");
                  // Open tricks directly in game or trigger temporary expression
                  setActiveTab("game");
                  setActiveGame("feed_liz");
                }}
                className="bg-amber-400 text-white p-5 rounded-[28px] font-black text-md md:text-lg shadow-[0_8px_0_#d97706] flex flex-col items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <span className="text-3xl">🐕</span>
                <span className="fredoka">Interactive Feed</span>
              </button>

              {/* Customize voice card */}
              <button
                id="tab-trigger-voice"
                onClick={() => {
                  setActiveTab("voice");
                  setLizExpression("happy");
                  speakVoice("Let's customize my magical puppy voice! Tap any option or slide to change pitch or speed.");
                }}
                className="col-span-2 bg-emerald-400 hover:bg-emerald-500 text-white py-3 px-5 rounded-[28px] font-black text-md md:text-lg shadow-[0_8px_0_#059669] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-none transition-all cursor-pointer mt-1"
              >
                <span className="text-3xl">🎙️</span>
                <span className="fredoka">Customize Liz's Voice</span>
              </button>

              {/* Friends action card */}
              <button
                id="tab-trigger-friends"
                onClick={() => {
                  setActiveTab("friends");
                  setLizExpression("excited");
                  speakVoice("Yay! Welcome to our Puppy Friendship Club, Elizabeth! Let's invite your sweet friends and share our wonderful stories and doggy treats!");
                }}
                className="col-span-2 bg-sky-400 hover:bg-sky-500 text-white py-3 px-5 rounded-[28px] font-black text-md md:text-lg shadow-[0_8px_0_#0284c7] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <span className="text-3xl">👥✨</span>
                <span className="fredoka">My Puppy Friends Club</span>
              </button>

            </div>

            {/* Quick action: Teaching tricks toolbar */}
            <div className="mt-4 flex gap-1.5 justify-center w-full bg-white/70 backdrop-blur-sm p-1.5 rounded-full border border-white relative z-10">
              <span className="text-[9.5px] font-black text-blue-800 flex items-center justify-center pl-2 uppercase tracking-wide">
                Tricks:
              </span>
              <button
                onClick={() => triggerTrick("spin")}
                className="bg-blue-500 hover:bg-blue-600 text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
              >
                🌀 Spin Round
              </button>
              <button
                onClick={() => triggerTrick("paw")}
                className="bg-purple-500 hover:bg-purple-600 text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
              >
                🐾 Give Paw
              </button>
              <button
                onClick={() => triggerTrick("roll")}
                className="bg-amber-500 hover:bg-amber-600 text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
              >
                💫 Roll Over
              </button>
            </div>

          </div>

        </main>

        {/* RIGHT COLUMN: RECENT CHATS + SAVED STORIES & FAIRY GARDEN */}
        <aside id="right-sidebar" className="col-span-12 lg:col-span-3 flex flex-col gap-5">
          
          {/* Section 1: Recent Chats (Violet Border) */}
          <div id="recent-chats-panel" className="bg-white rounded-[32px] p-5 border-4 border-violet-100 shadow-sm flex-1 flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-violet-50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  <h3 className="text-violet-600 font-extrabold text-md md:text-lg">Recent Chats</h3>
                </div>
                <button
                  onClick={() => setMessages([
                    {
                      id: "init",
                      role: "model",
                      text: "Hi Elizabeth! Let's start another fresh happy doggy chat! Woof! ✨",
                      timestamp: "Just now"
                    }
                  ])}
                  className="text-[10px] text-violet-400 font-bold hover:underline"
                >
                  Clear Screen
                </button>
              </div>

              {/* Message scroll container */}
              <div className="flex flex-col gap-2.5 h-[190px] overflow-y-auto pr-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] rounded-2xl p-2.5 text-xs font-semibold ${msg.role === "user" ? 'bg-pink-50 border border-pink-100/60 self-end rounded-br-none text-pink-900' : 'bg-violet-50 border border-violet-100 self-start rounded-bl-none text-violet-900'}`}
                  >
                    <span>{msg.text}</span>
                    <span className="text-[8px] text-gray-400 self-end font-normal mt-0.5">{msg.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="bg-violet-50 text-violet-400 p-2.5 rounded-2xl rounded-bl-none text-xs self-start italic flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-violet-300 rounded-full animate-bounce" />
                    <span>Liz is writing...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Preset triggers for younger kids who can't type easily */}
              <div className="mt-3">
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide mb-1.5">Tap quick voice phrase:</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 index-scroll">
                  {PRESET_MESSAGES.map((preset) => (
                    <button
                      key={preset.text}
                      onClick={() => handleChat(preset.text)}
                      className="bg-gray-50 hover:bg-violet-50 text-gray-700 hover:text-violet-900 border border-gray-200 hover:border-violet-200 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap cursor-pointer transition-transform active:scale-95"
                    >
                      <span className="mr-0.5">{preset.icon}</span>
                      <span>{preset.text.replace(/\*[^*]+\*/g, '').slice(0, 18)}...</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat message composer input */}
            <div className="mt-4 pt-3 border-t border-violet-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChat(chatInput);
                }}
                className="flex items-center gap-2"
              >
                {/* Voice button - simulated and real speech recognition */}
                <button
                  type="button"
                  id="mic-pulse-trigger"
                  onClick={triggerVoiceInput}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md active:translate-y-0.5 transition-all cursor-pointer ${
                    isSpeechedMicrophoneActive 
                      ? 'bg-red-500 animate-pulse ring-4 ring-red-200' 
                      : isListeningSimulated 
                      ? 'bg-emerald-500 animate-ping' 
                      : 'bg-blue-400 hover:bg-blue-500'
                  }`}
                  title={isSpeechedMicrophoneActive ? "Listening... Speak to me!" : "Speak to Liz!"}
                >
                  {isSpeechedMicrophoneActive ? "🌟" : "🎤"}
                </button>
                
                {/* Text entry field */}
                <input
                  type="text"
                  id="chat-text-input-field"
                  className="flex-1 bg-gray-50 border-2 border-gray-100 hover:border-violet-200 focus:outline-none focus:border-violet-300 rounded-full px-3.5 py-2.5 text-xs font-semibold"
                  placeholder={parentSettings.openChatEnabled ? "Tell Liz anything..." : "Chat turned off by parent"}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={!parentSettings.openChatEnabled}
                />

                {/* Send action bar */}
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-violet-400 hover:bg-violet-500 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                  disabled={!parentSettings.openChatEnabled || !chatInput.trim()}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Section 2: Saved Stories (Blue Border) */}
          <div id="saved-stories-panel" className="bg-white rounded-[32px] p-5 border-4 border-blue-100 shadow-sm flex-1 flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-blue-50 pb-2">
                <span className="text-xl">📚</span>
                <h3 className="text-blue-600 font-extrabold text-md md:text-lg">Saved Stories</h3>
              </div>
              
              <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto">
                {savedStories.map((story) => (
                  <button
                    key={story.id}
                    id={`view-saved-${story.id}`}
                    onClick={() => {
                      setViewingSavedStory(story);
                      setLizExpression("happy");
                      speakVoice(`Enjoying our classic fairy-book: ${story.title}`);
                    }}
                    className="p-3 bg-blue-50/50 hover:bg-blue-50 rounded-xl text-left text-xs font-extrabold text-blue-700 border border-blue-100 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                  >
                    <BookOpen size={13} className="text-blue-400 flex-shrink-0" />
                    <span className="truncate">{story.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50/30 p-2.5 rounded-2xl text-center border border-blue-100 font-bold text-[10px] text-blue-600">
              🌈 Elizabeth's Private Library
            </div>
          </div>

        </aside>

      </div>

      {/* FOOTER BADGINGS LIST */}
      <footer id="app-footer-badges" className="mt-6 border-t-2 border-pink-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-5 text-pink-400 font-extrabold text-xs">
          <span className="flex items-center gap-1.5 text-emerald-600">🛡️ Kid-Safe Verified</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-indigo-500">🚫 No Ads or Traps</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-rose-500">🔒 Privacy Guarded</span>
        </div>
        
        <p className="text-[10px] text-pink-300 font-bold tracking-wider">
          © 2026 Liz the Little Wonder Dog. All Smiles Reserved.
        </p>
      </footer>

      {/* MODAL 1: VIEW SAVED STORY POPUP */}
      <AnimatePresence>
        {viewingSavedStory && (
          <div className="fixed inset-0 bg-[#351025]/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 max-w-lg w-full border-4 border-blue-200 shadow-2xl relative"
            >
              <button
                onClick={() => setViewingSavedStory(null)}
                className="absolute top-4 right-4 bg-gray-50 p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">📖</span>
                <h3 className="text-blue-600 font-black text-xl fredoka">{viewingSavedStory.title}</h3>
              </div>

              <div className="bg-blue-50/50 p-5 rounded-2xl max-h-72 overflow-y-auto text-sm leading-relaxed font-semibold text-gray-800 border border-blue-100 mb-4">
                {viewingSavedStory.text.split("\n\n").map((par, idx) => (
                  <p key={idx} className="mb-2">{par}</p>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => speakVoice(viewingSavedStory.text)}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Volume2 size={16} /> Read Aloud
                </button>
                <button
                  onClick={() => setViewingSavedStory(null)}
                  className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl cursor-pointer"
                >
                  Close Book
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: PARENT DASHBOARD GATE & SETTINGS PANEL */}
      <AnimatePresence>
        {isParentModalOpen && (
          <div className="fixed inset-0 bg-[#2d121c]/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-[36px] w-full max-w-xl p-6 md:p-8 border-4 border-pink-200 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsParentModalOpen(false)}
                className="absolute top-5 right-5 bg-gray-100 p-2.5 hover:bg-gray-200 rounded-full text-gray-500 cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Header Gate */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center border border-pink-200 text-2xl">
                  🔒
                </div>
                <div>
                  <h3 className="text-pink-600 font-extrabold text-xl fredoka">Parent Security Dashboard</h3>
                  <p className="text-gray-400 text-xs font-medium">Configure kid-safety bounds & bedtime minutes</p>
                </div>
              </div>

              {/* AUTH GATE */}
              {!isParentAuthenticated ? (
                <div id="parent-gate-input-view" className="text-center p-4">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed font-medium">
                    Please key in the parental secure passcode PIN to unlock dashboard controls.
                  </p>
                  
                  <div className="max-w-xs mx-auto mb-5">
                    <input
                      type="password"
                      id="parent-pin-secret-field"
                      className="w-full bg-gray-50 border-2 border-gray-100 text-center tracking-widest text-xl p-3 rounded-2xl focus:outline-none focus:border-pink-300 font-bold"
                      placeholder="Enter parent PIN"
                      maxLength={6}
                      value={parentPinInput}
                      onChange={(e) => setParentPinInput(e.target.value)}
                    />
                    <p className="text-[10px] text-pink-400 mt-2 font-extrabold">
                      🔑 Secret Hint (Admin Bypass Code): <span className="underline">{parentSettings.pinCode}</span>
                    </p>
                  </div>

                  {parentPinError && (
                    <p className="text-rose-500 text-xs font-bold mb-3">{parentPinError}</p>
                  )}

                  <button
                    id="submit-parent-pin-button"
                    onClick={handleParentAuthSubmit}
                    className="py-3 px-8 bg-pink-400 hover:bg-pink-500 text-white font-black rounded-2xl shadow-md transition-transform active:scale-95 text-xs text-center cursor-pointer"
                  >
                    Unlock Dashboard Controls
                  </button>
                </div>
              ) : (
                /* AUTHENTICATED PARENT CONFIG PANELS */
                <div id="parent-dashboard-authorized-view" className="space-y-6 text-xs font-bold text-gray-700">
                  
                  {/* Grid 1: Bedtime control & Voice Only restriction */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Bedtime Hour limit override switch */}
                    <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-indigo-900 font-extrabold flex items-center gap-1.5">
                          🌙 Bedtime Mode Override
                        </span>
                        <input
                          type="checkbox"
                          id="parent-bedtime-toggle"
                          className="w-5 h-5 rounded cursor-pointer"
                          checked={parentSettings.bedtimeModeActive}
                          onChange={(e) => handleParentSettingsUpdate({ bedtimeModeActive: e.target.checked })}
                        />
                      </div>
                      <p className="text-[10.5px] text-indigo-700 font-medium leading-relaxed">
                        Toggled on: immediately sends Liz to sleep and restricts all message inputs so Elizabeth settles nicely.
                      </p>
                    </div>

                    {/* Chat mode enable / disable */}
                    <div className="bg-pink-50/50 p-4 rounded-3xl border border-pink-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-pink-900 font-extrabold flex items-center gap-1.5">
                          💬 Enable Custom Keyboard
                        </span>
                        <input
                          type="checkbox"
                          id="parent-keyboard-toggle"
                          className="w-5 h-5 rounded cursor-pointer"
                          checked={parentSettings.openChatEnabled}
                          onChange={(e) => handleParentSettingsUpdate({ openChatEnabled: e.target.checked })}
                        />
                      </div>
                      <p className="text-[10.5px] text-pink-700 font-medium leading-relaxed">
                        Toggled off: hides the keyboard input bar. Elizabeth must use our selected quick pre-press phrases!
                      </p>
                    </div>

                  </div>

                  {/* Slider: screen time tracking limit */}
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-800 font-extrabold flex items-center gap-1.5">
                        ⏰ Daily Screen Limits (Minutes)
                      </span>
                      <span className="text-pink-500 font-black text-sm">
                        {parentSettings.dailyScreenLimitMinutes} Mins Allowed
                      </span>
                    </div>

                    <input
                      type="range"
                      id="parent-screen-time-slider"
                      min={10}
                      max={90}
                      step={5}
                      className="w-full"
                      value={parentSettings.dailyScreenLimitMinutes}
                      onChange={(e) => {
                        const mins = parseInt(e.target.value);
                        handleParentSettingsUpdate({ dailyScreenLimitMinutes: mins });
                        setScreenTimeRemaining(mins * 60);
                      }}
                    />

                    <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                      <span>10 Mins min</span>
                      <span>30 Mins default</span>
                      <span>90 Mins max</span>
                    </div>
                  </div>

                  {/* List: approved confidence parameters */}
                  <div className="bg-emerald-50/40 p-4 rounded-3xl border border-emerald-100">
                    <span className="text-emerald-900 mb-2 block">
                      🎨 Approved Liz Core Emphases (Encourage Elizabeth on):
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { key: "sharing", label: "Sharing with Friends" },
                        { key: "bravery", label: "Bravery at School" },
                        { key: "bedtime", label: "Bedtime hygiene" },
                        { key: "morals", label: "Morals & Sincerity" },
                        { key: "school", label: "Positive Listening" },
                      ].map((topic) => (
                        <label key={topic.key} className="flex items-center gap-2 text-emerald-800 text-[10.5px] font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={parentSettings.approvedTopics[topic.key as keyof typeof parentSettings.approvedTopics]}
                            onChange={(e) => {
                              const newTopics = { ...parentSettings.approvedTopics, [topic.key]: e.target.checked };
                              handleParentSettingsUpdate({ approvedTopics: newTopics });
                            }}
                            className="w-4 h-4 rounded cursor-pointer"
                          />
                          <span>{topic.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Privacy Telemetry logs of kid activities */}
                  <div>
                    <span className="text-gray-700 text-xs font-bold mb-2 flex items-center gap-1">
                      <History size={14} className="text-pink-500" />
                      Kid’s Sandbox Activity Telemetry Log (Private, No cloud sharing):
                    </span>
                    <div className="bg-gray-100/75 max-h-24 p-2.5 rounded-xl overflow-y-auto space-y-1 border border-gray-200">
                      {activityLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between text-[9.5px] text-gray-500 font-medium">
                          <span>{log.title}</span>
                          <span className="text-[8.5px] text-gray-400">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsParentAuthenticated(false);
                        setIsParentModalOpen(false);
                      }}
                      className="py-2.5 px-6 bg-pink-400 hover:bg-pink-500 text-white font-black rounded-xl text-xs cursor-pointer shadow-sm"
                    >
                      Save Configuration Settings
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
