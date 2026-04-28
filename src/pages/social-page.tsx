// src/pages/SocialPage.tsx
import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Clock,
  Globe,
  Check,
  Search,
  UserPlus,
  MessageCircle,
} from "lucide-react";

import {
  Box,
  Chip,
  Stack,
  Paper,
  Badge,
  Button,
  Avatar,
  Divider,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import { RankChip } from "../components/rank-chip";
import { RoleChip } from "../components/role-chip";
import { MetaChip } from "../components/meta-chip";
import { AvatarUser } from "../components/avatar-user";

import type { ChatRequest, SocialPlayer } from "../types/type-social";

// ─── Design tokens (EXACT match to LobbyCard) ─────────────────────────────────

const T = {
  bg: "rgba(22, 23, 34, 0.97)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  accent: "#FF4655",
  accentDim: "rgba(255,70,85,0.12)",
  accentBorder: "rgba(255,70,85,0.25)",
  text: "#edf0f4",
  textMuted: "rgba(74,84,112,1)",
  textSub: "#8892aa",
  green: "#22c55e",
  blue: "#4fc3f7",
  purple: "#a78bfa",
  RAJ: '"Rajdhani", sans-serif',
} as const;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockChatRequests: ChatRequest[] = [
  {
    id: "1",
    from: {
      id: "2",
      name: "VelocityX",
      tag: "#NA1",
      avatar: "VX",
      status: "online",
      rank: "Platinum III",
      role: "Duelist",
    },
    message: "Hey! I saw you're looking for teammates. Want to play?",
    sentAt: new Date(Date.now() - 5 * 60000).toISOString(),
    status: "pending",
  },
  {
    id: "2",
    from: {
      id: "3",
      name: "StarlightK",
      tag: "#KR1",
      avatar: "SK",
      status: "online",
      rank: "Diamond I",
      role: "Initiator",
    },
    message: "Your playstyle matches what we need. Let's team up!",
    sentAt: new Date(Date.now() - 30 * 60000).toISOString(),
    status: "pending",
  },
];

const mockSocialPlayers: SocialPlayer[] = [
  {
    id: "1",
    name: "NightSabre",
    tag: "#EU1",
    avatar: "NS",
    status: "online",
    lastActive: "Just now",
    rank: "Gold II",
    role: "Duelist",
    agents: ["Jett", "Reyna"],
    isFriend: false,
    requestSent: false,
    bio: "Looking for competitive players to climb with. Good comms, chill vibes.",
    playstyle: "Competitive",
    winRate: 58,
    karma: 4.8,
  },
  {
    id: "2",
    name: "VelocityX",
    tag: "#NA1",
    avatar: "VX",
    status: "in-game",
    lastActive: "In match",
    rank: "Platinum III",
    role: "Controller",
    agents: ["Omen", "Brimstone"],
    isFriend: true,
    requestSent: false,
    bio: "Controller main looking for consistent duo",
    playstyle: "Competitive",
    winRate: 62,
    karma: 4.5,
  },
  {
    id: "3",
    name: "StarlightK",
    tag: "#KR1",
    avatar: "SK",
    status: "online",
    lastActive: "5 min ago",
    rank: "Diamond I",
    role: "Initiator",
    agents: ["Sova", "Fade"],
    isFriend: false,
    requestSent: false,
    bio: "Diamond player looking for serious team",
    playstyle: "Competitive",
    winRate: 55,
    karma: 4.2,
  },
  {
    id: "4",
    name: "TacticalMid",
    tag: "#NA4",
    avatar: "TM",
    status: "offline",
    lastActive: "2 hours ago",
    rank: "Gold III",
    role: "Duelist",
    agents: ["Jett", "Reyna", "Phoenix"],
    isFriend: false,
    requestSent: true,
    bio: "Just looking to have fun and rank up",
    playstyle: "Balanced",
    winRate: 51,
    karma: 3.9,
  },
];

// ─── Social Player Card Component (EXACT match to LobbyCard styling) ──────────

interface SocialPlayerCardProps {
  player: SocialPlayer;
  index: number;
  onSendChatRequest: (playerId: string) => void;
  onMessage?: (playerId: string) => void;
}

function SocialPlayerCard({
  player,
  index,
  onSendChatRequest,
  onMessage,
}: SocialPlayerCardProps) {
  const statusColor =
    player.status === "online"
      ? T.green
      : player.status === "in-game"
        ? T.blue
        : T.textMuted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      style={{ height: "100%", width: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: "4px",
          clipPath:
            "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: T.borderHover,
            boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${statusColor}22`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: statusColor,
            zIndex: 2,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 3,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${statusColor}88, transparent 55%)`,
            zIndex: 2,
          },
          height: "100%",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 14px 14px 0",
            borderColor: `transparent ${statusColor}44 transparent transparent`,
            zIndex: 3,
          }}
        />

        <Box
          sx={{
            p: "16px 18px 14px 24px",
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          {/* Player header */}
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: statusColor,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "2px solid #161722",
                },
              }}
            >
              <AvatarUser
                avatarUrl={player.avatar}
                name={player.name}
                sx={{ width: 48, height: 48 }}
              />
            </Badge>
            <Stack>
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: T.text,
                  letterSpacing: "0.03em",
                }}
              >
                {player.name}
                <Typography
                  component="span"
                  sx={{ color: T.textMuted, fontSize: "0.7rem", ml: 0.5 }}
                >
                  {player.tag}
                </Typography>
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.6}>
                <MetaChip
                  icon={<Globe size={10} />}
                  label={player.rank.split(" ")[0]}
                />
                <Stack direction="row" alignItems="center" gap={0.3}>
                  <Clock size={10} color={T.textMuted} />
                  <Typography
                    sx={{
                      color: T.textMuted,
                      fontSize: "0.65rem",
                      fontFamily: T.RAJ,
                    }}
                  >
                    {player.lastActive}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          {/* Rank and role */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <RankChip rank={player.rank} />
            <RoleChip role={player.role} />
          </Stack>

          {/* Bio */}
          {player.bio && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 500,
                color: T.textMuted,
                fontSize: "0.75rem",
                letterSpacing: "0.02em",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {player.bio}
            </Typography>
          )}

          {/* Agents */}
          {player.agents && player.agents.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.6}>
              <Typography
                sx={{
                  color: T.textMuted,
                  fontSize: "0.6rem",
                  fontFamily: T.RAJ,
                  fontWeight: 600,
                }}
              >
                MAINS:
              </Typography>
              {player.agents.map((agent) => (
                <Chip
                  key={agent}
                  label={agent}
                  size="small"
                  sx={{
                    background: "rgba(255,255,255,0.04)",
                    color: T.textSub,
                    fontSize: "0.65rem",
                    height: 20,
                  }}
                />
              ))}
            </Stack>
          )}

          <Divider
            sx={{ borderColor: "rgba(255,255,255,0.055)", mt: "auto" }}
          />

          {/* Actions */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            gap={1}
          >
            {player.isFriend ? (
              <Button
                onClick={() => onMessage?.(player.id)}
                size="small"
                startIcon={<MessageCircle size={14} />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "2px",
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "rgba(74,222,128,0.1)",
                  color: T.green,
                  border: `1px solid rgba(74,222,128,0.25)`,
                  "&:hover": {
                    background: "rgba(74,222,128,0.15)",
                    borderColor: "rgba(74,222,128,0.45)",
                  },
                }}
              >
                Message
              </Button>
            ) : player.requestSent ? (
              <Button
                size="small"
                disabled
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "2px",
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "rgba(255,255,255,0.06)",
                  color: T.textSub,
                  border: `1px solid ${T.border}`,
                }}
              >
                Request Sent
              </Button>
            ) : (
              <Button
                onClick={() => onSendChatRequest(player.id)}
                size="small"
                startIcon={<UserPlus size={14} />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "2px",
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: T.accent,
                  color: "#fff",
                  "&:hover": {
                    background: "#e03040",
                    boxShadow: "0 0 14px rgba(255,70,85,0.35)",
                  },
                }}
              >
                Chat Request
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
}

