import type { UserType } from "src/types/type-user";
import type { ApplicantStatus } from "src/types/type-inventory";

import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Lock,
  Users,
  Clock,
  Globe,
  Trash2,
  Layout,
  Server,
  RefreshCw,
  ChevronLeft,
  ArrowUpRight,
} from "lucide-react";

import {
  Box,
  Stack,
  Paper,
  Button,
  Divider,
  Tooltip,
  Skeleton,
  Container,
  Typography,
  IconButton,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

import { GoogleSignIn } from "src/core/auth";
import { ValorantRegionalServers } from "src/@mock";
import { fErrorCatchToast } from "src/lib/error-catch";
import { useInventory, useCredentials } from "src/core/slices";
import {
  useDeleteLobbyMutation,
  useLobbyStatusMutation,
  useAcceptJoinRequestMutation,
  useRejectJoinRequestMutation,
} from "src/core/apis/api-inventory";

import { RankChip } from "src/components/rank-chip";
import { MetaChip } from "src/components/meta-chip";
import { AvatarUser } from "src/components/avatar-user";
import { WINDOW_MS } from "src/components/count-down-timer";

import { RoleChip } from "../components/role-chip";
import { StatusChip } from "../components/status-chip";
import { formatTimeAgo, getTrackerProfileUrl } from "../lib/valorant";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(10,11,20,0.98)",
  bgCard: "rgba(14,16,28,0.97)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  accent: "#FF4655",
  accentDim: "rgba(255,70,85,0.1)",
  accentBorder: "rgba(255,70,85,0.22)",
  text: "#dde3f0",
  textSub: "#7f8fad",
  textMuted: "#3e4d6b",
  textDim: "#28374f",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.12)",
  greenBorder: "rgba(34,197,94,0.25)",
  teal: "#5DCAA5",
  tealDim: "rgba(93,202,165,0.07)",
  tealBorder: "rgba(93,202,165,0.22)",
  suspended: "#ff46d7",
  suspendedBorder: "rgba(255,70,240,0.28)",
  RAJ: '"Rajdhani", sans-serif',
} as const;

// ─── Shared helpers ───────────────────────────────────────────────────────────

