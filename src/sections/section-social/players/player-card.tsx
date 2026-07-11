import React from "react";
import { Check, UserPlus, Activity, MessageSquare } from "lucide-react";

import { Box, Chip, Paper, Button, Typography } from "@mui/material";

import { PlayerChat } from "./player-chat";

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

interface PlayerCardProps {
  player: Player;
  isInParty: boolean;
  isInvitePending: boolean;
  isChatExpanded: boolean;
  onToggleChat: () => void;
  onInvite: () => void;
  chatProps: {
    messages: any[];
    inputMessage: string;
    onInputChange: (value: string) => void;
    onSendMessage: () => void;
    isThinking: boolean;
    onQuickPhrase: (phrase: string) => void;
  };
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isInParty,
  isInvitePending,
  isChatExpanded,
  onToggleChat,
  onInvite,
  chatProps,
}) => {
  const cardBorderColor = isInParty
    ? "#00f3c5"
    : isChatExpanded
      ? "#ff4655"
      : "#1b222d";

  return (
    <Paper
      sx={{
        border: `1px solid ${cardBorderColor}`,
        bgcolor: isInParty ? "#0c1817" : isChatExpanded ? "#101317" : "#0b1016",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: isInParty ? "#00f3c5" : "rgba(255,70,85,0.4)",
          bgcolor: isInParty ? "#0c1817" : "#10151c",
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: "100%",
          bgcolor: isInParty
            ? "#00f3c5"
            : isInvitePending
              ? "#ffb000"
              : "#ff4655",
        }}
      />

      <Box sx={{ p: 2, pl: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#161e27",
                border: "1px solid #2d3846",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Typography variant="h5">{player.rankIcon}</Typography>
              <Chip
                label={player.mainAgent}
                size="small"
                sx={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  fontSize: "0.4rem",
                  height: 14,
                  bgcolor: "black",
                  border: "1px solid #2d3846",
                  color: "#00f3c5",
                  fontWeight: 700,
                }}
              />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {player.username}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#556375", fontFamily: "monospace" }}
                >
                  #{player.tagline}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <Chip
                  label={player.rank}
                  size="small"
                  sx={{
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    bgcolor: "#1e2736",
                    color: "white",
                  }}
                />
                <Typography variant="caption" sx={{ color: "#8c9ba5" }}>
                  •
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#00f3c5",
                    fontWeight: 700,
                    fontSize: "0.55rem",
                  }}
                >
                  {player.role}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              label={`PARTY: ${player.partySize}/${player.partyMax}`}
              size="small"
              sx={{
                fontSize: "0.5rem",
                bgcolor: "#121922",
                border: "1px solid #1e2736",
              }}
            />
            <Chip
              label={player.microphone ? "VOICE MIC ON" : "NO MIC"}
              size="small"
              sx={{
                fontSize: "0.5rem",
                fontWeight: 700,
                bgcolor: player.microphone
                  ? "rgba(0,243,197,0.1)"
                  : "rgba(239,68,68,0.1)",
                color: player.microphone ? "#00f3c5" : "#ef4444",
                border: player.microphone
                  ? "1px solid rgba(0,243,197,0.2)"
                  : "1px solid rgba(239,68,68,0.2)",
              }}
            />
          </Box>
        </Box>

        {/* Description */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "#121922",
            borderRadius: 1,
            border: "1px solid #1e2736",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#ff4655",
              fontWeight: 900,
              display: "block",
              mb: 0.5,
              fontSize: "0.5rem",
            }}
          >
            Squad Target Goal
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontStyle: "italic", color: "white", fontSize: "0.75rem" }}
          >
            &quot;{player.lookingFor}&quot;
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#6e7b8c",
              display: "block",
              mt: 1,
              borderTop: "1px solid #1e2736",
              pt: 1,
              fontSize: "0.6rem",
            }}
          >
            {player.personality}
          </Typography>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid #1b222d",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {player.languages.map((lang) => (
              <Chip
                key={lang}
                label={lang}
                size="small"
                sx={{
                  fontSize: "0.5rem",
                  bgcolor: "#192435",
                  border: "1px solid #223145",
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              onClick={onToggleChat}
              sx={{
                fontSize: "0.55rem",
                fontWeight: 700,
                bgcolor: isChatExpanded ? "rgba(255,70,85,0.2)" : "#121922",
                color: isChatExpanded ? "#ff4655" : "#8c9ba5",
                border: `1px solid ${isChatExpanded ? "#ff4655" : "#1e2736"}`,
                "&:hover": {
                  borderColor: "rgba(255,70,85,0.4)",
                  color: "white",
                },
              }}
            >
              <MessageSquare size={14} style={{ marginRight: 4 }} />
              {isChatExpanded ? "Close Chat" : "Open Chat"}
            </Button>

            {isInParty ? (
              <Chip
                label="Joined"
                icon={<Check size={12} />}
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  bgcolor: "rgba(0,243,197,0.1)",
                  border: "1px solid #00f3c5",
                  color: "#00f3c5",
                }}
              />
            ) : isInvitePending ? (
              <Chip
                label="Invited..."
                icon={<Activity size={12} />}
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  bgcolor: "rgba(255,176,0,0.1)",
                  border: "1px solid #ffb000",
                  color: "#ffb000",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ) : (
              <Button
                size="small"
                onClick={onInvite}
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 900,
                  bgcolor: "#ff4655",
                  color: "white",
                  "&:hover": { bgcolor: "#e8404e" },
                }}
              >
                <UserPlus size={14} style={{ marginRight: 4 }} />
                Invite
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Chat */}
      {isChatExpanded && (
        <PlayerChat
          {...chatProps}
          playerId={player.id}
          username={player.username}
        />
      )}
    </Paper>
  );
};
