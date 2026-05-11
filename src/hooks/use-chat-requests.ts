import { useRef, useState, useEffect, useCallback } from "react";

import type {
  ActiveChat,
  ChatRequest,
  ChatMessage,
} from "../types/type-social";

const TRAY_AUTO_DISMISS_MS = 5000;
const ME_ID = "me";

export interface UseChatRequestsReturn {
  requests: ChatRequest[];
  // Tray
  trayVisible: boolean;
  trayRequest: ChatRequest | null;
  dismissTray: () => void;
  // Drawer
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  // Button badge
  showInboxButton: boolean;
  pendingCount: number;
  // Actions
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  pushRequest: (req: ChatRequest) => void;
  // Active chat windows (LinkedIn-style)
  activeChats: ActiveChat[];
  openChat: (request: ChatRequest) => void;
  closeChat: (chatId: string) => void;
  toggleMinimizeChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string) => void;
}

export function useChatRequests(
  initial: ChatRequest[] = [],
): UseChatRequestsReturn {
  const [requests, setRequests] = useState<ChatRequest[]>(initial);
  const [trayVisible, setTrayVisible] = useState(false);
  const [trayRequest, setTrayRequest] = useState<ChatRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showInboxButton, setShowInboxButton] = useState(false);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);

  const trayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // ── Tray auto-show ────────────────────────────────────────────────────────

  useEffect(() => {
    const pending = requests.filter((r) => r.status === "pending");
    if (pending.length === 0) {
      setTrayVisible(false);
      setTrayRequest(null);
      return undefined;
    }

    const latest = pending[pending.length - 1];
    setTrayRequest(latest);
    setTrayVisible(true);

    if (trayTimerRef.current) clearTimeout(trayTimerRef.current);
    trayTimerRef.current = setTimeout(() => {
      setTrayVisible(false);
      setShowInboxButton(true);
    }, TRAY_AUTO_DISMISS_MS);

    return () => {
      if (trayTimerRef.current) clearTimeout(trayTimerRef.current);
    };
  }, [requests]);

  // ── Tray / Drawer actions ─────────────────────────────────────────────────

  const dismissTray = useCallback(() => {
    setTrayVisible(false);
    setShowInboxButton(true);
    if (trayTimerRef.current) clearTimeout(trayTimerRef.current);
  }, []);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    setTrayVisible(false);
    if (trayTimerRef.current) clearTimeout(trayTimerRef.current);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    if (pendingCount > 0) setShowInboxButton(true);
    else setShowInboxButton(false);
  }, [pendingCount]);

  // ── Request actions ───────────────────────────────────────────────────────

  const acceptRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)),
    );

    // Open a chat window for the accepted request
    setRequests((prev) => {
      const req = prev.find((r) => r.id === id);
      if (req) {
        setActiveChats((chats) => {
          // Don't open duplicate
          if (chats.find((c) => c.playerId === req.from.id)) return chats;
          const newChat: ActiveChat = {
            id: `chat-${req.from.id}`,
            playerId: req.from.id,
            playerName: req.from.name,
            playerTag: req.from.tag,
            playerAvatar: req.from.avatar,
            playerStatus: req.from.status,
            messages: [
              // Seed with their original request message
              {
                id: `seed-${Date.now()}`,
                senderId: req.from.id,
                text: req.message,
                sentAt: req.sentAt,
              },
            ],
            minimized: false,
            unreadCount: 0,
          };
          return [...chats, newChat];
        });
      }
      return prev;
    });
  }, []);

  const rejectRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
  }, []);

  const pushRequest = useCallback((req: ChatRequest) => {
    setRequests((prev) => [...prev, req]);
  }, []);

  // ── Chat window actions ───────────────────────────────────────────────────

  const openChat = useCallback((request: ChatRequest) => {
    setActiveChats((prev) => {
      if (prev.find((c) => c.playerId === request.from.id)) {
        // Unminimize if already exists
        return prev.map((c) =>
          c.playerId === request.from.id ? { ...c, minimized: false } : c,
        );
      }
      const newChat: ActiveChat = {
        id: `chat-${request.from.id}`,
        playerId: request.from.id,
        playerName: request.from.name,
        playerTag: request.from.tag,
        playerAvatar: request.from.avatar,
        playerStatus: request.from.status,
        messages: [],
        minimized: false,
        unreadCount: 0,
      };
      return [...prev, newChat];
    });
  }, []);

  const closeChat = useCallback((chatId: string) => {
    setActiveChats((prev) => prev.filter((c) => c.id !== chatId));
  }, []);

  const toggleMinimizeChat = useCallback((chatId: string) => {
    setActiveChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              minimized: !c.minimized,
              unreadCount: !c.minimized ? c.unreadCount : 0,
            }
          : c,
      ),
    );
  }, []);

  const sendMessage = useCallback((chatId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId: ME_ID,
      text,
      sentAt: new Date().toISOString(),
    };

    setActiveChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, newMsg] } : c,
      ),
    );

    // Simulate a reply after 1-2 seconds
    const delay = 1000 + Math.random() * 1200;
    const REPLIES = [
      "Sounds good, let's queue!",
      "What rank are you currently?",
      "Which map do you prefer?",
      "I main Duelist, what about you?",
      "GG, ready when you are.",
      "Let me finish this game and I'll join.",
    ];
    setTimeout(() => {
      setActiveChats((prev) => {
        const chat = prev.find((c) => c.id === chatId);
        if (!chat) return prev;
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          senderId: chat.playerId,
          text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
          sentAt: new Date().toISOString(),
        };
        return prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [...c.messages, replyMsg],
                unreadCount: c.minimized ? c.unreadCount + 1 : 0,
              }
            : c,
        );
      });
    }, delay);
  }, []);

  return {
    requests,
    trayVisible,
    trayRequest,
    dismissTray,
    drawerOpen,
    openDrawer,
    closeDrawer,
    showInboxButton,
    pendingCount,
    acceptRequest,
    rejectRequest,
    pushRequest,
    activeChats,
    openChat,
    closeChat,
    toggleMinimizeChat,
    sendMessage,
  };
}
