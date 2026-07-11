import React from "react";
import { Search, Compass } from "lucide-react";

import { Box, Paper, Typography } from "@mui/material";

import { PlayerCard } from "./player-card";

interface Player {
  id: string;
  username: string;
  tagline: string;
  rank: string;
  rankIcon: string;
  mainAgent: string;
  role: string;
  lookingFor: string;
  personality: string;
  partySize: number;
  partyMax: number;
  microphone: boolean;
  languages: string[];
  status: string;
}

interface PlayerListProps {
  players: Player[];
  playerStates: {
    isInParty: (id: string) => boolean;
    isInvitePending: (id: string) => boolean;
    isChatExpanded: (id: string) => boolean;
  };
  onToggleChat: (id: string) => void;
  onInvite: (player: Player) => void;
  chatProps: (playerId: string) => any;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  playerStates,
  onToggleChat,
  onInvite,
  chatProps,
}) => {
  if (players.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#19212d",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={20} style={{ color: "#ff4655" }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
              No active squad agents found
            </Typography>
            <Typography variant="body2" sx={{ color: "#6e7b8c", mt: 0.5 }}>
              Adjust your filters or add new players using the &quot;+
              Player&quot; button.
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#0b1016",
          p: 2,
          borderRadius: 1,
          border: "1px solid #1b222d",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Compass size={16} style={{ color: "#ff4655" }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 900, letterSpacing: "0.05em" }}
          >
            Active Tactical Feed ({players.length} Operatives Available)
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "#6e7b8c", fontSize: "0.5rem", fontWeight: 700 }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: 6,
              height: 6,
              bgcolor: "#00f3c5",
              borderRadius: "50%",
              animation: "pulse 1.5s infinite",
              mr: 1,
            }}
          />
          REALTIME NETWORK SYNC
        </Typography>
      </Box>

      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isInParty={playerStates.isInParty(player.id)}
          isInvitePending={playerStates.isInvitePending(player.id)}
          isChatExpanded={playerStates.isChatExpanded(player.id)}
          onToggleChat={() => onToggleChat(player.id)}
          onInvite={() => onInvite(player)}
          chatProps={chatProps(player.id)}
        />
      ))}
    </Box>
  );
};
