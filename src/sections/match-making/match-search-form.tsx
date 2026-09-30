import type { SelectChangeEvent } from "@mui/material";

import React, { useState, useEffect } from "react";

import { Radar, Groups, Refresh, FiberManualRecord } from "@mui/icons-material";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  keyframes,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";

import type { Telemetry, QueueState } from "../../types/type-common";

const SYSTEM_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// --- Animations ---
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const blink = keyframes`
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const textColorPulse = keyframes`
  0% { color: #FF4655; }
  50% { color: #FF98A0; }
  100% { color: #FF4655; }
`;
// ------------------

// --- Responsive Style Constants ---
const RESPONSIVE_LABEL = {
  color: "#8E9AA8",
  fontFamily: SYSTEM_FONT,
  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
};

const RESPONSIVE_INPUT_FONT = {
  fontFamily: SYSTEM_FONT,
  fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.95rem" },
};

const RESPONSIVE_INPUT_PADDING = {
  py: { xs: 1, sm: 1.2, md: 1.4 },
  px: { xs: 1.5, sm: 1.8, md: 2 },
};

const RESPONSIVE_MENU_ITEM = {
  fontFamily: SYSTEM_FONT,
  fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.95rem" },
  py: { xs: 0.8, sm: 1, md: 1.2 },
};
// ----------------------------------

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

export const VALORANT_RANKS: string[] = [
  "Iron 1",
  "Iron 2",
  "Iron 3",
  "Bronze 1",
  "Bronze 2",
  "Bronze 3",
  "Silver 1",
  "Silver 2",
  "Silver 3",
  "Gold 1",
  "Gold 2",
  "Gold 3",
  "Platinum 1",
  "Platinum 2",
  "Platinum 3",
  "Diamond 1",
  "Diamond 2",
  "Diamond 3",
  "Ascendant 1",
  "Ascendant 2",
  "Ascendant 3",
  "Immortal 1",
  "Immortal 2",
  "Immortal 3",
  "Radiant",
];

const RankSelect = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => (
  <FormControl fullWidth size="small" disabled={disabled}>
    <InputLabel sx={RESPONSIVE_LABEL}>{label}</InputLabel>
    <Select
      value={value}
      label={label}
      disabled={disabled}
      onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
      sx={{
        bgcolor: "#141D26",
        color: "#F0F3F6",
        borderRadius: "6px",
        ...RESPONSIVE_INPUT_FONT,
        "& .MuiSelect-select": RESPONSIVE_INPUT_PADDING,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#FF4655",
        },
        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.05)",
        },
        "&.Mui-disabled": {
          opacity: 0.6,
        },
      }}
    >
      {VALORANT_RANKS.map((r) => (
        <MenuItem key={r} value={r} sx={RESPONSIVE_MENU_ITEM}>
          {r}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

interface MatchSearchFormProps {
  username: string;
  setUsername: (val: string) => void;
  region: string;
  setRegion: (val: string) => void;
  server: string;
  setServer: (val: string) => void;
  myRank: string;
  setMyRank: (val: string) => void;
  minRank: string;
  setMinRank: (val: string) => void;
  maxRank: string;
  setMaxRank: (val: string) => void;
  groupSize: number;
  setGroupSize: (val: number) => void;
  telemetry: Telemetry;
  queueState: QueueState;
  isConnected: boolean;
  onStartSearch: () => void;
  onCancelSearch: () => void;
}

export const MatchSearchForm: React.FC<MatchSearchFormProps> = ({
  username,
  setUsername,
  region,
  setRegion,
  server,
  setServer,
  myRank,
  setMyRank,
  minRank,
  setMinRank,
  maxRank,
  setMaxRank,
  groupSize,
  setGroupSize,
  telemetry,
  queueState,
  isConnected,
  onStartSearch,
  onCancelSearch,
}) => {
  const needed = 5 - groupSize;
  const isSearching = queueState === "searching";

  // Timer State
  const [searchTime, setSearchTime] = useState(0);

  // Live Timer Logic
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    if (isSearching) {
      setSearchTime(0); // Reset timer on fresh search
      timerId = setInterval(() => {
        setSearchTime((prev) => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }

    // Cleanup interval on unmount or state change
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isSearching]);

  // Format seconds to MM:SS
  const formattedTime = `${Math.floor(searchTime / 60)
    .toString()
    .padStart(2, "0")}:${(searchTime % 60).toString().padStart(2, "0")}`;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: "#17212B",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Typography
        sx={{
          fontFamily: SYSTEM_FONT,
          fontWeight: 600,
          fontSize: { xs: "0.95rem", sm: "1.05rem" },
          color: "#F0F3F6",
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 0.8,
        }}
      >
        <Radar sx={{ color: "#FF4655", fontSize: 18 }} /> Find Teammates
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
        }}
      >
        <TextField
          fullWidth
          size="small"
          label="Riot ID"
          value={username}
          disabled={isSearching}
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{ sx: RESPONSIVE_LABEL }}
          sx={{
            bgcolor: "#141D26",
            "& .MuiOutlinedInput-root": {
              color: "#F0F3F6",
              borderRadius: "6px",
              ...RESPONSIVE_INPUT_FONT,
              "& input": RESPONSIVE_INPUT_PADDING,
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
              "&:hover fieldset": { borderColor: "#FF4655" },
              "&.Mui-focused fieldset": { borderColor: "#FF4655" },
              "&.Mui-disabled fieldset": {
                borderColor: "rgba(255, 255, 255, 0.05)",
              },
              "&.Mui-disabled": { opacity: 0.6 },
            },
          }}
        />

        <FormControl fullWidth size="small" disabled={isSearching}>
          <InputLabel sx={RESPONSIVE_LABEL}>Region</InputLabel>
          <Select
            value={region}
            label="Region"
            disabled={isSearching}
            onChange={(e: SelectChangeEvent) => {
              setRegion(e.target.value);
              setServer(VALORANT_REGIONS[e.target.value][0]);
            }}
            sx={{
              bgcolor: "#141D26",
              color: "#F0F3F6",
              borderRadius: "6px",
              ...RESPONSIVE_INPUT_FONT,
              "& .MuiSelect-select": RESPONSIVE_INPUT_PADDING,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#FF4655",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#FF4655",
              },
              "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.05)",
              },
              "&.Mui-disabled": { opacity: 0.6 },
            }}
          >
            {Object.keys(VALORANT_REGIONS).map((r) => (
              <MenuItem key={r} value={r} sx={RESPONSIVE_MENU_ITEM}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" disabled={isSearching}>
          <InputLabel sx={RESPONSIVE_LABEL}>Server</InputLabel>
          <Select
            value={server}
            label="Server"
            disabled={isSearching}
            onChange={(e: SelectChangeEvent) => setServer(e.target.value)}
            sx={{
              bgcolor: "#141D26",
              color: "#F0F3F6",
              borderRadius: "6px",
              ...RESPONSIVE_INPUT_FONT,
              "& .MuiSelect-select": RESPONSIVE_INPUT_PADDING,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#FF4655",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#FF4655",
              },
              "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.05)",
              },
              "&.Mui-disabled": { opacity: 0.6 },
            }}
          >
            {VALORANT_REGIONS[region].map((s) => (
              <MenuItem key={s} value={s} sx={RESPONSIVE_MENU_ITEM}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" disabled={isSearching}>
          <InputLabel sx={RESPONSIVE_LABEL}>Current Party Size</InputLabel>
          <Select
            value={String(groupSize)}
            label="Current Party Size"
            disabled={isSearching}
            onChange={(e: SelectChangeEvent) =>
              setGroupSize(Number(e.target.value))
            }
            sx={{
              bgcolor: "#141D26",
              color: "#F0F3F6",
              borderRadius: "6px",
              ...RESPONSIVE_INPUT_FONT,
              "& .MuiSelect-select": RESPONSIVE_INPUT_PADDING,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#FF4655",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#FF4655",
              },
              "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.05)",
              },
              "&.Mui-disabled": { opacity: 0.6 },
            }}
          >
            <MenuItem value="4" sx={RESPONSIVE_MENU_ITEM}>
              4 players (need 1 solo)
            </MenuItem>
            <MenuItem value="3" sx={RESPONSIVE_MENU_ITEM}>
              3 players (need 2 players)
            </MenuItem>
            <MenuItem value="2" sx={RESPONSIVE_MENU_ITEM}>
              2 players (need 3 players)
            </MenuItem>
            <MenuItem value="1" sx={RESPONSIVE_MENU_ITEM}>
              Solo (need 4 players)
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 1.5,
          mt: 1.5,
        }}
      >
        <RankSelect
          label="Your Rank"
          value={myRank}
          onChange={setMyRank}
          disabled={isSearching}
        />
        <RankSelect
          label="Min Rank"
          value={minRank}
          onChange={setMinRank}
          disabled={isSearching}
        />
        <RankSelect
          label="Max Rank"
          value={maxRank}
          onChange={setMaxRank}
          disabled={isSearching}
        />
      </Box>

      <Box
        sx={{
          mt: 2,
          p: { xs: 1.5, md: 2 },
          bgcolor: "#141D26",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <FiberManualRecord sx={{ color: "#2ED573", fontSize: 9 }} />
            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                color: "#F0F3F6",
                fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.85rem" },
              }}
            >
              Online: <strong>{telemetry.onlinePlayers}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Groups sx={{ color: "#FF4655", fontSize: 16 }} />
            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                color: "#F0F3F6",
                fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.85rem" },
              }}
            >
              In Queue: <strong>{telemetry.inQueueCount}</strong>
            </Typography>
          </Box>
        </Box>
        <Typography
          sx={{
            color: "#8E9AA8",
            fontFamily: SYSTEM_FONT,
            fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.82rem" },
          }}
        >
          Searching for {needed} player{needed > 1 ? "s" : ""}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        {queueState === "searching" ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 2.5, md: 3 },
              px: { xs: 1.5, md: 2 },
              borderRadius: "6px",
              border: "1px dashed rgba(255, 70, 85, 0.4)",
              bgcolor: "rgba(255, 70, 85, 0.04)",
            }}
          >
            <Radar
              sx={{
                fontSize: { xs: 28, md: 32 },
                color: "#FF4655",
                mb: 0.5,
                animation: `${pulse} 1.5s ease-in-out infinite`,
              }}
            />
            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                fontWeight: 600,
                fontSize: { xs: "0.88rem", sm: "0.95rem", md: "1rem" },
                animation: `${textColorPulse} 2s ease-in-out infinite`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Searching {server} for {needed} teammate{needed > 1 ? "s" : ""}
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  width: "1.2rem",
                  justifyContent: "flex-start",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    animation: `${blink} 1.4s infinite both`,
                    animationDelay: "0s",
                  }}
                >
                  .
                </Box>
                <Box
                  component="span"
                  sx={{
                    animation: `${blink} 1.4s infinite both`,
                    animationDelay: "0.2s",
                  }}
                >
                  .
                </Box>
                <Box
                  component="span"
                  sx={{
                    animation: `${blink} 1.4s infinite both`,
                    animationDelay: "0.4s",
                  }}
                >
                  .
                </Box>
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                mb: 1.5,
                fontFamily: SYSTEM_FONT,
                fontWeight: 600,
                color: "#F0F3F6",
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
              }}
            >
              <Box
                component="span"
                sx={{ color: "#8E9AA8", fontWeight: 400, mr: 0.8 }}
              >
                Time Elapsed:
              </Box>
              {formattedTime}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1.5,
                mt: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Button
                size="small"
                variant="outlined"
                onClick={onCancelSearch}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                  fontFamily: SYSTEM_FONT,
                  textTransform: "none",
                  py: { xs: 0.4, md: 0.6 },
                  px: { xs: 2, md: 3 },
                  color: "#F0F3F6",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#FF4655",
                    bgcolor: "rgba(255, 70, 85, 0.08)",
                  },
                }}
              >
                Cancel search
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={handleReload}
                startIcon={<Refresh sx={{ fontSize: "16px !important" }} />}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                  fontFamily: SYSTEM_FONT,
                  textTransform: "none",
                  py: { xs: 0.4, md: 0.6 },
                  px: { xs: 2, md: 3 },
                  color: "#8E9AA8",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#F0F3F6",
                    borderColor: "#F0F3F6",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                Reload
              </Button>
            </Box>

            <Typography
              sx={{
                mt: 2,
                fontFamily: SYSTEM_FONT,
                color: "#8E9AA8",
                fontSize: { xs: "0.7rem", md: "0.75rem" },
              }}
            >
              Taking longer than 2 or 3 minute? Reload the page to generate a
              new connection and search again.
            </Typography>
          </Box>
        ) : (
          <Button
            fullWidth
            size="medium"
            variant="contained"
            disabled={!isConnected}
            onClick={onStartSearch}
            sx={{
              py: { xs: 1, md: 1.2 },
              fontSize: { xs: "0.88rem", sm: "0.92rem", md: "1rem" },
              fontFamily: SYSTEM_FONT,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#FF4655",
              color: "#FFFFFF",
              borderRadius: "6px",
              boxShadow: "none",
              "&:hover": { bgcolor: "#E03B49", boxShadow: "none" },
            }}
          >
            Find Team ({groupSize}/5)
          </Button>
        )}
      </Box>
    </Box>
  );
};
