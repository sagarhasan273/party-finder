// src/pages/FriendsPage.tsx
import { useState } from "react";

import {
  Box,
  Tab,
  Tabs,
  Card,
  Chip,
  Badge,
  Stack,
  Avatar,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  Circle as CircleIcon,
  SportsEsports as GameIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";

import { mockPlayers } from "../@mock";

export function FriendsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const friends = mockPlayers.filter((p) => p.isFriend);
  const onlineFriends = friends.filter((f) => f.status === "online");
  const inGameFriends = friends.filter((f) => f.status === "in-game");
  const offlineFriends = friends.filter((f) => f.status === "offline");

  const getDisplayedFriends = () => {
    if (tabValue === 0) return friends;
    if (tabValue === 1) return onlineFriends;
    if (tabValue === 2) return inGameFriends;
    return offlineFriends;
  };

  const filteredFriends = getDisplayedFriends().filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CircleIcon sx={{ fontSize: 10, color: "#4ade80" }} />;
      case "in-game":
        return <GameIcon sx={{ fontSize: 14, color: "#f5c842" }} />;
      default:
        return <CircleIcon sx={{ fontSize: 10, color: "#5c6070" }} />;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          fontFamily: '"Barlow Condensed", sans-serif',
          mb: 1,
        }}
      >
        Friends
      </Typography>
      <Typography variant="body2" sx={{ color: "#9aa0b8", mb: 3 }}>
        {onlineFriends.length} friends online • {inGameFriends.length} in game
      </Typography>

      <TextField
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#5c6070" }} />
            </InputAdornment>
          ),
          sx: {
            bgcolor: "#1c1d22",
            border: "1px solid #2a2b35",
            borderRadius: 2,
          },
        }}
      />

      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "#2a2b35" }}
      >
        <Tab label={`All (${friends.length})`} />
        <Tab label={`Online (${onlineFriends.length})`} />
        <Tab label={`In Game (${inGameFriends.length})`} />
        <Tab label={`Offline (${offlineFriends.length})`} />
      </Tabs>

      <Stack spacing={2}>
        {filteredFriends.map((friend) => (
          <Card
            key={friend.id}
            sx={{
              p: 2,
              bgcolor: "#141519",
              border: "1px solid #2a2b35",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: friend.status === "online" ? "#4ade80" : "#5c6070",
                    boxShadow: "0 0 0 2px #141519",
                  },
                }}
              >
                <Avatar sx={{ width: 48, height: 48, bgcolor: "#ff4655" }}>
                  {friend.avatar}
                </Avatar>
              </Badge>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {friend.name}
                  <Typography
                    component="span"
                    sx={{ color: "#5c6070", ml: 0.5, fontSize: 12 }}
                  >
                    {friend.tag}
                  </Typography>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  {getStatusIcon(friend.status)}
                  <Typography variant="caption" sx={{ color: "#5c6070" }}>
                    {friend.lastActive}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                  <Chip
                    label={friend.rank}
                    size="small"
                    sx={{ fontSize: 10, bgcolor: "#1c1d22" }}
                  />
                  <Chip
                    label={friend.role}
                    size="small"
                    sx={{ fontSize: 10, bgcolor: "#1c1d22" }}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton sx={{ color: "#4ade80" }}>
                <ChatIcon />
              </IconButton>
              <IconButton sx={{ color: "#ff4655" }}>
                <PersonRemoveIcon />
              </IconButton>
              <IconButton sx={{ color: "#5c6070" }}>
                <BlockIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Stack>

      {filteredFriends.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ color: "#5c6070" }}>No friends found</Typography>
        </Box>
      )}
    </Box>
  );
}
