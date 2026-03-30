import type { LobbyType } from "src/types/type-inventory";

import { motion } from "framer-motion";
import {
  X,
  Clock,
  Globe,
  Users,
  Server,
  Shield,
  XCircle,
  Hourglass,
  CheckCircle2,
} from "lucide-react";

import {
  Box,
  Stack,
  Paper,
  Divider,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";

import { ValorantRegionalServers } from "src/@mock";

import { RankChip } from "src/components/RankChip";
import { RoleChip } from "src/components/RoleChip";
import { StatusChip } from "src/components/StatusChip";

import { MetaChip } from "./meta-chip";
import { formatTimeAgo } from "../lib/valorant";

// ─── Props ────────────────────────────────────────────────────────────────────

interface LobbyRequestCardProps {
  lobby: LobbyType;
  currentUserId: string;
  index?: number;
  onCancelRequest?: (lobbyId: string, applicationId: string) => void;
}

// ─── Status config ────────────────────────────────────────────────────────────

const REQUEST_STATUS = {
  pending: {
    label: "Pending",
    Icon: Hourglass,
    bg: "rgba(251,191,36,0.1)",
    color: "#f59e0b",
    border: "rgba(251,191,36,0.28)",
    accent: "#f59e0b",
  },
  accepted: {
    label: "Accepted",
    Icon: CheckCircle2,
    bg: "rgba(34,197,94,0.1)",
    color: "#22c55e",
    border: "rgba(34,197,94,0.3)",
    accent: "#22c55e",
  },
  rejected: {
    label: "Rejected",
    Icon: XCircle,
    bg: "rgba(255,70,85,0.1)",
    color: "#FF4655",
    border: "rgba(255,70,85,0.28)",
    accent: "#FF4655",
  },
} as const;

// ─── Tokens ───────────────────────────────────────────────────────────────────

const CARD_BG = "rgba(13,15,26,0.97)";
const BORDER = "rgba(255,255,255,0.07)";
const RAJ = '"Rajdhani", sans-serif';

// ─── Component ───────────────────────────────────────────────────────────────

export function LobbyRequestCard({
  lobby,
  currentUserId,
  index = 0,
  onCancelRequest,
}: LobbyRequestCardProps) {
  const myApplication = lobby?.applicants?.find(
    (a) => a.user.id === currentUserId,
  );

  const requestStatus =
    (myApplication?.status as keyof typeof REQUEST_STATUS) ?? "pending";
  const cfg = REQUEST_STATUS[requestStatus] ?? REQUEST_STATUS.pending;
  const { Icon: StatusIcon, accent } = cfg;

  const spotsLeft = 5 - Number(lobby?.currentPlayers ?? 4);
  const roles = lobby?.rolesNeeded?.filter(Boolean) ?? [];

  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === lobby?.region,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.32, ease: "easeOut" }}
    >
      <Paper
        elevation={0}
        sx={{
          // Dark Valorant surface
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,

          // Sharp diagonal clip — top-right corner, Valorant agent card feel
          borderRadius: "4px",
          clipPath:
            "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",

          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.2s, box-shadow 0.2s",

          "&:hover": {
            borderColor: "rgba(255,255,255,0.13)",
            boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accent}22`,
          },

          // Left accent bar — color = request status
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: accent,
            zIndex: 2,
          },

          // Top edge tint fading right
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 3,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${accent}88, transparent 55%)`,
            zIndex: 2,
          },
        }}
      >
        {/* Clipped corner triangle ornament */}
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
            borderColor: `transparent ${accent}55 transparent transparent`,
            zIndex: 3,
          }}
        />

        <Box sx={{ p: "16px 18px 14px 22px", position: "relative", zIndex: 1 }}>
          {/* Meta row */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1.5}
            mb={1.5}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={1.75}
              flexWrap="wrap"
              mb={0.4}
            >
              <MetaChip
                icon={<Globe size={12} />}
                label={currentRegion?.label || lobby?.region || "Unknown"}
              />
              <MetaChip
                icon={<Server size={12} />}
                label={lobby?.server || "Unknown"}
              />
            </Stack>

            {/* Right: badge + cancel */}
            <Stack
              direction="row"
              alignItems="center"
              gap={0.75}
              flexShrink={0}
            >
              {/* Request status badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.55,
                  px: 1,
                  py: "3px",
                  borderRadius: "2px",
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                }}
              >
                <StatusIcon size={10} color={cfg.color} strokeWidth={2} />
                <Typography
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.62rem",
                    letterSpacing: "0.1em",
                    color: cfg.color,
                    textTransform: "uppercase",
                  }}
                >
                  {cfg.label}
                </Typography>
              </Box>

              {/* Cancel — only when pending */}
              {requestStatus === "pending" &&
                onCancelRequest &&
                myApplication && (
                  <Tooltip title="Cancel request" placement="top">
                    <IconButton
                      onClick={() => onCancelRequest(lobby.id, currentUserId)}
                      size="small"
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "2px",
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: "rgba(255,255,255,0.28)",
                        transition: "all 0.15s",
                        "&:hover": {
                          border: "1px solid rgba(255,70,85,0.4)",
                          color: "#FF4655",
                          background: "rgba(255,70,85,0.08)",
                        },
                      }}
                    >
                      <X size={12} />
                    </IconButton>
                  </Tooltip>
                )}
            </Stack>
          </Stack>

          {/* ── Top row: title + status badge ── */}
          <Stack direction="column" flexWrap="wrap" gap={0.75} mb={1.5}>
            <Stack
              direction="row"
              alignItems="center"
              gap={1.75}
              flexWrap="wrap"
              mb={0.4}
            >
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  letterSpacing: "0.05em",
                  lineHeight: 1.15,
                  color: "#edf0f4",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: { xs: 170, sm: 260 },
                  textTransform: "uppercase",
                }}
              >
                {lobby.title}
              </Typography>
              <StatusChip status={lobby.status} />
            </Stack>
            {/* ── Description ── */}
            {lobby.description && (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 500,
                  color: "rgb(212, 137, 134)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.02em",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 1.25,
                }}
              >
                {lobby.description}
              </Typography>
            )}
          </Stack>

          {/* ── Rank range ── */}
          <Stack direction="row" alignItems="center" gap={0.75} mb={1}>
            <RankChip rank={lobby.rankMin} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.18)",
                fontSize: "0.65rem",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              →
            </Typography>
            <RankChip rank={lobby.rankMax} />
          </Stack>

          {/* ── Roles needed ── */}
          {roles.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.6} mb={1}>
              {roles.map((role) => (
                <RoleChip key={role} role={role} />
              ))}
            </Stack>
          )}

          {/* ── Party code — only revealed on acceptance ── */}
          {requestStatus === "accepted" && lobby.partyCode && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: "5px",
                mb: 1.25,
                borderRadius: "3px",
                background: "rgba(34,197,94,0.07)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <Shield size={11} color="#22c55e" />
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  color: "rgba(74,84,112,1)",
                  textTransform: "uppercase",
                }}
              >
                Party Code
              </Typography>
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  letterSpacing: "0.22em",
                  color: "#22c55e",
                }}
              >
                {lobby.partyCode}
              </Typography>
            </Box>
          )}

          <Divider sx={{ borderColor: "rgba(255,255,255,0.055)", mb: 1.25 }} />

          {/* ── Footer ── */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Left: player count + timestamp */}
            <Stack direction="row" gap={1.75} alignItems="center">
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Users size={12} color="rgba(58,64,96,1)" />
                <Typography
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    color: "#8892aa",
                    fontSize: "0.78rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {lobby.currentPlayers}/5
                </Typography>
                {spotsLeft > 0 && lobby.status === "open" && (
                  <Typography
                    sx={{
                      color: "#22c55e",
                      fontSize: "0.68rem",
                      fontFamily: RAJ,
                      fontWeight: 600,
                    }}
                  >
                    ({spotsLeft} left)
                  </Typography>
                )}
              </Stack>

              <Stack direction="row" alignItems="center" gap={0.5}>
                <Clock size={11} color="rgba(58,64,96,1)" />
                <Typography
                  sx={{
                    color: "rgba(74,84,112,1)",
                    fontSize: "0.68rem",
                    fontFamily: RAJ,
                    fontWeight: 600,
                  }}
                >
                  {formatTimeAgo(lobby.createdAt)}
                </Typography>
              </Stack>
            </Stack>

            {/* Right: applied role */}
            {myApplication?.user?.mainRole && (
              <Stack direction="row" alignItems="center" gap={0.6}>
                <Typography
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    letterSpacing: "0.09em",
                    color: "rgba(58,64,96,1)",
                    textTransform: "uppercase",
                  }}
                >
                  Applied as
                </Typography>
                <RoleChip role={myApplication.user.mainRole} />
              </Stack>
            )}
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
}
