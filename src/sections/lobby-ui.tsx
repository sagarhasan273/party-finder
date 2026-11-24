/**
 * lobby-ui.tsx: every visual piece of the app in one file.
 *
 *   Panel, BrandMark, SquadSlots, Pill, EqBars   shared building blocks
 *   MatchSearchForm                              search screen (+ VALORANT_REGIONS / RANKS)
 *   ConnectedPlayers                             lobby: who is in the room, voice controls
 *   LobbyChat, PartyCodeShare                    lobby: chat and party code
 *   HistoryStats                                 community activity panel
 *
 * They are pure UI: all state and socket/voice logic live in pages/home-page.tsx.
 */
import type { SelectChangeEvent } from "@mui/material";
import type { Theme, SxProps } from "@mui/material/styles";

import { Crosshair } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

import { alpha, keyframes } from "@mui/material/styles";
import {
  Add,
  Mic,
  Send,
  MicOff,
  Person,
  VolumeUp,
  ExitToApp,
  CheckCircle,
  ContentCopy,
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

import { fonts, tokens } from "../theme/theme";

import type {
  Telemetry,
  MatchData,
  QueueState,
  VoiceStatus,
  ChatMessage,
} from "../contexts/socket-context";

// ── Motion ────────────────────────────────────────────────────────────────────
const ping = keyframes`
  0% { box-shadow: 0 0 0 0 currentColor; }
  80%, 100% { box-shadow: 0 0 0 6px transparent; }
`;
const beckon = keyframes`
  0%, 100% { opacity: 0.45; transform: rotate(45deg) scale(0.92); }
  50% { opacity: 1; transform: rotate(45deg) scale(1.04); }
`;
const sweep = keyframes`to { transform: rotate(360deg); }`;
const blip = keyframes`
  0%, 55% { opacity: 0; transform: scale(0.4); }
  65% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1); }
`;
const bounce = keyframes`
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
`;

// ── Ranks ─────────────────────────────────────────────────────────────────────
const TIER_COLORS: Record<string, string> = {
  Iron: "#8E949C",
  Bronze: "#C58E5A",
  Silver: "#CBD3DC",
  Gold: "#EBBE55",
  Platinum: "#46C7CE",
  Diamond: "#C38EF7",
  Ascendant: "#3DDC97",
  Immortal: "#FF5A6A",
  Radiant: "#FFE7A0",
};

/** Tier colour for a rank such as "Gold 2". */
export const rankColor = (rank: string): string =>
  TIER_COLORS[rank.split(" ")[0]] ?? tokens.muted;

const RankText: React.FC<{ rank: string }> = ({ rank }) => (
  <Box component="span" sx={{ color: rankColor(rank), fontWeight: 700 }}>
    {rank}
  </Box>
);

// ── Shared building blocks ────────────────────────────────────────────────────
export const BrandMark: React.FC<{ heading?: boolean }> = ({
  heading = false,
}) => (
  <Stack direction="row" alignItems="center" gap={1.3}>
    <Box
      sx={{
        width: 34,
        height: 34,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 25,
          height: 25,
          transform: "rotate(45deg)",
          borderRadius: "3px",
          bgcolor: tokens.accent,
          display: "grid",
          placeItems: "center",
          boxShadow: `0 0 18px ${alpha(tokens.accent, 0.45)}`,
        }}
      >
        <Box sx={{ transform: "rotate(-45deg)", display: "grid" }}>
          <Crosshair size={15} color="#fff" strokeWidth={2.5} aria-hidden />
        </Box>
      </Box>
    </Box>
    <Typography
      variant="h6"
      component={heading ? "h1" : "span"}
      sx={{ fontSize: { xs: "1.05rem", sm: "1.15rem" }, whiteSpace: "nowrap" }}
    >
      Valorant{" "}
      <Box component="span" sx={{ color: tokens.accent }}>
        5th
      </Box>{" "}
      Finder
    </Typography>
  </Stack>
);

/** Small rounded status label with a coloured dot. */
export const Pill: React.FC<{
  color?: string;
  pulse?: boolean;
  children: React.ReactNode;
}> = ({ color = tokens.muted, pulse = false, children }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.9,
      px: 1.25,
      py: 0.55,
      borderRadius: 99,
      fontSize: "0.75rem",
      fontWeight: 600,
      whiteSpace: "nowrap",
      color,
      bgcolor: alpha(color, 0.1),
      border: `1px solid ${alpha(color, 0.28)}`,
    }}
  >
    <Box
      component="span"
      sx={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        bgcolor: "currentColor",
        animation: pulse ? `${ping} 1.8s ease-out infinite` : "none",
      }}
    />
    {children}
  </Box>
);

