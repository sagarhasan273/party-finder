import type { LobbyType } from "src/types/type-inventory";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Globe, Server, ExternalLink } from "lucide-react";

import {
  Box,
  Chip,
  Stack,
  Paper,
  Button,
  Divider,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";

import { ValorantRegionalServers } from "src/@mock";
import { fErrorCatchToast } from "src/lib/error-catch";
import { useInventory, useCredentials } from "src/core/slices";
import { useRequestToJoinLobbyMutation } from "src/core/apis/api-inventory";

import { RoleChip } from "./role-chip";
import { RankChip } from "./rank-chip";
import { MetaChip } from "./meta-chip";
import { StatusChip } from "./status-chip";
import { AvatarUser } from "./avatar-user";
import { formatTimeAgo } from "../lib/valorant";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(22, 23, 34, 0.97)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  accent: "#FF4655",
  accentDim: "rgba(255,70,85,0.12)",
  accentBorder: "rgba(255,70,85,0.25)",
  text: "#edf0f4",
  textMuted: "rgba(74,84,112,1)",
  textSub: "#8892aa",
  green: "#22c55e",
  RAJ: '"Rajdhani", sans-serif',
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface LobbyCardProps {
  lobby: LobbyType;
  index?: number;
}

export function LobbyCard({ lobby, index = 0 }: LobbyCardProps) {
  const { isAuthenticated, user, setIsSignInRequired } = useCredentials();
  const { appliedLobbies, setAppliedLobbies } = useInventory();

  const [haveYouRequestedToJoin, setHaveYouRequestedToJoin] = useState(
    lobby?.applicants?.some((applicant) => applicant.user === user?.id),
  );

  const [requestToJoinLobby] = useRequestToJoinLobbyMutation();

  const roles = lobby?.rolesNeeded;
  const playerCount = Number(lobby.currentPlayers) || 4;
  const spotsLeft = 5 - playerCount;
  const areYouTheHost = lobby?.host.id === user?.id;

  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === lobby?.region,
  );

  // Status-driven top bar color
  const statusAccent =
    lobby.status === "open"
      ? T.green
      : lobby.status === "full"
        ? T.accent
        : "rgba(255,255,255,0.12)";

  const handleJoin = async () => {
    if (!isAuthenticated) {
      setIsSignInRequired(true);
      return;
    }
    try {
      const response = await requestToJoinLobby({
        lobbyId: lobby?.id,
        applicantId: user?.id || "",
      }).unwrap();
      if (response?.status && response?.data) {
        setHaveYouRequestedToJoin(true);
        // Avoid duplicates
        const alreadyExists = appliedLobbies.some(
          (l) => l.id === response.data.id,
        );
        if (!alreadyExists) {
          setAppliedLobbies([...appliedLobbies, response.data]);
        }
      }
    } catch (error) {
      fErrorCatchToast(error, "Failed to send join request.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      style={{ height: "100%", width: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: "4px",
          clipPath:
            "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: T.borderHover,
            boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${statusAccent}22`,
          },
          // Left accent bar
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: statusAccent,
            zIndex: 2,
          },
          // Top edge tint
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 3,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${statusAccent}88, transparent 55%)`,
            zIndex: 2,
          },
          height: "100%",
        }}
      >
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
            borderColor: `transparent ${statusAccent}44 transparent transparent`,
            zIndex: 3,
          }}
        />

        <Box
          sx={{
            p: "16px 18px 14px 24px",
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          {/* Host info */}
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <AvatarUser
              avatarUrl={lobby?.host?.profilePhoto}
              name={lobby?.host?.name || ""}
              verified={lobby?.host?.verified}
              sx={{ width: 44, height: 44 }}
            />
            <Stack>
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  color: T.text,
                  letterSpacing: "0.03em",
                }}
              >
                {lobby.host.name}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.6}>
                <StatusChip status={lobby?.status || "open"} />
                <MetaChip
                  icon={<Globe size={10} />}
                  label={currentRegion?.label || String(lobby.region)}
                />
                {lobby.server && (
                  <MetaChip icon={<Server size={10} />} label={lobby.server} />
                )}
              </Stack>
            </Stack>
          </Stack>

          {/* Title + rank */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={0.75}
              flex={1}
              minWidth={0}
            >
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.04em",
                  lineHeight: 1.2,
                  color: T.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                }}
              >
                {lobby.title}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5} flexShrink={0}>
              <RankChip rank={lobby.rankMin} />
              <Typography
                sx={{ color: "rgba(255,255,255,0.18)", fontSize: "0.65rem" }}
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
                fontFamily: T.RAJ,
                fontWeight: 500,
                color: T.textMuted,
                fontSize: "0.78rem",
                letterSpacing: "0.02em",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {lobby.description}
            </Typography>
          )}

          {/* Roles */}
          {roles.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.6}>
              {roles.map((role) => (
                <RoleChip key={role} role={role} />
              ))}
            </Stack>
          )}

          {/* Footer */}
          <Divider
            sx={{ borderColor: "rgba(255,255,255,0.055)", mt: "auto" }}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" gap={1.5} alignItems="center">
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Users size={12} color="rgba(58,64,96,1)" />
                <Typography
                  sx={{
                    fontFamily: T.RAJ,
                    fontWeight: 700,
                    color: T.textSub,
                    fontSize: "0.78rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {playerCount}/5
                </Typography>
                {spotsLeft > 0 && lobby.status === "open" && (
                  <Typography
                    sx={{
                      color: T.green,
                      fontSize: "0.68rem",
                      fontFamily: T.RAJ,
                      fontWeight: 600,
                    }}
                  >
                    ({spotsLeft} player{spotsLeft !== 1 ? "s" : ""} needed)
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Clock size={11} color="rgba(58,64,96,1)" />
                <Typography
                  sx={{
                    color: T.textMuted,
                    fontSize: "0.68rem",
                    fontFamily: T.RAJ,
                    fontWeight: 600,
                  }}
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
                      background: "rgba(114,137,218,0.1)",
                      border: "1px solid rgba(114,137,218,0.25)",
                      color: "#7289DA",
                      "&:hover": {
                        background: "rgba(114,137,218,0.2)",
                        borderColor: "rgba(114,137,218,0.45)",
                      },
                    }}
                  >
                    <ExternalLink size={13} />
                  </IconButton>
                </Tooltip>
              )}

              {lobby.status === "open" && (
                <Button
                  onClick={handleJoin}
                  disabled={haveYouRequestedToJoin || areYouTheHost}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "2px",
                    fontFamily: T.RAJ,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    boxShadow: "none",
                    background:
                      haveYouRequestedToJoin || areYouTheHost
                        ? "rgba(255,255,255,0.06)"
                        : T.accent,
                    color:
                      haveYouRequestedToJoin || areYouTheHost
                        ? T.textSub
                        : "#fff",
                    border:
                      haveYouRequestedToJoin || areYouTheHost
                        ? `1px solid ${T.border}`
                        : "1px solid transparent",
                    "&:hover": {
                      background:
                        haveYouRequestedToJoin || areYouTheHost
                          ? "rgba(255,255,255,0.06)"
                          : "#e03040",
                      boxShadow:
                        haveYouRequestedToJoin || areYouTheHost
                          ? "none"
                          : "0 0 14px rgba(255,70,85,0.35)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(255,255,255,0.05)",
                      color: T.textSub,
                      border: `1px solid ${T.border}`,
                    },
                  }}
                >
                  {haveYouRequestedToJoin
                    ? "Requested"
                    : areYouTheHost
                      ? "Your lobby"
                      : "Request to join"}
                </Button>
              )}

              {lobby.status === "full" && (
                <Chip
                  label="FULL"
                  size="small"
                  sx={{
                    background: T.accentDim,
                    color: T.accent,
                    border: `1px solid ${T.accentBorder}`,
                    fontFamily: T.RAJ,
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    height: 22,
                    borderRadius: "2px",
                  }}
                />
              )}
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
}
