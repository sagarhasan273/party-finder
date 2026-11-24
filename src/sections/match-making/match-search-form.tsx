import type { SelectChangeEvent } from "@mui/material";

import React, { useState, useEffect } from "react";

import { Radar, FiberManualRecord } from "@mui/icons-material";
import {
  Box,
  Button,
  Select,
  Slider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { tokens } from "../../theme/theme";
import { Panel } from "../../components/panel";
import { SquadSlots } from "../../components/squad-slots";

import type { Telemetry, QueueState } from "../../types/type-common";

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
  AP: ["Singapore", "Hong Kong", "Tokyo (Japan)", "Mumbai (India)", "Sydney (Australia)", "Manila (Philippines)"],
  LATAM: ["Mexico City (Mexico)", "Santiago (Chile)", "Miami (Florida, USA)", "Bogotá (Colombia)"],
  BR: ["São Paulo"],
  KR: ["Seoul"],
};

const TIERS = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ascendant", "Immortal"];
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

interface Props {
  value: SearchForm;
  onChange: (patch: Partial<SearchForm>) => void;
  telemetry: Telemetry;
  queueState: QueueState;
  isConnected: boolean;
  onStart: () => void;
  onCancel: () => void;
}

const PARTY_LABELS: Record<number, string> = { 1: "Solo", 2: "Duo", 3: "Trio", 4: "Four" };

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <Box sx={{ mt: 3 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1, gap: 2 }}>
      <Typography variant="subtitle2">{label}</Typography>
      {hint && <Typography sx={{ fontSize: "0.8rem", color: tokens.text }}>{hint}</Typography>}
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

export const MatchSearchForm: React.FC<Props> = ({
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
          <FiberManualRecord sx={{ color: isConnected ? tokens.live : tokens.faint, fontSize: 10 }} />
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

      <Field label="Who is already with you?" hint={`Looking for ${needed} more`}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap" }}>
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
          <SquadSlots filled={value.groupSize} searching={isSearching} size={30} />
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

        <FormControl fullWidth size="small" disabled={isSearching} sx={{ mt: 1.5 }}>
          <InputLabel>Server</InputLabel>
          <Select
            label="Server"
            value={value.server}
            onChange={(e: SelectChangeEvent) => onChange({ server: e.target.value })}
          >
            {VALORANT_REGIONS[value.region].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Field>

      <Field label="Rank range you will play with" hint={`${value.minRank} to ${value.maxRank}`}>
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
              onChange({ minRank: VALORANT_RANKS[a], maxRank: VALORANT_RANKS[b] });
            }}
            sx={{ "& .MuiSlider-markLabel": { display: { xs: "none", md: "block" } } }}
          />
        </Box>

        <FormControl size="small" disabled={isSearching} sx={{ mt: 2, minWidth: 200 }}>
          <InputLabel>Your rank</InputLabel>
          <Select
            label="Your rank"
            value={value.rank}
            onChange={(e: SelectChangeEvent) => onChange({ rank: e.target.value })}
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
              Searching {value.server} for {needed} teammate{needed > 1 ? "s" : ""}
            </Typography>
            <Typography sx={{ color: tokens.muted, fontSize: "0.85rem", mt: 0.5 }}>
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