/** Three bouncing bars: someone is talking. */
export const EqBars: React.FC<{ color?: string; active?: boolean }> = ({
  color = tokens.live,
  active = true,
}) => (
  <Box
    aria-hidden
    sx={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 16 }}
  >
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 3,
          height: "100%",
          borderRadius: 2,
          bgcolor: color,
          transformOrigin: "bottom",
          transform: active ? undefined : "scaleY(0.3)",
          animation: active
            ? `${bounce} 0.9s ease-in-out ${i * 0.15}s infinite`
            : "none",
        }}
      />
    ))}
  </Box>
);

interface PanelProps {
  title?: string;
  subtitle?: string;
  /** Small mono label above the title, e.g. "01" or "Live". */
  eyebrow?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

/** One surface style for every card: hairline border, red corner tick. */
export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  eyebrow,
  icon,
  action,
  sx,
  children,
}) => (
  <Box
    component="section"
    sx={[
      {
        position: "relative",
        boxSizing: "border-box",
        minWidth: 0,
        p: { xs: 2, sm: 2.5 },
        bgcolor: alpha(tokens.surface, 0.92),
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.03), transparent 140px)",
        border: `1px solid ${tokens.line}`,
        borderRadius: "4px",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -1,
          left: -1,
          width: 36,
          height: 2,
          bgcolor: tokens.accent,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          right: -1,
          bottom: -1,
          width: 12,
          height: 12,
          borderRight: `2px solid ${tokens.lineStrong}`,
          borderBottom: `2px solid ${tokens.lineStrong}`,
          pointerEvents: "none",
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {(title || action) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          {eyebrow && (
            <Typography
              sx={{
                fontFamily: fonts.mono,
                fontSize: "0.7rem",
                color: tokens.accent,
                letterSpacing: "0.08em",
                mb: 0.4,
              }}
            >
              {eyebrow}
            </Typography>
          )}
          <Typography
            variant="h6"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {icon}
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{ color: tokens.muted, fontSize: "0.82rem", mt: 0.4 }}
            >
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

interface SquadSlotsProps {
  /** How many of the five seats are taken. */
  filled: number;
  total?: number;
  /** Pulse the empty seats one after another while the queue is running. */
  searching?: boolean;
  size?: number;
}

/**
 * The five seats of a Valorant stack, drawn as diamonds. The first open seat
 * is tinted red: that is the one we are filling.
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
    sx={{ display: "flex", gap: `${Math.round(size * 0.16)}px` }}
  >
    {Array.from({ length: total }, (_, i) => {
      const isFilled = i < filled;
      const isNext = i === filled;
      return (
        <Box
          key={i}
          sx={{
            width: size,
            height: size,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: "3px",
              transform: "rotate(45deg)",
              display: "grid",
              placeItems: "center",
              bgcolor: isFilled
                ? tokens.text
                : isNext
                  ? tokens.accentSoft
                  : "transparent",
              color: isFilled ? tokens.bg : tokens.accent,
              border: isFilled
                ? "none"
                : `1.5px dashed ${isNext ? tokens.accent : alpha(tokens.accent, 0.5)}`,
              boxShadow: isNext
                ? `0 0 16px ${alpha(tokens.accent, 0.35)}`
                : "none",
              animation:
                !isFilled && searching
                  ? `${beckon} 1.6s ease-in-out ${(i - filled) * 0.22}s infinite`
                  : "none",
            }}
          >
            <Box sx={{ transform: "rotate(-45deg)", display: "grid" }}>
              {isFilled ? (
                <Person sx={{ fontSize: size * 0.42 }} />
              ) : (
                <Add sx={{ fontSize: size * 0.4 }} />
              )}
            </Box>
          </Box>
        </Box>
      );
    })}
  </Box>
);

/** Rotating radar sweep shown while the queue runs. */
const RadarScope: React.FC<{ size?: number }> = ({ size = 84 }) => (
  <Box
    aria-hidden
    sx={{
      position: "relative",
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "50%",
      overflow: "hidden",
      border: `1px solid ${alpha(tokens.accent, 0.5)}`,
      background: `radial-gradient(circle, transparent 31%, ${alpha(tokens.accent, 0.28)} 32%, transparent 33.5%, transparent 63%, ${alpha(tokens.accent, 0.28)} 64%, transparent 65.5%)`,
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: `conic-gradient(from 0deg, ${alpha(tokens.accent, 0.6)}, transparent 28%)`,
        animation: `${sweep} 2.4s linear infinite`,
      },
      "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 8,
        height: 8,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        bgcolor: tokens.accent,
        boxShadow: `0 0 12px ${tokens.accent}`,
      },
    }}
  >
    {[
      { top: "24%", left: "66%", delay: 0 },
      { top: "68%", left: "28%", delay: 1.1 },
    ].map((b) => (
      <Box
        key={b.top}
        sx={{
          position: "absolute",
          top: b.top,
          left: b.left,
          width: 7,
          height: 7,
          borderRadius: "50%",
          bgcolor: tokens.live,
          boxShadow: `0 0 10px ${tokens.live}`,
          opacity: 0,
          animation: `${blip} 2.4s ease-out ${b.delay}s infinite`,
        }}
      />
    ))}
  </Box>
);

