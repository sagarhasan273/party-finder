import { Clock, UserPlus, MessageCircle } from "lucide-react";

import { Box, Chip, Stack, Button, Divider, Typography } from "@mui/material";

import { AvatarUser } from "../../components/avatar-user";
import { StyledBorder } from "../../components/border-style";

import type { SocialPlayer } from "../../types/type-social";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(13,15,26,0.97)",
  bgCard: "rgba(14,16,28,0.97)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  accent: "#FF4655",
  text: "#dde3f0",
  textMuted: "rgba(74,84,112,1)",
  textSub: "#7f8fad",
  green: "#22c55e",
  blue: "#4fc3f7",
  RAJ: '"Rajdhani", sans-serif',
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor = (status: SocialPlayer["status"]) => {
  if (status === "online") return T.green;
  if (status === "in-game") return T.blue;
  return "rgba(58,64,96,1)";
};

const statusLabel = (status: SocialPlayer["status"]) => {
  if (status === "online") return "Online";
  if (status === "in-game") return "In Game";
  return "Offline";
};

interface PlayerCardProps {
  player: SocialPlayer;
  index: number;
  onSendRequest: (id: string) => void;
  onMessage: (player: SocialPlayer) => void;
}

export function PlayerCard({
  player,
  index,
  onSendRequest,
  onMessage,
}: PlayerCardProps) {
  const sc = statusColor(player.status);

  return (
    <StyledBorder color="green" index={index}>
      {/* Corner ornament */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 14px 14px 0",
          borderColor: `transparent ${sc}44 transparent transparent`,
          zIndex: 3,
        }}
      />

      <Box
        sx={{
          p: "16px 18px 14px 22px",
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.1,
        }}
      >
        {/* Header */}
        <Stack direction="row" gap={1.25} alignItems="flex-start">
          <AvatarUser
            avatarUrl={player.avatar}
            name={player.name}
            verified
            sx={{
              width: 44,
              height: 44,
              borderRadius: "3px",
              background: `${sc}18`,
              border: `1px solid ${sc}33`,
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.85rem",
              color: sc,
            }}
          />

          <Box flex={1} minWidth={0}>
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: T.text,
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {player.name}
              <Box
                component="span"
                sx={{
                  opacity: 0.32,
                  fontWeight: 400,
                  textTransform: "none",
                  fontSize: "0.7rem",
                  ml: 0.5,
                }}
              >
                {player.tag}
              </Box>
            </Typography>
            <Stack direction="row" alignItems="center" gap={0.5} mt={0.3}>
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: sc,
                }}
              />
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 600,
                  fontSize: "0.58rem",
                  letterSpacing: "0.07em",
                  color: sc,
                  textTransform: "uppercase",
                }}
              >
                {statusLabel(player.status)}
              </Typography>
              <Typography sx={{ color: T.textMuted, fontSize: "0.55rem" }}>
                ·
              </Typography>
              <Clock size={9} color={T.textMuted} />
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 600,
                  fontSize: "0.58rem",
                  letterSpacing: "0.04em",
                  color: T.textMuted,
                  textTransform: "uppercase",
                }}
              >
                {player.lastActive}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Rank + Role */}
        <Stack direction="row" gap={0.6} flexWrap="wrap">
          {[player.rank, player.role].map((label) => (
            <Chip
              key={label}
              label={label?.toUpperCase()}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.04)",
                color: T.textSub,
                border: `1px solid ${T.border}`,
                borderRadius: "2px",
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.58rem",
                letterSpacing: "0.06em",
                height: 19,
              }}
            />
          ))}
        </Stack>

        {/* Agents */}
        {Number(player?.agents?.length) > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {player?.agents?.map((agent) => (
              <Chip
                key={agent}
                label={agent}
                size="small"
                sx={{
                  background: "rgba(255,255,255,0.025)",
                  color: T.textMuted,
                  border: `1px solid rgba(255,255,255,0.05)`,
                  borderRadius: "2px",
                  fontFamily: T.RAJ,
                  fontWeight: 600,
                  fontSize: "0.56rem",
                  height: 17,
                }}
              />
            ))}
          </Stack>
        )}

        {/* Bio */}
        {player.bio && (
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 500,
              fontSize: "0.7rem",
              color: T.textMuted,
              letterSpacing: "0.02em",
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {player.bio}
          </Typography>
        )}

        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mt: "auto" }} />

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" gap={0.75}>
          {player.isFriend ? (
            <Button
              size="small"
              onClick={() => onMessage(player)}
              startIcon={<MessageCircle size={12} />}
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                height: 28,
                borderRadius: "2px",
                background: "rgba(34,197,94,0.1)",
                color: T.green,
                border: "1px solid rgba(34,197,94,0.25)",
                "&:hover": { background: "rgba(34,197,94,0.18)" },
              }}
            >
              Message
            </Button>
          ) : player.requestSent ? (
            <Button
              size="small"
              disabled
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                height: 28,
                borderRadius: "2px",
                background: "rgba(255,255,255,0.04)",
                color: T.textSub,
                border: `1px solid ${T.border}`,
              }}
            >
              Request Sent
            </Button>
          ) : (
            <Button
              size="small"
              onClick={() => onSendRequest(player.id)}
              startIcon={<UserPlus size={12} />}
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                height: 28,
                borderRadius: "2px",
                background: T.accent,
                color: "#fff",
                border: "none",
                boxShadow: "none",
                "&:hover": {
                  background: "#e03040",
                  boxShadow: "0 0 14px rgba(255,70,85,0.3)",
                },
              }}
            >
              Chat Request
            </Button>
          )}
        </Stack>
      </Box>
    </StyledBorder>
  );
}
