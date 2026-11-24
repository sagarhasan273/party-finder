/**
 * home-page.tsx: all app logic. The UI pieces are in sections/lobby-ui.tsx,
 * the network code is in realtime.tsx.
 *
 *   socket.io  -> matchmaking (queue, match-found, telemetry, stats)
 *   LiveKit    -> voice + chat + party code once a match is found
 *
 * Layout: on desktop the lobby is a two-column grid. On phones it becomes
 * three tabs (Squad / Chat / Code) with an unread badge on Chat.
 */
import React, { useState, useEffect, useCallback } from "react";

import { Logout } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Tab,
  Menu,
  Tabs,
  Alert,
  Badge,
  Avatar,
  Button,
  Dialog,
  MenuItem,
  Container,
  Typography,
  IconButton,
  DialogTitle,
  ListItemIcon,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from "@mui/material";

import { CONFIG } from "../config-global";
import { fonts, tokens } from "../theme/theme";
import { useCredentials } from "../core/slices";
import ConnectWithMe from "../components/connect-with-me";
import { Talk2ActiveCard } from "../components/talk2active-card";
import { useSocket, useLiveKitRoom } from "../contexts/socket-context";
import {
  Pill,
  BrandMark,
  LobbyChat,
  ANY_SERVER,
  HistoryStats,
  PartyCodeShare,
  MatchSearchForm,
  ConnectedPlayers,
} from "../sections/lobby-ui";

import type { SearchForm, HistoryStatsData } from "../sections/lobby-ui";
import type {
  MatchData,
  Telemetry,
  QueueState,
  ChatMessage,
  SearchRequest,
  DataChannelPayload,
} from "../contexts/socket-context";

type LobbyTab = "squad" | "chat" | "code";

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
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });

  const [form, setForm] = useState<SearchForm>({
    username: initialRiotId(user),
    region: "AP",
    server: ANY_SERVER,
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

  // Mobile lobby tabs + unread counter for the Chat tab.
  const [tab, setTab] = useState<LobbyTab>("squad");
  const [seenIncoming, setSeenIncoming] = useState(0);
  const incoming = messages.filter((m) => !m.self).length;
  useEffect(() => {
    if (isDesktop || tab === "chat") setSeenIncoming(incoming);
  }, [isDesktop, tab, incoming]);
  const unread = Math.max(0, incoming - seenIncoming);

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
    setTab("squad");
    setSeenIncoming(0);
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
        setTab("squad");
        setSeenIncoming(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
        try {
          await connect(CONFIG.livekitUrl, d.livekit.token);
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
  const voiceReady = voice.status === "connected";

  const players = inLobby ? (
    <ConnectedPlayers
      matchData={match}
      region={form.region}
      server={form.server === ANY_SERVER ? "Any server" : form.server}
      localIdentity={voice.localIdentity}
      speakingIds={voice.speakingIds}
      voiceStatus={voice.status}
      isMuted={voice.isMuted}
      micDenied={voice.micDenied}
      audioBlocked={voice.audioBlocked}
      onToggleMic={voice.toggleMic}
      onEnableAudio={voice.enableAudio}
      onLeave={leaveLobby}
      localPhoto={profile.profilePhoto}
    />
  ) : null;
  const code = (
    <PartyCodeShare
      receivedPartyCode={partyCode}
      onSendPartyCode={sendPartyCode}
      disabled={!voiceReady}
    />
  );
  const chat = (
    <LobbyChat
      messages={messages}
      onSendMessage={sendChat}
      disabled={!voiceReady}
    />
  );

  return (
    <Container
      maxWidth="lg"
      sx={{ px: { xs: 1.5, sm: 3 }, pt: 0, pb: { xs: 3, sm: 5 } }}
    >
      <Dialog
        open={peerLeftOpen}
        onClose={() => setPeerLeftOpen(false)}
        PaperProps={{ sx: { minWidth: { xs: "88vw", sm: 420 } } }}
      >
        <DialogTitle
          sx={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: "1.4rem",
            textTransform: "uppercase",
            pb: 0.5,
          }}
        >
          Your teammate left
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: tokens.muted }}>
            The room is closed. Jump back in and we&rsquo;ll find someone new.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            fullWidth
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
          position: "sticky",
          top: 0,
          zIndex: 10,
          mx: { xs: -1.5, sm: -3 },
          px: { xs: 1.5, sm: 3 },
          py: 1.25,
          mb: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          bgcolor: alpha(tokens.bg, 0.78),
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${tokens.line}`,
        }}
      >
        <BrandMark heading />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {inLobby ? (
              <Pill color={tokens.live} pulse>
                In a squad
              </Pill>
            ) : (
              <Pill
                color={isConnected ? tokens.live : tokens.faint}
                pulse={isConnected}
              >
                {isConnected ? "Online" : "Offline"}
              </Pill>
            )}
          </Box>
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            aria-label="Account menu"
            aria-haspopup="menu"
            sx={{ p: 0.4, border: `1px solid ${tokens.line}` }}
          >
            <Avatar
              src={profile.profilePhoto}
              alt={profile.name ?? "Account"}
              imgProps={{ referrerPolicy: "no-referrer" }}
              sx={{
                width: 30,
                height: 30,
                bgcolor: tokens.surfaceRaised,
                color: tokens.text,
              }}
            >
              {profile.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderBottom: `1px solid ${tokens.line}`,
              mb: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: tokens.faint,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Signed in as
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }} noWrap>
              {profile.name}
            </Typography>
          </Box>
          <MenuItem onClick={signOut} sx={{ minHeight: 44 }}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
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
        isDesktop ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "7fr 5fr",
              gap: 2.5,
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gap: 2.5,
                alignContent: "start",
                minWidth: 0,
              }}
            >
              {players}
              {code}
            </Box>
            {chat}
          </Box>
        ) : (
          <Box>
            <Tabs
              value={tab}
              onChange={(_, v: LobbyTab) => setTab(v)}
              variant="fullWidth"
              aria-label="Lobby sections"
              sx={{
                mb: 2,
                minHeight: 44,
                bgcolor: tokens.surface,
                border: `1px solid ${tokens.line}`,
                borderRadius: "4px",
                "& .MuiTabs-indicator": { height: 3, bgcolor: tokens.accent },
              }}
            >
              <Tab value="squad" label="Squad" />
              <Tab
                value="chat"
                label={
                  <Badge
                    color="primary"
                    badgeContent={unread}
                    max={9}
                    sx={{ "& .MuiBadge-badge": { right: -12 } }}
                  >
                    Chat
                  </Badge>
                }
              />
              <Tab
                value="code"
                label={
                  <Badge
                    color="success"
                    variant="dot"
                    invisible={!partyCode}
                    sx={{ "& .MuiBadge-badge": { right: -8 } }}
                  >
                    Code
                  </Badge>
                }
              />
            </Tabs>
            {/* All three stay mounted so drafts survive switching tabs. */}
            <Box sx={{ display: tab === "squad" ? "block" : "none" }}>
              {players}
            </Box>
            <Box sx={{ display: tab === "chat" ? "block" : "none" }}>
              {chat}
            </Box>
            <Box sx={{ display: tab === "code" ? "block" : "none" }}>
              {code}
            </Box>
          </Box>
        )
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

      <Box sx={{ maxWidth: inLobby ? "none" : 760, mx: "auto" }}>
        <HistoryStats data={history} />
        {/* Full card on the search screen, slim banner inside a match. */}
        <Talk2ActiveCard variant={inLobby ? "strip" : "full"} />
        <ConnectWithMe />
      </Box>
    </Container>
  );
}
