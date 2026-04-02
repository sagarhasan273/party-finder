import type { LobbyType } from "src/types/type-inventory";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Copy,
  Info,
  Clock,
  Globe,
  Users,
  Check,
  Cross,
  Server,
  Shield,
  XCircle,
  Hourglass,
  CheckCircle2,
} from "lucide-react";

import {
  Box,
  Fade,
  Stack,
  Paper,
  Popper,
  Divider,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";

import { ValorantRegionalServers } from "src/@mock";

import { RoleChip } from "src/components/role-chip";
import { RankChip } from "src/components/rank-chip";

import { MetaChip } from "./meta-chip";
import { AvatarUser } from "./avatar-user";
import { StatusChip } from "./status-chip";
import { formatTimeAgo } from "../lib/valorant";
import { CountdownTimer } from "./count-down-timer";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(22, 23, 34, 0.97)",
  border: "rgba(255,255,255,0.07)",
  text: "#edf0f4",
  textMuted: "rgba(74,84,112,1)",
  textSub: "#8892aa",
  accent: "#FF4655",
  green: "#22c55e",
  RAJ: '"Rajdhani", sans-serif',
} as const;

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
  suspended: {
    label: "Suspended",
    Icon: Info,
    bg: "rgba(255, 70, 230, 0.1)",
    color: "#ff46d7",
    border: "rgba(255, 70, 240, 0.28)",
    accent: "#ff46f6",
  },
  joining: {
    label: "Joining",
    Icon: Info,
    bg: "rgba(255, 70, 230, 0.1)",
    color: "#ff46d7",
    border: "rgba(255, 70, 240, 0.28)",
    accent: "#ff46f6",
  },
  "not-joining": {
    label: "Not Joining",
    Icon: Info,
    bg: "rgba(255, 70, 230, 0.1)",
    color: "#ff46d7",
    border: "rgba(255, 70, 240, 0.28)",
    accent: "#ff46f6",
  },
  cancelled: {
    label: "Cancelled",
    Icon: Cross,
    bg: "rgba(255,70,85,0.1)",
    color: "#FF4655",
    border: "rgba(255,70,85,0.28)",
    accent: "#FF4655",
  },
} as const;

// ─── Copy hook ────────────────────────────────────────────────────────────────

function useCopyCode(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// ─── PartyCodeBox ─────────────────────────────────────────────────────────────

export function PartyCodeBox({ partyCode }: { partyCode: string }) {
  const { copied, copy } = useCopyCode(partyCode);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <Box
      onMouseEnter={(e) => {
        setAnchorEl(e.currentTarget);
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        pl: 1.25,
        pr: 0.75,
        py: "5px",
        mb: 1.25,
        ml: "auto",
        borderRadius: "3px",
        clipPath:
          "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
        background: "rgba(34,197,94,0.07)",
        border: "1px solid rgba(34,197,94,0.45)",
        position: "relative",
        overflow: "visible",
        animation: "codepulse 1.8s ease-in-out infinite",
        "@keyframes codepulse": {
          "0%": {
            borderColor: "rgba(34,197,94,0.25)",
            boxShadow: "0 0 0 0 rgba(34,197,94,0.15)",
          },
          "50%": {
            borderColor: "rgba(34,197,94,0.9)",
            boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
          },
          "100%": {
            borderColor: "rgba(34,197,94,0.25)",
            boxShadow: "0 0 0 0 rgba(34,197,94,0)",
          },
        },
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
          borderWidth: "0 8px 8px 0",
          borderColor:
            "transparent rgba(34,197,94,0.8) transparent transparent",
        }}
      />

      <Shield size={11} color={T.green} />

      <Typography
        sx={{
          fontFamily: T.RAJ,
          fontWeight: 700,
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          color: "rgba(193,199,218,1)",
          textTransform: "uppercase",
        }}
      >
        Party code
      </Typography>

      <Typography
        onClick={copy}
        sx={{
          fontFamily: T.RAJ,
          fontWeight: 700,
          fontSize: "0.88rem",
          letterSpacing: "0.22em",
          color: T.green,
          userSelect: "all",
          cursor: "pointer",
          "&:hover": { opacity: 0.75 },
        }}
      >
        {partyCode}
      </Typography>

      <IconButton
        onClick={copy}
        size="small"
        disableRipple
        sx={{
          ml: 0.25,
          width: 22,
          height: 22,
          borderRadius: "2px",
          flexShrink: 0,
          border: copied
            ? "1px solid rgba(34,197,94,0.5)"
            : "1px solid rgba(255,255,255,0.2)",
          color: copied ? T.green : "rgba(200,200,200,0.9)",
          transition: "all 0.15s",
          "&:hover": {
            border: "1px solid rgba(34,197,94,0.45)",
            color: T.green,
            background: "rgba(34,197,94,0.08)",
          },
        }}
      >
        {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} />}
      </IconButton>

      <Popper open={open} anchorEl={anchorEl} placement="top" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Box
              sx={{
                mb: 0.75,
                background: "rgba(13,15,26,0.98)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "2px",
                px: 1.25,
                py: 0.5,
                boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  color: T.green,
                  whiteSpace: "nowrap",
                }}
              >
                Copy this code to join the party
              </Typography>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}

