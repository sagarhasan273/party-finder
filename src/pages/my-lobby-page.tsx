import type { UserType } from "src/types/type-user";
import type { ApplicantStatus } from "src/types/type-inventory";

import { toast } from "sonner";
import { motion } from "framer-motion";
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

import { formatTimeAgo } from "../lib/valorant";
import { RoleChip } from "../components/role-chip";
import { StatusChip } from "../components/status-chip";

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
  greenDim: "rgba(34,197,94,0.15)",
  greenBorder: "rgba(34,197,94,0.28)",
  teal: "#5DCAA5",
  tealDim: "rgba(93,202,165,0.08)",
  tealBorder: "rgba(93,202,165,0.25)",
  RAJ: '"Rajdhani", sans-serif',
} as const;

// ─── Shared card shell ────────────────────────────────────────────────────────

function valorantCard(accentColor: string) {
  return {
    backgroundColor: T.bg,
    border: `1px solid ${T.border}`,
    borderRadius: "4px",
    clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
    position: "relative",
    overflow: "hidden",
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:hover": {
      borderColor: T.borderHover,
      boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}22`,
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
      background: `linear-gradient(90deg, ${accentColor}88, transparent 55%)`,
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
        borderColor: `transparent ${color}44 transparent transparent`,
        zIndex: 3,
      }}
    />
  );
}

// ─── ApplicantCard ────────────────────────────────────────────────────────────

function ApplicantCard({
  user,
  lobbyId,
  status,
}: {
  user: Partial<UserType>;
  status: ApplicantStatus;
  lobbyId: string;
}) {
  const [acceptJoinRequest, { isLoading: isAccepting }] =
    useAcceptJoinRequestMutation();
  const [rejectJoinRequest, { isLoading: isRejecting }] =
    useRejectJoinRequestMutation();

  const handleAccept = async () => {
    try {
      const response = await acceptJoinRequest({
        lobbyId,
        applicantId: user.id as string,
      }).unwrap();
      if (response.status)
        toast.success(response?.message || "Join request accepted.");
    } catch (error) {
      fErrorCatchToast(error, "Failed to accept join request.");
    }
  };

  const handleReject = async () => {
    try {
      const response = await rejectJoinRequest({
        lobbyId,
        applicantId: user.id as string,
      }).unwrap();
      if (response.status)
        toast.success(response?.message || "Join request rejected.");
    } catch (error) {
      fErrorCatchToast(error, "Failed to reject join request.");
    }
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
        ...valorantCard(T.accent),
        clipPath:
          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
      }}
    >
      <CornerOrnament color={T.accent} />

      {/* Avatar + name */}
      <Stack direction="row" gap={1} mb={0.5}>
        <AvatarUser
          avatarUrl={user?.profilePhoto || ""}
          name={user.name || ""}
          verified={user.verified}
        />
        <Stack>
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              fontFamily: T.RAJ,
              letterSpacing: "0.04em",
              color: T.text,
            }}
          >
            {user.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 700,
              fontFamily: T.RAJ,
              letterSpacing: "0.04em",
              color: T.text,
              textTransform: "uppercase",
            }}
          >
            {user.gamename}
            <Box
              component="span"
              sx={{ opacity: 0.35, fontWeight: 400, textTransform: "none" }}
            >
              #{user.tagline}
            </Box>
          </Typography>
        </Stack>
      </Stack>

      {/* Rank + Role */}
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {user?.rank && <RankChip rank={user.rank} />}
        {user?.mainRole && <RoleChip role={user.mainRole} size="small" />}
      </Stack>

      {/* Playstyle */}
      {user?.playstyle && (
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontFamily: T.RAJ,
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: T.textMuted,
            lineHeight: 1.4,
          }}
        >
          {user.playstyle}
        </Typography>
      )}

      {/* Actions — pending */}
      {status === "pending" && (
        <Stack direction="row" gap={0.6} mt={0.25}>
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
              letterSpacing: "0.06em",
              height: 24,
              borderRadius: "2px",
              textTransform: "uppercase",
              background: T.greenDim,
              color: T.green,
              border: `1px solid ${T.greenBorder}`,
              boxShadow: "none",
              "&:hover": {
                background: "rgba(34,197,94,0.25)",
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
              letterSpacing: "0.06em",
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

      {/* Status — accepted */}
      {status === "accepted" && (
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
            <CircularProgress size={16} sx={{ color: T.teal, flexShrink: 0 }} />
            <Box>
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  color: T.teal,
                }}
              >
                Waiting for applicant…
              </Typography>
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 500,
                  fontSize: "0.62rem",
                  color: "rgba(93,202,165,0.6)",
                }}
              >
                They&lsquo;ll confirm shortly
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Status — rejected */}
      {status === "rejected" && (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            background: "rgba(255,70,85,0.07)",
            border: `1px solid rgba(255,70,85,0.3)`,
            borderRadius: "2px",
          }}
        >
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.78rem",
              color: T.accent,
            }}
          >
            Applicant rejected
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
      const response = await deleteLobby({
        lobbyId: id,
        hostId: user?.id || "",
        applicantIds:
          myLobby?.applicants?.map((a) => a?.user?.id as string) || [],
      }).unwrap();
      if (response?.status) {
        toast.success("Lobby deleted.");
        setMyLobby(null);
      } else {
        toast.info(response?.data?.message || "Failed to delete lobby.");
        setMyLobby(null);
      }
    } catch (error) {
      fErrorCatchToast(error, "Failed to delete lobby.");
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
        : "rgba(255,255,255,0.18)";

  // ── Auth guard ──────────────────────────────────────────────────────────────
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
            <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>
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
              color: T.textMuted,
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
                  boxShadow: `0 0 18px rgba(255,70,85,0.35)`,
                },
              }}
            >
              New lobby
            </Button>
          </Stack>
        </Box>

        {/* ── Loading skeletons ── */}
        {myLobbyLoading && (
          <Stack gap={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={160}
                sx={{
                  borderRadius: "4px",
                  bgcolor: "rgba(255,255,255,0.04)",
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
              border: "1px dashed rgba(255,255,255,0.07)",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.012)",
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
                background: "rgba(255,70,85,0.07)",
                border: "1px solid rgba(255,70,85,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layout size={20} color="rgba(255,70,85,0.45)" />
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
            <Typography sx={{ color: T.textMuted, fontSize: "0.85rem", mb: 3 }}>
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
                  {/* Top row */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                    mb={1.5}
                  >
                    {/* Host info */}
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      <AvatarUser
                        avatarUrl={myLobby?.host?.profilePhoto}
                        name={myLobby?.host?.name || ""}
                        verified={myLobby?.host?.verified}
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
                          {myLobby.host.name}
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.6}>
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

                    {/* Rank + actions */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={0.75}
                      flexShrink={0}
                    >
                      <RankChip rank={myLobby.rankMin} />
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.18)",
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
                              : "rgba(255,255,255,0.3)",
                          color:
                            myLobby.status === "open"
                              ? T.textSub
                              : "rgba(200,200,200,1)",
                          "&:hover": {
                            borderColor: "rgba(255,255,255,0.2)",
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
                            border: `1px solid rgba(255,70,85,0.2)`,
                            color: "rgba(255,70,85,0.5)",
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

                  {/* Title + status */}
                  <Box mb={1.5}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={0.75}
                      flexWrap="wrap"
                      mb={0.4}
                    >
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
                      <StatusChip status={myLobby.status} />
                    </Stack>
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
                          sx={{ color: T.textSub, fontWeight: 600 }}
                        >
                          {myLobby.hostGamename}
                        </Box>
                        {myLobby.hostTagline && (
                          <Box component="span" sx={{ opacity: 0.4 }}>
                            #{myLobby.hostTagline}
                          </Box>
                        )}
                      </Typography>
                    )}
                  </Box>

                  {/* Roles */}
                  {roles?.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.6} mb={1.25}>
                      {roles.map(
                        (role) => role && <RoleChip key={role} role={role} />,
                      )}
                    </Stack>
                  )}

                  {/* Description */}
                  {myLobby.description && (
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
                        mb: 1.5,
                      }}
                    >
                      {myLobby.description}
                    </Typography>
                  )}

                  <Divider
                    sx={{ borderColor: "rgba(255,255,255,0.055)", mb: 1.25 }}
                  />

                  {/* Footer */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
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
                            ({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
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
                          {formatTimeAgo(myLobby.createdAt)}
                        </Typography>
                      </Stack>
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
                        color: T.textMuted,
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
