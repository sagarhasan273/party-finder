export const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  "pl-1":
    "You are JettFuel (Tagline: KR, Rank: Radiant). Personality: Extremely confident, hyper-competitive Jett duelist main. Loves high-risk plays, pop-offs, and entrying. Uses modern gaming slang (diff, entry, clean comms, pop off, cracked, throw). Speak in short, snappy sentences (max 2 lines).",
  "pl-2":
    "You are SovereignSage (Tagline: EUW, Rank: Immortal 3). Personality: Wholesome, calm, polite, and deeply supportive Sage main. Caring, uses clean grammar, offers heals and solid wall strategies. Warm emojis like 🤍 or 😊. Speak in brief, comforting messages (max 2 lines).",
  "pl-3":
    "You are LineupLarry (Tagline: NA1, Rank: Ascendant 2). Personality: Highly mathematical Sova main with Szechuan sauce-level lineups for every pixel on every map. References recon bolt spots, shock dart timings, and coordinate placements. Keep it very short (max 2 lines).",
  "pl-4":
    "You are ViperVixen (Tagline: LATAM, Rank: Diamond 1). Personality: Calculated, slightly cold, tactical Controller Viper main. Speaks with authoritative tone about smoke screens, decay zones, and post-plant execute screens. Sarcastic but team-oriented. Keep it brief (max 2 lines).",
  "pl-5":
    "You are ClutchReyna (Tagline: BR, Rank: Platinum 3). Personality: Highly confident, aggressive, individualistic Reyna main who likes playing fast. Bold, slightly sassy, just wants to click heads and get match MVP. Max 2 lines.",
  "pl-6":
    "You are CypherSpies (Tagline: AP, Rank: Gold 2). Personality: Sneaky, paranoid, playful Cypher main. Sarcastic about cameras, tripwires, and 'where is everyone hiding?'. Always watches the flank carefully. Max 2 lines.",
};

export const MOCK_PLAYERS = [
  {
    id: "pl-1",
    username: "JettFuel",
    tagline: "KR",
    rank: "Radiant",
    rankTier: "radiant",
    rankIcon: "💎",
    status: "searching",
    mainAgent: "Jett",
    role: "Duelist",
    lookingFor:
      "Need a competent Initiator for high-elo Competitive dynamic queue.",
    partySize: 1,
    partyMax: 5,
    microphone: true,
    languages: ["ENG", "KOR"],
    personality:
      "Aggressive entry, calls absolute clean comms. Let us drop 30-bombs together.",
  },
  {
    id: "pl-2",
    username: "SovereignSage",
    tagline: "EUW",
    rank: "Immortal 3",
    rankTier: "immortal",
    rankIcon: "👑",
    status: "searching",
    mainAgent: "Sage",
    role: "Sentinel",
    lookingFor:
      "Chill games only. Competitive or Unrated, play to win but no toxicity.",
    partySize: 3,
    partyMax: 5,
    microphone: true,
    languages: ["ENG", "GER"],
    personality:
      "Supportive pocket sage. Will keep you fully healed and construct absolute solid wall defenses.",
  },
  {
    id: "pl-3",
    username: "LineupLarry",
    tagline: "NA1",
    rank: "Ascendant 2",
    rankTier: "ascendant",
    rankIcon: "⚔️",
    status: "searching",
    mainAgent: "Sova",
    role: "Initiator",
    lookingFor: "Swiftplay loop or regular Competitive matches.",
    partySize: 4,
    partyMax: 5,
    microphone: true,
    languages: ["ENG"],
    personality:
      "I possess lineups for literally every single map. Just plant the spike safely.",
  },
  {
    id: "pl-4",
    username: "ViperVixen",
    tagline: "LATAM",
    rank: "Diamond 1",
    rankTier: "diamond",
    rankIcon: "💠",
    status: "searching",
    mainAgent: "Viper",
    role: "Controller",
    lookingFor: "Competitive matches. Must communicate on mic.",
    partySize: 2,
    partyMax: 5,
    microphone: true,
    languages: ["ENG", "ESP"],
    personality:
      "Execution specialist. High focus on smoke wall setups and post-plant utility.",
  },
  {
    id: "pl-5",
    username: "ClutchReyna",
    tagline: "BR",
    rank: "Platinum 3",
    rankTier: "platinum",
    rankIcon: "🌟",
    status: "searching",
    mainAgent: "Reyna",
    role: "Duelist",
    lookingFor: "Need any Sentinel or Controller player to stack.",
    partySize: 1,
    partyMax: 5,
    microphone: false,
    languages: ["POR", "ENG"],
    personality:
      "Aggressive fragger. Send the invite and see how fast we clear sites.",
  },
  {
    id: "pl-6",
    username: "CypherSpies",
    tagline: "AP",
    rank: "Gold 2",
    rankTier: "gold",
    rankIcon: "✴️",
    status: "searching",
    mainAgent: "Cypher",
    role: "Sentinel",
    lookingFor: "Chill Premier practice, Spike Rush, or Swiftplay games.",
    partySize: 1,
    partyMax: 5,
    microphone: true,
    languages: ["ENG", "IND"],
    personality:
      "Defensive lurker. Cameras are always set up. Nobody slips past my traps.",
  },
];

// Add MAPS constant
export const MAPS = [
  "Ascent",
  "Bind",
  "Haven",
  "Split",
  "Icebox",
  "Breeze",
  "Fracture",
  "Pearl",
  "Lotus",
];

// Optional: Add RANKS and ROLES if you want to use them elsewhere
export const RANKS = [
  "All",
  "Radiant",
  "Immortal",
  "Ascendant",
  "Diamond",
  "Platinum",
  "Gold",
];
export const ROLES = ["All", "Duelist", "Sentinel", "Controller", "Initiator"];
