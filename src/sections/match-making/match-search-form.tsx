import React from "react";
import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import type { Telemetry, QueueState } from "../../types/type-common";
import { Radar, Groups, FiberManualRecord } from "@mui/icons-material";

const SYSTEM_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

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
  "Iron 1", "Iron 2", "Iron 3",
  "Bronze 1", "Bronze 2", "Bronze 3",
  "Silver 1", "Silver 2", "Silver 3",
  "Gold 1", "Gold 2", "Gold 3",
  "Platinum 1", "Platinum 2", "Platinum 3",
  "Diamond 1", "Diamond 2", "Diamond 3",
  "Ascendant 1", "Ascendant 2", "Ascendant 3",
  "Immortal 1", "Immortal 2", "Immortal 3",
  "Radiant",
];

const RankSelect = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <FormControl fullWidth size="small">
    <InputLabel sx={{ color: "#8E9AA8", fontFamily: SYSTEM_FONT, fontSize: "0.8rem" }}>
      {label}
    </InputLabel>
    <Select
      value={value}
      label={label}
      onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
      sx={{
        bgcolor: "#141D26",
        color: "#F0F3F6",
        borderRadius: "6px",
        fontFamily: SYSTEM_FONT,
        fontSize: "0.82rem",
        "& .MuiSelect-select": { py: 1, px: 1.5 },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
      }}
    >
      {VALORANT_RANKS.map((r) => (
        <MenuItem key={r} value={r} sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}>
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
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{
            sx: { color: "#8E9AA8", fontFamily: SYSTEM_FONT, fontSize: "0.8rem" },
          }}
          sx={{
            bgcolor: "#141D26",
            "& .MuiOutlinedInput-root": {
              color: "#F0F3F6",
              borderRadius: "6px",
              fontSize: "0.82rem",
              fontFamily: SYSTEM_FONT,
              "& input": { py: 1, px: 1.5 },
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
              "&:hover fieldset": { borderColor: "#FF4655" },
              "&.Mui-focused fieldset": { borderColor: "#FF4655" },
            },
          }}
        />

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: "#8E9AA8", fontFamily: SYSTEM_FONT, fontSize: "0.8rem" }}>
            Region
          </InputLabel>
          <Select
            value={region}
            label="Region"
            onChange={(e: SelectChangeEvent) => {
              setRegion(e.target.value);
              setServer(VALORANT_REGIONS[e.target.value][0]);
            }}
            sx={{
              bgcolor: "#141D26",
              color: "#F0F3F6",
              borderRadius: "6px",
              fontFamily: SYSTEM_FONT,
              fontSize: "0.82rem",
              "& .MuiSelect-select": { py: 1, px: 1.5 },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
            }}
          >
            {Object.keys(VALORANT_REGIONS).map((r) => (
              <MenuItem key={r} value={r} sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: "#8E9AA8", fontFamily: SYSTEM_FONT, fontSize: "0.8rem" }}>
            Server
          </InputLabel>
          <Select
            value={server}
            label="Server"
            onChange={(e: SelectChangeEvent) => setServer(e.target.value)}
            sx={{
              bgcolor: "#141D26",
              color: "#F0F3F6",
              borderRadius: "6px",
              fontFamily: SYSTEM_FONT,
              fontSize: "0.82rem",
              "& .MuiSelect-select": { py: 1, px: 1.5 },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
            }}
          >
            {VALORANT_REGIONS[region].map((s) => (
              <MenuItem key={s} value={s} sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: "#8E9AA8", fontFamily: SYSTEM_FONT, fontSize: "0.8rem" }}>
            Current Party Size
          </InputLabel>
          <Select
            value={String(groupSize)}
            label="Current Party Size"
            onChange={(e: SelectChangeEvent) => setGroupSize(Number(e.target.value))}
            sx={{
              bgcolor: "#141D26",
              color: "#F0F3F6",
              borderRadius: "6px",
              fontFamily: SYSTEM_FONT,
              fontSize: "0.82rem",
              "& .MuiSelect-select": { py: 1, px: 1.5 },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
            }}
          >
            <MenuItem value="4" sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}>
              4 players (need 1 solo)
            </MenuItem>
            <MenuItem value="3" sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}>
              3 players (need 2 players)
            </MenuItem>
            <MenuItem value="2" sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}>
              2 players (need 3 players)
            </MenuItem>
            <MenuItem value="1" sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}>
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
        <RankSelect label="Your Rank" value={myRank} onChange={setMyRank} />
        <RankSelect label="Min Rank" value={minRank} onChange={setMinRank} />
        <RankSelect label="Max Rank" value={maxRank} onChange={setMaxRank} />
      </Box>

      <Box
        sx={{
          mt: 2,
          p: 1.5,
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
            <Typography sx={{ fontFamily: SYSTEM_FONT, color: "#F0F3F6", fontSize: "0.78rem" }}>
              Online: <strong>{telemetry.onlinePlayers}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Groups sx={{ color: "#FF4655", fontSize: 16 }} />
            <Typography sx={{ fontFamily: SYSTEM_FONT, color: "#F0F3F6", fontSize: "0.78rem" }}>
              In Queue: <strong>{telemetry.inQueueCount}</strong>
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ color: "#8E9AA8", fontFamily: SYSTEM_FONT, fontSize: "0.75rem" }}>
          Searching for {needed} player{needed > 1 ? "s" : ""}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        {queueState === "searching" ? (
          <Box
            sx={{
              textAlign: "center",
              py: 2.5,
              px: 1.5,
              borderRadius: "6px",
              border: "1px dashed rgba(255, 70, 85, 0.4)",
              bgcolor: "rgba(255, 70, 85, 0.04)",
            }}
          >
            <Radar sx={{ fontSize: 28, color: "#FF4655", mb: 0.5 }} />
            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                fontWeight: 600,
                fontSize: { xs: "0.88rem", sm: "0.95rem" },
                color: "#FF4655",
              }}
            >
              Searching {server} for {needed} teammate{needed > 1 ? "s" : ""}...
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={onCancelSearch}
              sx={{
                mt: 1.5,
                fontSize: "0.75rem",
                fontFamily: SYSTEM_FONT,
                textTransform: "none",
                py: 0.4,
                px: 2,
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
          </Box>
        ) : (
          <Button
            fullWidth
            size="medium"
            variant="contained"
            disabled={!isConnected}
            onClick={onStartSearch}
            sx={{
              py: 1,
              fontSize: "0.88rem",
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