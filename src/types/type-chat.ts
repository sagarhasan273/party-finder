export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  seen?: boolean;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    tag: string;
    avatar: string;
    status: "online" | "in-game" | "offline";
    rank: string;
    role: string;
  };
  messages: ChatMessage[];
  unreadCount: number;
  minimized: boolean;
  open: boolean;
}