// ─── Chat Request Card Component (for incoming requests) ─────────────────────

interface ChatRequestCardProps {
  request: ChatRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

function ChatRequestCard({
  request,
  onAccept,
  onReject,
}: ChatRequestCardProps) {
  const statusColor = request.from.status === "online" ? T.green : T.textMuted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: T.bg,
          border: `1px solid ${T.accentBorder}`,
          borderRadius: "4px",
          clipPath:
            "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: T.accent,
            zIndex: 2,
          },
        }}
      >
        <Box sx={{ p: "14px 18px 14px 24px", position: "relative", zIndex: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1.5}
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: statusColor,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: T.accent,
                    fontFamily: T.RAJ,
                    fontWeight: 700,
                  }}
                >
                  {request.from.avatar}
                </Avatar>
              </Badge>
              <Box>
                <Typography
                  sx={{
                    fontFamily: T.RAJ,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {request.from.name}
                  {request.from.tag}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: T.textMuted,
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <MessageCircle size={10} />
                  Wants to chat
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                onClick={() => onAccept(request.id)}
                startIcon={<Check size={14} />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "2px",
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  background: T.green,
                  color: "#fff",
                  "&:hover": { background: "#16a34a" },
                }}
              >
                Accept
              </Button>
              <Button
                size="small"
                onClick={() => onReject(request.id)}
                startIcon={<X size={14} />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "2px",
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  background: "rgba(255,255,255,0.06)",
                  color: T.textSub,
                  border: `1px solid ${T.border}`,
                  "&:hover": { borderColor: T.accent, color: T.accent },
                }}
              >
                Decline
              </Button>
            </Box>
          </Stack>

          {request.message && (
            <Typography
              sx={{
                mt: 1.5,
                pt: 1,
                borderTop: `1px solid ${T.border}`,
                fontFamily: T.RAJ,
                fontSize: "0.75rem",
                color: T.textSub,
                fontStyle: "italic",
              }}
            >
              {request.message}
            </Typography>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}

// ─── Main SocialPage Component ────────────────────────────────────────────────

export function SocialPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [players, setPlayers] = useState(mockSocialPlayers);
  const [chatRequests, setChatRequests] = useState(mockChatRequests);

  const handleSendChatRequest = useCallback((playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, requestSent: true } : p)),
    );
  }, []);

  const handleAcceptChatRequest = useCallback(
    (requestId: string) => {
      const accepted = chatRequests.find((r) => r.id === requestId);
      setChatRequests((prev) => prev.filter((r) => r.id !== requestId));
      if (accepted) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === accepted.from.id
              ? { ...p, isFriend: true, requestSent: false }
              : p,
          ),
        );
      }
    },
    [chatRequests],
  );

  const handleRejectChatRequest = useCallback((requestId: string) => {
    setChatRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  const filteredPlayers = useMemo(
    () =>
      players.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [players, searchTerm],
  );

  const onlineCount = players.filter((p) => p.status === "online").length;
  const inGameCount = players.filter((p) => p.status === "in-game").length;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography
        sx={{
          fontFamily: T.RAJ,
          fontWeight: 800,
          fontSize: "1.75rem",
          color: T.text,
          mb: 1,
        }}
      >
        Social Hub
      </Typography>
      <Typography sx={{ color: T.textMuted, fontSize: "0.85rem", mb: 3 }}>
        Discover players, send chat requests, and connect with the community
      </Typography>

      {/* Chat Requests Section */}
      <AnimatePresence>
        {chatRequests.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.85rem",
                color: T.accent,
                mb: 1.5,
                letterSpacing: "0.08em",
              }}
            >
              INCOMING CHAT REQUESTS ({chatRequests.length})
            </Typography>
            <Stack spacing={1.5}>
              {chatRequests.map((request) => (
                <ChatRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptChatRequest}
                  onReject={handleRejectChatRequest}
                />
              ))}
            </Stack>
          </Box>
        )}
      </AnimatePresence>

      {/* Search */}
      <TextField
        placeholder="Search players by name or tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} color={T.textMuted} />
            </InputAdornment>
          ),
          sx: {
            bgcolor: "#1c1d22",
            border: `1px solid ${T.border}`,
            borderRadius: "4px",
            fontFamily: T.RAJ,
            "&:hover": { borderColor: T.borderHover },
          },
        }}
      />

      {/* Stats Row */}
      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        <Chip
          label={`Online: ${onlineCount}`}
          sx={{
            bgcolor: "rgba(74,222,128,0.1)",
            color: T.green,
            border: `1px solid rgba(74,222,128,0.25)`,
          }}
        />
        <Chip
          label={`In Game: ${inGameCount}`}
          sx={{
            bgcolor: "rgba(79,195,247,0.1)",
            color: T.blue,
            border: `1px solid rgba(79,195,247,0.25)`,
          }}
        />
        <Chip
          label={`Total: ${players.length}`}
          sx={{ bgcolor: "rgba(255,255,255,0.04)", color: T.textSub }}
        />
      </Stack>

      {/* Players Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        }}
      >
        {filteredPlayers.map((player, idx) => (
          <SocialPlayerCard
            key={player.id}
            player={player}
            index={idx}
            onSendChatRequest={handleSendChatRequest}
          />
        ))}
      </Box>

      {/* Empty State */}
      {filteredPlayers.length === 0 && (
        <Paper
          sx={{
            textAlign: "center",
            py: 6,
            bgcolor: T.bg,
            border: `1px solid ${T.border}`,
          }}
        >
          <Users
            size={48}
            color={T.textMuted}
            style={{ marginBottom: 16, opacity: 0.4 }}
          />
          <Typography
            sx={{ fontFamily: T.RAJ, fontWeight: 700, color: T.textSub }}
          >
            No players found
          </Typography>
          <Typography sx={{ color: T.textMuted, fontSize: "0.8rem", mt: 0.5 }}>
            Try adjusting your search
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
