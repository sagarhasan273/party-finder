import React, { useRef, useState, useEffect } from "react";

import { Send } from "@mui/icons-material";
import { Box, TextField, Typography, IconButton } from "@mui/material";

import type { ChatMessage } from "../../types/type-common";

const SYSTEM_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

interface LobbyChatProps {
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
}

export const LobbyChat: React.FC<LobbyChatProps> = ({
  messages,
  onSendMessage,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    onSendMessage(messageInput.trim());
    setMessageInput("");
  };

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        minWidth: 0,
        overflowX: "hidden",
        p: { xs: 2, sm: 2.5 },
        bgcolor: "#17212B",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        minHeight: 280,
      }}
    >
      <Typography
        sx={{
          fontFamily: SYSTEM_FONT,
          fontWeight: 600,
          fontSize: { xs: "0.92rem", sm: "1rem" },
          color: "#F0F3F6",
          mb: 1,
        }}
      >
        Lobby Chat
      </Typography>

      <Box
        ref={scrollContainerRef}
        sx={{
          flexGrow: 1,
          minHeight: 180,
          maxHeight: { xs: 220, md: 360 },
          overflowY: "auto",
          overflowX: "hidden",
          minWidth: 0,
          bgcolor: "#141D26",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "6px",
          p: 1.2,
          mb: 1.5,
          overscrollBehavior: "contain",
        }}
      >
        {messages.length === 0 && (
          <Typography
            sx={{
              color: "#8E9AA8",
              fontFamily: SYSTEM_FONT,
              fontSize: "0.75rem",
            }}
          >
            Say hello. Messages go straight to your teammate.
          </Typography>
        )}

        {messages.map((m, i) => (
          <Box
            key={`${m.sender}-${m.timestamp}-${i}`}
            sx={{ py: 0.4, minWidth: 0 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  color: m.sender === "System" ? "#FF4655" : "#2ED573",
                  fontWeight: 600,
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.72rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {m.sender}
              </Typography>
              <Typography
                sx={{
                  color: "#8E9AA8",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.65rem",
                  flexShrink: 0,
                }}
              >
                {m.timestamp}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "#F0F3F6",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                mt: 0.1,
                fontSize: "0.78rem",
              }}
            >
              {m.message}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 0.8, minWidth: 0 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          sx={{}}
        />
        <IconButton
          type="submit"
          size="small"
          sx={{
            flexShrink: 0,
            p: 0.9,
            bgcolor: "rgba(255, 70, 85, 0.15)",
            color: "#FF4655",
            borderRadius: "6px",
            "&:hover": { bgcolor: "rgba(255, 70, 85, 0.25)" },
          }}
        >
          <Send sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
};
