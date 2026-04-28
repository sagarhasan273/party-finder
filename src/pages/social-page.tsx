// src/pages/SocialPage.tsx
import { useState } from "react";

import {
  Box,
  Tab,
  Tabs,
  Card,
  Chip,
  Menu,
  Badge,
  Stack,
  Paper,
  Avatar,
  Button,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Circle as CircleIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  SportsEsports as GameIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import { mockPlayers, mockFriendRequests } from "../@mock";

import type { SocialPlayer } from "../types/type-social";

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "#4ade80";
    case "in-game":
      return "#f5c842";
    default:
      return "#5c6070";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "online":
      return "Online";
    case "in-game":
      return "In Game";
    default:
      return "Offline";
  }
};

export function SocialPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<SocialPlayer | null>(
    null,
  );
  const [players, setPlayers] = useState(mockPlayers);
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);

  const handleSendRequest = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, requestSent: true } : p)),
    );
  };

  const handleAcceptRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    // In real app, also update friend status
  };

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    player: SocialPlayer,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlayer(player);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlayer(null);
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.tag.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onlinePlayers = filteredPlayers.filter((p) => p.status === "online");
  const inGamePlayers = filteredPlayers.filter((p) => p.status === "in-game");
  const offlinePlayers = filteredPlayers.filter((p) => p.status === "offline");

  const getDisplayedPlayers = () => {
    if (tabValue === 0) return players;
    if (tabValue === 1) return onlinePlayers;
    if (tabValue === 2) return inGamePlayers;
    return offlinePlayers;
  };

  console.log(selectedPlayer);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          fontFamily: '"Barlow Condensed", sans-serif',
          mb: 1,
        }}
      >
        Social Hub
      </Typography>
      <Typography variant="body2" sx={{ color: "#9aa0b8", mb: 3 }}>
        Discover players, send friend requests, and connect with the community
      </Typography>

      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <Paper
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "#141519",
            border: "1px solid #2a2b35",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Friend Requests ({friendRequests.length})
          </Typography>
          <Stack spacing={2}>
            {friendRequests.map((request) => (
              <Box
                key={request.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#ff4655" }}>
                    {request.from.avatar}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {request.from.name}
                      {request.from.tag}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#5c6070" }}>
                      Wants to be friends
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    sx={{
                      bgcolor: "#4ade80",
                      color: "#fff",
                      "&:hover": { bgcolor: "#22c55e" },
                    }}
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: "#ff4655",
                      color: "#fff",
                      "&:hover": { bgcolor: "#dc2626" },
                    }}
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Search and Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search players by name or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
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
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{ borderColor: "#2a2b35", color: "#9aa0b8" }}
        >
          Filters
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "#2a2b35" }}
      >
        <Tab label={`All (${players.length})`} />
        <Tab label={`Online (${onlinePlayers.length})`} />
        <Tab label={`In Game (${inGamePlayers.length})`} />
        <Tab label={`Offline (${offlinePlayers.length})`} />
      </Tabs>

      {/* Players Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        }}
      >
        {getDisplayedPlayers().map((player) => (
          <Card
            key={player.id}
            sx={{
              p: 2,
              bgcolor: "#141519",
              border: "1px solid #2a2b35",
              borderRadius: 2,
              position: "relative",
              "&:hover": { borderColor: "#ff4655" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: getStatusColor(player.status),
                      boxShadow: "0 0 0 2px #141519",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "#ff4655",
                      fontSize: 20,
                    }}
                  >
                    {player.avatar}
                  </Avatar>
                </Badge>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                    {player.name}
                    <Typography
                      component="span"
                      sx={{ color: "#5c6070", ml: 0.5, fontSize: 12 }}
                    >
                      {player.tag}
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
                    <CircleIcon
                      sx={{ fontSize: 8, color: getStatusColor(player.status) }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: getStatusColor(player.status) }}
                    >
                      {getStatusText(player.status)}
                    </Typography>
                    {player.status === "in-game" && (
                      <GameIcon sx={{ fontSize: 14, color: "#f5c842" }} />
                    )}
                  </Box>
                  <Chip
                    label={player.rank}
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: "#1c1d22",
                      color: "#f5c842",
                      fontSize: 11,
                    }}
                  />
                </Box>
              </Box>
              <IconButton onClick={(e) => handleMenuOpen(e, player)}>
                <MoreVertIcon sx={{ color: "#5c6070" }} />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Chip
                label={player.role}
                size="small"
                sx={{ bgcolor: "#1c1d22", fontSize: 11 }}
              />
              {player.agents.map((agent) => (
                <Chip
                  key={agent}
                  label={agent}
                  size="small"
                  sx={{ bgcolor: "#1c1d22", fontSize: 11 }}
                />
              ))}
            </Box>

            {player.isFriend ? (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ChatIcon />}
                sx={{ borderColor: "#2a2b35", color: "#4ade80" }}
              >
                Message
              </Button>
            ) : player.requestSent ? (
              <Button
                fullWidth
                variant="outlined"
                disabled
                sx={{ borderColor: "#2a2b35", color: "#5c6070" }}
              >
                Request Sent
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => handleSendRequest(player.id)}
                sx={{ bgcolor: "#ff4655", "&:hover": { bgcolor: "#ff6b78" } }}
              >
                Add Friend
              </Button>
            )}
          </Card>
        ))}
      </Box>

      {/* Menu for player options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: "#1c1d22",
            border: "1px solid #2a2b35",
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ChatIcon sx={{ mr: 1, fontSize: 18 }} /> Message
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PersonAddIcon sx={{ mr: 1, fontSize: 18 }} /> Send Friend Request
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <GameIcon sx={{ mr: 1, fontSize: 18 }} /> Invite to Party
        </MenuItem>
      </Menu>
    </Box>
  );
}
