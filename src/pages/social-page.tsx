import { motion } from "framer-motion";
import { useMemo, useState, useCallback } from "react";
import { Users, Clock, Search, UserPlus, MessageCircle } from "lucide-react";

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

import { useChatRequests } from "../hooks/use-chat-requests";
import { ChatRequestSystem } from "../components/ChatRequestSystem";

import type { ChatRequest, SocialPlayer } from "../types/type-social";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(13,15,26,0.97)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  accent: "#FF4655",
  text: "#edf0f4",
  textMuted: "rgba(74,84,112,1)",
  textSub: "#8892aa",
  green: "#22c55e",
  blue: "#4fc3f7",
  RAJ: '"Rajdhani", sans-serif',
} as const;

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_REQUESTS: ChatRequest[] = [
  {
    id: "req-1",
    from: {
      id: "p2",
      name: "VelocityX",
      tag: "#NA1",
      avatar: "VX",
      status: "online",
      rank: "Platinum III",
      role: "Controller",
    },
    message: "Hey! I saw you're looking for teammates. Want to play?",
    sentAt: new Date(Date.now() - 5 * 60000).toISOString(),
    status: "pending",
  },
  {
    id: "req-2",
    from: {
      id: "p3",
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

const INITIAL_PLAYERS: SocialPlayer[] = [
  {
    id: "p1",
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
    bio: "Looking for competitive players to climb with.",
    playstyle: "Competitive",
    winRate: 58,
    karma: 4.8,
  },
  {
    id: "p2",
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
    bio: "Controller main looking for consistent duo.",
    playstyle: "Competitive",
    winRate: 62,
    karma: 4.5,
  },
  {
    id: "p3",
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
    bio: "Diamond player looking for serious team.",
    playstyle: "Competitive",
    winRate: 55,
    karma: 4.2,
  },
  {
    id: "p4",
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
    bio: "Just looking to have fun and rank up.",
    playstyle: "Balanced",
    winRate: 51,
    karma: 3.9,
  },
  {
    id: "p5",
    name: "IceBreaker",
    tag: "#EU9",
    avatar: "IB",
    status: "online",
    lastActive: "Just now",
    rank: "Ascendant II",
    role: "Sentinel",
    agents: ["Killjoy", "Cypher"],
    isFriend: false,
    requestSent: false,
    bio: "Sentinel one-trick, high info plays.",
    playstyle: "Strategic",
    winRate: 60,
    karma: 4.7,
  },
  {
    id: "p6",
    name: "FluxCore",
    tag: "#AP2",
    avatar: "FC",
    status: "online",
    lastActive: "1 min ago",
    rank: "Immortal I",
    role: "Duelist",
    agents: ["Neon", "Jett"],
    isFriend: false,
    requestSent: false,
    bio: "Immortal pushing for Radiant this act.",
    playstyle: "Aggressive",
    winRate: 65,
    karma: 4.3,
  },
];

// ─── Status color helper ──────────────────────────────────────────────────────

const statusColor = (status: SocialPlayer["status"]) => {
  if (status === "online") return "#22c55e";
  if (status === "in-game") return "#4fc3f7";
  return "rgba(90,100,130,1)";
};

// ─── Player card ──────────────────────────────────────────────────────────────

interface PlayerCardProps {
  player: SocialPlayer;
  index: number;
  onSendRequest: (id: string) => void;
  onMessage: (id: string) => void;
}

function PlayerCard({
  player,
  index,
  onSendRequest,
  onMessage,
}: PlayerCardProps) {
  const sc = statusColor(player.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.32, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          backgroundColor: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: "4px",
          clipPath:
            "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: T.borderHover,
            boxShadow: `0 8px 36px rgba(0,0,0,0.5), 0 0 0 1px ${sc}22`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: sc,
            zIndex: 2,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 3,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${sc}88, transparent 55%)`,
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
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 14px 14px 0",
            borderColor: `transparent ${sc}44 transparent transparent`,
            zIndex: 3,
          }}
        />

        <Box
          sx={{
            p: "16px 18px 14px 22px",
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          {/* Header: avatar + name */}
          <Stack direction="row" gap={1.25} alignItems="flex-start">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                flexShrink: 0,
                "& .MuiBadge-badge": {
                  bgcolor: sc,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "2px solid rgba(13,15,26,1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "3px",
                  background: `${sc}22`,
                  border: `1px solid ${sc}44`,
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  color: sc,
                }}
              >
                {player.avatar}
              </Avatar>
            </Badge>

            <Box flex={1} minWidth={0}>
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: T.text,
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {player.name}
                <Box
                  component="span"
                  sx={{
                    opacity: 0.35,
                    fontWeight: 400,
                    textTransform: "none",
                    fontSize: "0.72rem",
                    ml: 0.5,
                  }}
                >
                  {player.tag}
                </Box>
              </Typography>
              <Stack direction="row" alignItems="center" gap={0.5} mt={0.25}>
                <Clock size={9} color={T.textMuted} />
                <Typography
                  sx={{
                    fontFamily: T.RAJ,
                    fontWeight: 600,
                    fontSize: "0.6rem",
                    letterSpacing: "0.05em",
                    color: T.textMuted,
                    textTransform: "uppercase",
                  }}
                >
                  {player.lastActive}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Rank + Role */}
          <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
            <Chip
              label={player.rank.toUpperCase()}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.05)",
                color: T.textSub,
                border: `1px solid ${T.border}`,
                borderRadius: "2px",
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.06em",
                height: 20,
              }}
            />
            <Chip
              label={player.role.toUpperCase()}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.05)",
                color: T.textSub,
                border: `1px solid ${T.border}`,
                borderRadius: "2px",
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.06em",
                height: 20,
              }}
            />
          </Stack>

          {/* Agents */}
          {player.agents.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {player.agents.map((agent) => (
                <Chip
                  key={agent}
                  label={agent}
                  size="small"
                  sx={{
                    background: "rgba(255,255,255,0.03)",
                    color: T.textMuted,
                    border: `1px solid rgba(255,255,255,0.05)`,
                    borderRadius: "2px",
                    fontFamily: T.RAJ,
                    fontWeight: 600,
                    fontSize: "0.58rem",
                    height: 18,
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Bio */}
          {player.bio && (
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 500,
                fontSize: "0.72rem",
                color: T.textMuted,
                letterSpacing: "0.02em",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {player.bio}
            </Typography>
          )}

          <Divider
            sx={{ borderColor: "rgba(255,255,255,0.055)", mt: "auto" }}
          />

          {/* Actions */}
          <Stack direction="row" justifyContent="flex-end">
            {player.isFriend ? (
              <Button
                size="small"
                onClick={() => onMessage(player.id)}
                startIcon={<MessageCircle size={13} />}
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  height: 28,
                  borderRadius: "2px",
                  background: "rgba(34,197,94,0.1)",
                  color: T.green,
                  border: "1px solid rgba(34,197,94,0.25)",
                  "&:hover": { background: "rgba(34,197,94,0.18)" },
                }}
              >
                Message
              </Button>
            ) : player.requestSent ? (
              <Button
                size="small"
                disabled
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  height: 28,
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.04)",
                  color: T.textSub,
                  border: `1px solid ${T.border}`,
                }}
              >
                Sent
              </Button>
            ) : (
              <Button
                size="small"
                onClick={() => onSendRequest(player.id)}
                startIcon={<UserPlus size={13} />}
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  height: 28,
                  borderRadius: "2px",
                  background: T.accent,
                  color: "#fff",
                  border: "none",
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SocialPage() {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState(INITIAL_PLAYERS);

  const chatState = useChatRequests(INITIAL_REQUESTS);

  const handleSendRequest = useCallback((playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, requestSent: true } : p)),
    );
  }, []);

  const handleMessage = useCallback((playerId: string) => {
    console.log("open chat with", playerId);
  }, []);

  // Simulate an incoming request (for demo — wire to socket in prod)
  const handleSimulate = useCallback(() => {
    chatState.pushRequest({
      id: `req-${Date.now()}`,
      from: {
        id: `sim-${Date.now()}`,
        name: "FluxCore",
        tag: "#AP2",
        avatar: "FC",
        status: "online",
        rank: "Immortal I",
        role: "Duelist",
      },
      message: "Immortal pushing Radiant — want to duo queue?",
      sentAt: new Date().toISOString(),
      status: "pending",
    });
  }, [chatState]);

  const filtered = useMemo(
    () =>
      players.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.tag.toLowerCase().includes(search.toLowerCase()),
      ),
    [players, search],
  );

  const onlineCount = players.filter((p) => p.status === "online").length;
  const inGameCount = players.filter((p) => p.status === "in-game").length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* Page header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
        flexWrap="wrap"
        gap={1.5}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 900,
              fontSize: "1.8rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: T.text,
              lineHeight: 1,
            }}
          >
            Social Hub
          </Typography>
          <Typography
            sx={{
              color: T.textMuted,
              fontSize: "0.8rem",
              mt: 0.5,
              fontFamily: T.RAJ,
              fontWeight: 500,
            }}
          >
            Discover active players and send chat requests
          </Typography>
        </Box>

        {/* Simulate button — remove in prod */}
        <Button
          size="small"
          onClick={handleSimulate}
          sx={{
            fontFamily: T.RAJ,
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            height: 28,
            borderRadius: "2px",
            border: "1px dashed rgba(255,255,255,0.15)",
            color: T.textMuted,
            "&:hover": { borderColor: T.accent, color: T.accent },
          }}
        >
          + Simulate Request
        </Button>
      </Stack>

      {/* Stats row */}
      <Stack direction="row" gap={1} mb={2.5} flexWrap="wrap">
        {[
          { label: "Online", value: onlineCount, color: T.green },
          { label: "In Game", value: inGameCount, color: "#4fc3f7" },
          { label: "Total", value: players.length, color: T.textSub },
        ].map(({ label, value, color }) => (
          <Box
            key={label}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
              px: 1.1,
              py: "4px",
              borderRadius: "2px",
              background: `${color}12`,
              border: `1px solid ${color}28`,
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color,
              }}
            >
              {label}: {value}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Search */}
      <TextField
        placeholder="Search by name or tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={14} color={T.textMuted} />
            </InputAdornment>
          ),
          sx: {
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${T.border}`,
            borderRadius: "4px",
            fontFamily: T.RAJ,
            fontWeight: 600,
            fontSize: "0.82rem",
            "& fieldset": { border: "none" },
            "&:hover": { borderColor: T.borderHover },
            "&.Mui-focused": { borderColor: "rgba(255,70,85,0.4)" },
          },
        }}
        sx={{ mb: 2.5 }}
      />

      {/* Player grid */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
        }}
      >
        {filtered.map((player, idx) => (
          <PlayerCard
            key={player.id}
            player={player}
            index={idx}
            onSendRequest={handleSendRequest}
            onMessage={handleMessage}
          />
        ))}
      </Box>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Box
          sx={{
            py: 10,
            textAlign: "center",
            border: "1px dashed rgba(255,255,255,0.07)",
            borderRadius: "4px",
            mt: 2,
          }}
        >
          <Users
            size={36}
            color="rgba(74,84,112,0.4)"
            style={{ marginBottom: 12 }}
          />
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: T.textMuted,
            }}
          >
            No players found
          </Typography>
        </Box>
      )}

      {/* ── Chat request system (tray + button + drawer) ── */}
      <ChatRequestSystem {...chatState} />
    </Box>
  );
}
