import React, { useState } from "react";
import { Cpu, Wand2, MapPin, Loader2 } from "lucide-react";

import {
  Box,
  Chip,
  Paper,
  Select,
  Button,
  MenuItem,
  Typography,
  FormControl,
} from "@mui/material";

import { MAPS } from "../../../utils/constants";

interface TacticalCoachProps {
  onGenerateStrategy: (map: string) => Promise<string>;
  isLoading: boolean;
}

export const TacticalCoach: React.FC<TacticalCoachProps> = ({
  onGenerateStrategy,
  isLoading,
}) => {
  const [map, setMap] = useState("Ascent");
  const [strategy, setStrategy] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await onGenerateStrategy(map);
      setStrategy(result);
    } catch (error) {
      setStrategy("Failed to generate strategy. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 2.5,
        border: "1px solid rgba(0,243,197,0.3)",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#0b1016",
      }}
      className="valorant-glow-cyan"
    >
      {/* VCT Analyst Badge */}
      <Chip
        label="VCT ANALYST"
        size="small"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bgcolor: "#00f3c5",
          color: "black",
          fontWeight: 900,
          fontSize: "0.45rem",
          height: 18,
          borderRadius: 0,
          borderBottomLeftRadius: 4,
          letterSpacing: "0.05em",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Cpu size={18} className="animate-pulse" style={{ color: "#00f3c5" }} />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 900,
            color: "#00f3c5",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
        >
          VCT Tactical Coach
        </Typography>
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: "#8c9ba5",
          display: "block",
          mb: 2,
          fontSize: "0.6rem",
          lineHeight: 1.5,
        }}
      >
        Generates customized strategies based on your current party roster and
        selected map.
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <Select
            value={map}
            onChange={(e) => setMap(e.target.value)}
            sx={{
              bgcolor: "#121922",
              fontSize: "0.7rem",
              "& .MuiSelect-select": {
                py: 1,
              },
              "& fieldset": {
                borderColor: "#1e2736",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0,243,197,0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00f3c5",
              },
            }}
          >
            {MAPS.map((m) => (
              <MenuItem key={m} value={m} sx={{ fontSize: "0.7rem" }}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isLoading || isGenerating}
          sx={{
            bgcolor: "#00f3c5",
            color: "black",
            fontWeight: 900,
            fontSize: "0.6rem",
            px: 2.5,
            minWidth: 100,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            "&:hover": {
              bgcolor: "#00d4ac",
            },
            "&:disabled": {
              bgcolor: "rgba(0,243,197,0.2)",
              color: "rgba(255,255,255,0.3)",
            },
          }}
        >
          {isLoading || isGenerating ? (
            <>
              <Loader2
                size={14}
                className="animate-spin"
                style={{ marginRight: 6 }}
              />
              Loading...
            </>
          ) : (
            <>
              <Wand2 size={14} style={{ marginRight: 6 }} />
              Tactics
            </>
          )}
        </Button>
      </Box>

      {/* Strategy Output */}
      {strategy ? (
        <Box
          sx={{
            mt: 2.5,
            bgcolor: "#070b10",
            border: "1px solid rgba(0,243,197,0.15)",
            p: 2,
            borderRadius: 1,
            maxHeight: 200,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "0.6rem",
            color: "#c0c8d0",
            "&::-webkit-scrollbar": {
              width: 4,
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0,243,197,0.3)",
              borderRadius: 2,
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#00f3c5",
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 1,
              pb: 1,
              borderBottom: "1px solid rgba(0,243,197,0.1)",
              fontSize: "0.55rem",
            }}
          >
            <MapPin size={10} />
            {map} Playbook:
          </Typography>
          {strategy.split("\n").map((line, i) => (
            <Box
              key={i}
              sx={{
                mb: 0.75,
                lineHeight: 1.6,
                "&:last-child": { mb: 0 },
              }}
            >
              {line}
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            mt: 2.5,
            p: 2,
            bgcolor: "#121922",
            borderRadius: 1,
            textAlign: "center",
            border: "1px dashed #1e2736",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#556375",
              fontStyle: "italic",
              fontSize: "0.55rem",
            }}
          >
            {isLoading || isGenerating
              ? "🔮 Analyzing party agent synergies..."
              : '🎯 Select a map and click "Tactics" to generate a strategy'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
