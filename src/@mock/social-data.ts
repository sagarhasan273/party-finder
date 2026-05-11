// src/data/socialData.ts
import type {
  ChatMessage,
  SocialPlayer,
  FriendRequest,
  ChatConversation,
} from "../types/type-social";

export const mockPlayers: SocialPlayer[] = [
  {
    id: "1",
    name: "NightSabre",
    tag: "#EU1",
    avatar: "NS",
    status: "online",
    lastActive: "Just now",
    rank: "Gold II",
    role: "Duelist",
    agents: ["Jett", "Reyna"],
    isFriend: false,
    requestSent: false,
  },
  {
    id: "2",
    name: "VelocityX",
    tag: "#NA1",
    avatar: "VX",
    status: "in-game",
    lastActive: "In match",
    rank: "Platinum III",
    role: "Controller",
    agents: ["Omen", "Brimstone"],
    isFriend: true,
    requestSent: false,
  },
  {
    id: "3",
    name: "StarlightK",
    tag: "#KR1",
    avatar: "SK",
    status: "online",
    lastActive: "5 min ago",
    rank: "Diamond I",
    role: "Initiator",
    agents: ["Sova", "Fade"],
    isFriend: false,
    requestSent: false,
  },
  {
    id: "4",
    name: "TacticalMid",
    tag: "#NA4",
    avatar: "TM",
    status: "online",
    lastActive: "Just now",
    rank: "Gold III",
    role: "Duelist",
    agents: ["Jett", "Reyna"],
    isFriend: false,
    requestSent: false,
  },
  {
    id: "5",
    name: "SmokeScreen",
    tag: "#EU3",
    avatar: "SS",
    status: "offline",
    lastActive: "2 hours ago",
    rank: "Platinum I",
    role: "Controller",
    agents: ["Omen", "Clove"],
    isFriend: true,
    requestSent: false,
  },
  {
    id: "6",
    name: "FlashPoint",
    tag: "#NA5",
    avatar: "FP",
    status: "in-game",
    lastActive: "In match",
    rank: "Gold I",
    role: "Initiator",
    agents: ["Breach", "Fade"],
    isFriend: false,
    requestSent: true,
  },
];

export const mockFriendRequests: FriendRequest[] = [
  {
    id: "1",
    from: mockPlayers[0],
    to: "current-user",
    status: "pending",
    sentAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    from: mockPlayers[3],
    to: "current-user",
    status: "pending",
    sentAt: "2024-01-14T15:20:00Z",
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "2",
    text: "Hey! Want to play some matches?",
    sentAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    senderId: "current-user",
    text: "Sure! What time?",
    sentAt: "2024-01-15T09:05:00Z",
  },
  {
    id: "3",
    senderId: "2",
    text: "How about in 30 min?",
    sentAt: "2024-01-15T09:10:00Z",
  },
  {
    id: "4",
    senderId: "1",
    text: "Hey, saw you are looking for a fifth. I'm available!",
    sentAt: "2024-01-14T20:00:00Z",
  },
];

export const mockConversations: ChatConversation[] = [
  {
    userId: "2",
    user: mockPlayers[1],
    messages: mockMessages.filter(
      (m) => m.senderId === "2" || m.senderId === "current-user",
    ),
    lastMessage: "How about in 30 min?",
    lastMessageTime: "2024-01-15T09:10:00Z",
    unreadCount: 1,
  },
  {
    userId: "1",
    user: mockPlayers[0],
    messages: mockMessages.filter(
      (m) => m.senderId === "1" || m.senderId === "current-user",
    ),
    lastMessage: "Hey, saw you're looking for a fifth. I'm available!",
    lastMessageTime: "2024-01-14T20:00:00Z",
    unreadCount: 0,
  },
];
