import type { LobbyType } from "src/types/type-inventory";

import { toast } from "sonner";
import { motion } from "framer-motion";
import { Users, Clock, Globe, Server, ExternalLink } from "lucide-react";

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Divider,
  Tooltip,
  Typography,
  IconButton,
  CardContent,
} from "@mui/material";

import { useCredentials } from "src/core/slices";
import { ValorantRegionalServers } from "src/@mock";
import { fErrorCatchToast } from "src/lib/error-catch";
import { useRequestToJoinLobbyMutation } from "src/core/apis/api-inventory";

import { RoleChip } from "./role-chip";
import { RankChip } from "./rank-chip";
import { MetaChip } from "./meta-chip";
import { StatusChip } from "./status-chip";
import { formatTimeAgo } from "../lib/valorant";

interface LobbyCardProps {
  lobby: LobbyType;
  index?: number;
}

export function LobbyCard({ lobby, index = 0 }: LobbyCardProps) {
  const { isAuthenticated, user } = useCredentials();

  const [requestToJoinLobby] = useRequestToJoinLobbyMutation();

  const roles = lobby?.rolesNeeded;
  const playerCount = Number(lobby.currentPlayers) || 4;
  const spotsLeft = playerCount;

  const handleJoin = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const response = await requestToJoinLobby({
        lobbyId: lobby?.id,
        userId: user?.id || "",
      }).unwrap();

      if (response?.status) {
        toast.success("Request sent!", {
          description: `Reached out to ${lobby?.hostGamename ?? "host"} to join.`,
        });
      } else {
        toast.info(response?.message || "Failed to send request.");
      }
    } catch (error) {
      fErrorCatchToast(error, "Failed to send join request.");
    }
  };

  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === lobby?.region,
  );

  const haveYouRequestedToJoin = lobby?.applicants?.some(
    (applicant) => applicant.user === user?.id,
  );

  const areYouTheHost = lobby?.userId === user?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
    >
      <Card
        sx={{
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              lobby.status === "open"
                ? "linear-gradient(90deg, transparent, #22c55e, transparent)"
                : lobby.status === "full"
                  ? "linear-gradient(90deg, transparent, #ff4655, transparent)"
                  : "transparent",
            opacity: 0.6,
          },
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* ── Meta: region + server ── */}
          <Stack direction="row" flexWrap="wrap" gap={0.6} mb={1}>
            <MetaChip
              icon={<Globe size={10} />}
              label={currentRegion?.label || String(lobby.region)}
            />
            {lobby.server && (
              <MetaChip icon={<Server size={10} />} label={lobby.server} />
            )}
          </Stack>

          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1}
          >
            <StatusChip status={lobby?.status || "open"} />
            <Box flex={1} minWidth={0}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  fontFamily: '"Rajdhani", sans-serif',
                  letterSpacing: "0.04em",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "text.primary",
                }}
              >
                {lobby.title}
              </Typography>
            </Box>
            {/* Rank range */}
            <Stack direction="row" alignItems="center" gap={0.5} flexShrink={0}>
              <RankChip rank={lobby.rankMin} />
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontSize: "0.65rem" }}
              >
                →
              </Typography>
              <RankChip rank={lobby.rankMax} />
            </Stack>
          </Stack>

          {/* Description */}
          {lobby.description && (
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontSize: "0.8rem",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 1,
              }}
            >
              {lobby.description}
            </Typography>
          )}

          {/* Roles */}
          {roles.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {roles.map((role) => (
                <RoleChip key={role} role={role} />
              ))}
            </Stack>
          )}

          {/* Footer */}
          <Divider sx={{ mt: "auto", pt: 0.5, borderColor: "divider" }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" gap={1.5} alignItems="center">
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Users size={13} style={{ color: "#7a8499" }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "0.8rem",
                  }}
                >
                  {playerCount}/{5}
                </Typography>
                {spotsLeft > 0 && lobby.status === "open" && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#22c55e", fontSize: "0.72rem" }}
                  >
                    ({spotsLeft} left)
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Clock size={11} style={{ color: "#7a8499" }} />
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontSize: "0.72rem" }}
                >
                  {formatTimeAgo(lobby.createdAt)}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.75} alignItems="center">
              {lobby.discordLink && (
                <Tooltip title="Join Discord">
                  <IconButton
                    href={lobby.discordLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: "rgba(114,137,218,0.12)",
                      border: "1px solid rgba(114,137,218,0.25)",
                      color: "#7289DA",
                      "&:hover": { backgroundColor: "rgba(114,137,218,0.22)" },
                    }}
                  >
                    <ExternalLink size={13} />
                  </IconButton>
                </Tooltip>
              )}
              {lobby.status === "open" && (
                <Button
                  component="button"
                  onClick={handleJoin}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "4px",
                    background: "#FF4655",
                    color: "#fff",
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      background: "#ff6b77",
                      boxShadow: "0 0 14px rgba(255,70,85,0.4)",
                    },
                  }}
                  disabled={haveYouRequestedToJoin || areYouTheHost}
                >
                  {haveYouRequestedToJoin
                    ? "Requested"
                    : areYouTheHost
                      ? "Your Lobby"
                      : "Request to JOIN"}
                </Button>
              )}
              {lobby.status === "full" && (
                <Chip
                  label="FULL"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,70,85,0.1)",
                    color: "#ff4655",
                    border: "1px solid rgba(255,70,85,0.3)",
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: 22,
                  }}
                />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
