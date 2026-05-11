import { useState, useCallback } from "react";

import type { ChatMessage, Conversation } from "../types/type-chat";

const MAX_OPEN = 3; // max simultaneous open windows

// ─── Mock seed data ───────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participant: {
      id: "p2",
      name: "VelocityX",
      tag: "#NA1",
      avatar: "VX",
      status: "in-game",
      rank: "Platinum III",
      role: "Controller",
    },
    messages: [
      {
        id: "m1",
        senderId: "p2",
        text: "Hey! I saw you're looking for teammates. Want to play?",
        sentAt: new Date(Date.now() - 10 * 60000).toISOString(),
        seen: true,
      },
      {
        id: "m2",
        senderId: "me",
        text: "Sure! What rank are you looking for?",
        sentAt: new Date(Date.now() - 8 * 60000).toISOString(),
        seen: true,
      },
      {
        id: "m3",
        senderId: "p2",
        text: "Plat+ ideally. I'm P3 and pushing Diamond this act 🎯",
        sentAt: new Date(Date.now() - 5 * 60000).toISOString(),
        seen: false,
      },
    ],
    unreadCount: 1,
    minimized: false,
    open: true,
  },
  {
    id: "conv-2",
    participant: {
      id: "p3",
      name: "StarlightK",
      tag: "#KR1",
      avatar: "SK",
      status: "online",
      rank: "Diamond I",
      role: "Initiator",
    },
    messages: [
      {
        id: "m4",
        senderId: "p3",
        text: "Your playstyle matches what we need. Let's team up!",
        sentAt: new Date(Date.now() - 30 * 60000).toISOString(),
        seen: true,
      },
    ],
    unreadCount: 0,
    minimized: true,
    open: true,
  },
];

export function useConversations() {
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);

  // Open a conversation (or bring to front)
  const openConversation = useCallback(
    (participant: Conversation["participant"]) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.participant.id === participant.id);
        if (existing) {
          return prev.map((c) =>
            c.id === existing.id
              ? { ...c, open: true, minimized: false, unreadCount: 0 }
              : c,
          );
        }
        // Limit max open windows — minimize oldest if needed
        const openOnes = prev.filter((c) => c.open && !c.minimized);
        let updated = [...prev];
        if (openOnes.length >= MAX_OPEN) {
          const oldest = openOnes[0];
          updated = updated.map((c) =>
            c.id === oldest.id ? { ...c, minimized: true } : c,
          );
        }
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          participant,
          messages: [],
          unreadCount: 0,
          minimized: false,
          open: true,
        };
        return [...updated, newConv];
      });
    },
    [],
  );

  const closeConversation = useCallback((convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, open: false } : c)),
    );
  }, []);

  const toggleMinimize = useCallback((convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              minimized: !c.minimized,
              unreadCount: c.minimized ? 0 : c.unreadCount,
            }
          : c,
      ),
    );
  }, []);

  const sendMessage = useCallback(
    (convId: string, text: string, myId = "me") => {
      const msg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: myId,
        text,
        sentAt: new Date().toISOString(),
        seen: false,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, msg] } : c,
        ),
      );
    },
    [],
  );

  const markRead = useCallback((convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              unreadCount: 0,
              messages: c.messages.map((m) => ({ ...m, seen: true })),
            }
          : c,
      ),
    );
  }, []);

  // Simulate incoming message (wire to socket in prod)
  const receiveMessage = useCallback(
    (convId: string, senderId: string, text: string) => {
      const msg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId,
        text,
        sentAt: new Date().toISOString(),
        seen: false,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, msg],
                unreadCount: c.minimized ? c.unreadCount + 1 : c.unreadCount,
              }
            : c,
        ),
      );
    },
    [],
  );

  const openConvs = conversations.filter((c) => c.open);
  const totalUnread = openConvs.reduce((sum, c) => sum + c.unreadCount, 0);

  return {
    conversations: openConvs,
    openConversation,
    closeConversation,
    toggleMinimize,
    sendMessage,
    markRead,
    receiveMessage,
    totalUnread,
  };
}