function valorantCard(accentColor: string) {
  return {
    backgroundColor: T.bgCard,
    border: `1px solid ${T.border}`,
    borderRadius: "4px",
    clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
    position: "relative",
    overflow: "hidden",
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:hover": {
      borderColor: T.borderHover,
      boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}1a`,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: 3,
      height: "100%",
      background: accentColor,
      zIndex: 2,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 3,
      right: 0,
      height: "2px",
      background: `linear-gradient(90deg, ${accentColor}55, transparent 60%)`,
      zIndex: 2,
    },
  } as const;
}

function CornerOrnament({ color }: { color: string }) {
  return (
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
        borderColor: `transparent ${color}2a transparent transparent`,
        zIndex: 3,
      }}
    />
  );
}

// ─── ApplicantCountdown ───────────────────────────────────────────────────────

interface ApplicantCountdownProps {
  acceptedAt: Date | string;
  onExpired?: () => void;
}

function ApplicantCountdown({
  acceptedAt,
  onExpired,
}: ApplicantCountdownProps) {
  const deadline = new Date(acceptedAt).getTime() + WINDOW_MS;

  const getSecondsLeft = () =>
    Math.max(0, Math.floor((deadline - Date.now()) / 1000));

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);
  const isWarning = secondsLeft <= 10 && secondsLeft > 0;
  const expired = secondsLeft <= 0;

  useEffect(() => {
    if (expired) {
      onExpired?.();
      return undefined;
    }
    const id = setInterval(() => {
      const s = getSecondsLeft();
      setSecondsLeft(s);
      if (s <= 0) {
        clearInterval(id);
        onExpired?.();
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  if (expired) return null;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const progress = (secondsLeft / (WINDOW_MS / 1000)) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        bgcolor: "rgba(0,0,0,0.25)",
        borderRadius: "2px",
        p: "7px 10px",
        border: `1px solid ${isWarning ? T.accent : T.tealBorder}`,
        animation: isWarning ? "warnpulse 1s ease-in-out infinite" : "none",
        "@keyframes warnpulse": {
          "0%": { borderColor: "rgba(255,70,85,0.2)" },
          "50%": { borderColor: "rgba(255,70,85,0.7)" },
          "100%": { borderColor: "rgba(255,70,85,0.2)" },
        },
      }}
    >
      <Clock
        size={13}
        color={isWarning ? T.accent : T.teal}
        style={{ flexShrink: 0 }}
      />
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" mb={0.4}>
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 600,
              fontSize: "0.6rem",
              color: T.textSub,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            Waiting for response
          </Typography>
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.72rem",
              color: isWarning ? T.accent : T.teal,
              letterSpacing: "0.08em",
            }}
          >
            {mm}:{ss}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 2,
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.06)",
            "& .MuiLinearProgress-bar": {
              bgcolor: isWarning ? T.accent : T.teal,
              borderRadius: 1,
              transition: "width 1s linear",
            },
          }}
        />
      </Box>
    </Box>
  );
}

// ─── ApplicantCard ────────────────────────────────────────────────────────────

function ApplicantCard({
  user,
  lobbyId,
  status,
  acceptedAt,
  message,
}: {
  user: Partial<UserType>;
  status: ApplicantStatus;
  lobbyId: string;
  acceptedAt?: Date | string;
  message?: string;
}) {
  const { setLobbyApplicantStatus } = useInventory();
  const [acceptJoinRequest, { isLoading: isAccepting }] =
    useAcceptJoinRequestMutation();
  const [rejectJoinRequest, { isLoading: isRejecting }] =
    useRejectJoinRequestMutation();

  const handleAccept = async () => {
    try {
      const r = await acceptJoinRequest({
        lobbyId,
        applicantId: user.id as string,
      }).unwrap();
      if (r.status) {
        setLobbyApplicantStatus({
          applicantId: user?.id as string,
          status: "accepted",
          updatedAt: new Date().toString(),
        });
        toast.success(r?.message || "Join request accepted.");
      }
    } catch (e) {
      fErrorCatchToast(e, "Failed to accept join request.");
    }
  };

  const handleReject = async () => {
    try {
      const r = await rejectJoinRequest({
        lobbyId,
        applicantId: user.id as string,
      }).unwrap();
      if (r.status) {
        setLobbyApplicantStatus({
          applicantId: user?.id as string,
          status: "rejected",
        });
        toast.success(r?.message || "Join request rejected.");
      }
    } catch (e) {
      fErrorCatchToast(e, "Failed to reject join request.");
    }
  };

  // Auto-suspend when the 1-min window closes without a response
  const handleCountdownExpired = () => {
    setLobbyApplicantStatus({
      applicantId: user?.id as string,
      status: "suspended",
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        flex: "1 1 148px",
        minWidth: 250,
        maxWidth: { xs: 1, sm: 300 },
        p: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        ...valorantCard(status === "joining" ? T.green : T.accent),
        clipPath:
          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
      }}
    >
      <CornerOrnament color={status === "joining" ? T.green : T.accent} />

      {/* Avatar + name */}
      <Stack direction="row" gap={1} mb={0.5}>
        <AvatarUser
          avatarUrl={user?.profilePhoto || ""}
          name={user.name || ""}
          verified={user.verified}
        />
        <Stack justifyContent="center">
          <Typography
            sx={{
              fontSize: "0.82rem",
              fontWeight: 700,
              fontFamily: T.RAJ,
              letterSpacing: "0.03em",
              color: T.text,
              lineHeight: 1.2,
            }}
          >
            {user.name}
          </Typography>
          <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                fontFamily: T.RAJ,
                letterSpacing: "0.04em",
                color: T.textSub,
                lineHeight: 1.4,
              }}
            >
              {user.gamename}
              <Box component="span" sx={{ opacity: 0.8, fontWeight: 500 }}>
                #{user.tagline}
              </Box>
            </Typography>
            {user.gamename && user.tagline && (
              <Box
                component="span"
                onClick={() =>
                  window.open(
                    getTrackerProfileUrl(user.gamename!, user.tagline!),
                    "_blank",
                  )
                }
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2px",
                  cursor: "pointer",
                  color: "#4a9eca",
                  fontSize: "0.6rem",
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  transition: "color 0.15s",
                  "&:hover": { color: "#7ac5e8" },
                }}
              >
                <ArrowUpRight size={11} />
                Stats
              </Box>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Rank + Role — pending only */}
      {status === "pending" && (
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {user?.rank && <RankChip rank={user.rank} />}
          {user?.mainRole && <RoleChip role={user.mainRole} size="small" />}
        </Stack>
      )}

      {/* Playstyle */}
      {user?.playstyle && (
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontFamily: T.RAJ,
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: T.textSub,
            lineHeight: 1.4,
          }}
        >
          {user.playstyle}
        </Typography>
      )}

      {/* Actions — pending */}
      {status === "pending" && (
        <Stack direction="row" gap={0.6} mt="auto">
          <Button
            size="small"
            onClick={handleAccept}
            disabled={isAccepting || isRejecting}
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: "0.62rem",
              fontFamily: T.RAJ,
              fontWeight: 700,
              letterSpacing: "0.07em",
              height: 24,
              borderRadius: "2px",
              textTransform: "uppercase",
              background: T.greenDim,
              color: T.green,
              border: `1px solid ${T.greenBorder}`,
              boxShadow: "none",
              "&:hover": {
                background: "rgba(34,197,94,0.2)",
                boxShadow: "none",
              },
            }}
          >
            Accept
          </Button>
          <Button
            size="small"
            onClick={handleReject}
            disabled={isAccepting || isRejecting}
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: "0.62rem",
              fontFamily: T.RAJ,
              fontWeight: 700,
              letterSpacing: "0.07em",
              height: 24,
              borderRadius: "2px",
              textTransform: "uppercase",
              background: "transparent",
              color: T.textSub,
              border: `1px solid ${T.border}`,
              "&:hover": {
                borderColor: T.accentBorder,
                color: T.accent,
                background: T.accentDim,
              },
            }}
          >
            Reject
          </Button>
        </Stack>
      )}

      {/* Status — accepted: live countdown */}
      {status === "accepted" &&
        (acceptedAt ? (
          <ApplicantCountdown
            acceptedAt={acceptedAt}
            onExpired={handleCountdownExpired}
          />
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 1.25,
              background: T.tealDim,
              border: `1px solid ${T.tealBorder}`,
              borderRadius: "2px",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1.25}>
              <CircularProgress
                size={15}
                sx={{ color: T.teal, flexShrink: 0 }}
              />
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.76rem",
                  color: T.teal,
                }}
              >
                Waiting for applicant…
              </Typography>
            </Stack>
          </Paper>
        ))}

      {/* Status — suspended */}
      {status === "suspended" && (
        <Paper
          elevation={0}
          sx={{
            p: 1.25,
            background: "rgba(255,70,230,0.06)",
            border: `1px solid ${T.suspendedBorder}`,
            borderRadius: "2px",
          }}
        >
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 600,
              fontSize: "0.76rem",
              color: T.suspended,
            }}
          >
            Suspended
          </Typography>
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontSize: "0.62rem",
              color: "rgba(255,70,230,0.5)",
              mt: 0.25,
              lineHeight: 1.4,
            }}
          >
            Applicant didn&lsquo;t respond in time.
          </Typography>
        </Paper>
      )}

      {/* Status — rejected */}
      {status === "rejected" && (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            background: "rgba(255,70,85,0.06)",
            border: "1px solid rgba(255,70,85,0.2)",
            borderRadius: "2px",
            mt: "auto",
          }}
        >
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.76rem",
              color: T.accent,
              textAlign: "center",
            }}
          >
            Applicant rejected
          </Typography>
        </Paper>
      )}

      {status === "joining" && (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            background: T.greenDim,
            border: `1px solid ${T.greenBorder}`,
            borderRadius: "2px",
            mt: "auto",
          }}
        >
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.76rem",
              color: T.green,
              textAlign: "center",
            }}
          >
            Applicant has responded to join.
          </Typography>
        </Paper>
      )}

      {/* Status — rejected */}
      {status === "cancelled" && (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            background: "rgba(255,70,85,0.06)",
            border: "1px solid rgba(255,70,85,0.2)",
            borderRadius: "2px",
            mt: "auto",
          }}
        >
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.76rem",
              color: T.accent,
              textAlign: "center",
            }}
          >
            Request got cancelled.
          </Typography>
        </Paper>
      )}
    </Paper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function MyLobbyPage() {
  const { isAuthenticated, user } = useCredentials();
  const { myLobby, setMyLobby, myLobbyLoading } = useInventory();
  const [deleteLobby] = useDeleteLobbyMutation();
  const [lobbyStatus] = useLobbyStatusMutation();
  const navigate = useNavigate();

  const handleToggle = async () => {
    try {
      await lobbyStatus({
        userId: user.id,
        lobbyId: myLobby?.id as string,
      }).unwrap();
    } catch {
      toast.error("Failed to update lobby status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const r = await deleteLobby({
        lobbyId: id,
        hostId: user?.id || "",
        applicantIds:
          myLobby?.applicants?.map((a) => a?.user?.id as string) || [],
      }).unwrap();
      if (r?.status) {
        toast.success("Lobby deleted.");
        setMyLobby(null);
      } else {
        toast.info(r?.data?.message || "Failed to delete lobby.");
        setMyLobby(null);
      }
    } catch (e) {
      fErrorCatchToast(e, "Failed to delete lobby.");
    }
  };

  const roles = myLobby?.rolesNeeded ?? [];
  const playerCount = Number(myLobby?.currentPlayers) || 4;
  const spotsLeft = 5 - playerCount;
  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === myLobby?.region,
  );

  const statusAccent =
    myLobby?.status === "open"
      ? T.green
      : myLobby?.status === "full"
        ? T.accent
        : "rgba(255,255,255,0.12)";

  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Stack alignItems="center" gap={2.5} textAlign="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "4px",
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
              background: T.accentDim,
              border: `1px solid ${T.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={22} color={T.accent} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: T.text,
                mb: 0.5,
              }}
            >
              Sign in required
            </Typography>
            <Typography sx={{ color: T.textSub, fontSize: "0.88rem" }}>
              You need to be signed in to manage your lobbies.
            </Typography>
          </Box>
          <GoogleSignIn />
        </Stack>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Page header ── */}
        <Box mb={4}>
          <Button
            component={Link}
            to="/"
            startIcon={<ChevronLeft size={14} />}
            size="small"
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.09em",
              color: T.textSub,
              mb: 2,
              textTransform: "uppercase",
              borderRadius: "2px",
              "&:hover": { color: T.text },
            }}
          >
            Back to browse
          </Button>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "4px",
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                  background: T.accentDim,
                  border: `1px solid ${T.accentBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Layout size={17} color={T.accent} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 900,
                  fontSize: "1.85rem",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                  color: T.text,
                  textTransform: "uppercase",
                }}
              >
                My lobbies
              </Typography>
            </Stack>

            <Button
              component={Link}
              to="/create"
              variant="contained"
              startIcon={<Plus size={14} />}
              disabled={!!myLobby}
              sx={{
                background: T.accent,
                fontFamily: T.RAJ,
                fontWeight: 700,
                letterSpacing: "0.07em",
                fontSize: "0.75rem",
                height: 34,
                borderRadius: "3px",
                textTransform: "uppercase",
                boxShadow: "none",
                "&:hover": {
                  background: "#e03040",
                  boxShadow: "0 0 18px rgba(255,70,85,0.3)",
                },
              }}
            >
              New lobby
            </Button>
          </Stack>
        </Box>

        {/* ── Skeletons ── */}
        {myLobbyLoading && (
          <Stack gap={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={160}
                sx={{
                  borderRadius: "4px",
                  bgcolor: "rgba(255,255,255,0.035)",
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </Stack>
        )}

        {/* ── Empty state ── */}
        {!myLobbyLoading && !myLobby && (
          <Box
            sx={{
              py: 12,
              textAlign: "center",
              border: "1px dashed rgba(255,255,255,0.06)",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                mx: "auto",
                mb: 2,
                borderRadius: "4px",
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                background: T.accentDim,
                border: `1px solid ${T.accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layout size={20} color="rgba(255,70,85,0.4)" />
            </Box>
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: T.text,
                mb: 0.75,
              }}
            >
              No lobbies yet
            </Typography>
            <Typography sx={{ color: T.textSub, fontSize: "0.85rem", mb: 3 }}>
              You haven&lsquo;t posted any lobbies. Create one to find your 5th!
            </Typography>
            <Button
              onClick={() => navigate("/create")}
              variant="contained"
              sx={{
                background: T.accent,
                fontFamily: T.RAJ,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                borderRadius: "3px",
                boxShadow: "none",
                "&:hover": { background: "#e03040", boxShadow: "none" },
              }}
            >
              Post a lobby
            </Button>
          </Box>
        )}

        {/* ── Lobby card ── */}
        {!myLobbyLoading && myLobby && (
          <Stack gap={2.5}>
            <motion.div
              key={myLobby.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Paper elevation={0} sx={valorantCard(statusAccent)}>
                <CornerOrnament color={statusAccent} />

                <Box
                  sx={{
                    p: "18px 20px 16px 24px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                    mb={1.75}
                  >
                    <Stack direction="row" gap={1.25} alignItems="center">
                      <AvatarUser
                        avatarUrl={myLobby?.host?.profilePhoto}
                        name={myLobby?.host?.name || ""}
                        verified={myLobby?.host?.verified}
                        sx={{ width: 42, height: 42 }}
                      />
                      <Stack>
                        <Typography
                          sx={{
                            fontFamily: T.RAJ,
                            fontWeight: 700,
                            fontSize: "0.84rem",
                            color: T.text,
                            letterSpacing: "0.03em",
                            lineHeight: 1.2,
                          }}
                        >
                          {myLobby.host.name}
                        </Typography>
                        <Stack
                          direction="row"
                          flexWrap="wrap"
                          gap={0.6}
                          mt={0.2}
                        >
                          <StatusChip status={myLobby.status} />
                          <MetaChip
                            icon={<Globe size={10} />}
                            label={
                              currentRegion?.label || String(myLobby.region)
                            }
                          />
                          {myLobby.server && (
                            <MetaChip
                              icon={<Server size={10} />}
                              label={myLobby.server}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={0.75}
                      flexShrink={0}
                    >
                      <RankChip rank={myLobby.rankMin} />
                      <Typography
                        sx={{
                          color: T.textMuted,
                          fontSize: "0.62rem",
                          lineHeight: 1,
                        }}
                      >
                        →
                      </Typography>
                      <RankChip rank={myLobby.rankMax} />
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ mx: 0.25, borderColor: T.border }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          myLobby.status === "open" ? (
                            <Lock size={11} />
                          ) : (
                            <RefreshCw size={11} />
                          )
                        }
                        onClick={handleToggle}
                        sx={{
                          fontFamily: T.RAJ,
                          fontWeight: 700,
                          fontSize: "0.62rem",
                          letterSpacing: "0.07em",
                          height: 26,
                          px: 1,
                          borderRadius: "2px",
                          textTransform: "uppercase",
                          borderColor:
                            myLobby.status === "open"
                              ? T.border
                              : "rgba(255,255,255,0.2)",
                          color:
                            myLobby.status === "open"
                              ? T.textSub
                              : "rgba(180,190,210,1)",
                          "&:hover": {
                            borderColor: "rgba(255,255,255,0.18)",
                            color: T.text,
                            background: "rgba(255,255,255,0.04)",
                          },
                        }}
                      >
                        {myLobby.status === "open" ? "Close" : "Reopen"}
                      </Button>
                      <Tooltip title="Delete lobby" placement="top">
                        <IconButton
                          onClick={() => handleDelete(myLobby.id)}
                          size="small"
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: "2px",
                            border: "1px solid rgba(255,70,85,0.18)",
                            color: "rgba(255,70,85,0.45)",
                            transition: "all 0.15s",
                            "&:hover": {
                              background: T.accentDim,
                              color: T.accent,
                              borderColor: T.accentBorder,
                            },
                          }}
                        >
                          <Trash2 size={11} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Box mb={1.5}>
                    <Typography
                      sx={{
                        fontFamily: T.RAJ,
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        letterSpacing: "0.05em",
                        lineHeight: 1.2,
                        color: T.text,
                        textTransform: "uppercase",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: { xs: 200, sm: 420 },
                      }}
                    >
                      {myLobby.title}
                    </Typography>
                    {myLobby.hostGamename && (
                      <Typography
                        sx={{
                          fontFamily: T.RAJ,
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          letterSpacing: "0.03em",
                          color: T.textMuted,
                        }}
                      >
                        hosted by{" "}
                        <Box
                          component="span"
                          sx={{ color: T.textSub, fontWeight: 700 }}
                        >
                          {myLobby.hostGamename}
                        </Box>
                        {myLobby.hostTagline && (
                          <Box
                            component="span"
                            sx={{ color: T.textMuted, fontWeight: 400 }}
                          >
                            #{myLobby.hostTagline}
                          </Box>
                        )}
                      </Typography>
                    )}
                  </Box>

                  {roles?.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.6} mb={1.25}>
                      {roles.map(
                        (role) => role && <RoleChip key={role} role={role} />,
                      )}
                    </Stack>
                  )}

                  {myLobby.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: T.RAJ,
                        fontWeight: 500,
                        color: T.textSub,
                        fontSize: "0.78rem",
                        letterSpacing: "0.02em",
                        lineHeight: 1.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 1.5,
                      }}
                    >
                      {myLobby.description}
                    </Typography>
                  )}

                  <Divider
                    sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 1.25 }}
                  />

                  <Stack direction="row" gap={1.75} alignItems="center">
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <Users size={12} color={T.textMuted} />
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
                      {spotsLeft > 0 && myLobby.status === "open" && (
                        <Typography
                          sx={{
                            color: T.green,
                            fontSize: "0.68rem",
                            fontFamily: T.RAJ,
                            fontWeight: 600,
                          }}
                        >
                          ({spotsLeft} player{spotsLeft !== 1 ? "s" : ""}{" "}
                          needed)
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <Clock size={11} color={T.textMuted} />
                      <Typography
                        sx={{
                          color: T.textMuted,
                          fontSize: "0.68rem",
                          fontFamily: T.RAJ,
                          fontWeight: 600,
                        }}
                      >
                        {formatTimeAgo(myLobby.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            </motion.div>

            {/* ── Join requests ── */}
            {myLobby?.applicants && myLobby.applicants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <Box>
                  <Stack direction="row" alignItems="center" gap={1} mb={1.25}>
                    <Typography
                      sx={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        fontFamily: T.RAJ,
                        letterSpacing: "0.12em",
                        color: T.textSub,
                        textTransform: "uppercase",
                      }}
                    >
                      Join requests
                    </Typography>
                    <Box
                      sx={{
                        px: 0.85,
                        py: "1px",
                        borderRadius: "2px",
                        background: T.accentDim,
                        border: `1px solid ${T.accentBorder}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          fontFamily: T.RAJ,
                          letterSpacing: "0.08em",
                          color: T.accent,
                          lineHeight: 1.7,
                        }}
                      >
                        {myLobby.applicants.length}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {myLobby.applicants.map((applicant) => (
                      <ApplicantCard
                        key={applicant.user.id}
                        user={applicant.user}
                        lobbyId={myLobby.id}
                        status={applicant.status}
                        acceptedAt={applicant.updatedAt}
                        message={applicant?.message}
                      />
                    ))}
                  </Stack>
                </Box>
              </motion.div>
            )}
          </Stack>
        )}
      </motion.div>
    </Container>
  );
}
