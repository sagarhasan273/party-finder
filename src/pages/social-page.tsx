import { motion } from "framer-motion";
import { useMemo, useState, useCallback } from "react";
import {
  Star,
  Users,
  Clock,
  Search,
  Swords,
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
  ToggleButton,
  InputAdornment,
  ToggleButtonGroup,
} from "@mui/material";

import { useChatRequests } from "../hooks/use-chat-requests";
import { ChatRequestSystem } from "../components/ChatRequestSystem";

import type { ChatRequest, SocialPlayer } from "../types/type-social";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(13,15,26,0.97)",
  bgCard: "rgba(14,16,28,0.97)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  accent: "#FF4655",
  text: "#dde3f0",
  textMuted: "rgba(74,84,112,1)",
  textSub: "#7f8fad",
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
  {
    id: "p7",
    name: "ZenithQ",
    tag: "#EU3",
    avatar: "ZQ",
    status: "online",
    lastActive: "Just now",
    rank: "Diamond III",
    role: "Controller",
    agents: ["Astra", "Viper"],
    isFriend: false,
    requestSent: false,
    bio: "Smokes main, love the strategic side of the game.",
    playstyle: "Strategic",
    winRate: 57,
    karma: 4.6,
  },
  {
    id: "p8",
    name: "RiftSlayer",
    tag: "#BR2",
    avatar: "RS",
    status: "in-game",
    lastActive: "In match",
    rank: "Platinum I",
    role: "Initiator",
    agents: ["Breach", "Gekko"],
    isFriend: false,
    requestSent: false,
    bio: "Always flashing for the team, never tilting.",
    playstyle: "Supportive",
    winRate: 53,
    karma: 4.1,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor = (status: SocialPlayer["status"]) => {
  if (status === "online") return T.green;
  if (status === "in-game") return T.blue;
  return "rgba(58,64,96,1)";
};

const statusLabel = (status: SocialPlayer["status"]) => {
  if (status === "online") return "Online";
  if (status === "in-game") return "In Game";
  return "Offline";
};

// ─── PlayerCard ───────────────────────────────────────────────────────────────

interface PlayerCardProps {
  player: SocialPlayer;
  index: number;
  onSendRequest: (id: string) => void;
  onMessage: (player: SocialPlayer) => void;
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
      transition={{ delay: index * 0.055, duration: 0.3, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          backgroundColor: T.bgCard,
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
            background: `linear-gradient(90deg, ${sc}77, transparent 55%)`,
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
            gap: 1.1,
          }}
        >
          {/* Header */}
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
                  border: "2px solid rgba(14,16,28,1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "3px",
                  background: `${sc}18`,
                  border: `1px solid ${sc}33`,
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.85rem",
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
                    opacity: 0.32,
                    fontWeight: 400,
                    textTransform: "none",
                    fontSize: "0.7rem",
                    ml: 0.5,
                  }}
                >
                  {player.tag}
                </Box>
              </Typography>
              <Stack direction="row" alignItems="center" gap={0.5} mt={0.3}>
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: sc,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: T.RAJ,
                    fontWeight: 600,
                    fontSize: "0.58rem",
                    letterSpacing: "0.07em",
                    color: sc,
                    textTransform: "uppercase",
                  }}
                >
                  {statusLabel(player.status)}
                </Typography>
                <Typography sx={{ color: T.textMuted, fontSize: "0.55rem" }}>
                  ·
                </Typography>
                <Clock size={9} color={T.textMuted} />
                <Typography
                  sx={{
                    fontFamily: T.RAJ,
                    fontWeight: 600,
                    fontSize: "0.58rem",
                    letterSpacing: "0.04em",
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
          <Stack direction="row" gap={0.6} flexWrap="wrap">
            {[player.rank, player.role].map((label) => (
              <Chip
                key={label}
                label={label.toUpperCase()}
                size="small"
                sx={{
                  background: "rgba(255,255,255,0.04)",
                  color: T.textSub,
                  border: `1px solid ${T.border}`,
                  borderRadius: "2px",
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.58rem",
                  letterSpacing: "0.06em",
                  height: 19,
                }}
              />
            ))}
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
                    background: "rgba(255,255,255,0.025)",
                    color: T.textMuted,
                    border: `1px solid rgba(255,255,255,0.05)`,
                    borderRadius: "2px",
                    fontFamily: T.RAJ,
                    fontWeight: 600,
                    fontSize: "0.56rem",
                    height: 17,
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Stats row */}
          <Stack direction="row" gap={1.5}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Swords size={10} color={T.textMuted} />
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  color: T.textSub,
                  letterSpacing: "0.04em",
                }}
              >
                {player.winRate}% WR
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Star size={10} color={T.textMuted} />
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  color: T.textSub,
                  letterSpacing: "0.04em",
                }}
              >
                {player.karma} Karma
              </Typography>
            </Stack>
            <Chip
              label={player.playstyle}
              size="small"
              sx={{
                background: "transparent",
                color: T.textMuted,
                border: `1px solid rgba(255,255,255,0.05)`,
                borderRadius: "2px",
                fontFamily: T.RAJ,
                fontWeight: 600,
                fontSize: "0.56rem",
                height: 17,
              }}
            />
          </Stack>

          {/* Bio */}
          {player.bio && (
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 500,
                fontSize: "0.7rem",
                color: T.textMuted,
                letterSpacing: "0.02em",
                lineHeight: 1.45,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {player.bio}
            </Typography>
          )}

          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mt: "auto" }} />

          {/* Actions */}
          <Stack direction="row" justifyContent="flex-end" gap={0.75}>
            {player.isFriend ? (
              <Button
                size="small"
                onClick={() => onMessage(player)}
                startIcon={<MessageCircle size={12} />}
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.65rem",
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
                  fontSize: "0.65rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  height: 28,
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.04)",
                  color: T.textSub,
                  border: `1px solid ${T.border}`,
                }}
              >
                Request Sent
              </Button>
            ) : (
              <Button
                size="small"
                onClick={() => onSendRequest(player.id)}
                startIcon={<UserPlus size={12} />}
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  height: 28,
                  borderRadius: "2px",
                  background: T.accent,
                  color: "#fff",
                  border: "none",
                  boxShadow: "none",
                  "&:hover": {
                    background: "#e03040",
                    boxShadow: "0 0 14px rgba(255,70,85,0.3)",
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

type FilterTab = "all" | "online" | "friends";

export function SocialPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [players, setPlayers] = useState(INITIAL_PLAYERS);

  const chatState = useChatRequests(INITIAL_REQUESTS);

  const handleSendRequest = useCallback((playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, requestSent: true } : p)),
    );
  }, []);

  const handleMessage = useCallback(
    (player: SocialPlayer) => {
      // Open a chat window directly for friends
      const fakeRequest = {
        id: `direct-${player.id}`,
        from: {
          id: player.id,
          name: player.name,
          tag: player.tag,
          avatar: player.avatar,
          status: player.status,
          rank: player.rank,
          role: player.role,
        },
        message: "",
        sentAt: new Date().toISOString(),
        status: "accepted" as const,
      };
      chatState.openChat(fakeRequest);
    },
    [chatState],
  );

  // Simulate incoming request
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

  const filtered = useMemo(() => {
    let list = players;
    if (filter === "online")
      list = list.filter(
        (p) => p.status === "online" || p.status === "in-game",
      );
    if (filter === "friends") list = list.filter((p) => p.isFriend);
    if (search)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.tag.toLowerCase().includes(search.toLowerCase()),
      );
    return list;
  }, [players, search, filter]);

  const onlineCount = players.filter((p) => p.status === "online").length;
  const inGameCount = players.filter((p) => p.status === "in-game").length;
  const friendCount = players.filter((p) => p.isFriend).length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* ── Page header ── */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={2.5}
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
              fontFamily: T.RAJ,
              fontWeight: 500,
              fontSize: "0.75rem",
              color: T.textMuted,
              mt: 0.5,
              letterSpacing: "0.04em",
            }}
          >
            Discover active players · send chat requests · start conversations
          </Typography>
        </Box>

        {/* Dev: simulate incoming request */}
        <Button
          size="small"
          onClick={handleSimulate}
          sx={{
            fontFamily: T.RAJ,
            fontWeight: 700,
            fontSize: "0.62rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            height: 28,
            borderRadius: "2px",
            border: "1px dashed rgba(255,255,255,0.12)",
            color: T.textMuted,
            "&:hover": { borderColor: T.accent, color: T.accent },
          }}
        >
          + Simulate Request
        </Button>
      </Stack>

      {/* ── Stats ── */}
      <Stack direction="row" gap={1} mb={2.5} flexWrap="wrap">
        {[
          { label: "Online", value: onlineCount, color: T.green },
          { label: "In Game", value: inGameCount, color: T.blue },
          { label: "Friends", value: friendCount, color: "#f59e0b" },
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
              background: `${color}10`,
              border: `1px solid ${color}25`,
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
                fontSize: "0.6rem",
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

      {/* ── Search + filter ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={1.5}
        mb={2.5}
        alignItems="center"
      >
        <TextField
          placeholder="Search by name or tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={13} color={T.textMuted} />
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
        />

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, v) => v && setFilter(v)}
          size="small"
          sx={{ flexShrink: 0 }}
        >
          {(["all", "online", "friends"] as FilterTab[]).map((tab) => (
            <ToggleButton
              key={tab}
              value={tab}
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                px: 1.5,
                py: "4px",
                borderRadius: "2px",
                border: `1px solid ${T.border}`,
                color: T.textMuted,
                "&.Mui-selected": {
                  background: "rgba(255,70,85,0.12)",
                  color: T.accent,
                  borderColor: "rgba(255,70,85,0.3)",
                },
                "&:hover": { borderColor: T.borderHover, color: T.text },
              }}
            >
              {tab}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {/* ── Player grid ── */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
            lg: "1fr 1fr 1fr 1fr",
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

      {/* ── Empty state ── */}
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

      {/* ── Chat request system + bottom chat windows ── */}
      <ChatRequestSystem {...chatState} />
    </Box>
  );
}
