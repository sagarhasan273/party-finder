// src/types/social.ts
export interface FriendRequest {
  id: string;
  from: SocialPlayer;
  to: string;
  status: "pending" | "accepted" | "rejected";
  sentAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
}

export interface ActiveChat {
  id: string; // unique chat id
  playerId: string;
  playerName: string;
  playerTag: string;
  playerAvatar: string;
  playerStatus: PlayerStatus;
  messages: ChatMessage[];
  minimized: boolean;
  unreadCount: number;
}

export interface ChatConversation {
  userId: string;
  user: SocialPlayer;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
export interface SocialPlayer {
  id: string;
  name: string;
  tag: string;
  avatar: string;
  status: PlayerStatus;
  lastActive: string;
  rank: string;
  role?: string;
  agents?: string[];
  isFriend: boolean;
  requestSent: boolean;
  bio?: string;
  playstyle?: string;
  winRate?: number;
  karma?: number;
}

export interface ChatRequest {
  id: string;
  from: {
    id: string;
    name: string;
    tag: string;
    avatar: string;
    status: PlayerStatus;
    rank?: string;
    role?: string;
  };
  message: string;
  sentAt: string;
  status: RequestStatus;
}

export type PlayerStatus = "online" | "in-game" | "offline";
export type RequestStatus = "pending" | "accepted" | "rejected";

export interface Player {
  id: string;
  username: string;
  tagline: string;
  rank: string;
  rankTier: string;
  rankIcon: string;
  status: "searching" | "in-party" | "offline";
  mainAgent: string;
  role: "Duelist" | "Sentinel" | "Controller" | "Initiator";
  lookingFor: string;
  partySize: number;
  partyMax: number;
  microphone: boolean;
  languages: string[];
  personality: string;
}

export interface Profile {
  username: string;
  tagline: string;
  rank: string;
  rankIcon: string;
  role: string;
  status: string;
  isSearching: boolean;
  partySize: number;
  partyMax: number;
  winRate: string;
  headshotRate: string;
  favoriteMap: string;
  clutchWon: string;
  avatarUrl: string | null;
  bio: string;
}

export interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
}

export interface Invite {
  id: string;
  sender: Player;
  message: string;
  time: string;
}

export interface Toast {
  id: number;
  text: string;
  type: "success" | "warning" | "message" | "invite" | "info";
}

export interface Filters {
  search: string;
  rank: string;
  role: string;
  mode: string;
  micRequired: boolean;
}

export interface ChatState {
  [playerId: string]: Message[];
}

export interface InputMessages {
  [playerId: string]: string;
}

export interface ThinkingStatus {
  [playerId: string]: boolean;
}

export interface ExpandedChats {
  [playerId: string]: boolean;
}
