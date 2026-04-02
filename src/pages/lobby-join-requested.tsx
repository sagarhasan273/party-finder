import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Layout, ChevronLeft } from "lucide-react";

import {
  Box,
  Stack,
  Button,
  Skeleton,
  Container,
  Typography,
} from "@mui/material";

import { fErrorCatchToast } from "src/lib/error-catch";
import { useInventory, useCredentials } from "src/core/slices";
import { useCancelJoinRequestMutation } from "src/core/apis/api-inventory";

import { LobbyRequestCard } from "src/components/lobby-request-card";

// ─── Shared sx tokens ────────────────────────────────────────────────────────
const rajdhani = '"Rajdhani", sans-serif';

// ─── Page ────────────────────────────────────────────────────────────────────

export function LobbyJoinRequested() {
  const { isAuthenticated, user } = useCredentials();
  const { appliedLobbies, appliedLobbiesLoading, setAppliedLobbies } =
    useInventory();

  const [cancelRequest] = useCancelJoinRequestMutation();

  const navigate = useNavigate();

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
    <Container
      maxWidth="md"
      sx={{
        py: 5,
        "&.MuiContainer-root": {
          px: {
            sm: 3,
            md: 1,
          },
        },
      }}
    >
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
                  JOIN REQUESTED LOBBIES
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* ── Loading skeletons ── */}
        {appliedLobbiesLoading && (
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
        {!appliedLobbiesLoading && !appliedLobbies.length && (
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
              You haven&apos;t requested to join any lobbies. Browse to find
              your lobby.
            </Typography>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{
                background: "#FF4655",
                fontFamily: rajdhani,
                fontWeight: 700,
                letterSpacing: "0.06em",
                "&:hover": { background: "#ff6b77" },
              }}
            >
              BROWSE LOBBIES
            </Button>
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // 1 column on mobile
              sm: "repeat(2, 1fr)", // 2 columns on tablet and up
            },
            gap: 1,
            alignItems: "stretch",
          }}
        >
          {/* ── Lobbies card ── */}
          {appliedLobbies.map((lobby, i) => (
            <LobbyRequestCard
              key={lobby.id}
              lobby={lobby}
              currentUserId={user.id} // to find your application in applicants[]
              index={i}
              onCancelRequest={async (lobbyId, applicationId) => {
                // call your cancel API here
                try {
                  const response = await cancelRequest({
                    lobbyId,
                    applicantId: applicationId,
                  }).unwrap();
                  if (response.status) {
                    setAppliedLobbies(
                      appliedLobbies.filter((l) => l.id !== lobbyId),
                    );
                  } else {
                    // handle error (e.g. show toast)
                    console.error(
                      "Failed to cancel join request:",
                      response.message,
                    );
                  }
                } catch (err) {
                  fErrorCatchToast(
                    err,
                    "Failed to cancel join request. Please try again.",
                  );
                }
              }}
            />
          ))}
        </Box>
      </motion.div>
    </Container>
  );
}
