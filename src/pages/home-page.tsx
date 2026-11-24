import { Crosshair } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

import {
  Box,
  Menu,
  Alert,
  Stack,
  Avatar,
  Button,
  Dialog,
  MenuItem,
  Container,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { tokens } from "../theme/theme";
import { CONFIG } from "../config-global";
import { useCredentials } from "../core/slices";
import { useSocket } from "../contexts/socket-context";
import ConnectWithMe from "../components/connect-with-me";
import { useLiveKitRoom } from "../hooks/use-livekit-room";
import { LobbyChat } from "../sections/match-making/lobby-chat";
import { PartyCodeShare } from "../sections/match-making/party-code-share";
import { ConnectedPlayers } from "../sections/match-making/connected-players";
import {
  HistoryStats,
  type HistoryStatsData,
} from "../sections/match-making/history-stats";
import {
  type SearchForm,
  MatchSearchForm,
  VALORANT_REGIONS,
} from "../sections/match-making/match-search-form";

import type {
  Telemetry,
  MatchData,
  QueueState,
  ChatMessage,
  SearchRequest,
  DataChannelPayload,
} from "../types/type-common";

const clock = (): string =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Pre-fills the Riot ID from the profile when the user has saved one. */
const initialRiotId = (user: unknown): string => {
  const u = (user ?? {}) as Record<string, unknown>;
  if (u.gamename && u.tagline) return `${u.gamename}#${u.tagline}`;
  return "";
};

export function HomePage(): React.JSX.Element {
  const { emit, on, isConnected } = useSocket();
  const { user, logout } = useCredentials();

  const [form, setForm] = useState<SearchForm>({
    username: initialRiotId(user),
    region: "AP",
    server: VALORANT_REGIONS.AP[0],
    rank: "Gold 2",
    minRank: "Silver 1",
    maxRank: "Platinum 3",
    groupSize: 1,
  });
  const patchForm = useCallback(
    (patch: Partial<SearchForm>) => setForm((f) => ({ ...f, ...patch })),
    [],
  );

  const [telemetry, setTelemetry] = useState<Telemetry>({
    onlinePlayers: 1,
    inQueueCount: 0,
  });
  const [queueState, setQueueState] = useState<QueueState>("idle");
  const [match, setMatch] = useState<MatchData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [partyCode, setPartyCode] = useState("");
  const [error, setError] = useState("");
  const [peerLeftOpen, setPeerLeftOpen] = useState(false);
  const [history, setHistory] = useState<HistoryStatsData>({
    totalVisits: 0,
    searches: {},
  });
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  // ── Voice + data channel (LiveKit) ─────────────────────────────────────────
  const handleData = (payload: DataChannelPayload, senderName: string) => {
    if (payload.type === "CHAT") {
      setMessages((m) => [
        ...m,
        {
          sender: senderName,
          message: payload.message,
          timestamp: payload.timestamp,
        },
      ]);
    } else if (payload.type === "PARTY_CODE") {
      setPartyCode(payload.partyCode);
    }
  };

  const voice = useLiveKitRoom({ onData: handleData });
  const { connect, disconnect } = voice;

  const resetLobby = useCallback(() => {
    setMatch(null);
    setMessages([]);
    setPartyCode("");
    setQueueState("idle");
  }, []);

  // ── Matchmaking events (socket.io) ─────────────────────────────────────────
  useEffect(() => {
    const offs = [
      on<Telemetry>("telemetry-update", setTelemetry),
      on<HistoryStatsData>("history-stats", setHistory),
      on<{ status: QueueState }>("queue-status", (d) =>
        setQueueState(d.status),
      ),
      on<{ message: string }>("error-msg", (d) => {
        setError(d.message);
        setQueueState("idle");
      }),
      on<MatchData>("match-found", async (d) => {
        setMatch(d);
        setQueueState("matched");
        setError("");
        setMessages([]);
        setPartyCode("");
        try {
          await connect(d.livekit.url, d.livekit.token);
        } catch {
          setError("Voice couldn't connect. Leave the room and search again.");
        }
      }),
      on("peer-left", () => {
        disconnect();
        resetLobby();
        setPeerLeftOpen(true);
      }),
    ];
    return () => offs.forEach((off) => off());
  }, [on, connect, disconnect, resetLobby]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const startSearch = () => {
    const riotId = form.username.trim();
    if (!/^.{3,16}#[A-Za-z0-9]{3,5}$/.test(riotId)) {
      setError("Enter your Riot ID as Name#TAG, for example Sova#1234.");
      return;
    }
    setError("");
    setQueueState("searching");
    const req: SearchRequest = {
      username: riotId,
      region: form.region,
      server: form.server,
      rank: form.rank,
      minRank: form.minRank,
      maxRank: form.maxRank,
      currentGroupSize: form.groupSize,
    };
    emit("start-search", req);
  };

  const cancelSearch = () => {
    emit("cancel-search");
    setQueueState("idle");
  };

  const leaveLobby = async () => {
    emit("leave-room");
    await disconnect();
    resetLobby();
  };

  const sendChat = (text: string) => {
    const timestamp = clock();
    if (voice.sendData({ type: "CHAT", message: text, timestamp })) {
      setMessages((m) => [
        ...m,
        { sender: form.username, message: text, timestamp, self: true },
      ]);
    } else {
      setError("Message not sent. Voice is still connecting.");
    }
  };

  const sendPartyCode = (code: string) => {
    if (voice.sendData({ type: "PARTY_CODE", partyCode: code }))
      setPartyCode(code);
    else setError("Code not sent. Voice is still connecting.");
  };

  const signOut = async () => {
    setMenuAnchor(null);
    if (match) await leaveLobby();
    sessionStorage.removeItem(CONFIG.googleAccessToken);
    logout();
  };

  const profile = (user ?? {}) as { name?: string; profilePhoto?: string };
  const inLobby = queueState === "matched" && match;

  return (
    <Container
      maxWidth="lg"
      sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 } }}
    >
      <Dialog
        open={peerLeftOpen}
        onClose={() => setPeerLeftOpen(false)}
        PaperProps={{
          sx: {
            border: `1px solid ${tokens.line}`,
            minWidth: { xs: "88vw", sm: 400 },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: "1.5rem",
          }}
        >
          Your teammate left
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: tokens.muted }}>
            The room is closed. Search again to find someone new.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => setPeerLeftOpen(false)}
            autoFocus
          >
            Back to search
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        component="header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${tokens.line}`,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1.2}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "6px",
              bgcolor: tokens.accent,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Crosshair size={17} color="#fff" aria-hidden />
          </Box>
          <Typography variant="h6" component="h1">
            Valorant 5th Finder
          </Typography>
        </Stack>

        <IconButton
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          aria-label="Account menu"
          aria-haspopup="menu"
          sx={{ p: 0.5 }}
        >
          <Avatar
            src={profile.profilePhoto}
            alt={profile.name ?? "Account"}
            imgProps={{ referrerPolicy: "no-referrer" }}
            sx={{ width: 34, height: 34 }}
          >
            {profile.name?.charAt(0)}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem
            disabled
            sx={{
              opacity: "1 !important",
              fontSize: "0.85rem",
              color: tokens.muted,
            }}
          >
            {profile.name}
          </MenuItem>
          <MenuItem onClick={signOut}>Sign out</MenuItem>
        </Menu>
      </Box>

      {error && (
        <Alert
          severity="error"
          role="alert"
          onClose={() => setError("")}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {inLobby ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
            gap: 2,
          }}
        >
          <Box
            sx={{ display: "grid", gap: 2, alignContent: "start", minWidth: 0 }}
          >
            <ConnectedPlayers
              matchData={match}
              region={form.region}
              server={form.server}
              localIdentity={voice.localIdentity}
              speakingIds={voice.speakingIds}
              voiceStatus={voice.status}
              isMuted={voice.isMuted}
              micDenied={voice.micDenied}
              audioBlocked={voice.audioBlocked}
              onToggleMic={voice.toggleMic}
              onEnableAudio={voice.enableAudio}
              onLeave={leaveLobby}
            />
            <PartyCodeShare
              receivedPartyCode={partyCode}
              onSendPartyCode={sendPartyCode}
              disabled={voice.status !== "connected"}
            />
          </Box>
          <LobbyChat
            messages={messages}
            onSendMessage={sendChat}
            disabled={voice.status !== "connected"}
          />
        </Box>
      ) : (
        <MatchSearchForm
          value={form}
          onChange={patchForm}
          telemetry={telemetry}
          queueState={queueState}
          isConnected={isConnected}
          onStart={startSearch}
          onCancel={cancelSearch}
        />
      )}

      <Box sx={{ maxWidth: inLobby ? "none" : 720, mx: "auto" }}>
        <HistoryStats data={history} />
      </Box>
      <ConnectWithMe />
    </Container>
  );
}
