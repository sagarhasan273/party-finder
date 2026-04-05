import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

import { Box } from "@mui/system";
import { Typography } from "@mui/material";

import { useSocket } from "../contexts/socket-context";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const RAJ = '"Rajdhani", sans-serif';

const PHASE_COLOR = {
  online: "#22c55e",
  lobbies: "#FF4655",
  idle: "rgba(62,77,107,1)",
} as const;

const ONLINE_SHOW_MS = 3000;
const FALLBACK_SHOW_MS = 3000;

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeStatusBadgeProps {
  openCount: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeStatusBadge({ openCount }: HomeStatusBadgeProps) {
  const { on, off, emit, isConnected } = useSocket();
  const [connectedUsers, setConnectedUsers] = useState<number>(0);

  const [showOnline, setShowOnline] = useState(false);

  // Progress bar lives in a DOM ref — no setState, no re-renders per frame
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const isCycling = useRef(false);
  const phaseStart = useRef(0);
  const phaseDuration = useRef(ONLINE_SHOW_MS);

  // ── Progress bar via direct DOM mutation (no setState) ────────────────────

  const startProgressLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      const elapsed = Date.now() - phaseStart.current;
      const pct = Math.max(0, 100 - (elapsed / phaseDuration.current) * 100);

      // Write directly to DOM — zero React re-renders
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }

      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopProgressLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = "100%";
    }
  }, []);

  // ── Cycle logic ────────────────────────────────────────────────────────────

  const stopCycle = useCallback(() => {
    isCycling.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    stopProgressLoop();
    setShowOnline(false);
  }, [stopProgressLoop]);

  const startCycle = useCallback(() => {
    if (isCycling.current) return;
    isCycling.current = true;

    const tick = (phase: "online" | "fallback") => {
      if (!isCycling.current) return;

      phaseStart.current = Date.now();
      phaseDuration.current =
        phase === "online" ? ONLINE_SHOW_MS : FALLBACK_SHOW_MS;

      startProgressLoop();

      if (phase === "online") {
        setShowOnline(true);
        timerRef.current = setTimeout(() => tick("fallback"), ONLINE_SHOW_MS);
      } else {
        setShowOnline(false);
        timerRef.current = setTimeout(() => tick("online"), FALLBACK_SHOW_MS);
      }
    };

    tick("online");
  }, [startProgressLoop]);

  // ── Socket listener ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isConnected) {
      return undefined;
    }

    startCycle();

    const handleUserCount = (data: { count: number }) => {
      setConnectedUsers(Number(data.count));
    };

    off("users:count", handleUserCount);
    on("users:count", handleUserCount);

    emit("users:count:request", {});

    return () => {
      off("users:count", handleUserCount);
      stopCycle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // ── Derive display values ──────────────────────────────────────────────────

  const mode =
    showOnline && connectedUsers !== 0
      ? "online"
      : openCount > 0
        ? "lobbies"
        : "idle";
  const accent = PHASE_COLOR[mode];

  const primaryText =
    showOnline && connectedUsers !== 0
      ? `${connectedUsers === 0 ? "few" : connectedUsers} online players`
      : openCount > 0
        ? `${openCount} open lobbies`
        : "Valorant lobby finder";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        mb: 1,
        display: "inline-flex",
        alignItems: "stretch",
        background: "rgba(13,15,26,0.97)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "4px",
        clipPath:
          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s",
        "&:hover": { borderColor: "rgba(255,255,255,0.13)" },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: 2,
          height: "100%",
          background: accent,
          zIndex: 2,
          transition: "background 0.4s",
        },
      }}
    >
      {/* ── Left: primary cycling section ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: "14px",
          py: "7px",
          pl: "16px",
          minWidth: "150px",
        }}
      >
        {/* Pulse dot */}
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            flexShrink: 0,
            transition: "background 0.4s",
            animation:
              mode !== "idle" ? "dotPulse 2s ease-in-out infinite" : "none",
            "@keyframes dotPulse": {
              "0%, 100%": { opacity: 1, transform: "scale(1)" },
              "50%": { opacity: 0.4, transform: "scale(1.4)" },
            },
          }}
        />

        {/* Animated primary text */}
        <Box sx={{ overflow: "hidden", minWidth: 80 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  color: accent,
                  transition: "color 0.4s",
                }}
              >
                {primaryText}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* ── Bottom: progress drain bar — DOM-controlled, no state ── */}
      {mode !== "idle" && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "rgba(255,255,255,0.04)",
            zIndex: 3,
          }}
        >
          <Box
            ref={progressBarRef}
            sx={{
              width: "100%",
              height: "100%",
              background: accent,
              transition: "background 0.4s",
              // width is driven by direct DOM mutation — no CSS transition
              // on width so it tracks the RAF perfectly
            }}
          />
        </Box>
      )}
    </Box>
  );
}
