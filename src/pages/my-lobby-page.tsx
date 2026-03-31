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

import { formatTimeAgo } from "../lib/valorant";
import { RoleChip } from "../components/role-chip";
import { StatusChip } from "../components/status-chip";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const CARD_BG = "rgba(13,15,26,0.97)";
const BORDER = "rgba(255,255,255,0.07)";
const RAJ = '"Rajdhani", sans-serif';

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
      if (response.status) {
        toast.success(response?.message || "Join request accepted.");
      }
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
      if (response.status) {
        toast.success(response?.message || "Join request rejected.");
      }
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
        p: "11px 13px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${BORDER}`,
        // Valorant diagonal clip on top-right
        borderRadius: "4px",
        clipPath:
          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.13)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        },
        // Micro left bar
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: 2,
          height: "100%",
          background: "rgba(255,70,85,0.4)",
        },
      }}
    >
      {/* Corner triangle ornament */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 10px 10px 0",
          borderColor:
            "transparent rgba(255,70,85,0.25) transparent transparent",
          zIndex: 1,
        }}
      />

      {/* Name */}
      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 700,
          fontFamily: RAJ,
          letterSpacing: "0.04em",
          color: "#edf0f4",
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
            fontFamily: RAJ,
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: "rgba(74,84,112,1)",
            lineHeight: 1.4,
          }}
        >
          {user.playstyle}
        </Typography>
      )}

      {/* Actions */}
      {status === "pending" && (
        <Stack direction="row" gap={0.6} mt={0.25}>
          <Button
            size="small"
            onClick={() => handleAccept()}
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: "0.62rem",
              fontFamily: RAJ,
              fontWeight: 700,
              letterSpacing: "0.06em",
              height: 24,
              borderRadius: "2px",
              textTransform: "uppercase",
              background: "rgba(34,197,94,0.15)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.28)",
              boxShadow: "none",
              "&:hover": {
                background: "rgba(34,197,94,0.25)",
                boxShadow: "none",
              },
            }}
            disabled={isAccepting || isRejecting}
          >
            Accept
          </Button>
          <Button
            size="small"
            onClick={() => handleReject()}
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: "0.62rem",
              fontFamily: RAJ,
              fontWeight: 700,
              letterSpacing: "0.06em",
              height: 24,
              borderRadius: "2px",
              textTransform: "uppercase",
              background: "transparent",
              color: "rgba(90,100,130,1)",
              border: "1px solid rgba(255,255,255,0.09)",
              "&:hover": {
                borderColor: "rgba(255,70,85,0.4)",
                color: "#FF4655",
                background: "rgba(255,70,85,0.07)",
              },
            }}
            disabled={isAccepting || isRejecting}
          >
            Reject
          </Button>
        </Stack>
      )}

      {status === "accepted" && (
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            background: "rgba(93,202,165,0.08)",
            border: "1px solid rgba(93,202,165,0.25)",
            borderRadius: "2px",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box sx={{ color: "#5DCAA5" }}>
              <CircularProgress size={20} sx={{ color: "currentColor" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#5DCAA5",
                }}
              >
                Waiting for applicant response...
              </Typography>
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 500,
                  fontSize: "0.65rem",
                  color: "rgba(93,202,165,0.7)",
                }}
              >
                They&lsquo;ll confirm shortly
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
      {status === "rejected" && (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            background: "rgba(93,202,165,0.08)",
            border: "1px solid rgba(202, 93, 93, 0.95)",
            borderRadius: "2px",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box>
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#fd5151",
                }}
              >
                Applicant has been rejected!
              </Typography>
            </Box>
          </Stack>
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
      const response = await lobbyStatus({
        userId: user.id,
        lobbyId: myLobby?.id as string,
      }).unwrap();
      if (response?.status && myLobby) {
        toast.success(
          response?.data === "open" ? "Lobby closed." : "Lobby reopened!",
        );
        setMyLobby({
          ...myLobby,
          id: myLobby.id,
          status: response?.data ?? myLobby.status,
        });
      }
    } catch {
      toast.error("Failed to update lobby status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteLobby({
        lobbyId: id,
        userId: user?.id || "",
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
  const maxPlayers = 5;
  const spotsLeft = maxPlayers - playerCount;

  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === myLobby?.region,
  );

  // Status-driven accent color for the main card
  const statusAccent =
    myLobby?.status === "open"
      ? "#22c55e"
      : myLobby?.status === "full"
        ? "#FF4655"
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
              background: "rgba(255,70,85,0.1)",
              border: "1px solid rgba(255,70,85,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={22} color="#FF4655" />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: RAJ,
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Sign In Required
            </Typography>
            <Typography
              sx={{ color: "rgba(74,84,112,1)", fontSize: "0.88rem" }}
            >
              You need to be signed in to manage your lobbies.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {}}
            sx={{
              background: "#FF4655",
              fontFamily: RAJ,
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              borderRadius: "3px",
              "&:hover": {
                background: "#ff6b77",
                boxShadow: "0 0 18px rgba(255,70,85,0.4)",
              },
            }}
          >
            Sign In
          </Button>
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
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <Box mb={4}>
          <Button
            component={Link}
            to="/"
            startIcon={<ChevronLeft size={14} />}
            size="small"
            sx={{
              fontFamily: RAJ,
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.09em",
              color: "rgba(74,84,112,1)",
              mb: 2,
              textTransform: "uppercase",
              borderRadius: "2px",
              "&:hover": { color: "#edf0f4" },
            }}
          >
            Back to Browse
          </Button>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              {/* Icon with diagonal clip */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "4px",
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                  background: "rgba(255,70,85,0.12)",
                  border: "1px solid rgba(255,70,85,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Layout size={17} color="#FF4655" />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 900,
                  fontSize: "1.85rem",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                  color: "#edf0f4",
                  textTransform: "uppercase",
                }}
              >
                My Lobbies
              </Typography>
            </Stack>

            <Button
              component={Link}
              to="/create"
              variant="contained"
              startIcon={<Plus size={14} />}
              sx={{
                background: "#FF4655",
                fontFamily: RAJ,
                fontWeight: 700,
                letterSpacing: "0.07em",
                fontSize: "0.75rem",
                height: 34,
                borderRadius: "3px",
                textTransform: "uppercase",
                "&:hover": {
                  background: "#ff6b77",
                  boxShadow: "0 0 18px rgba(255,70,85,0.4)",
                },
              }}
            >
              New Lobby
            </Button>
          </Stack>
        </Box>

        {/* ── Loading skeletons ─────────────────────────────────────────────── */}
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

        {/* ── Empty state ───────────────────────────────────────────────────── */}
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
                borderRadius: "4px",
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                background: "rgba(255,70,85,0.07)",
                border: "1px solid rgba(255,70,85,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <Layout size={20} color="rgba(255,70,85,0.45)" />
            </Box>
            <Typography
              sx={{
                fontFamily: RAJ,
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#edf0f4",
                mb: 0.75,
              }}
            >
              No Lobbies Yet
            </Typography>
            <Typography
              sx={{ color: "rgba(74,84,112,1)", fontSize: "0.85rem", mb: 3 }}
            >
              You haven&apos;t posted any lobbies. Create one to find your 5th!
            </Typography>
            <Button
              onClick={() => navigate("/create")}
              variant="contained"
              sx={{
                background: "#FF4655",
                fontFamily: RAJ,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                borderRadius: "3px",
                "&:hover": { background: "#ff6b77" },
              }}
            >
              Post a Lobby
            </Button>
          </Box>
        )}

        {/* ── Lobby card ───────────────────────────────────────────────────── */}
        {!myLobbyLoading && myLobby && (
          <Stack gap={2.5}>
            <motion.div
              key={myLobby.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  // Signature Valorant diagonal clip — top-right corner
                  borderRadius: "4px",
                  clipPath:
                    "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.13)",
                    boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${statusAccent}22`,
                  },
                  // Left accent bar — driven by lobby status
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
                }}
              >
                {/* Corner triangle ornament */}
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    borderStyle: "solid",
                    borderWidth: "0 16px 16px 0",
                    borderColor: `transparent ${statusAccent}44 transparent transparent`,
                    zIndex: 3,
                  }}
                />

                <Box
                  sx={{
                    p: "18px 20px 16px 24px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* ── Top control row: meta chips + rank + actions ── */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                    mb={1.5}
                  >
                    {/* Left: region + server */}
                    <Stack direction="row" flexWrap="wrap" gap={0.6}>
                      <MetaChip
                        icon={<Globe size={10} />}
                        label={currentRegion?.label || String(myLobby.region)}
                      />
                      {myLobby.server && (
                        <MetaChip
                          icon={<Server size={10} />}
                          label={myLobby.server}
                        />
                      )}
                    </Stack>

                    {/* Right: ranks + divider + actions */}
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
                        sx={{
                          mx: 0.25,
                          borderColor: "rgba(255,255,255,0.07)",
                        }}
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
                        onClick={() => handleToggle()}
                        sx={{
                          fontFamily: RAJ,
                          fontWeight: 700,
                          fontSize: "0.62rem",
                          letterSpacing: "0.07em",
                          height: 26,
                          px: 1,
                          borderRadius: "2px",
                          textTransform: "uppercase",
                          borderColor:
                            myLobby.status === "open"
                              ? "rgba(255,255,255,0.09)"
                              : "rgba(255, 255, 255, 0.42)",
                          color:
                            myLobby.status === "open"
                              ? "rgba(90,100,130,1)"
                              : "rgb(182, 182, 182)",
                          "&:hover": {
                            borderColor: "rgba(255,255,255,0.2)",
                            color: "#edf0f4",
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
                              background: "rgba(255,70,85,0.1)",
                              color: "#FF4655",
                              borderColor: "rgba(255,70,85,0.4)",
                            },
                          }}
                        >
                          <Trash2 size={11} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {/* ── Title + status + host ── */}
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
                          fontFamily: RAJ,
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          letterSpacing: "0.05em",
                          lineHeight: 1.2,
                          color: "#edf0f4",
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
                          fontFamily: RAJ,
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          letterSpacing: "0.03em",
                          color: "rgba(74,84,112,1)",
                        }}
                      >
                        hosted by{" "}
                        <Box
                          component="span"
                          sx={{ color: "#8892aa", fontWeight: 600 }}
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

                  {/* ── Roles ── */}
                  {roles?.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.6} mb={1.25}>
                      {roles.map((role) => {
                        if (!role) return null;
                        return <RoleChip key={role} role={role} />;
                      })}
                    </Stack>
                  )}

                  {/* ── Description ── */}
                  {myLobby.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: RAJ,
                        fontWeight: 500,
                        color: "rgba(74,84,112,1)",
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

                  {/* ── Footer ── */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" gap={1.75} alignItems="center">
                      {/* Players */}
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
                          {playerCount}/{maxPlayers}
                        </Typography>
                        {spotsLeft > 0 && myLobby.status === "open" && (
                          <Typography
                            sx={{
                              color: "#22c55e",
                              fontSize: "0.68rem",
                              fontFamily: RAJ,
                              fontWeight: 600,
                            }}
                          >
                            ({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
                          </Typography>
                        )}
                      </Stack>

                      {/* Time */}
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
                          {formatTimeAgo(myLobby.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            </motion.div>

            {/* ── Join requests ─────────────────────────────────────────────── */}
            {myLobby?.applicants && myLobby.applicants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <Box>
                  {/* Section label + count */}
                  <Stack direction="row" alignItems="center" gap={1} mb={1.25}>
                    <Typography
                      sx={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        fontFamily: RAJ,
                        letterSpacing: "0.12em",
                        color: "rgba(74,84,112,1)",
                        textTransform: "uppercase",
                      }}
                    >
                      Join Requests
                    </Typography>
                    <Box
                      sx={{
                        px: 0.85,
                        py: "1px",
                        borderRadius: "2px",
                        background: "rgba(255,70,85,0.1)",
                        border: "1px solid rgba(255,70,85,0.25)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          fontFamily: RAJ,
                          letterSpacing: "0.08em",
                          color: "#FF4655",
                          lineHeight: 1.7,
                        }}
                      >
                        {myLobby.applicants.length}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Cards grid */}
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
