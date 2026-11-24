/**
 * lobby-ui.tsx: every visual piece of the app in one file.
 *
 *   Panel, BrandMark, SquadSlots    shared building blocks
 *   MatchSearchForm                 search screen (+ VALORANT_REGIONS / RANKS)
 *   ConnectedPlayers                lobby: who is in the room, voice controls
 *   LobbyChat, PartyCodeShare       lobby: chat and party code
 *   HistoryStats                    community activity panel
 *
 * They are pure UI: all state and socket/voice logic live in pages/home-page.tsx.
 */
import type { SelectChangeEvent } from "@mui/material";
import type { Theme, SxProps } from "@mui/material/styles";

import { Crosshair } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

import { keyframes } from "@mui/material/styles";
import {
  Add,
  Mic,
  Send,
  Radar,
  MicOff,
  Person,
  ExitToApp,
  GraphicEq,
  TrendingUp,
  CheckCircle,
  ContentCopy,
  FiberManualRecord,
} from "@mui/icons-material";
import {
  Box,
  Stack,
  Alert,
  Avatar,
  Button,
  Select,
  Slider,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { tokens } from "../theme/theme";

import type {
  Telemetry,
  MatchData,
  QueueState,
  VoiceStatus,
  ChatMessage,
} from "../contexts/socket-context";

export const BrandMark: React.FC<{ heading?: boolean }> = ({
  heading = false,
}) => (
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
    <Typography variant="h6" component={heading ? "h1" : "span"}>
      Valorant 5th Finder
    </Typography>
  </Stack>
);

interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

/** One surface style for every card, so spacing and borders stay consistent. */
export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  icon,
  action,
  sx,
  children,
}) => (
  <Box
    component="section"
    sx={[
      {
        boxSizing: "border-box",
        minWidth: 0,
        p: { xs: 2, sm: 3 },
        bgcolor: tokens.surface,
        border: `1px solid ${tokens.line}`,
        borderRadius: "8px",
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {(title || action) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {icon}
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: tokens.muted, fontSize: "0.8rem" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
    )}
    {children}
  </Box>
);

const beckon = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
`;

interface SquadSlotsProps {
  /** How many of the five seats are taken. */
  filled: number;
  total?: number;
  /** Pulse the empty seats one after another while the queue is running. */
  searching?: boolean;
  size?: number;
}

/**
 * The five seats of a Valorant stack. This is the product in one picture:
 * it shows up on the sign-in page, in the search form and inside the lobby.
 */
export const SquadSlots: React.FC<SquadSlotsProps> = ({
  filled,
  total = 5,
  searching = false,
  size = 40,
}) => (
  <Box
    role="img"
    aria-label={`${filled} of ${total} seats filled`}
    sx={{ display: "flex", gap: 1, alignItems: "center" }}
  >
    {Array.from({ length: total }, (_, i) => {
      const isFilled = i < filled;
      return (
        <Box
          key={i}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            bgcolor: isFilled ? tokens.text : "transparent",
            color: isFilled ? tokens.bg : tokens.accent,
            border: isFilled ? "none" : `1.5px dashed ${tokens.accent}`,
            animation:
              !isFilled && searching
                ? `${beckon} 1.6s ease-in-out ${(i - filled) * 0.25}s infinite`
                : "none",
          }}
        >
          {isFilled ? (
            <Person sx={{ fontSize: size * 0.55 }} />
          ) : (
            <Add sx={{ fontSize: size * 0.5 }} />
          )}
        </Box>
      );
    })}
  </Box>
);

export const VALORANT_REGIONS: Record<string, string[]> = {
  NA: [
    "Ashburn (Virginia)",
    "Atlanta (Georgia)",
    "Chicago (Illinois)",
    "Dallas (Texas)",
    "Portland (Oregon)",
    "San Jose (California)",
  ],
  EU: [
    "Frankfurt (Germany)",
    "Paris (France)",
    "London (United Kingdom)",
    "Warsaw (Poland)",
    "Stockholm (Sweden)",
    "Madrid (Spain)",
    "Istanbul (Turkey)",
    "Dubai (United Arab Emirates)",
    "Manama (Bahrain)",
    "Cape Town (South Africa)",
  ],
  AP: [
    "Singapore",
    "Hong Kong",
    "Tokyo (Japan)",
    "Mumbai (India)",
    "Sydney (Australia)",
    "Manila (Philippines)",
  ],
  LATAM: [
    "Mexico City (Mexico)",
    "Santiago (Chile)",
    "Miami (Florida, USA)",
    "Bogotá (Colombia)",
  ],
  BR: ["São Paulo"],
  KR: ["Seoul"],
};

const TIERS = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Ascendant",
  "Immortal",
];
export const VALORANT_RANKS: string[] = [
  ...TIERS.flatMap((t) => [1, 2, 3].map((n) => `${t} ${n}`)),
  "Radiant",
];

// A mark at the first division of each tier, plus Radiant.
const RANK_MARKS = [
  ...TIERS.map((label, i) => ({ value: i * 3, label })),
  { value: VALORANT_RANKS.length - 1, label: "Radiant" },
];

export interface SearchForm {
  username: string;
  region: string;
  server: string;
  rank: string;
  minRank: string;
  maxRank: string;
  groupSize: number;
}

interface SearchFormProps {
  value: SearchForm;
  onChange: (patch: Partial<SearchForm>) => void;
  telemetry: Telemetry;
  queueState: QueueState;
  isConnected: boolean;
  onStart: () => void;
  onCancel: () => void;
}

const PARTY_LABELS: Record<number, string> = {
  1: "Solo",
  2: "Duo",
  3: "Trio",
  4: "Four",
};

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <Box sx={{ mt: 3 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        mb: 1,
        gap: 2,
      }}
    >
      <Typography variant="subtitle2">{label}</Typography>
      {hint && (
        <Typography sx={{ fontSize: "0.8rem", color: tokens.text }}>
          {hint}
        </Typography>
      )}
    </Box>
    {children}
  </Box>
);

const useElapsed = (running: boolean): string => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    setSeconds(0);
    if (!running) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

export const MatchSearchForm: React.FC<SearchFormProps> = ({
  value,
  onChange,
  telemetry,
  queueState,
  isConnected,
  onStart,
  onCancel,
}) => {
  const isSearching = queueState === "searching";
  const needed = 5 - value.groupSize;
  const elapsed = useElapsed(isSearching);

  const lo = VALORANT_RANKS.indexOf(value.minRank);
  const hi = VALORANT_RANKS.indexOf(value.maxRank);

  return (
    <Panel
      title="Find teammates"
      icon={<Radar sx={{ color: tokens.accent }} />}
      action={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <FiberManualRecord
            sx={{
              color: isConnected ? tokens.live : tokens.faint,
              fontSize: 10,
            }}
          />
          <Typography sx={{ fontSize: "0.8rem", color: tokens.muted }}>
            {telemetry.onlinePlayers} online, {telemetry.inQueueCount} searching
          </Typography>
        </Box>
      }
      sx={{ maxWidth: 720, mx: "auto" }}
    >
      <TextField
        fullWidth
        size="small"
        label="Riot ID"
        placeholder="Name#TAG"
        value={value.username}
        disabled={isSearching}
        onChange={(e) => onChange({ username: e.target.value })}
      />

      <Field
        label="Who is already with you?"
        hint={`Looking for ${needed} more`}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            flexWrap: "wrap",
          }}
        >
          <ToggleButtonGroup
            exclusive
            size="small"
            value={value.groupSize}
            disabled={isSearching}
            onChange={(_, v: number | null) => v && onChange({ groupSize: v })}
            aria-label="Current party size"
          >
            {[1, 2, 3, 4].map((n) => (
              <ToggleButton key={n} value={n} sx={{ px: 2 }}>
                {PARTY_LABELS[n]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <SquadSlots
            filled={value.groupSize}
            searching={isSearching}
            size={30}
          />
        </Box>
      </Field>

      <Field label="Region">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={value.region}
          disabled={isSearching}
          onChange={(_, v: string | null) =>
            v && onChange({ region: v, server: VALORANT_REGIONS[v][0] })
          }
          aria-label="Region"
          sx={{ flexWrap: "wrap" }}
        >
          {Object.keys(VALORANT_REGIONS).map((r) => (
            <ToggleButton key={r} value={r} sx={{ px: 2 }}>
              {r}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <FormControl
          fullWidth
          size="small"
          disabled={isSearching}
          sx={{ mt: 1.5 }}
        >
          <InputLabel>Server</InputLabel>
          <Select
            label="Server"
            value={value.server}
            onChange={(e: SelectChangeEvent) =>
              onChange({ server: e.target.value })
            }
          >
            {VALORANT_REGIONS[value.region].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Field>

      <Field
        label="Rank range you will play with"
        hint={`${value.minRank} to ${value.maxRank}`}
      >
        <Box sx={{ px: 1.5 }}>
          <Slider
            value={[lo, hi]}
            min={0}
            max={VALORANT_RANKS.length - 1}
            step={1}
            marks={RANK_MARKS}
            disabled={isSearching}
            disableSwap
            valueLabelDisplay="auto"
            valueLabelFormat={(i) => VALORANT_RANKS[i]}
            getAriaLabel={(i) => (i === 0 ? "Lowest rank" : "Highest rank")}
            onChange={(_, v) => {
              const [a, b] = v as number[];
              onChange({
                minRank: VALORANT_RANKS[a],
                maxRank: VALORANT_RANKS[b],
              });
            }}
            sx={{
              "& .MuiSlider-markLabel": {
                display: { xs: "none", md: "block" },
              },
            }}
          />
        </Box>

        <FormControl
          size="small"
          disabled={isSearching}
          sx={{ mt: 2, minWidth: 200 }}
        >
          <InputLabel>Your rank</InputLabel>
          <Select
            label="Your rank"
            value={value.rank}
            onChange={(e: SelectChangeEvent) =>
              onChange({ rank: e.target.value })
            }
          >
            {VALORANT_RANKS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Field>

      <Box sx={{ mt: 4 }}>
        {isSearching ? (
          <Box
            role="status"
            aria-live="polite"
            sx={{
              p: 2.5,
              textAlign: "center",
              borderRadius: "6px",
              border: `1px dashed ${tokens.accent}`,
              bgcolor: "rgba(255, 70, 85, 0.05)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
              <SquadSlots filled={value.groupSize} searching size={34} />
            </Box>
            <Typography sx={{ fontWeight: 600 }}>
              Searching {value.server} for {needed} teammate
              {needed > 1 ? "s" : ""}
            </Typography>
            <Typography
              sx={{ color: tokens.muted, fontSize: "0.85rem", mt: 0.5 }}
            >
              {elapsed} elapsed. You can leave this page open in the background.
            </Typography>
            <Button variant="outlined" onClick={onCancel} sx={{ mt: 2 }}>
              Cancel search
            </Button>
          </Box>
        ) : (
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={!isConnected}
            onClick={onStart}
            sx={{ py: 1.4, fontSize: "1.05rem" }}
          >
            {isConnected ? "Find my fifth" : "Connecting to server"}
          </Button>
        )}
      </Box>
    </Panel>
  );
};

interface PlayersProps {
  matchData: MatchData;
  region: string;
  server: string;
  localIdentity: string;
  speakingIds: string[];
  voiceStatus: VoiceStatus;
  isMuted: boolean;
  micDenied: boolean;
  audioBlocked: boolean;
  onToggleMic: () => void;
  onEnableAudio: () => void;
  onLeave: () => void;
}

const STATUS_LABEL: Record<VoiceStatus, string> = {
  idle: "Voice off",
  connecting: "Connecting voice",
  connected: "Voice live",
  failed: "Voice failed",
};

export const ConnectedPlayers: React.FC<PlayersProps> = ({
  matchData,
  region,
  server,
  localIdentity,
  speakingIds,
  voiceStatus,
  isMuted,
  micDenied,
  audioBlocked,
  onToggleMic,
  onEnableAudio,
  onLeave,
}) => {
  const seated = matchData.participants.reduce(
    (sum, p) => sum + p.currentGroupSize,
    0,
  );

  return (
    <Panel
      title="Squad room"
      subtitle={`${region}, ${server}`}
      action={
        <Box
          role="status"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            fontSize: "0.8rem",
            color: voiceStatus === "connected" ? tokens.live : tokens.muted,
          }}
        >
          <GraphicEq sx={{ fontSize: 18 }} />
          {STATUS_LABEL[voiceStatus]}
        </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 2.5,
        }}
      >
        <SquadSlots filled={Math.min(seated, 5)} size={30} />
        <Typography sx={{ color: tokens.muted, fontSize: "0.85rem" }}>
          {seated >= 5
            ? "Stack is full"
            : `${5 - seated} seat${5 - seated > 1 ? "s" : ""} still open`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
        }}
      >
        {matchData.participants.map((p) => {
          const isSelf = p.userId === localIdentity;
          const speaking = speakingIds.includes(p.userId);
          return (
            <Box
              key={p.userId}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                minWidth: 0,
                bgcolor: tokens.inset,
                borderRadius: "6px",
                border: `1px solid ${speaking ? tokens.live : tokens.line}`,
                transition: "border-color 0.15s",
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: tokens.text,
                  color: tokens.bg,
                  fontWeight: 700,
                  boxShadow: speaking ? `0 0 0 3px ${tokens.live}` : "none",
                  transition: "box-shadow 0.15s",
                }}
              >
                {p.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{ fontWeight: 600, fontSize: "0.92rem" }}
                >
                  {p.username}
                  {isSelf && (
                    <span style={{ color: tokens.muted, fontWeight: 400 }}>
                      {" "}
                      (you)
                    </span>
                  )}
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: "0.8rem",
                    color: tokens.accent,
                    fontWeight: 600,
                  }}
                >
                  {p.rank}
                </Typography>
                <Typography
                  noWrap
                  sx={{ fontSize: "0.75rem", color: tokens.muted }}
                >
                  {p.currentGroupSize === 1
                    ? "Solo"
                    : `Party of ${p.currentGroupSize}`}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {micDenied && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Microphone is blocked, so teammates can&lsquo;t hear you. Allow it in
          your browser&lsquo;s site settings, then press Unmute.
        </Alert>
      )}
      {audioBlocked && (
        <Alert
          severity="info"
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onEnableAudio}>
              Turn on sound
            </Button>
          }
        >
          Your browser is holding back voice until you interact.
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 1.5, mt: 2.5, flexWrap: "wrap" }}>
        <Button
          variant={isMuted ? "contained" : "outlined"}
          color={isMuted ? "primary" : "inherit"}
          onClick={onToggleMic}
          disabled={voiceStatus !== "connected"}
          startIcon={isMuted ? <MicOff /> : <Mic sx={{ color: tokens.live }} />}
          aria-pressed={isMuted}
          sx={{ minWidth: 130 }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </Button>
        <Button variant="outlined" onClick={onLeave} startIcon={<ExitToApp />}>
          Leave room
        </Button>
      </Box>
    </Panel>
  );
};

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const LobbyChat: React.FC<ChatProps> = ({
  messages,
  onSendMessage,
  disabled = false,
}) => {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    onSendMessage(text);
    setDraft("");
  };

  return (
    <Panel
      title="Chat"
      sx={{ display: "flex", flexDirection: "column", minHeight: 320 }}
    >
      <Box
        ref={scrollRef}
        role="log"
        aria-live="polite"
        sx={{
          flex: 1,
          minHeight: 200,
          maxHeight: { xs: 260, md: 380 },
          overflowY: "auto",
          overscrollBehavior: "contain",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1.5,
          mb: 1.5,
          bgcolor: tokens.inset,
          border: `1px solid ${tokens.line}`,
          borderRadius: "6px",
        }}
      >
        {messages.length === 0 && (
          <Typography sx={{ color: tokens.muted, fontSize: "0.85rem" }}>
            {disabled
              ? "Chat opens as soon as voice connects."
              : "Break the ice. Messages go straight to your teammate."}
          </Typography>
        )}

        {messages.map((m, i) => (
          <Box
            key={`${m.timestamp}-${i}`}
            sx={{
              alignSelf: m.self ? "flex-end" : "flex-start",
              maxWidth: "85%",
            }}
          >
            {!m.self && (
              <Typography
                sx={{ fontSize: "0.72rem", color: tokens.muted, mb: 0.3 }}
              >
                {m.sender}
              </Typography>
            )}
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                borderRadius: "10px",
                bgcolor: m.self ? "rgba(255, 70, 85, 0.18)" : tokens.surface,
                border: `1px solid ${m.self ? "rgba(255, 70, 85, 0.35)" : tokens.line}`,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                fontSize: "0.9rem",
              }}
            >
              {m.message}
            </Box>
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: tokens.faint,
                mt: 0.3,
                textAlign: m.self ? "right" : "left",
              }}
            >
              {m.timestamp}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box component="form" onSubmit={submit} sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a message"
          value={draft}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          inputProps={{ "aria-label": "Message", maxLength: 500 }}
        />
        <IconButton
          type="submit"
          aria-label="Send message"
          disabled={disabled || !draft.trim()}
          sx={{
            flexShrink: 0,
            borderRadius: "6px",
            bgcolor: tokens.accent,
            color: "#fff",
            "&:hover": { bgcolor: tokens.accentHover },
            "&.Mui-disabled": { bgcolor: tokens.inset, color: tokens.faint },
          }}
        >
          <Send sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Panel>
  );
};

interface PartyCodeProps {
  receivedPartyCode: string;
  onSendPartyCode: (code: string) => void;
  disabled?: boolean;
}

export const PartyCodeShare: React.FC<PartyCodeProps> = ({
  receivedPartyCode,
  onSendPartyCode,
  disabled = false,
}) => {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const code = input.trim();
    if (!code || disabled) return;
    onSendPartyCode(code);
    setInput("");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(receivedPartyCode);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the code is still visible to copy by hand */
    }
  };

  return (
    <Panel
      title="Party code"
      subtitle="Talk first. Share your in-game invite code when you're ready."
    >
      {receivedPartyCode && (
        <Box
          role="status"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 2,
            p: 1.5,
            pl: 2,
            borderRadius: "6px",
            bgcolor: "rgba(61, 220, 151, 0.08)",
            border: "1px solid rgba(61, 220, 151, 0.35)",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.75rem", color: tokens.muted }}>
              Current code
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: "1.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                wordBreak: "break-all",
                lineHeight: 1.2,
              }}
            >
              {receivedPartyCode}
            </Typography>
          </Box>
          <IconButton
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy party code"}
          >
            {copied ? (
              <CheckCircle sx={{ color: tokens.live }} />
            ) : (
              <ContentCopy />
            )}
          </IconButton>
        </Box>
      )}

      <Box component="form" onSubmit={send} sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Paste your party code"
          value={input}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          inputProps={{ "aria-label": "Party code", maxLength: 40 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={disabled || !input.trim()}
        >
          Share
        </Button>
      </Box>
    </Panel>
  );
};

export interface HistoryStatsData {
  totalVisits: number;
  /** Keys look like "AP-Mumbai (India)": region, a dash, then the server name. */
  searches: Record<string, number>;
}

const splitSearchKey = (key: string): { region: string; server: string } => {
  const dash = key.indexOf("-");
  return dash < 0
    ? { region: key, server: key }
    : { region: key.slice(0, dash), server: key.slice(dash + 1) };
};

export const HistoryStats: React.FC<{ data: HistoryStatsData }> = ({
  data,
}) => {
  const rows = Object.entries(data.searches)
    .map(([key, count]) => ({ key, count, ...splitSearchKey(key) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const max = rows[0]?.count ?? 1;

  return (
    <Panel
      title="Community activity"
      icon={<TrendingUp sx={{ color: tokens.live }} />}
      sx={{ mt: 2.5 }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(160px, 1fr) 3fr" },
          gap: { xs: 2.5, md: 4 },
          alignItems: "start",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: "2.6rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {data.totalVisits.toLocaleString()}
          </Typography>
          <Typography
            sx={{ color: tokens.muted, fontSize: "0.85rem", mt: 0.5 }}
          >
            players connected so far
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.2 }}>
            Most searched servers
          </Typography>
          {rows.length === 0 ? (
            <Typography sx={{ color: tokens.muted, fontSize: "0.85rem" }}>
              No searches yet. Yours will be the first.
            </Typography>
          ) : (
            <Box
              component="ul"
              sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.2 }}
            >
              {rows.map(({ key, region, server, count }) => (
                <Box
                  component="li"
                  key={key}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "minmax(0, 1fr) 40px",
                      sm: "minmax(0, 1.2fr) 2fr 48px",
                    },
                    alignItems: "center",
                    columnGap: 1.5,
                    rowGap: 0.5,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      {server}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.72rem", color: tokens.muted }}
                    >
                      {region}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      gridColumn: { xs: "1 / -1", sm: "auto" },
                      gridRow: { xs: 2, sm: "auto" },
                      height: 8,
                      borderRadius: 4,
                      bgcolor: tokens.inset,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${(count / max) * 100}%`,
                        bgcolor: tokens.accent,
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      color: tokens.muted,
                      textAlign: "right",
                    }}
                  >
                    {count.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Panel>
  );
};
