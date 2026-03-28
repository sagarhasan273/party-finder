import { useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Skeleton,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { Crosshair, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchLobbies } from "../store/lobbiesSlice";
import { LobbyCard } from "../components/LobbyCard";
import { FilterBar } from "../components/FilterBar";
import { useAuth } from "../hooks/useAuth";
import { RANK_INDEX } from "../lib/valorant";

export function HomePage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const { items: lobbies, status, filters } = useAppSelector((s) => s.lobbies);
  const isLoading = status === "loading" || status === "idle";

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLobbies());
    }
  }, [dispatch, status]);

  const filteredLobbies = useMemo(() => {
    return lobbies.filter((lobby) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !lobby.title.toLowerCase().includes(q) &&
          !lobby.description?.toLowerCase().includes(q) &&
          !lobby.hostUsername?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filters.rankMin) {
        const minIdx = RANK_INDEX[filters.rankMin] ?? 0;
        const lobbyMaxIdx = RANK_INDEX[lobby.rankMax] ?? 8;
        if (lobbyMaxIdx < minIdx) return false;
      }
      if (filters.map && filters.map !== "Any") {
        if (lobby.map !== filters.map && lobby.map !== "Any") return false;
      }
      if (filters.region) {
        if (lobby.region !== filters.region) return false;
      }
      if (filters.openOnly) {
        if (lobby.status !== "open") return false;
      }
      return true;
    });
  }, [lobbies, filters]);

  const openCount = lobbies.filter((l) => l.status === "open").length;

  return (
    <Box>
      {/* ── Hero ── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #0a0c15 0%, #0d0f1a 100%)",
          pt: { xs: 2, md: 3 },
          pb: { xs: 1, md: 2 },
        }}
      >
        {/* Grid overlay */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.025,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Red corner glow */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at top right, rgba(255,70,85,0.12), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        {/* Diagonal accent stripe */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -80,
            right: "15%",
            width: 3,
            height: "200%",
            background: "rgba(255,70,85,0.07)",
            transform: "rotate(-15deg)",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Live badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                borderRadius: "4px",
                background: "rgba(255,70,85,0.1)",
                border: "1px solid rgba(255,70,85,0.3)",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ff1c2f",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%,100%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  color: "#ff1c2f",
                }}
              >
                {openCount > 0
                  ? `${openCount} OPEN LOBBIES`
                  : "VALORANT LOBBY FINDER"}
              </Typography>
            </Box>

            {/* Heading */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "4.5rem" },
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "0.03em",
                color: "#e8ecf0",
              }}
            >
              FIND YOUR{" "}
              <Box
                component="span"
                sx={{
                  color: "#ff1c2f",
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "#ff1c2f",
                    borderRadius: 2,
                  },
                  mb: 1,
                }}
              >
                FIFTH
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: { xs: "0.55rem", md: "1rem" },
                color: "rgba(255,255,255,0.5)",
                maxWidth: 520,
                lineHeight: 1.65,
                mb: 2,
              }}
            >
              Find the perfect 5th for your Valorant ranked lobby. Filter by
              rank, map, region, and role — connect with serious players, climb
              together.
            </Typography>

            {/* CTAs */}
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              <Button
                href="#lobbies"
                variant="contained"
                size="large"
                startIcon={<Crosshair size={18} />}
                endIcon={<ChevronRight size={16} />}
                sx={{
                  background: "#ff1c2f",
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  fontSize: "0.9rem",
                  px: 3,
                  height: 46,
                  "&:hover": {
                    background: "#ff1c2f",
                    boxShadow: "0 0 28px rgba(255,70,85,0.45)",
                  },
                }}
              >
                BROWSE LOBBIES
              </Button>
              {isAuthenticated && (
                <Button
                  component={Link}
                  to="/create"
                  variant="outlined"
                  size="large"
                  startIcon={<Plus size={16} />}
                  sx={{
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    fontSize: "0.9rem",
                    px: 3,
                    height: 46,
                    borderColor: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.75)",
                    "&:hover": {
                      borderColor: "rgba(255,70,85,0.5)",
                      color: "#ff1c2f",
                      background: "rgba(255,70,85,0.05)",
                    },
                  }}
                >
                  POST LOBBY
                </Button>
              )}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* ── Lobby browser ── */}
      <Container maxWidth="lg" sx={{ py: 3 }} id="lobbies">
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <FilterBar />
        </motion.div>

        {/* Results header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          mb={2}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography
              sx={{
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                color: "text.secondary",
              }}
            >
              {isLoading ? "LOADING..." : `${filteredLobbies.length} LOBBIES`}
            </Typography>
            {!isLoading && filters.openOnly && (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: "4px",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    color: "#22c55e",
                  }}
                >
                  OPEN ONLY
                </Typography>
              </Box>
            )}
          </Stack>
          {isAuthenticated && (
            <Button
              component={Link}
              to="/create"
              variant="outlined"
              size="small"
              startIcon={<Plus size={13} />}
              sx={{
                display: { xs: "none", sm: "flex" },
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                height: 32,
                borderColor: "rgba(255,70,85,0.3)",
                color: "#ff1c2f",
                "&:hover": {
                  borderColor: "#ff1c2f",
                  background: "rgba(255,70,85,0.08)",
                },
              }}
            >
              POST LOBBY
            </Button>
          )}
        </Stack>

        {/* Grid */}
        {isLoading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid size={{ xs: 12, md: 6, xl: 4 }} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={220}
                  sx={{
                    borderRadius: "6px",
                    bgcolor: "rgba(255,255,255,0.05)",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : filteredLobbies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              sx={{
                py: 12,
                textAlign: "center",
                border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <Crosshair
                size={40}
                color="rgba(255,70,85,0.4)"
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
                {lobbies.length === 0 ? "NO LOBBIES YET" : "NO MATCHES FOUND"}
              </Typography>
              <Typography
                sx={{ color: "text.secondary", fontSize: "0.88rem", mb: 3 }}
              >
                {lobbies.length === 0
                  ? "Be the first to post a lobby and find your 5th!"
                  : "Try adjusting your filters to see more results."}
              </Typography>
              {isAuthenticated && (
                <Button
                  component={Link}
                  to="/create"
                  variant="contained"
                  sx={{
                    background: "#ff1c2f",
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    "&:hover": { background: "#ff1c2f" },
                  }}
                >
                  Post a Lobby
                </Button>
              )}
            </Box>
          </motion.div>
        ) : (
          <Grid container spacing={2}>
            {filteredLobbies.map((lobby, i) => (
              <Grid size={{ xs: 12, md: 6, xl: 4 }}  key={lobby.id}>
                <LobbyCard lobby={lobby} index={i} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
