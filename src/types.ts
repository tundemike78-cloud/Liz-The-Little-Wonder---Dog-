/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export type StoryType = "bedtime" | "adventure" | "princess" | "moral" | "animal" | "confidence";

export interface StoryState {
  type: StoryType;
  customPrompt: string;
  storyText: string;
  isLoading: boolean;
  isCustomizing: boolean;
  storyBuilderSelectedKeywords: string[];
}

export type MoodType = "happy" | "sad" | "scared" | "angry" | "excited" | "tired";

export interface KindnessMission {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface ParentSettings {
  bedtimeModeActive: boolean;
  pinCode: string;
  approvedTopics: {
    sharing: boolean;
    bravery: boolean;
    bedtime: boolean;
    morals: boolean;
    school: boolean;
  };
  openChatEnabled: boolean;
  dailyScreenLimitMinutes: number; // e.g. 15, 30, 45
  sleepTime: string; // e.g., "20:00"
}

export interface ActivityLog {
  id: string;
  type: "chat" | "story" | "game" | "mission" | "mood";
  title: string;
  timestamp: string;
}

export interface LizDressUp {
  hat: "none" | "crown" | "wizard" | "bow" | "detective";
  collar: "pink" | "gold" | "star" | "cape";
  accessory: "none" | "glasses" | "badge" | "bubble";
}

export type MiniGameType = null | "guess_animal" | "riddle" | "dress_up" | "feed_liz" | "trick_training" | "color_match" | "kindness_cards";

export interface AnimalRiddle {
  hints: string[];
  answer: string;
  options: string[];
}

export interface Friend {
  id: string;
  name: string;
  companionName: string;
  companionBreed: string;
  avatarEmoji: string;
  status: string;
  isOnline: boolean;
  receivedGiftsCount: number;
  missionJoined?: boolean;
}
