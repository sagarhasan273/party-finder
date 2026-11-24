import React from "react";

import { Box, Alert, Avatar, Button, Typography } from "@mui/material";
import { Mic, MicOff, ExitToApp, GraphicEq } from "@mui/icons-material";

import { tokens } from "../../theme/theme";
import { Panel } from "../../components/panel";
import { SquadSlots } from "../../components/squad-slots";

import type { MatchData } from "../../types/type-common";
import type { VoiceStatus } from "../../hooks/use-livekit-room";

interface Props {
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

export const ConnectedPlayers: React.FC<Props> = ({
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
          Microphone is blocked, so teammates can&apos;t hear you. Allow it in
          your browser&apos;s site settings, then press Unmute.
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