// ── Search screen ─────────────────────────────────────────────────────────────
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

/** Server value meaning "any server in the chosen region". */
export const ANY_SERVER = "Any";

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
  ...TIERS.map((label, i) => ({ value: i * 3, label: label.slice(0, 3) })),
  { value: VALORANT_RANKS.length - 1, label: "Rad" },
];

// The slider rail is painted with the tier colours, left to right.
const RAIL_GRADIENT = `linear-gradient(90deg, ${[...TIERS, "Radiant"]
  .map((t) => TIER_COLORS[t])
  .join(", ")})`;

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

const Step: React.FC<{
  n: string;
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}> = ({ n, label, hint, children }) => (
  <Box sx={{ mt: { xs: 2.5, sm: 3 } }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 2,
        mb: 1.25,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <Typography
          component="span"
          sx={{
            fontFamily: fonts.mono,
            fontSize: "0.7rem",
            color: tokens.accent,
          }}
        >
          {n}
        </Typography>
        <Typography variant="subtitle2" component="h3">
          {label}
        </Typography>
      </Box>
      {hint && (
        <Typography
          component="div"
          sx={{ fontSize: "0.82rem", color: tokens.text, textAlign: "right" }}
        >
          {hint}
        </Typography>
      )}
    </Box>
    {children}
  </Box>
);

/** Segmented toggle group with separate, gapped buttons instead of fused ones. */
const segmented = {
  gap: 1,
  "& .MuiToggleButtonGroup-grouped": {
    m: 0,
    border: `1px solid ${tokens.line} !important`,
    borderRadius: "4px !important",
  },
  "& .MuiToggleButtonGroup-grouped.Mui-selected": {
    borderColor: `${tokens.accent} !important`,
  },
} as const;

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
  const radarRef = useRef<HTMLDivElement | null>(null);

  // On a phone the search button sits at the bottom; bring the radar into view.
  useEffect(() => {
    if (isSearching)
      radarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isSearching]);

  const lo = VALORANT_RANKS.indexOf(value.minRank);
  const hi = VALORANT_RANKS.indexOf(value.maxRank);
  const anyRank = lo === 0 && hi === VALORANT_RANKS.length - 1;
  const anyServer = value.server === ANY_SERVER;

  return (
    <Panel
      eyebrow="MATCHMAKING"
      title="Find your fifth"
      action={
        <Pill
          color={isConnected ? tokens.live : tokens.faint}
          pulse={isConnected}
        >
          {telemetry.onlinePlayers} online · {telemetry.inQueueCount} searching
        </Pill>
      }
      sx={{ maxWidth: 760, mx: "auto" }}
    >
      {isSearching && (
        <Box
          ref={radarRef}
          role="status"
          aria-live="polite"
          sx={{
            mb: 1,
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
            textAlign: { xs: "center", sm: "left" },
            borderRadius: "4px",
            border: `1px solid ${alpha(tokens.accent, 0.35)}`,
            bgcolor: alpha(tokens.accent, 0.06),
          }}
        >
          <RadarScope />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {anyServer
                ? `Scanning all ${value.region} servers`
                : `Scanning ${value.server}`}
            </Typography>
            <Typography
              sx={{ color: tokens.muted, fontSize: "0.88rem", mt: 0.8 }}
            >
              Looking for {needed} teammate{needed > 1 ? "s" : ""}{" "}
              {anyRank ? (
                "of any rank"
              ) : (
                <>
                  from <RankText rank={value.minRank} /> to{" "}
                  <RankText rank={value.maxRank} />
                </>
              )}
              . You can leave this tab in the background.
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: fonts.mono,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                }}
                aria-label={`${elapsed} elapsed`}
              >
                {elapsed}
              </Typography>
              <Button variant="outlined" size="small" onClick={onCancel}>
                Cancel search
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          opacity: isSearching ? 0.55 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <Step n="01" label="Your Riot ID">
          <TextField
            fullWidth
            size="small"
            placeholder="Name#TAG"
            value={value.username}
            disabled={isSearching}
            onChange={(e) => onChange({ username: e.target.value })}
            inputProps={{
              "aria-label": "Riot ID",
              autoCapitalize: "off",
              autoCorrect: "off",
              spellCheck: false,
            }}
          />
        </Step>

        <Step
          n="02"
          label="Who's with you"
          hint={
            <Box
              component="span"
              sx={{ color: tokens.accent, fontWeight: 600 }}
            >
              Need {needed} more
            </Box>
          }
        >
          <ToggleButtonGroup
            exclusive
            value={value.groupSize}
            disabled={isSearching}
            onChange={(_, v: number | null) => v && onChange({ groupSize: v })}
            aria-label="Current party size"
            sx={{
              ...segmented,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            {[1, 2, 3, 4].map((n) => (
              <ToggleButton
                key={n}
                value={n}
                sx={{
                  flexDirection: "column",
                  gap: 0.25,
                  py: 0.75,
                  lineHeight: 1,
                }}
              >
                {PARTY_LABELS[n]}
                <Box
                  component="span"
                  sx={{
                    fontFamily: fonts.body,
                    fontWeight: 500,
                    fontSize: "0.64rem",
                    whiteSpace: "nowrap",
                    letterSpacing: 0,
                    textTransform: "none",
                    color: tokens.faint,
                  }}
                >
                  +{5 - n} needed
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>
            <SquadSlots
              filled={value.groupSize}
              searching={isSearching}
              size={30}
            />
          </Box>
        </Step>

        <Step n="03" label="Region and server">
          <ToggleButtonGroup
            exclusive
            value={value.region}
            disabled={isSearching}
            onChange={(_, v: string | null) =>
              v && onChange({ region: v, server: ANY_SERVER })
            }
            aria-label="Region"
            sx={{
              ...segmented,
              display: "flex",
              flexWrap: { xs: "nowrap", sm: "wrap" },
              overflowX: { xs: "auto", sm: "visible" },
              mx: { xs: -2, sm: 0 },
              px: { xs: 2, sm: 0 },
              pb: { xs: 0.5, sm: 0 },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {Object.keys(VALORANT_REGIONS).map((r) => (
              <ToggleButton key={r} value={r} sx={{ px: 1.8, flexShrink: 0 }}>
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
              renderValue={(s) =>
                s === ANY_SERVER ? `Any ${value.region} server` : s
              }
            >
              <MenuItem value={ANY_SERVER} sx={{ fontWeight: 600 }}>
                Any {value.region} server
                <Box
                  component="span"
                  sx={{ ml: 1, fontSize: "0.72rem", color: tokens.live }}
                >
                  fastest match
                </Box>
              </MenuItem>
              {VALORANT_REGIONS[value.region].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Step>

        <Step
          n="04"
          label="Rank range"
          hint={
            <ToggleButton
              value="any"
              size="small"
              selected={anyRank}
              disabled={isSearching}
              onChange={() =>
                onChange(
                  anyRank
                    ? { minRank: "Silver 1", maxRank: "Platinum 3" }
                    : {
                        minRank: VALORANT_RANKS[0],
                        maxRank: VALORANT_RANKS[VALORANT_RANKS.length - 1],
                      },
                )
              }
              sx={{
                minHeight: 28,
                px: 1.4,
                py: 0.2,
                fontSize: "0.76rem",
                border: `1px solid ${anyRank ? tokens.accent : tokens.line}`,
              }}
            >
              Any rank
            </ToggleButton>
          }
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 1,
              fontFamily: fonts.display,
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
              fontWeight: 800,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {anyRank ? (
              <Box component="span" sx={{ color: tokens.text }}>
                Any rank
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontFamily: fonts.body,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textTransform: "none",
                    color: tokens.muted,
                  }}
                >
                  Iron 1 to Radiant
                </Box>
              </Box>
            ) : (
              <>
                <RankText rank={value.minRank} />
                <Box
                  component="span"
                  sx={{ flex: 1, height: "1px", bgcolor: tokens.line, mx: 1 }}
                />
                <RankText rank={value.maxRank} />
              </>
            )}
          </Box>
          <Box sx={{ px: 1.2 }}>
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
              getAriaValueText={(i) => VALORANT_RANKS[i]}
              onChange={(_, v) => {
                const [a, b] = v as number[];
                onChange({
                  minRank: VALORANT_RANKS[a],
                  maxRank: VALORANT_RANKS[b],
                });
              }}
              sx={{
                height: 6,
                py: "16px",
                "& .MuiSlider-rail": {
                  background: RAIL_GRADIENT,
                  opacity: 0.35,
                  borderRadius: 1,
                },
                "& .MuiSlider-track": {
                  height: 12,
                  bgcolor: "transparent",
                  border: `2px solid ${tokens.text}`,
                  borderRadius: "3px",
                },
                "& .MuiSlider-thumb": {
                  width: 14,
                  height: 22,
                  borderRadius: "3px",
                  bgcolor: tokens.text,
                  boxShadow: `0 2px 10px rgba(0,0,0,0.5)`,
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: `0 0 0 6px ${alpha(tokens.text, 0.14)}`,
                  },
                },
                "& .MuiSlider-mark": { display: "none" },
                "& .MuiSlider-markLabel": {
                  fontSize: "0.68rem",
                  color: tokens.faint,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  display: { xs: "none", sm: "block" },
                },
                "& .MuiSlider-valueLabel": {
                  bgcolor: tokens.surfaceRaised,
                  border: `1px solid ${tokens.line}`,
                  fontWeight: 600,
                },
              }}
            />
          </Box>

          <FormControl
            size="small"
            disabled={isSearching}
            sx={{ mt: { xs: 1, sm: 2.5 }, width: { xs: "100%", sm: 220 } }}
          >
            <InputLabel>Your rank</InputLabel>
            <Select
              label="Your rank"
              value={value.rank}
              onChange={(e: SelectChangeEvent) =>
                onChange({ rank: e.target.value })
              }
              renderValue={(r) => <RankText rank={r} />}
              MenuProps={{ PaperProps: { sx: { maxHeight: 360 } } }}
            >
              {VALORANT_RANKS.map((r) => (
                <MenuItem key={r} value={r} sx={{ gap: 1.2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      transform: "rotate(45deg)",
                      bgcolor: rankColor(r),
                      flexShrink: 0,
                    }}
                  />
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Step>
      </Box>

      {!isSearching && (
        <Box
          sx={{
            // On phones the button sticks to the bottom of the screen.
            position: { xs: "sticky", sm: "static" },
            bottom: 0,
            zIndex: 2,
            mt: 3,
            mx: { xs: -2, sm: 0 },
            mb: { xs: -2, sm: 0 },
            px: { xs: 2, sm: 0 },
            pt: { xs: 2, sm: 0 },
            pb: { xs: "calc(16px + env(safe-area-inset-bottom))", sm: 0 },
            background: {
              xs: `linear-gradient(180deg, transparent, ${tokens.surface} 35%)`,
              sm: "none",
            },
          }}
        >
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={!isConnected}
            onClick={onStart}
            sx={{
              py: 1.1,
              fontSize: "1rem",
              boxShadow: `0 10px 30px ${alpha(tokens.accent, 0.25)}`,
            }}
          >
            {!isConnected
              ? "Connecting to server"
              : needed === 1
                ? "Find my fifth"
                : `Find ${needed} teammates`}
          </Button>
        </Box>
      )}
    </Panel>
  );
};

// ── Lobby: players + voice ────────────────────────────────────────────────────
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
  /** Your own Google photo, used when the server sends none for you. */
  localPhoto?: string;
}

const STATUS: Record<VoiceStatus, { label: string; color: string }> = {
  idle: { label: "Voice off", color: tokens.faint },
  connecting: { label: "Connecting", color: "#EBBE55" },
  connected: { label: "Voice live", color: tokens.live },
  failed: { label: "Voice failed", color: tokens.accent },
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
  localPhoto,
}) => {
  const micOn = voiceStatus === "connected" && !isMuted;
  const seated = matchData.participants.reduce(
    (sum, p) => sum + p.currentGroupSize,
    0,
  );
  const status = STATUS[voiceStatus];

  return (
    <Panel
      eyebrow={`${region} · ${server}`.toUpperCase()}
      title="Squad room"
      action={
        <Box role="status">
          <Pill color={status.color} pulse={voiceStatus === "connected"}>
            {status.label}
          </Pill>
        </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 2.5,
          p: 1.5,
          borderRadius: "4px",
          bgcolor: tokens.inset,
          border: `1px solid ${tokens.line}`,
        }}
      >
        <SquadSlots filled={Math.min(seated, 5)} size={26} />
        <Typography
          sx={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: seated >= 5 ? tokens.live : tokens.text,
          }}
        >
          {seated >= 5
            ? "Stack is full"
            : `${5 - seated} seat${5 - seated > 1 ? "s" : ""} open`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.25,
        }}
      >
        {matchData.participants.map((p) => {
          const isSelf = p.userId === localIdentity;
          const speaking = speakingIds.includes(p.userId);
          const color = rankColor(p.rank);
          // Photo from the server if it sends one (participant.profilePhoto),
          // otherwise your own Google photo for your card.
          const photo =
            (p as { profilePhoto?: string }).profilePhoto ||
            (isSelf ? localPhoto : undefined);
          // Green ring: your mic is on, or a teammate is talking.
          const ringOn = isSelf ? micOn : speaking;
          return (
            <Box
              key={p.userId}
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.25,
                pl: 1.75,
                minWidth: 0,
                overflow: "hidden",
                borderRadius: "4px",
                bgcolor: speaking ? alpha(tokens.live, 0.06) : tokens.inset,
                border: `1px solid ${speaking ? alpha(tokens.live, 0.6) : tokens.line}`,
                transition: "border-color 0.15s, background-color 0.15s",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  bgcolor: color,
                },
              }}
            >
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  src={photo}
                  alt={p.username}
                  imgProps={{ referrerPolicy: "no-referrer" }}
                  sx={{
                    width: 40,
                    height: 40,
                    fontFamily: fonts.display,
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    bgcolor: alpha(color, 0.14),
                    color,
                    border: `2px solid ${tokens.inset}`,
                    boxShadow: ringOn
                      ? `0 0 0 2px ${tokens.live}, 0 0 14px ${alpha(tokens.live, 0.45)}`
                      : `0 0 0 1px ${alpha(color, 0.5)}`,
                    transition: "box-shadow 0.15s",
                  }}
                >
                  {p.username.charAt(0).toUpperCase()}
                </Avatar>
                {isSelf && voiceStatus === "connected" && (
                  <Box
                    aria-label={micOn ? "Your mic is on" : "Your mic is muted"}
                    role="img"
                    sx={{
                      position: "absolute",
                      right: -3,
                      bottom: -3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      bgcolor: micOn ? tokens.live : tokens.accent,
                      border: `2px solid ${tokens.inset}`,
                    }}
                  >
                    {micOn ? (
                      <Mic sx={{ fontSize: 11, color: tokens.bg }} />
                    ) : (
                      <MicOff sx={{ fontSize: 11 }} />
                    )}
                  </Box>
                )}
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  noWrap
                  sx={{ fontWeight: 600, fontSize: "0.94rem" }}
                >
                  {p.username}
                  {isSelf && (
                    <Box
                      component="span"
                      sx={{ color: tokens.muted, fontWeight: 400 }}
                    >
                      {" "}
                      (you)
                    </Box>
                  )}
                </Typography>
                <Typography noWrap sx={{ fontSize: "0.8rem", mt: 0.2 }}>
                  <RankText rank={p.rank} />
                  <Box component="span" sx={{ color: tokens.faint }}>
                    {" · "}
                    {p.currentGroupSize === 1
                      ? "Solo"
                      : `Party of ${p.currentGroupSize}`}
                  </Box>
                </Typography>
              </Box>
              <EqBars
                active={speaking}
                color={speaking ? tokens.live : tokens.faint}
              />
            </Box>
          );
        })}
      </Box>

      {micDenied && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Microphone is blocked, so teammates can&rsquo;t hear you. Allow it in
          your browser&rsquo;s site settings, then press Unmute.
        </Alert>
      )}
      {audioBlocked && (
        <Alert
          severity="info"
          icon={<VolumeUp />}
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onEnableAudio}>
              Turn on
            </Button>
          }
        >
          Your browser is holding back voice until you tap.
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "auto auto" },
          justifyContent: { sm: "start" },
          gap: 1.25,
          mt: 2.5,
        }}
      >
        <Button
          variant={isMuted ? "contained" : "outlined"}
          color={isMuted ? "primary" : "inherit"}
          onClick={onToggleMic}
          disabled={voiceStatus !== "connected"}
          startIcon={isMuted ? <MicOff /> : <Mic />}
          aria-pressed={isMuted}
          sx={{
            minWidth: { sm: 140 },
            // Mic on: green. Muted: the red filled button.
            ...(isMuted
              ? {}
              : {
                  color: tokens.live,
                  borderColor: alpha(tokens.live, 0.55),
                  bgcolor: tokens.liveSoft,
                  "&:hover": {
                    borderColor: tokens.live,
                    bgcolor: alpha(tokens.live, 0.2),
                  },
                }),
          }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </Button>
        <Button
          variant="outlined"
          onClick={onLeave}
          startIcon={<ExitToApp />}
          sx={{
            color: tokens.accent,
            borderColor: alpha(tokens.accent, 0.6),
            "&:hover": {
              borderColor: tokens.accent,
              color: "#fff",
              bgcolor: tokens.accent,
            },
          }}
        >
          Leave
        </Button>
      </Box>
    </Panel>
  );
};

