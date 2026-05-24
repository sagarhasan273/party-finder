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
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNubLmqdOK9pZWU-2IiD20cuSIdUUDi9-NvQ&s",
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
    avatar:
      "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
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
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFvRAqmyUDrtABrve52n4h_Wwh6PAyUb5SxQ&s",
    status: "online",
    lastActive: "5 min ago",
    rank: "Diamond I",
    role: "Initiator",
    // agents: ["Sova", "Fade"],
    isFriend: false,
    requestSent: false,
  },
  {
    id: "4",
    name: "TacticalMid",
    tag: "#NA4",
    avatar:
      "https://www.equinetmedia.com/hubfs/How-to-find-b2b-blog-images.png",
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
    avatar:
      "https://www.equinetmedia.com/hubfs/How-to-find-b2b-blog-images.png",
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
    avatar:
      "https://www.equinetmedia.com/hubfs/How-to-find-b2b-blog-images.png",
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
