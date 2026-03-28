export type RankTier =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Ascendant"
  | "Immortal"
  | "Radiant";

export type ValorantMap =
  | "Any"
  | "Ascent"
  | "Bind"
  | "Breeze"
  | "Fracture"
  | "Haven"
  | "Icebox"
  | "Lotus"
  | "Pearl"
  | "Split"
  | "Sunset";

export type LobbyStatus = "open" | "full" | "closed";

export interface Lobby {
  id: string;
  userId: string;
  title: string;
  description?: string;
  rankMin: RankTier;
  rankMax: RankTier;
  map: ValorantMap | string;
  rolesNeeded: string; // JSON string array
  region: string;
  status: LobbyStatus;
  hostUsername: string;
  hostTag?: string;
  discordLink?: string;
  currentPlayers: number;
  maxPlayers: number;
  createdAt: string;
  updatedAt: string;
}

export interface LobbyFilters {
  search: string;
  rankMin: string;
  map: string;
  region: string;
  openOnly: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}
