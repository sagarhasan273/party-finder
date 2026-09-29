import React from "react";

import { Box, Button, Typography, IconButton } from "@mui/material";
import { Mic, MicOff, ExitToApp, GraphicEq } from "@mui/icons-material";

import type { MatchData } from "../../types/type-common";

const SYSTEM_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

interface ConnectedPlayersProps {
  matchData: MatchData;
  region: string;
  server: string;
  username: string;
  isMuted: boolean;
  isLocalSpeaking: boolean;
  isRemoteSpeaking: boolean;
  onToggleMic: () => void;
  onLeaveLobby: () => void;
}

export const ConnectedPlayers: React.FC<ConnectedPlayersProps> = ({
  matchData,
  region,
  server,
  username,
  isMuted,
  isLocalSpeaking,
  isRemoteSpeaking,
  onToggleMic,
  onLeaveLobby,
}) => (
  <Box
    sx={{
      boxSizing: "border-box",
      minWidth: 0,
      overflowX: "hidden",
      p: { xs: 2, sm: 2.5 },
      bgcolor: "#17212B",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1.5,
        pb: 1,
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        gap: 1,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontFamily: SYSTEM_FONT,
            color: "#2ED573",
            fontWeight: 700,
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            m: 0,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Room {matchData.roomId}
        </Typography>
        <Typography
          sx={{
            color: "#8E9AA8",
            fontFamily: SYSTEM_FONT,
            fontSize: "0.72rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {region} · {server}
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}
      >
        <IconButton
          size="small"
          onClick={onToggleMic}
          sx={{
            p: 0.7,
            borderRadius: "6px",
            bgcolor: isMuted
              ? "rgba(255, 70, 85, 0.15)"
              : "rgba(46, 213, 115, 0.15)",
            border: `1px solid ${isMuted ? "rgba(255, 70, 85, 0.4)" : "rgba(46, 213, 115, 0.4)"}`,
          }}
        >
          {isMuted ? (
            <MicOff sx={{ color: "#FF4655", fontSize: 16 }} />
          ) : (
            <Mic sx={{ color: "#2ED573", fontSize: 16 }} />
          )}
        </IconButton>

        <Button
          variant="contained"
          size="small"
          onClick={onLeaveLobby}
          startIcon={<ExitToApp sx={{ fontSize: 15 }} />}
          sx={{
            px: 1.4,
            py: 0.5,
            fontSize: "0.75rem",
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
          Leave
        </Button>
      </Box>
    </Box>

    <Typography
      sx={{ fontFamily: SYSTEM_FONT, color: "#8E9AA8", fontSize: "0.75rem" }}
    >
      Connected Players
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 1.2,
        mt: 0.8,
      }}
    >
      {matchData.participants.map((p) => {
        const isSelf = p.username === username;
        const speaking = isSelf ? isLocalSpeaking : isRemoteSpeaking;

        return (
          <Box
            key={p.username}
            sx={{
              p: 1.5,
              bgcolor: "#141D26",
              border: `1px solid ${speaking ? "#2ED573" : "rgba(255, 255, 255, 0.06)"}`,
              borderRadius: "6px",
              position: "relative",
              transition: "border-color 0.2s",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: SYSTEM_FONT,
                  fontWeight: 600,
                  color: "#F0F3F6",
                  fontSize: "0.82rem",
                }}
              >
                {p.username} {isSelf && "(You)"}
              </Typography>
              {speaking ? (
                <GraphicEq sx={{ color: "#2ED573", fontSize: 15 }} />
              ) : (
                <Typography
                  sx={{
                    color: "#8E9AA8",
                    fontFamily: SYSTEM_FONT,
                    fontSize: "0.68rem",
                  }}
                >
                  Idle
                </Typography>
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                color: "#FF4655",
                fontWeight: 600,
                fontSize: "0.78rem",
                mt: 0.2,
              }}
            >
              {p.rank}
            </Typography>
            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                color: "#8E9AA8",
                fontSize: "0.7rem",
              }}
            >
              Has {p.currentGroupSize} player{p.currentGroupSize > 1 ? "s" : ""}
            </Typography>
          </Box>
        );
      })}
    </Box>
  </Box>
);
