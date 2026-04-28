// src/components/ChatDrawer.tsx
import { useState } from "react";

import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
} from "@mui/icons-material";
import {
  Box,
  List,
  Badge,
  Paper,
  Drawer,
  Avatar,
  ListItem,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";

import { mockConversations } from "src/@mock";

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const selectedConversation = mockConversations.find(
    (c) => c.userId === selectedChat,
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <Drawer
      anchor="right"
      open={open && !isMinimized}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 380,
          bgcolor: "#141519",
          borderLeft: "1px solid #2a2b35",
          position: "fixed",
          bottom: 0,
          right: 0,
          top: "auto",
          height: 500,
          borderRadius: "12px 12px 0 0",
          m: 0,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#1c1d22",
          borderBottom: "1px solid #2a2b35",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ChatIcon sx={{ fontSize: 20 }} />
          Messages
        </Typography>
        <Box>
          <IconButton size="small" onClick={() => setIsMinimized(true)}>
            <MinimizeIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {!selectedChat ? (
        // Chat list
        <List sx={{ p: 0 }}>
          {mockConversations.map((conv) => (
            <ListItem
              key={conv.userId}
              onClick={() => setSelectedChat(conv.userId)}
              sx={{
                cursor: "pointer",
                "&:hover": { bgcolor: "#1c1d22" },
                borderBottom: "1px solid #2a2b35",
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor:
                        conv.user.status === "online" ? "#4ade80" : "#5c6070",
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: "#ff4655" }}>
                    {conv.user.avatar}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 600 }}>
                    {conv.user.name}
                    {conv.user.tag}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{ color: conv.unreadCount > 0 ? "#4ade80" : "#5c6070" }}
                  >
                    {conv.lastMessage}
                  </Typography>
                }
              />
              {conv.unreadCount > 0 && (
                <Box
                  sx={{
                    bgcolor: "#ff4655",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {conv.unreadCount}
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        // Chat messages view
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #2a2b35",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton size="small" onClick={() => setSelectedChat(null)}>
              ←
            </IconButton>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor:
                    selectedConversation?.user.status === "online"
                      ? "#4ade80"
                      : "#5c6070",
                },
              }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: "#ff4655" }}>
                {selectedConversation?.user.avatar}
              </Avatar>
            </Badge>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                {selectedConversation?.user.name}
                {selectedConversation?.user.tag}
              </Typography>
              <Typography variant="caption" sx={{ color: "#5c6070" }}>
                {selectedConversation?.user.status === "online"
                  ? "Online"
                  : "Offline"}
              </Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {selectedConversation?.messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.senderId === "current-user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: "70%",
                    bgcolor:
                      msg.senderId === "current-user" ? "#ff4655" : "#1c1d22",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.7, display: "block", mt: 0.5 }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Message input */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #2a2b35",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1c1d22",
                  "& fieldset": { borderColor: "#2a2b35" },
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              sx={{ bgcolor: "#ff4655", "&:hover": { bgcolor: "#ff6b78" } }}
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}

// Minimized chat button (like LinkedIn)
export function ChatMinimizedButton({ onClick }: { onClick: () => void }) {
  const unreadCount = mockConversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        bgcolor: "#ff4655",
        color: "#fff",
        borderRadius: 50,
        p: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
        boxShadow: 3,
        "&:hover": { bgcolor: "#ff6b78" },
        zIndex: 1000,
      }}
    >
      <ChatIcon />
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Messages
      </Typography>
      {unreadCount > 0 && (
        <Box
          sx={{
            bgcolor: "#fff",
            color: "#ff4655",
            borderRadius: "50%",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {unreadCount}
        </Box>
      )}
    </Box>
  );
}
