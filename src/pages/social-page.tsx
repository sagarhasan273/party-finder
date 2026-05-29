import { Users, Search } from "lucide-react";
import { useState, useCallback } from "react";

import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import { mockPlayers } from "../@mock";
import { PlayerCard } from "../sections/section-social";
import { useChatRequests } from "../hooks/use-chat-requests";
import { ChatInboxButton } from "../components/ChatInboxButton";
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SocialPage() {
  const [search, setSearch] = useState("");

  const [players, setPlayers] = useState(mockPlayers);

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

  const onlineCount = players.filter((p) => p.status === "online").length;
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

        <ChatInboxButton
          visible={chatState.showInboxButton}
          count={chatState.pendingCount}
          onClick={chatState.openDrawer}
        />
        <ChatInboxButton
          visible={chatState.showInboxButton}
          count={chatState.pendingCount}
          onClick={chatState.openDrawer}
        />
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
        {players.map((player, idx) => (
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
      {players.length === 0 && (
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
