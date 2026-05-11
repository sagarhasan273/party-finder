import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Minus, ChevronUp } from "lucide-react";

import {
  Box,
  Stack,
  Avatar,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

import type { ActiveChat } from "../types/type-social";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const RAJ = '"Rajdhani", sans-serif';
const T = {
  bg: "rgba(10,11,20,0.99)",
  bgMsg: "rgba(14,16,28,0.98)",
  border: "rgba(255,255,255,0.07)",
  accent: "#FF4655",
  text: "#dde3f0",
  textSub: "#7f8fad",
  textMuted: "#3e4d6b",
  green: "#22c55e",
  blue: "#4fc3f7",
} as const;

const STATUS_COLOR: Record<string, string> = {
  online: T.green,
  "in-game": T.blue,
  offline: T.textMuted,
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatWindowProps {
  chat: ActiveChat;
  currentUserId: string;
  onClose: (chatId: string) => void;
  onToggleMinimize: (chatId: string) => void;
  onSendMessage: (chatId: string, text: string) => void;
  index: number; // position from right (0 = rightmost)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatWindow({
  chat,
  currentUserId,
  onClose,
  onToggleMinimize,
  onSendMessage,
  index,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sc = STATUS_COLOR[chat.playerStatus] ?? T.textMuted;

  // Scroll to bottom when messages change or window opens
  useEffect(() => {
    if (!chat.minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat.messages, chat.minimized]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSendMessage(chat.id, text);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Position: stack from right, each 292px wide + 8px gap
  const rightOffset = 24 + index * (284 + 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        position: "fixed",
        bottom: 0,
        right: rightOffset,
        width: 284,
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          background: T.bg,
          border: `1px solid rgba(255,70,85,0.25)`,
          borderBottom: "none",
          borderRadius: "4px 4px 0 0",
          clipPath:
            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
          overflow: "hidden",
          boxShadow:
            "0 -4px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,70,85,0.08)",
          // Left accent bar
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 2,
            height: "100%",
            background: T.accent,
            zIndex: 2,
          },
          // Top tint
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 2,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${T.accent}88, transparent 55%)`,
            zIndex: 2,
          },
        }}
      >
        {/* Corner ornament */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 3,
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 12px 12px 0",
            borderColor: `transparent ${T.accent}33 transparent transparent`,
          }}
        />

        {/* ── Header ── */}
        <Box
          onClick={() => onToggleMinimize(chat.id)}
          sx={{
            display: "flex",
            alignItems: "center",
            px: "14px",
            py: "9px",
            pl: "16px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            borderBottom: chat.minimized ? "none" : `1px solid ${T.border}`,
            transition: "background 0.15s",
            "&:hover": { background: "rgba(255,255,255,0.02)" },
          }}
        >
          {/* Avatar with status dot */}
          <Box sx={{ position: "relative", flexShrink: 0, mr: 1.25 }}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                borderRadius: "3px",
                background: `${sc}18`,
                border: `1px solid ${sc}33`,
                fontFamily: RAJ,
                fontWeight: 700,
                fontSize: "0.7rem",
                color: sc,
              }}
            >
              {chat.playerAvatar}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: sc,
                border: "1.5px solid rgba(10,11,20,1)",
              }}
            />
          </Box>

          {/* Name */}
          <Box flex={1} minWidth={0}>
            <Typography
              sx={{
                fontFamily: RAJ,
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: T.text,
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {chat.playerName}
              <Box
                component="span"
                sx={{
                  opacity: 0.35,
                  fontWeight: 400,
                  textTransform: "none",
                  fontSize: "0.65rem",
                  ml: 0.4,
                }}
              >
                {chat.playerTag}
              </Box>
            </Typography>
            <Typography
              sx={{
                fontFamily: RAJ,
                fontWeight: 600,
                fontSize: "0.55rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: sc,
              }}
            >
              {chat.playerStatus}
            </Typography>
          </Box>

          {/* Unread badge */}
          {chat.minimized && chat.unreadCount > 0 && (
            <Box
              sx={{
                minWidth: 16,
                height: 16,
                borderRadius: "2px",
                background: T.accent,
                px: 0.4,
                mr: 0.75,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.52rem",
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
              </Typography>
            </Box>
          )}

          {/* Controls */}
          <Stack
            direction="row"
            gap={0.25}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              onClick={() => onToggleMinimize(chat.id)}
              sx={{
                width: 20,
                height: 20,
                borderRadius: "2px",
                color: T.textMuted,
                "&:hover": {
                  color: T.text,
                  background: "rgba(255,255,255,0.05)",
                },
              }}
            >
              {chat.minimized ? <ChevronUp size={11} /> : <Minus size={11} />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onClose(chat.id)}
              sx={{
                width: 20,
                height: 20,
                borderRadius: "2px",
                color: T.textMuted,
                "&:hover": {
                  color: T.accent,
                  background: "rgba(255,70,85,0.08)",
                },
              }}
            >
              <X size={11} />
            </IconButton>
          </Stack>
        </Box>

        {/* ── Messages body ── */}
        <AnimatePresence initial={false}>
          {!chat.minimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 320, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Messages list */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: "10px 12px 10px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.75,
                  height: 272,
                  // Custom scrollbar
                  "&::-webkit-scrollbar": { width: 3 },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,70,85,0.3)",
                    borderRadius: 2,
                  },
                }}
              >
                {chat.messages.length === 0 ? (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: RAJ,
                        fontWeight: 600,
                        fontSize: "0.65rem",
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        color: T.textMuted,
                        textAlign: "center",
                      }}
                    >
                      Start the conversation
                    </Typography>
                  </Box>
                ) : (
                  chat.messages.map((msg) => {
                    const isMine = msg.senderId === currentUserId;
                    return (
                      <Box
                        key={msg.id}
                        sx={{
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: "78%",
                            px: 1.25,
                            py: "6px",
                            borderRadius: isMine
                              ? "4px 4px 2px 4px"
                              : "4px 4px 4px 2px",
                            background: isMine
                              ? "rgba(255,70,85,0.18)"
                              : "rgba(255,255,255,0.05)",
                            border: `1px solid ${isMine ? "rgba(255,70,85,0.28)" : T.border}`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: RAJ,
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              letterSpacing: "0.02em",
                              lineHeight: 1.45,
                              color: isMine ? "#f0c0c4" : T.textSub,
                              wordBreak: "break-word",
                            }}
                          >
                            {msg.text}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: RAJ,
                              fontWeight: 500,
                              fontSize: "0.52rem",
                              color: T.textMuted,
                              letterSpacing: "0.04em",
                              mt: 0.25,
                              textAlign: isMine ? "right" : "left",
                            }}
                          >
                            {new Date(msg.sentAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <Box
                sx={{
                  borderTop: `1px solid ${T.border}`,
                  px: "12px",
                  py: "8px",
                  pl: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Type a message…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontFamily: RAJ,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      color: T.text,
                      letterSpacing: "0.02em",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "2px",
                      "& fieldset": { borderColor: T.border },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.12)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(255,70,85,0.4)",
                        borderWidth: 1,
                      },
                      "& textarea": { padding: "5px 8px" },
                      "& textarea::placeholder": {
                        color: T.textMuted,
                        opacity: 1,
                      },
                    },
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={!input.trim()}
                  size="small"
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "2px",
                    flexShrink: 0,
                    background: input.trim()
                      ? T.accent
                      : "rgba(255,255,255,0.04)",
                    color: input.trim() ? "#fff" : T.textMuted,
                    border: `1px solid ${input.trim() ? T.accent : T.border}`,
                    transition: "all 0.15s",
                    "&:hover": input.trim() ? { background: "#e03040" } : {},
                    "&.Mui-disabled": {
                      background: "rgba(255,255,255,0.04)",
                      color: T.textMuted,
                    },
                  }}
                >
                  <Send size={13} />
                </IconButton>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
}