// ── Lobby: chat ───────────────────────────────────────────────────────────────
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
      title="Squad chat"
      subtitle="Only people in this room see it."
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box
        ref={scrollRef}
        role="log"
        aria-live="polite"
        sx={{
          flex: 1,
          minHeight: { xs: 260, md: 240 },
          maxHeight: { xs: "min(52svh, 440px)", md: 400 },
          overflowY: "auto",
          overscrollBehavior: "contain",
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
          p: 1.5,
          mb: 1.5,
          bgcolor: tokens.inset,
          border: `1px solid ${tokens.line}`,
          borderRadius: "4px",
        }}
      >
        {messages.length === 0 && (
          <Box
            sx={{ m: "auto", textAlign: "center", color: tokens.muted, px: 2 }}
          >
            <Typography
              sx={{
                fontFamily: fonts.display,
                fontSize: "1.2rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: tokens.text,
              }}
            >
              {disabled ? "Connecting…" : "Say hi"}
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", mt: 0.5 }}>
              {disabled
                ? "Chat opens as soon as voice connects."
                : "Agents, roles, comms. Sort it out before you queue."}
            </Typography>
          </Box>
        )}

        {messages.map((m, i) => (
          <Box
            key={`${m.timestamp}-${i}`}
            sx={{
              alignSelf: m.self ? "flex-end" : "flex-start",
              maxWidth: "82%",
            }}
          >
            {!m.self && (
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: tokens.muted,
                  mb: 0.3,
                  ml: 0.5,
                }}
              >
                {m.sender}
              </Typography>
            )}
            <Box
              sx={{
                px: 1.5,
                py: 0.9,
                borderRadius: m.self
                  ? "12px 12px 3px 12px"
                  : "12px 12px 12px 3px",
                bgcolor: m.self ? tokens.accent : tokens.surfaceRaised,
                color: m.self ? "#fff" : tokens.text,
                border: m.self ? "none" : `1px solid ${tokens.line}`,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                fontSize: "0.92rem",
                lineHeight: 1.4,
              }}
            >
              {m.message}
            </Box>
            <Typography
              sx={{
                fontSize: "0.66rem",
                color: tokens.faint,
                mt: 0.3,
                mx: 0.5,
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
          placeholder={disabled ? "Waiting for voice…" : "Message your squad"}
          value={draft}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          inputProps={{
            "aria-label": "Message",
            maxLength: 500,
            enterKeyHint: "send",
          }}
          sx={{ "& .MuiOutlinedInput-root": { minHeight: 40 } }}
        />
        <IconButton
          type="submit"
          aria-label="Send message"
          disabled={disabled || !draft.trim()}
          sx={{
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: "4px",
            bgcolor: tokens.accent,
            color: "#fff",
            "&:hover": { bgcolor: tokens.accentHover },
            "&.Mui-disabled": {
              bgcolor: tokens.inset,
              color: tokens.faint,
              border: `1px solid ${tokens.line}`,
            },
          }}
        >
          <Send sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Panel>
  );
};

// ── Lobby: party code ─────────────────────────────────────────────────────────
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
      subtitle="Talk first. Share your in-game code when you're ready."
    >
      {receivedPartyCode && (
        <Box
          role="status"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            mb: 2,
            p: 2,
            borderRadius: "4px",
            bgcolor: tokens.liveSoft,
            border: `1px dashed ${alpha(tokens.live, 0.55)}`,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: tokens.live,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Code ready
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.mono,
                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                fontWeight: 700,
                letterSpacing: "0.12em",
                wordBreak: "break-all",
                lineHeight: 1.2,
                mt: 0.3,
              }}
            >
              {receivedPartyCode}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={copy}
            startIcon={
              copied ? (
                <CheckCircle sx={{ color: tokens.live }} />
              ) : (
                <ContentCopy />
              )
            }
            aria-label={copied ? "Copied" : "Copy party code"}
            sx={{ flexShrink: 0 }}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
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
          inputProps={{
            "aria-label": "Party code",
            maxLength: 40,
            autoCapitalize: "characters",
            autoCorrect: "off",
            spellCheck: false,
            style: { fontFamily: fonts.mono, letterSpacing: "0.08em" },
          }}
          sx={{ "& .MuiOutlinedInput-root": { minHeight: 40 } }}
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

// ── Community activity ────────────────────────────────────────────────────────
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
    <Panel eyebrow="COMMUNITY" title="Where people queue" sx={{ mt: 2.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(180px, 1fr) 3fr" },
          gap: { xs: 2.5, md: 4 },
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: "4px",
            bgcolor: tokens.inset,
            border: `1px solid ${tokens.line}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.display,
              fontSize: { xs: "2.2rem", sm: "2.5rem" },
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {data.totalVisits.toLocaleString()}
          </Typography>
          <Typography
            sx={{ color: tokens.muted, fontSize: "0.82rem", mt: 0.6 }}
          >
            players connected so far
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Most searched servers
          </Typography>
          {rows.length === 0 ? (
            <Typography sx={{ color: tokens.muted, fontSize: "0.85rem" }}>
              No searches yet. Yours will be the first.
            </Typography>
          ) : (
            <Box
              component="ol"
              sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.4 }}
            >
              {rows.map(({ key, region, server, count }, i) => (
                <Box
                  component="li"
                  key={key}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "22px minmax(0, 1fr) auto",
                      sm: "26px minmax(0, 1.1fr) 2fr 52px",
                    },
                    alignItems: "center",
                    columnGap: 1.5,
                    rowGap: 0.6,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fonts.mono,
                      fontSize: "0.72rem",
                      color: i === 0 ? tokens.accent : tokens.faint,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ fontWeight: 600, fontSize: "0.86rem", minWidth: 0 }}
                  >
                    {server}{" "}
                    <Box
                      component="span"
                      sx={{
                        fontSize: "0.7rem",
                        color: tokens.faint,
                        fontWeight: 600,
                        ml: 0.5,
                      }}
                    >
                      {region}
                    </Box>
                  </Typography>
                  <Box
                    sx={{
                      gridColumn: { xs: "2 / -1", sm: "auto" },
                      gridRow: { xs: 2, sm: "auto" },
                      height: 6,
                      borderRadius: 1,
                      bgcolor: tokens.inset,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${(count / max) * 100}%`,
                        borderRadius: 1,
                        background:
                          i === 0
                            ? `linear-gradient(90deg, ${alpha(tokens.accent, 0.6)}, ${tokens.accent})`
                            : `linear-gradient(90deg, ${alpha(tokens.text, 0.15)}, ${alpha(tokens.text, 0.45)})`,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      color: tokens.muted,
                      textAlign: "right",
                      fontFamily: fonts.mono,
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
