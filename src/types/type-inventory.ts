import type { UserType } from "./type-user";

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

export type LobbyStatus = "open" | "full" | "in-progress" | "closed";

export type ApplicantStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "joining"
  | "not-joining"
  | "suspended"
  | "cancelled";

export interface LobbyType {
  id: string;
  host: UserType;
  title: string;
  description?: string;
  partyCode: string;
  rankMin: RankTier;
  rankMax: RankTier;
  hostGamename: string;
  hostTagline: string;
  rolesNeeded: string[];
  region: string;
  server: string;
  status: LobbyStatus;
  discordLink?: string;
  currentPlayers?: number;
  createdAt: string;
  updatedAt: string;
  applicants?: {
    user: Partial<UserType>;
    status: ApplicantStatus;
    createdAt: string;
    updatedAt: string;
    message?: string;
  }[];
}

export type CreateLobbyInput =
  | Omit<LobbyType, "id" | "createdAt" | "updatedAt">
  | { host: string };
