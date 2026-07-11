import React from "react";
import { Users, Volume2, VolumeX, UserPlus } from "lucide-react";

import {
  Box,
  Chip,
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSimulatePlayer: () => void;
  onSimulateInvite: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onSimulatePlayer,
  onSimulateInvite,
}) => (
  <AppBar
    position="sticky"
    sx={{ bgcolor: "#0b1016", borderBottom: "1px solid #1b222d" }}
  >
    <Toolbar sx={{ flexWrap: "wrap", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
        <Box
          sx={{
            bgcolor: "#ff4655",
            color: "#0f1923",
            px: 1.5,
            py: 0.5,
            fontWeight: 900,
            fontSize: "1.1rem",
            borderRadius: 0.5,
            letterSpacing: "0.05em",
            position: "relative",
          }}
        >
          VAL
          <Box
            sx={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 8,
              height: 8,
              bgcolor: "#00f3c5",
              borderRadius: "50%",
              animation: "pulse 1.5s infinite",
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 900, letterSpacing: "0.1em", fontSize: "0.9rem" }}
          >
            VALORANT SQUAD-NET
            <Chip
              label="LFG HUB"
              size="small"
              sx={{
                ml: 1,
                bgcolor: "#ff4655",
                color: "white",
                fontSize: "0.5rem",
                height: 16,
                fontWeight: 700,
              }}
            />
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#6e7b8c", display: "block", fontSize: "0.6rem" }}
          >
            Active Matchmaking Hub • Gemini AI Realtime API
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            bgcolor: "#101721",
            p: 0.5,
            borderRadius: 1,
            border: "1px solid #1e2736",
          }}
        >
          <Button
            size="small"
            onClick={onSimulatePlayer}
            sx={{
              fontSize: "0.6rem",
              color: "#00f3c5",
              border: "1px solid rgba(0,243,197,0.3)",
              "&:hover": { bgcolor: "rgba(0,243,197,0.1)" },
            }}
          >
            <Users size={12} style={{ marginRight: 4 }} />+ Player
          </Button>
          <Button
            size="small"
            onClick={onSimulateInvite}
            sx={{
              fontSize: "0.6rem",
              color: "#ff4655",
              border: "1px solid rgba(255,70,85,0.3)",
              "&:hover": { bgcolor: "rgba(255,70,85,0.1)" },
            }}
          >
            <UserPlus size={12} style={{ marginRight: 4 }} />+ Invite
          </Button>
        </Box>

        <IconButton
          onClick={onToggleSound}
          sx={{
            bgcolor: "#101721",
            border: "1px solid #1e2736",
            borderRadius: 1,
            color: "#6e7b8c",
            "&:hover": { color: "#ff4655" },
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
);