// ─── LobbyRequestCard ─────────────────────────────────────────────────────────

interface LobbyRequestCardProps {
  lobby: LobbyType;
  currentUserId: string;
  index?: number;
  onCancelRequest?: (lobbyId: string, applicationId: string) => void;
}

export function LobbyRequestCard({
  lobby,
  currentUserId,
  index = 0,
  onCancelRequest,
}: LobbyRequestCardProps) {
  const myApplication = lobby?.applicants?.find(
    (a) => a.user === currentUserId,
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
          backgroundColor: T.bg,
          border: `1px solid ${T.border}`,
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
            borderColor: `transparent ${accent}44 transparent transparent`,
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
            {/* Host info */}
            <Stack direction="row" flexWrap="wrap" gap={1} mb={1}>
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
                  <StatusChip status={lobby.status} />
                  <MetaChip
                    icon={<Globe size={10} />}
                    label={currentRegion?.label || String(lobby.region)}
                  />
                  {lobby.server && (
                    <MetaChip
                      icon={<Server size={10} />}
                      label={lobby.server}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>

            {/* Status badge + cancel */}
            <Stack
              direction="row"
              alignItems="center"
              gap={0.75}
              flexShrink={0}
            >
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
                    fontFamily: T.RAJ,
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
                        border: `1px solid ${T.border}`,
                        color: "rgba(255,255,255,0.28)",
                        transition: "all 0.15s",
                        "&:hover": {
                          border: "1px solid rgba(255,70,85,0.4)",
                          color: T.accent,
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

          {/* Title + status + party code */}
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
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  letterSpacing: "0.05em",
                  lineHeight: 1.15,
                  color: T.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: { xs: 170, sm: 260 },
                  textTransform: "uppercase",
                }}
              >
                {lobby.title}
              </Typography>
              {requestStatus === "accepted" && lobby.partyCode && (
                <PartyCodeBox partyCode={lobby.partyCode} />
              )}
            </Stack>

            {lobby.description && (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 500,
                  color: "rgba(212,137,134,1)",
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

          {/* Rank range */}
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

          {/* Roles */}
          {roles.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.6} mb={1}>
              {roles.map((role) => (
                <RoleChip key={role} role={role} />
              ))}
            </Stack>
          )}

          <Divider sx={{ borderColor: "rgba(255,255,255,0.055)", mb: 1.25 }} />

          {/* Footer */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {myApplication?.status !== "accepted" && (
              <Stack direction="row" gap={1.75} alignItems="center">
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
                    {lobby.currentPlayers}/5
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
                      ({spotsLeft} left)
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
            )}

            {myApplication?.status === "accepted" &&
              myApplication?.updatedAt && (
                <CountdownTimer
                  acceptedAt={myApplication?.updatedAt}
                  onExpired={() => {}}
                />
              )}

            {myApplication?.user?.mainRole && (
              <Stack direction="row" alignItems="center" gap={0.6}>
                <Typography
                  sx={{
                    fontFamily: T.RAJ,
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
