import React, { useRef, useState, useEffect } from "react";

import { Send } from "@mui/icons-material";
import { Box, TextField, Typography, IconButton } from "@mui/material";

import { tokens } from "../../theme/theme";
import { Panel } from "../../components/panel";

import type { ChatMessage } from "../../types/type-common";

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const LobbyChat: React.FC<Props> = ({ messages, onSendMessage, disabled = false }) => {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    onSendMessage(text);
    setDraft("");
  };

  return (
    <Panel title="Chat" sx={{ display: "flex", flexDirection: "column", minHeight: 320 }}>
      <Box
        ref={scrollRef}
        role="log"
        aria-live="polite"
        sx={{
          flex: 1,
          minHeight: 200,
          maxHeight: { xs: 260, md: 380 },
          overflowY: "auto",
          overscrollBehavior: "contain",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1.5,
          mb: 1.5,
          bgcolor: tokens.inset,
          border: `1px solid ${tokens.line}`,
          borderRadius: "6px",
        }}
      >
        {messages.length === 0 && (
          <Typography sx={{ color: tokens.muted, fontSize: "0.85rem" }}>
            {disabled
              ? "Chat opens as soon as voice connects."
              : "Break the ice. Messages go straight to your teammate."}
          </Typography>
        )}

        {messages.map((m, i) => (
          <Box
            key={`${m.timestamp}-${i}`}
            sx={{ alignSelf: m.self ? "flex-end" : "flex-start", maxWidth: "85%" }}
          >
            {!m.self && (
              <Typography sx={{ fontSize: "0.72rem", color: tokens.muted, mb: 0.3 }}>
                {m.sender}
              </Typography>
            )}
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                borderRadius: "10px",
                bgcolor: m.self ? "rgba(255, 70, 85, 0.18)" : tokens.surface,
                border: `1px solid ${m.self ? "rgba(255, 70, 85, 0.35)" : tokens.line}`,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                fontSize: "0.9rem",
              }}
            >
              {m.message}
            </Box>
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: tokens.faint,
                mt: 0.3,
                textAlign: m.self ? "right" : "left",
              }}
            >
              {m.timestamp}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box component="form" onSubmit={submit} sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a message"
          value={draft}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          inputProps={{ "aria-label": "Message", maxLength: 500 }}
        />
        <IconButton
          type="submit"
          aria-label="Send message"
          disabled={disabled || !draft.trim()}
          sx={{
            flexShrink: 0,
            borderRadius: "6px",
            bgcolor: tokens.accent,
            color: "#fff",
            "&:hover": { bgcolor: tokens.accentHover },
            "&.Mui-disabled": { bgcolor: tokens.inset, color: tokens.faint },
          }}
        >
          <Send sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Panel>
  );
};
