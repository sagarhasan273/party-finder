import type { UserType } from "src/types/type-user";

import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
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
  Shield,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";

import {
  Box,
  Chip,
  Stack,
  Paper,
  Button,
  Divider,
  Tooltip,
  Skeleton,
  Container,
  Typography,
  IconButton,
} from "@mui/material";

import { ValorantRegionalServers } from "src/@mock";
import { fErrorCatchToast } from "src/lib/error-catch";
import { useInventory, useCredentials } from "src/core/slices";
import {
  useGetMyLobbyQuery,
  useDeleteLobbyMutation,
} from "src/core/apis/api-inventory";

import { RankChip } from "src/components/RankChip";

import { formatTimeAgo } from "../lib/valorant";
import { RoleChip } from "../components/RoleChip";
import { StatusChip } from "../components/StatusChip";

// ─── Shared sx tokens ────────────────────────────────────────────────────────

const CARD_BG = "rgba(22,25,38,0.95)";
const BORDER = "rgba(255,255,255,0.07)";
const HOVER_BORDER = "rgba(255,255,255,0.14)";

const rajdhani = '"Rajdhani", sans-serif';

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Compact applicant card shown in the join-requests section */
function ApplicantCard({
  user,
  onAccept,
  onReject,
}: {
  user: Partial<UserType>;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: "1 1 148px",
        minWidth: 148,
        maxWidth: 210,
        p: "11px 14px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${BORDER}`,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        transition: "border-color 0.2s",
        "&:hover": { borderColor: HOVER_BORDER },
      }}
    >
      {/* Name */}
      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 700,
          fontFamily: rajdhani,
          color: "text.primary",
          letterSpacing: "0.03em",
        }}
      >
        {user.gamename}
        <Box component="span" sx={{ opacity: 0.4, fontWeight: 400 }}>
          #{user.tagline}
        </Box>
      </Typography>

      {/* Rank + Role chips */}
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {user?.rank && <RankChip rank={user.rank} />}
        {user?.mainRole && (
          <Chip
            icon={<Shield size={9} />}
            label={user.mainRole.toUpperCase()}
            size="small"
            sx={{
              fontFamily: rajdhani,
              fontWeight: 700,
              fontSize: "0.62rem",
              letterSpacing: "0.04em",
              height: 20,
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "text.secondary",
              border: `1px solid ${BORDER}`,
              "& .MuiChip-icon": { ml: 0.5, color: "text.secondary" },
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        )}
      </Stack>

      {/* Playstyle */}
      {user?.playstyle && (
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: "text.secondary",
            lineHeight: 1.45,
          }}
        >
          {user.playstyle}
        </Typography>
      )}

      {/* Actions */}
      <Stack direction="row" gap={0.75} mt={0.25}>
        <Button
          size="small"
          variant="contained"
          onClick={onAccept}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: "0.68rem",
            fontFamily: rajdhani,
            fontWeight: 700,
            letterSpacing: "0.05em",
            height: 26,
            background: "rgba(34,197,94,0.18)",
            color: "#22c55e",
            border: "1px solid rgba(34,197,94,0.3)",
            boxShadow: "none",
            "&:hover": {
              background: "rgba(34,197,94,0.28)",
              boxShadow: "none",
            },
          }}
        >
          Accept
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={onReject}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: "0.68rem",
            fontFamily: rajdhani,
            fontWeight: 700,
            letterSpacing: "0.05em",
            height: 26,
            borderColor: "rgba(255,255,255,0.1)",
            color: "text.secondary",
            "&:hover": {
              borderColor: "rgba(255,70,85,0.35)",
              color: "#FF4655",
              background: "rgba(255,70,85,0.06)",
            },
          }}
        >
          Reject
        </Button>
      </Stack>
    </Paper>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function MyLobbyPage() {
  const { isAuthenticated, user } = useCredentials();
  const { myLobby, setMyLobby } = useInventory();

  const { data, isLoading: lobbiesLoading } = useGetMyLobbyQuery(null);
  const [deleteLobby] = useDeleteLobbyMutation();

  const navigate = useNavigate();

  const deleteLobbyRef = useRef<Boolean>(false);

  const handleToggle = async (id: string, currentStatus: string) => {
    try {
      toast.success(
        currentStatus === "open" ? "Lobby closed." : "Lobby reopened!",
      );
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
        deleteLobbyRef.current = true;
      } else {
        toast.info(response?.data?.message || "Failed to delete lobby.");
      }
    } catch (error) {
      fErrorCatchToast(error, "Failed to delete lobby.");
    }
  };

  useEffect(() => {
    if (
      isAuthenticated &&
      data &&
      data.status &&
      deleteLobbyRef.current === false
    ) {
      setMyLobby(data.data || []);
    }
  }, [isAuthenticated, data, setMyLobby]);

  const roles = myLobby?.rolesNeeded ?? [];
  const playerCount = Number(myLobby?.currentPlayers) || 4;
  const maxPlayers = 5;
  const spotsLeft = maxPlayers - playerCount;

  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === myLobby?.region,
  );

  // ── Auth guard ──
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
              width: 56,
              height: 56,
              borderRadius: "12px",
              background: "rgba(255,70,85,0.1)",
              border: "1px solid rgba(255,70,85,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={26} color="#FF4655" />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontFamily: rajdhani, fontWeight: 900, mb: 0.5 }}
            >
              SIGN IN REQUIRED
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>
              You need to be signed in to manage your lobbies.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {}}
            sx={{
              background: "#FF4655",
              fontFamily: rajdhani,
              fontWeight: 700,
              letterSpacing: "0.06em",
              "&:hover": { background: "#ff6b77" },
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
        {/* ── Page header ── */}
        <Box mb={4}>
          <Button
            component={Link}
            to="/"
            startIcon={<ChevronLeft size={15} />}
            size="small"
            sx={{
              fontFamily: rajdhani,
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.07em",
              color: "text.secondary",
              mb: 2,
              textTransform: "uppercase",
              "&:hover": { color: "text.primary" },
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
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "8px",
                  background: "rgba(255,70,85,0.12)",
                  border: "1px solid rgba(255,70,85,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Layout size={18} color="#FF4655" />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: rajdhani,
                    fontWeight: 900,
                    fontSize: "1.9rem",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    color: "text.primary",
                  }}
                >
                  MY LOBBIES
                </Typography>
              </Box>
            </Stack>

            <Button
              component={Link}
              to="/create"
              variant="contained"
              startIcon={<Plus size={15} />}
              sx={{
                background: "#FF4655",
                fontFamily: rajdhani,
                fontWeight: 700,
                letterSpacing: "0.06em",
                fontSize: "0.8rem",
                height: 36,
                "&:hover": {
                  background: "#ff6b77",
                  boxShadow: "0 0 18px rgba(255,70,85,0.35)",
                },
              }}
            >
              New Lobby
            </Button>
          </Stack>
        </Box>

        {/* ── Loading skeletons ── */}
        {lobbiesLoading && (
          <Stack gap={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={160}
                sx={{
                  borderRadius: "8px",
                  bgcolor: "rgba(255,255,255,0.04)",
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </Stack>
        )}

        {/* ── Empty state ── */}
        {!lobbiesLoading && !myLobby && (
          <Box
            sx={{
              py: 12,
              textAlign: "center",
              border: "1px dashed rgba(255,255,255,0.08)",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "10px",
                background: "rgba(255,70,85,0.08)",
                border: "1px solid rgba(255,70,85,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <Layout size={22} color="rgba(255,70,85,0.5)" />
            </Box>
            <Typography
              sx={{
                fontFamily: rajdhani,
                fontWeight: 700,
                fontSize: "1.1rem",
                letterSpacing: "0.06em",
                mb: 1,
              }}
            >
              NO LOBBIES YET
            </Typography>
            <Typography
              sx={{ color: "text.secondary", fontSize: "0.88rem", mb: 3 }}
            >
              You haven&apos;t posted any lobbies. Create one to find your 5th!
            </Typography>
            <Button
              onClick={() => navigate("/create")}
              variant="contained"
              sx={{
                background: "#FF4655",
                fontFamily: rajdhani,
                fontWeight: 700,
                letterSpacing: "0.06em",
                "&:hover": { background: "#ff6b77" },
              }}
            >
              Post a Lobby
            </Button>
          </Box>
        )}

        {/* ── Lobby card ── */}
        {!lobbiesLoading && myLobby && (
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
                  borderRadius: "10px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    borderColor: HOVER_BORDER,
                    boxShadow: "0 4px 28px rgba(0,0,0,0.25)",
                  },
                  // Left accent bar — color matches status
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 3,
                    height: "100%",
                    background:
                      myLobby.status === "open"
                        ? "#22c55e"
                        : myLobby.status === "full"
                          ? "#FF4655"
                          : "rgba(255,255,255,0.12)",
                    borderRadius: "10px 0 0 10px",
                  },
                  // Subtle top highlight line
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 3,
                    right: 0,
                    height: "1px",
                    background:
                      myLobby.status === "open"
                        ? "linear-gradient(90deg, rgba(34,197,94,0.4), transparent)"
                        : myLobby.status === "full"
                          ? "linear-gradient(90deg, rgba(255,70,85,0.4), transparent)"
                          : "transparent",
                  },
                }}
              >
                <Box sx={{ p: "20px 22px 20px 28px" }}>
                  {/* ── Top row: title + actions ── */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={2}
                    mb={2}
                  >
                    {/* Left: title + host */}
                    <Box flex={1} minWidth={0}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                        mb={0.5}
                      >
                        <Typography
                          sx={{
                            fontFamily: rajdhani,
                            fontWeight: 700,
                            fontSize: "1.08rem",
                            letterSpacing: "0.04em",
                            lineHeight: 1.2,
                            color: "text.primary",
                          }}
                        >
                          {myLobby.title}
                        </Typography>
                        <StatusChip status={myLobby.status} />
                      </Stack>

                      {myLobby.hostGamename && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                          }}
                        >
                          {myLobby.hostGamename}
                          {myLobby.hostTagline && (
                            <Box
                              component="span"
                              sx={{ opacity: 0.45, fontWeight: 400 }}
                            >
                              #{myLobby.hostTagline}
                            </Box>
                          )}
                        </Typography>
                      )}
                    </Box>

                    {/* Right: rank range + action buttons */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1}
                      flexShrink={0}
                    >
                      <RankChip rank={myLobby.rankMin} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.65rem",
                          opacity: 0.6,
                        }}
                      >
                        |
                      </Typography>
                      <RankChip rank={myLobby.rankMax} />

                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ mx: 0.25, borderColor: "rgba(255,255,255,0.08)" }}
                      />

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          myLobby.status === "open" ? (
                            <Lock size={12} />
                          ) : (
                            <RefreshCw size={12} />
                          )
                        }
                        onClick={() => handleToggle(myLobby.id, myLobby.status)}
                        sx={{
                          fontFamily: rajdhani,
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          letterSpacing: "0.05em",
                          height: 28,
                          px: 1.25,
                          borderColor: "rgba(255,255,255,0.1)",
                          color: "text.secondary",
                          textTransform: "uppercase",
                          "&:hover": {
                            borderColor: "rgba(255,255,255,0.22)",
                            color: "text.primary",
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
                            width: 28,
                            height: 28,
                            border: "1px solid rgba(255,70,85,0.18)",
                            color: "rgba(255,70,85,0.5)",
                            transition: "all 0.15s",
                            "&:hover": {
                              background: "rgba(255,70,85,0.1)",
                              color: "#FF4655",
                              borderColor: "rgba(255,70,85,0.4)",
                            },
                          }}
                        >
                          <Trash2 size={12} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {/* ── Meta chips: region + server ── */}
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={0.75}
                    mb={roles?.length > 0 ? 1.25 : 1.5}
                  >
                    <Chip
                      icon={<Globe size={11} />}
                      label={
                        currentRegion?.label || myLobby?.region || "Unknown"
                      }
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        color: "text.secondary",
                        border: `1px solid ${BORDER}`,
                        fontFamily: rajdhani,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        letterSpacing: "0.04em",
                        height: 22,
                        "& .MuiChip-icon": {
                          ml: 0.75,
                          color: "text.secondary",
                        },
                        "& .MuiChip-label": { px: 0.75 },
                      }}
                    />
                    <Chip
                      icon={<Server size={11} />}
                      label={myLobby?.server || "Unknown"}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        color: "text.secondary",
                        border: `1px solid ${BORDER}`,
                        fontFamily: rajdhani,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        letterSpacing: "0.04em",
                        height: 22,
                        "& .MuiChip-icon": {
                          ml: 0.75,
                          color: "text.secondary",
                        },
                        "& .MuiChip-label": { px: 0.75 },
                      }}
                    />
                  </Stack>

                  {/* ── Role chips ── */}
                  {roles?.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.75} mb={1.5}>
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
                        color: "text.secondary",
                        fontSize: "0.83rem",
                        lineHeight: 1.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 1.75,
                      }}
                    >
                      {myLobby.description}
                    </Typography>
                  )}

                  <Divider
                    sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 1.5 }}
                  />

                  {/* ── Footer: player count + time ── */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" gap={2} alignItems="center">
                      {/* Players */}
                      <Stack direction="row" alignItems="center" gap={0.6}>
                        <Users size={13} color="#7a8499" />
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: rajdhani,
                            fontWeight: 700,
                            color: "text.primary",
                            fontSize: "0.8rem",
                          }}
                        >
                          {playerCount}/{maxPlayers}
                        </Typography>
                        {spotsLeft > 0 && myLobby.status === "open" && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#22c55e", fontSize: "0.72rem" }}
                          >
                            ({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
                          </Typography>
                        )}
                      </Stack>

                      {/* Time */}
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <Clock size={11} color="#7a8499" />
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontSize: "0.72rem" }}
                        >
                          {formatTimeAgo(myLobby.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            </motion.div>

            {/* ── Join requests section ── */}
            {myLobby?.applicants && myLobby.applicants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <Box>
                  {/* Section label */}
                  <Stack direction="row" alignItems="center" gap={1} mb={1.25}>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        fontFamily: rajdhani,
                        letterSpacing: "0.1em",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Join Requests
                    </Typography>
                    {/* Count badge */}
                    <Box
                      sx={{
                        px: 0.9,
                        py: 0.1,
                        borderRadius: "4px",
                        background: "rgba(255,70,85,0.12)",
                        border: "1px solid rgba(255,70,85,0.25)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          fontFamily: rajdhani,
                          letterSpacing: "0.06em",
                          color: "#FF4655",
                          lineHeight: 1.6,
                        }}
                      >
                        {myLobby.applicants.length}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Applicant cards grid */}
                  <Stack direction="row" gap={1.25} flexWrap="wrap">
                    {myLobby.applicants.map((applicant) => (
                      <ApplicantCard
                        key={applicant.user.id}
                        user={applicant.user}
                        onAccept={() => {
                          console.log("accept", applicant.user.id);
                        }}
                        onReject={() => {
                          console.log("reject", applicant.user.id);
                        }}
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
