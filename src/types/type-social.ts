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
  role: string;
  agents: string[];
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
    rank: string;
    role: string;
  };
  message: string;
  sentAt: string;
  status: RequestStatus;
}

export type PlayerStatus = "online" | "in-game" | "offline";
export type RequestStatus = "pending" | "accepted" | "rejected";
