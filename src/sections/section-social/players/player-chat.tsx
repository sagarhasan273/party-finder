import React, { useRef, useEffect } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";

import { Box, Paper, Button, TextField, Typography } from "@mui/material";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
}

interface PlayerChatProps {
  playerId: string;
  username: string;
  messages: Message[];
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isThinking: boolean;
  quickPhrases?: string[];
  onQuickPhrase: (phrase: string) => void;
}

export const PlayerChat: React.FC<PlayerChatProps> = ({
  playerId,
  username,
  messages,
  inputMessage,
  onInputChange,
  onSendMessage,
  isThinking,
  quickPhrases = [
    "Hey! Lock into Competitive queue?",
    "Do you have a microphone?",
    "Which agents can you play?",
    "Send me a lobby invite!",
  ],
  onQuickPhrase,
}) => {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  return (
    <Box
      sx={{
        borderTop: "1px solid #1b222d",
        bgcolor: "#080b10",
        display: "flex",
        flexDirection: "column",
        height: 320,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#0e141c",
          px: 2,
          py: 1,
          borderBottom: "1px solid #1b222d",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#00f3c5",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              bgcolor: "#00f3c5",
              borderRadius: "50%",
              animation: "pulse 1.5s infinite",
            }}
          />
          Gemini character-live connection active
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#6e7b8c",
            fontSize: "0.5rem",
            bgcolor: "#121922",
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
          }}
        >
          PERSISTENT HISTORICAL BUFFER
        </Typography>
      </Box>

      {/* Messages */}
      <Box
        ref={chatRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <MessageSquare
              size={24}
              style={{ color: "rgba(255,70,85,0.3)", marginBottom: 4 }}
            />
            <Typography variant="caption" sx={{ color: "#556375" }}>
              Say hello to {username}! Send a test prompt below.
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.sender === "me" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: msg.sender === "me" ? "#ff4655" : "#121922",
                  color: msg.sender === "me" ? "white" : "#e8ecf0",
                  border: msg.sender === "me" ? "none" : "1px solid #1e2736",
                  borderRadius: 1,
                  borderBottomRightRadius: msg.sender === "me" ? 0 : 1,
                  borderBottomLeftRadius: msg.sender === "me" ? 1 : 0,
                  fontSize: "0.7rem",
                }}
              >
                {msg.text}
              </Paper>
              <Typography
                variant="caption"
                sx={{ color: "#556375", mt: 0.5, fontSize: "0.45rem" }}
              >
                {msg.timestamp}
              </Typography>
            </Box>
          ))
        )}

        {isThinking && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#121922",
              p: 1.5,
              borderRadius: 1,
              border: "1px solid rgba(0,243,197,0.25)",
              alignSelf: "flex-start",
            }}
          >
            <Loader2
              size={10}
              className="animate-spin"
              style={{ color: "#00f3c5" }}
            />
            <Typography
              variant="caption"
              sx={{ color: "#00f3c5", fontSize: "0.6rem", fontWeight: 700 }}
            >
              Agent formulating comms...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Quick phrases */}
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "#0c1117",
          borderTop: "1px solid #1b222d",
          display: "flex",
          gap: 0.5,
          overflowX: "auto",
        }}
      >
        {quickPhrases.map((phrase) => (
          <Button
            key={phrase}
            size="small"
            onClick={() => onQuickPhrase(phrase)}
            sx={{
              fontSize: "0.5rem",
              bgcolor: "#121922",
              color: "#8c9ba5",
              border: "1px solid #1e2736",
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "rgba(255,70,85,0.1)",
                borderColor: "rgba(255,70,85,0.3)",
                color: "white",
              },
            }}
          >
            {phrase}
          </Button>
        ))}
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 1.5,
          bgcolor: "#0e141c",
          borderTop: "1px solid #1b222d",
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          size="small"
          placeholder={`Type messages to ${username}...`}
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#121922",
              fontSize: "0.7rem",
              "& fieldset": { borderColor: "#1e2736" },
              "&:hover fieldset": { borderColor: "#ff4655" },
            },
          }}
        />
        <Button
          onClick={onSendMessage}
          sx={{
            bgcolor: "#ff4655",
            color: "white",
            minWidth: 40,
            "&:hover": { bgcolor: "#e8404e" },
          }}
        >
          <Send size={14} />
        </Button>
      </Box>
    </Box>
  );
};
