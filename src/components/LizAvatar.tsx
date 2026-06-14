/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { LizDressUp } from "../types";

interface LizAvatarProps {
  expression?: "happy" | "comfort" | "excited" | "sleepy" | "breathing" | "eating" | "trick_paw" | "trick_spin" | "trick_roll";
  dressUp?: LizDressUp;
  className?: string;
  size?: number;
}

export default function LizAvatar({
  expression = "happy",
  dressUp = { hat: "none", collar: "pink", accessory: "none" },
  className = "",
  size = 200,
}: LizAvatarProps) {
  
  // Decide core animations based on trick state
  let animateStates = {};
  let transitionConfig = {};

  if (expression === "trick_spin") {
    animateStates = { rotate: 360 };
    transitionConfig = { duration: 1, ease: "easeInOut" };
  } else if (expression === "trick_roll") {
    animateStates = { rotate: [0, 90, 180, 270, 360, 0], x: [0, -30, -5, 10, 30, 0], y: [0, 15, 0, 15, 0, 0] };
    transitionConfig = { duration: 1.5, ease: "easeInOut" };
  } else if (expression === "trick_paw") {
    animateStates = { y: [0, -15, 0] };
    transitionConfig = { duration: 0.6, repeat: 1, ease: "easeOut" };
  } else if (expression === "breathing") {
    // Gentle expansion and contraction
    animateStates = { scale: [0.95, 1.05, 0.95] };
    transitionConfig = { duration: 4, repeat: Infinity, ease: "easeInOut" };
  } else if (expression === "eating") {
    // Cheerful vibration
    animateStates = { y: [0, -4, 4, -4, 0], scale: [1, 1.02, 0.98, 1] };
    transitionConfig = { duration: 0.4, repeat: 3, ease: "linear" };
  } else {
    // Idle gentle bounce
    animateStates = { y: [0, -5, 0] };
    transitionConfig = { duration: 3, repeat: Infinity, ease: "easeInOut" };
  }

  // Eye configurations based on expressions
  const renderEyes = () => {
    switch (expression) {
      case "sleepy":
        // Closed, curving downward (sleepy)
        return (
          <>
            <path d="M45 48 C 45 52, 55 52, 55 48" stroke="#5C4D50" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M75 48 C 75 52, 85 52, 85 48" stroke="#5C4D50" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );
      case "breathing":
        // Quietly closed, curving peaceful smiley eyes
        return (
          <>
            <path d="M43 51 C 48 47, 53 47, 58 51" stroke="#5C4D50" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M72 51 C 77 47, 82 47, 87 51" stroke="#5C4D50" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "comfort":
        // Downward soft sympathetic curved lines
        return (
          <>
            <path d="M44 47 C 49 50, 54 50, 56 47" stroke="#5C4D50" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M74 47 C 79 50, 84 50, 86 47" stroke="#5C4D50" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );
      case "excited":
        // Animated twinkling star eyes or smiling eye arcs upward
        return (
          <>
            {/* Twinkle left */}
            <path d="M50 40 L52 46 L58 48 L52 50 L50 56 L48 50 L42 48 L48 46 Z" fill="#FBBF24" />
            {/* Twinkle right */}
            <path d="M80 40 L82 46 L88 48 L82 50 L80 56 L78 50 L72 48 L78 46 Z" fill="#FBBF24" />
          </>
        );
      default:
        // Huge circular gleaming happy puppy eyes (Default & PAW & SPIN)
        return (
          <>
            <g>
              <circle cx="49" cy="48" r="8.5" fill="#2E2325" />
              <circle cx="47" cy="45" r="3" fill="#FFFFFF" />
              <circle cx="51" cy="49.5" r="1.2" fill="#FFFFFF" />
            </g>
            <g>
              <circle cx="81" cy="48" r="8.5" fill="#2E2325" />
              <circle cx="79" cy="45" r="3" fill="#FFFFFF" />
              <circle cx="83" cy="49.5" r="1.2" fill="#FFFFFF" />
            </g>
          </>
        );
    }
  };

  // Mouth configuration
  const renderMouthAndTongue = () => {
    switch (expression) {
      case "sleepy":
        return <circle cx="65" cy="59" r="3" fill="#5C4D50" />; // cute little sleepy round open mouth
      case "breathing":
        return <path d="M61 58 Q65 61 69 58" stroke="#5C4D50" strokeWidth="2.5" fill="none" strokeLinecap="round" />; // peaceful thin smile
      case "eating":
        return (
          <g>
            <path d="M59 57 C59 63, 71 63, 71 57 Z" fill="#931A25" /> {/* chewing open red mouth */}
            <circle cx="65" cy="56" r="3" fill="#FFC0CB" />
          </g>
        );
      case "excited":
        return (
          <g>
            <path d="M58 57 C 58 67, 72 67, 72 57 Z" fill="#D32F2F" /> {/* happy big open laugh */}
            <path d="M61 61 C 63 65, 67 65, 69 61" fill="#FF8A8A" /> {/* tongue */}
          </g>
        );
      default:
        // Smiling mouth with cute mini tongue popping out slightly
        return (
          <g>
            <path d="M59 57 C61 60, 65 60, 65 57 C65 60, 69 60, 71 57" stroke="#2E2325" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M63 58.5 C63 62, 67 62, 67 58.5 Z" fill="#FF4D79" />
          </g>
        );
    }
  };

  // Ear animations (excited ears perk up, tired ears droop further)
  const renderEars = () => {
    const liftY = expression === "excited" ? -6 : expression === "sleepy" ? 6 : 0;
    return (
      <g>
        {/* Left Ear */}
        <motion.path
          d="M32 30 C 15 32, 10 55, 23 68 C 28 73, 35 62, 34 50 Z"
          fill="#FFFFFF"
          stroke="#E5E0EB"
          strokeWidth="1.5"
          animate={{ y: liftY }}
          transition={{ duration: 0.5 }}
        />
        <motion.path /* Ear inner soft pink */
          d="M26 38 C 18 42, 15 54, 22 62 C 25 65, 28 58, 28 48 Z"
          fill="#FFEBF0"
          animate={{ y: liftY }}
          transition={{ duration: 0.5 }}
        />

        {/* Right Ear */}
        <motion.path
          d="M98 30 C 115 32, 120 55, 107 68 C 102 73, 95 62, 96 50 Z"
          fill="#FFFFFF"
          stroke="#E5E0EB"
          strokeWidth="1.5"
          animate={{ y: liftY }}
          transition={{ duration: 0.5 }}
        />
        <motion.path /* Ear inner soft pink */
          d="M104 38 C 112 42, 115 54, 108 62 C 105 65, 102 58, 102 48 Z"
          fill="#FFEBF0"
          animate={{ y: liftY }}
          transition={{ duration: 0.5 }}
        />
      </g>
    );
  };

  return (
    <div id="liz-character-container" className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      
      {/* Speaking cloud bubbles */}
      {expression === "trick_paw" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute -top-12 -right-16 bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-md border border-pink-200 fredoka"
        >
          Paw, please! 🐾
        </motion.div>
      )}

      {expression === "eating" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: [1, 1, 0], scale: [1, 1.1, 0.9], y: -30 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-12 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-md border border-amber-200 fredoka"
        >
          *munch munch* Yum! 🍓🍰
        </motion.div>
      )}

      <motion.div
        animate={animateStates}
        transition={transitionConfig}
        style={{ width: size, height: size }}
        className="relative"
      >
        <svg
          viewBox="0 0 130 130"
          className="w-full h-full"
          id="liz-vector-svg"
        >
          {/* Subtle Shadow under body */}
          <ellipse cx="65" cy="118" rx="35" ry="6.5" fill="#E2DAEB" opacity="0.65" />

          {/* BACKGROUND SUPERHERO CAPE (if selected) */}
          {dressUp.collar === "cape" && (
            <motion.path
              d="M38 98 C30 100, 15 118, 30 118 L100 118 C115 118, 100 100, 92 98 Z"
              fill="#3B82F6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            />
          )}

          {/* CUTE LITTE TAIL */}
          <motion.g
            animate={{ rotate: expression === "sleepy" ? [-2, 2, -2] : [-15, 15, -15] }}
            transition={{ duration: expression === "sleepy" ? 2 : 0.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "35px 105px" }}
          >
            <path d="M 32 104 C 18 104, 12 92, 14 85 C 16 83, 20 86, 22 92 C 24 95, 30 100, 34 100 Z" fill="#FFFFFF" stroke="#E5E0EB" strokeWidth="1" />
            <circle cx="13" cy="84" r="3.5" fill="#FFFFFF" />
          </motion.g>

          {/* LIZ BODY */}
          <rect x="42" y="82" width="46" height="32" rx="18" fill="#FFFFFF" stroke="#E5E0EB" strokeWidth="1.5" />
          {/* Fluffy chest fur */}
          <path d="M47 84 Q52 90, 65 89 Q78 90, 83 84 Q78 100, 65 99 Q52 100, 47 84" fill="#FBFBFB" />

          {/* Back Paws */}
          <ellipse cx="48" cy="115" rx="8" ry="4" fill="#FFFFFF" stroke="#E2DAEB" strokeWidth="1" />
          <circle cx="44" cy="114" r="1.2" fill="#E5E0EB" />
          <circle cx="48" cy="113" r="1.2" fill="#E5E0EB" />
          <circle cx="52" cy="114" r="1.2" fill="#E5E0EB" />

          <ellipse cx="82" cy="115" rx="8" ry="4" fill="#FFFFFF" stroke="#E2DAEB" strokeWidth="1" />
          <circle cx="78" cy="114" r="1.2" fill="#E5E0EB" />
          <circle cx="82" cy="113" r="1.2" fill="#E5E0EB" />
          <circle cx="86" cy="114" r="1.2" fill="#E5E0EB" />

          {/* Front Paws */}
          <g>
            <motion.ellipse
              cx="58"
              cy="114"
              rx="6.5"
              ry="5.5"
              fill="#FFFFFF"
              stroke="#E2DAEB"
              strokeWidth="1"
              animate={expression === "trick_paw" ? { y: -8, rotate: -15 } : {}}
            />
            <motion.ellipse
              cx="72"
              cy="114"
              rx="6.5"
              ry="5.5"
              fill="#FFFFFF"
              stroke="#E2DAEB"
              strokeWidth="1"
              animate={expression === "trick_paw" ? { y: -2, rotate: 10 } : {}}
            />
          </g>

          {/* LIZ EARS */}
          {renderEars()}

          {/* LIZ HEAD */}
          <circle cx="65" cy="56" r="33" fill="#FFFFFF" stroke="#E5E0EB" strokeWidth="1.5" />
          
          {/* Cute side fluffy-cheek bumps */}
          <path d="M33 62 Q28 65, 34 71" fill="#FFFFFF" stroke="#E5E0EB" strokeWidth="1.5" />
          <path d="M97 62 Q102 65, 96 71" fill="#FFFFFF" stroke="#E5E0EB" strokeWidth="1.5" />

          {/* ROSY BLUSH CHEEKS */}
          <circle cx="41" cy="58" r="5" fill="#FFA3B1" opacity="0.45" />
          <circle cx="89" cy="58" r="5" fill="#FFA3B1" opacity="0.45" />

          {/* BOOP NOSE */}
          <ellipse cx="65" cy="53" rx="4.5" ry="3" fill="#3D3035" />
          {/* Highlight on nose */}
          <ellipse cx="64" cy="52" rx="1.5" ry="0.8" fill="#FFFFFF" />

          {/* EYE AND MOUTH DYNAMICS */}
          {renderEyes()}
          {renderMouthAndTongue()}

          {/* DRESS UP: retro glasses */}
          {dressUp.accessory === "glasses" && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              {/* Pink circular cool round glasses */}
              <circle cx="49" cy="48" r="11" stroke="#EC4899" strokeWidth="2.5" fill="none" />
              <circle cx="81" cy="48" r="11" stroke="#EC4899" strokeWidth="2.5" fill="none" />
              <line x1="60" y1="48" x2="70" y2="48" stroke="#EC4899" strokeWidth="2.5" />
              <path d="M38 48 C36 43, 30 43, 30 43" stroke="#EC4899" strokeWidth="2" fill="none" />
              <path d="M92 48 C94 43, 100 43, 100 43" stroke="#EC4899" strokeWidth="2" fill="none" />
            </motion.g>
          )}

          {/* DRESS UP: sheriff badge accessory */}
          {dressUp.accessory === "badge" && (
            <motion.g
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="origin-center"
            >
              {/* Golden sheriff badge on her side */}
              <polygon points="65,95 69,103 77,103 71,108 74,116 65,111 56,116 59,108 53,103 61,103" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="65" cy="106" r="2" fill="#D97706" />
            </motion.g>
          )}

          {/* DRESS UP: COLLAR (Pink Bow, Golden Medal, Star Collar) */}
          <g>
            {/* Base collar ribbon */}
            <path d="M47 81 C47 81, 65 88, 83 81 C83 81, 75 88, 65 88 C55 88, 47 81, 47 81" fill="#FF5E89" />

            {dressUp.collar === "pink" && (
              /* Pink Bow in center */
              <g>
                <circle cx="65" cy="85" r="4.5" fill="#FF2E63" />
                <polygon points="65,85 57,80 57,90" fill="#FF5E89" stroke="#FF2E63" strokeWidth="1" />
                <polygon points="65,85 73,80 73,90" fill="#FF5E89" stroke="#FF2E63" strokeWidth="1" />
                {/* little hanging bell */}
                <circle cx="65" cy="91" r="3" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5" />
              </g>
            )}

            {dressUp.collar === "gold" && (
              /* Big golden circular key/medal */
              <g>
                <circle cx="65" cy="85" r="4.5" fill="#D97706" />
                <circle cx="65" cy="91" r="5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                <text x="63" y="94.5" fontSize="6.5" fill="#92400E" fontWeight="bold">L</text>
              </g>
            )}

            {dressUp.collar === "star" && (
              /* Glowing Star Pendant */
              <g>
                <circle cx="65" cy="85" r="4" fill="#6366F1" />
                {/* Yellow star pendant hanging down */}
                <polygon points="65,88 67,93 72,93 68,96 70,101 65,98 60,101 62,96 58,93 63,93" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.8" />
              </g>
            )}
          </g>

          {/* DRESS UP: HATS */}
          {dressUp.hat === "crown" && (
            <motion.g
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              {/* Shiny Gold Queen Crown */}
              <polygon points="45,28 35,12 52,22 65,5 78,22 95,12 85,28" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
              <rect x="44" y="27" width="42" height="4" rx="2" fill="#D97706" />
              {/* Crown jewels (colorful circles) */}
              <circle cx="35" cy="12" r="2.5" fill="#EF4444" />
              <circle cx="65" cy="5" r="2.5" fill="#3B82F6" />
              <circle cx="95" cy="12" r="2.5" fill="#10B981" />
              <circle cx="52" cy="27" r="1.5" fill="#EF4444" />
              <circle cx="65" cy="27" r="1.5" fill="#EC4899" />
              <circle cx="78" cy="27" r="1.5" fill="#3B82F6" />
            </motion.g>
          )}

          {dressUp.hat === "wizard" && (
            <motion.g
              initial={{ y: -20, opacity: 0, rotate: -15 }}
              animate={{ y: 0, opacity: 1, rotate: -5 }}
              transition={{ type: "spring" }}
              style={{ transformOrigin: "65px 25px" }}
            >
              {/* Wizard's blue conical hat with stars */}
              <polygon points="35,26 65,-8 95,26" fill="#4F46E5" stroke="#3730A3" strokeWidth="1" />
              <ellipse cx="65" cy="26" rx="33" ry="5.5" fill="#3730A3" />
              {/* star decoration */}
              <polygon points="65,5 67,9 71,9 68,11 69,15 65,13 61,15 62,11 59,9 63,9" fill="#FBBF24" />
              <polygon points="50,15 51,18 54,18 52,19 53,22 50,20 47,22 48,19 46,18 49,18" fill="#FBBF24" scale="0.6" />
              <polygon points="76,14 77,16 79,16 77,17 78,19 76,18 74,19 75,17 73,16 75,16" fill="#FBBF24" scale="0.6" />
            </motion.g>
          )}

          {dressUp.hat === "bow" && (
            <motion.g
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring" }}
            >
              {/* Large gorgeous red bow on her head */}
              <circle cx="65" cy="24" r="5.5" fill="#EF4444" />
              <polygon points="65,24 53,16 53,30" fill="#F87171" stroke="#EF4444" strokeWidth="1.5" />
              <polygon points="65,24 77,16 77,30" fill="#F87171" stroke="#EF4444" strokeWidth="1.5" />
              {/* polka dots on bow */}
              <circle cx="56" cy="20" r="1.5" fill="#FFFFFF" />
              <circle cx="58" cy="26" r="1.5" fill="#FFFFFF" />
              <circle cx="72" cy="20" r="1.5" fill="#FFFFFF" />
              <circle cx="74" cy="26" r="1.5" fill="#FFFFFF" />
            </motion.g>
          )}

          {dressUp.hat === "detective" && (
            <motion.g
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              {/* Brown Sherlock detective deerstalker cap */}
              <path d="M35 24 C35 12, 95 12, 95 24 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
              <ellipse cx="65" cy="24" rx="31" ry="3.5" fill="#78350F" />
              {/* Visor / Brim front */}
              <path d="M85 24 C95 24, 105 29, 101 32 C95 34, 85 25, 85 24 Z" fill="#78350F" />
              {/* Visor / Brim back */}
              <path d="M45 24 C35 24, 25 29, 29 32 C35 34, 45 25, 45 24 Z" fill="#78350F" />
              {/* Cute detective check ribbon */}
              <rect x="37" y="21" width="56" height="3" fill="#FBBF24" />
            </motion.g>
          )}
        </svg>

        {/* Quiet floating ZZZ tags for sleepy mode */}
        {expression === "sleepy" && (
          <motion.div
            className="absolute top-4 right-2 text-rose-400 font-bold select-none text-sm font-mono flex flex-col gap-0.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [15, -10, -25, -35], x: [0, 5, -5, 5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>z</span>
            <span className="text-base pl-2">Z</span>
            <span className="text-xl pl-4">Z</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
