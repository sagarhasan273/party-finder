import type { RankTier } from "../types";

export const RANKS: RankTier[] = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Ascendant",
  "Immortal",
  "Radiant",
];

export const RANK_INDEX: Record<string, number> = Object.fromEntries(
  RANKS.map((r, i) => [r, i]),
);

export const MAPS = [
  "Any",
  "Ascent",
  "Bind",
  "Breeze",
  "Fracture",
  "Haven",
  "Icebox",
  "Lotus",
  "Pearl",
  "Split",
  "Sunset",
];

export const ROLES = ["Any", "Duelist", "Initiator", "Controller", "Sentinel"];

// MUI sx-friendly color tokens per rank
export const RANK_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Iron: {
    bg: "rgba(139,148,158,0.15)",
    color: "#8b949e",
    border: "rgba(139,148,158,0.3)",
  },
  Bronze: {
    bg: "rgba(205,127,50,0.15)",
    color: "#cd7f32",
    border: "rgba(205,127,50,0.3)",
  },
  Silver: {
    bg: "rgba(192,192,192,0.15)",
    color: "#c0c0c0",
    border: "rgba(192,192,192,0.3)",
  },
  Gold: {
    bg: "rgba(255,215,0,0.15)",
    color: "#ffd700",
    border: "rgba(255,215,0,0.3)",
  },
  Platinum: {
    bg: "rgba(0,200,200,0.15)",
    color: "#00c8c8",
    border: "rgba(0,200,200,0.3)",
  },
  Diamond: {
    bg: "rgba(176,38,255,0.15)",
    color: "#b026ff",
    border: "rgba(176,38,255,0.3)",
  },
  Ascendant: {
    bg: "rgba(0,255,128,0.12)",
    color: "#00ff80",
    border: "rgba(0,255,128,0.3)",
  },
  Immortal: {
    bg: "rgba(255,80,80,0.15)",
    color: "#ff5050",
    border: "rgba(255,80,80,0.3)",
  },
  Radiant: {
    bg: "rgba(255,230,0,0.15)",
    color: "#ffe600",
    border: "rgba(255,230,0,0.3)",
  },
};

export const ROLE_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Any: {
    bg: "rgba(100,100,130,0.2)",
    color: "#a0a0c0",
    border: "rgba(100,100,130,0.3)",
  },
  Duelist: {
    bg: "rgba(255,80,80,0.15)",
    color: "#ff5050",
    border: "rgba(255,80,80,0.3)",
  },
  Initiator: {
    bg: "rgba(0,180,255,0.15)",
    color: "#00b4ff",
    border: "rgba(0,180,255,0.3)",
  },
  Controller: {
    bg: "rgba(160,80,255,0.15)",
    color: "#a050ff",
    border: "rgba(160,80,255,0.3)",
  },
  Sentinel: {
    bg: "rgba(0,255,160,0.12)",
    color: "#00ffa0",
    border: "rgba(0,255,160,0.3)",
  },
};

export function parseRoles(rolesNeeded?: string): string[] {
  if (!rolesNeeded) return [];
  try {
    const parsed = JSON.parse(rolesNeeded);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return rolesNeeded
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
  }
}

export function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
