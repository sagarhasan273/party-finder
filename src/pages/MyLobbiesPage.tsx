import { toast } from "sonner";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Lock,
  Users,
  Clock,
  Trash2,
  Layout,
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
  CircularProgress,
} from "@mui/material";

import { useCredentials } from "src/core/slices";
import { MOCK_LOBBIES } from "src/core/slices/lobbiesSlice";

import { RankChip } from "../components/RankChip";
import { RoleChip } from "../components/RoleChip";
import { StatusChip } from "../components/StatusChip";
import { parseRoles, formatTimeAgo } from "../lib/valorant";

export function MyLobbiesPage() {
  const { isLoading: authLoading, isAuthenticated } = useCredentials();

  const navigate = useNavigate();
  const myStatus = "idle";
  const lobbiesLoading = myStatus === "idle";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("/..");
    }
  }, [authLoading, isAuthenticated]);

  const handleToggle = async (id: string, currentStatus: string) => {
    try {
      toast.success("Lobby reopened!");
    } catch {
      toast.error("Failed to update lobby status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lobby?")) return;
    try {
      toast.success("Lobby deleted.");
    } catch {
      toast.error("Failed to delete lobby.");
    }
  };

  if (authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Stack alignItems="center" gap={2}>
          <CircularProgress size={40} sx={{ color: "#FF4655" }} />
          <Typography
            sx={{
              fontFamily: '"Rajdhani", sans-serif',
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "text.secondary",
              fontSize: "0.8rem",
            }}
          >
            LOADING...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Stack alignItems="center" gap={2.5} textAlign="center">
          <Lock size={44} color="#FF4655" />
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 800 }}
          >
            SIGN IN REQUIRED
          </Typography>
          <Button
            variant="contained"
            onClick={() => {}}
            sx={{
              background: "#FF4655",
              fontFamily: '"Rajdhani", sans-serif',
              fontWeight: 700,
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
        {/* Header */}
        <Box mb={4}>
          <Button
            component={Link}
            to="/"
            startIcon={<ChevronLeft size={15} />}
            size="small"
            sx={{
              fontFamily: '"Rajdhani", sans-serif',
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.07em",
              color: "text.secondary",
              mb: 2,
              "&:hover": { color: "text.primary" },
            }}
          >
            BACK TO BROWSE
          </Button>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "6px",
                  background: "rgba(255,70,85,0.12)",
                  border: "1px solid rgba(255,70,85,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Layout size={18} color="#FF4655" />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 900,
                    fontSize: "1.8rem",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  MY LOBBIES
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {MOCK_LOBBIES.length}{" "}
                  {MOCK_LOBBIES.length === 1 ? "lobby" : "lobbies"} posted
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
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 700,
                letterSpacing: "0.06em",
                fontSize: "0.8rem",
                "&:hover": {
                  background: "#ff6b77",
                  boxShadow: "0 0 18px rgba(255,70,85,0.35)",
                },
              }}
            >
              NEW LOBBY
            </Button>
          </Stack>
        </Box>

        {/* Content */}
        {lobbiesLoading ? (
          <Stack gap={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={160}
                sx={{ borderRadius: "8px", bgcolor: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </Stack>
        ) : MOCK_LOBBIES.length === 0 ? (
          <Box
            sx={{
              py: 12,
              textAlign: "center",
              border: "1px dashed rgba(255,255,255,0.08)",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <Layout
              size={40}
              color="rgba(255,70,85,0.35)"
              style={{ marginBottom: 16 }}
            />
            <Typography
              sx={{
                fontFamily: '"Rajdhani", sans-serif',
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
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 700,
                "&:hover": { background: "#ff6b77" },
              }}
            >
              Post a Lobby
            </Button>
          </Box>
        ) : (
          <Stack gap={2}>
            {MOCK_LOBBIES.map((lobby, i) => {
              const roles = parseRoles(lobby.rolesNeeded);
              const playerCount = Number(lobby.currentPlayers) || 4;
              const maxPlayers = Number(lobby.maxPlayers) || 5;

              return (
                <motion.div
                  key={lobby.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      backgroundColor: "rgba(22,25,38,0.9)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "8px",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 3,
                        height: "100%",
                        background:
                          lobby.status === "open"
                            ? "#22c55e"
                            : lobby.status === "full"
                              ? "#FF4655"
                              : "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    {/* Top row */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                      mb={2}
                    >
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
                              fontFamily: '"Rajdhani", sans-serif',
                              fontWeight: 700,
                              fontSize: "1.05rem",
                              letterSpacing: "0.04em",
                              lineHeight: 1.2,
                            }}
                          >
                            {lobby.title}
                          </Typography>
                          <StatusChip status={lobby.status} />
                        </Stack>
                        {lobby.hostUsername && (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontWeight: 500 }}
                          >
                            {lobby.hostUsername}
                            {lobby.hostTag && (
                              <Box component="span" sx={{ opacity: 0.5 }}>
                                #{lobby.hostTag}
                              </Box>
                            )}
                          </Typography>
                        )}
                      </Box>

                      {/* Action buttons */}
                      <Stack direction="row" gap={1} flexShrink={0}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={
                            lobby.status === "open" ? (
                              <Lock size={13} />
                            ) : (
                              <RefreshCw size={13} />
                            )
                          }
                          onClick={() => handleToggle(lobby.id, lobby.status)}
                          sx={{
                            fontFamily: '"Rajdhani", sans-serif',
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            letterSpacing: "0.05em",
                            height: 30,
                            borderColor: "rgba(255,255,255,0.12)",
                            color: "text.secondary",
                            "&:hover": {
                              borderColor: "rgba(255,255,255,0.25)",
                              color: "text.primary",
                            },
                          }}
                        >
                          {lobby.status === "open" ? "CLOSE" : "REOPEN"}
                        </Button>
                        <Tooltip title="Delete lobby">
                          <IconButton
                            onClick={() => handleDelete(lobby.id)}
                            size="small"
                            sx={{
                              width: 30,
                              height: 30,
                              border: "1px solid rgba(255,70,85,0.2)",
                              color: "rgba(255,70,85,0.6)",
                              "&:hover": {
                                background: "rgba(255,70,85,0.1)",
                                color: "#FF4655",
                                borderColor: "rgba(255,70,85,0.4)",
                              },
                            }}
                          >
                            <Trash2 size={13} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>

                    {/* Meta chips */}
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      gap={0.75}
                      mb={roles.length > 0 ? 1.25 : 0}
                    >
                      <RankChip rank={lobby.rankMin} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          alignSelf: "center",
                          fontSize: "0.65rem",
                        }}
                      >
                        →
                      </Typography>
                      <RankChip rank={lobby.rankMax} />
                      <Chip
                        label={lobby.region}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          color: "text.secondary",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontFamily: '"Rajdhani", sans-serif',
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          height: 22,
                        }}
                      />
                      {lobby.map && lobby.map !== "Any" && (
                        <Chip
                          label={lobby.map}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.06)",
                            color: "text.secondary",
                            border: "1px solid rgba(255,255,255,0.1)",
                            fontFamily: '"Rajdhani", sans-serif',
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            height: 22,
                          }}
                        />
                      )}
                    </Stack>

                    {/* Roles */}
                    {roles.length > 0 && (
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={0.75}
                        mb={1.5}
                      >
                        {roles.map((role) => (
                          <RoleChip key={role} role={role} />
                        ))}
                      </Stack>
                    )}

                    {/* Description */}
                    {lobby.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.82rem",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 1.5,
                        }}
                      >
                        {lobby.description}
                      </Typography>
                    )}

                    <Divider
                      sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 1.25 }}
                    />

                    {/* Footer */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" gap={2} alignItems="center">
                        <Stack direction="row" alignItems="center" gap={0.5}>
                          <Users size={12} color="#7a8499" />
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: '"Rajdhani", sans-serif',
                              fontWeight: 700,
                              color: "text.primary",
                              fontSize: "0.78rem",
                            }}
                          >
                            {playerCount}/{maxPlayers} players
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={0.5}>
                          <Clock size={11} color="#7a8499" />
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.72rem",
                            }}
                          >
                            {formatTimeAgo(lobby.createdAt)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                </motion.div>
              );
            })}
          </Stack>
        )}
      </motion.div>
    </Container>
  );
}
