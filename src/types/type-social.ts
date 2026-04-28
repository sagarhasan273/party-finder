// src/types/social.ts
export interface SocialPlayer {
  id: string;
  name: string;
  tag: string;
  avatar: string;
  status: "online" | "in-game" | "offline";
  lastActive: string;
  rank: string;
  role: string;
  agents: string[];
  isFriend: boolean;
  requestSent?: boolean;
}

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
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  userId: string;
  user: SocialPlayer;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
