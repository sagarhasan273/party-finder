import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

import { Box } from "@mui/system";
import { Stack, Typography, LinearProgress } from "@mui/material";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(10,11,20,0.99)",
  bgInput: "rgba(20,24,42,0.8)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  accent: "#FF4655",
  text: "#dde3f0",
  textSub: "#7f8fad",
  textMuted: "#3e4d6b",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.08)",
  greenBorder: "rgba(34,197,94,0.3)",
  RAJ: '"Rajdhani", sans-serif',
} as const;

/** Single source of truth — change this to adjust the window */
export const WINDOW_MS = 120_000; // 1 minute

interface CountdownTimerProps {
  acceptedAt: Date | string;
  onExpired?: () => void;
}

export function CountdownTimer({ acceptedAt, onExpired }: CountdownTimerProps) {
  const deadline = new Date(acceptedAt).getTime() + WINDOW_MS;

  const getSecondsLeft = () =>
    Math.max(0, Math.floor((deadline - Date.now()) / 1000));

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);
  const isWarning = secondsLeft <= 10 && secondsLeft > 0;

  useEffect(() => {
    if (secondsLeft <= 0) {
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

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  // progress = fraction of WINDOW that remains (100 = full, 0 = expired)
  const progress = (secondsLeft / (WINDOW_MS / 1000)) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        gap: 1.5,
        bgcolor: "rgba(0,0,0,0.28)",
        borderRadius: "2px",
        p: 1,
        border: `1px solid ${isWarning ? T.accent : T.border}`,
        animation: isWarning ? "warnpulse 1s ease-in-out infinite" : "none",
        "@keyframes warnpulse": {
          "0%": { borderColor: "rgba(255,70,85,0.25)" },
          "50%": { borderColor: "rgba(255,70,85,0.75)" },
          "100%": { borderColor: "rgba(255,70,85,0.25)" },
        },
      }}
    >
      <Clock size={15} color={isWarning ? T.accent : T.green} />
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 600,
              fontSize: "0.62rem",
              color: T.textSub,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Time to join
          </Typography>
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.78rem",
              color: isWarning ? T.accent : T.green,
              letterSpacing: "0.08em",
            }}
          >
            {secondsLeft <= 0 ? "00:00" : `${mm}:${ss}`}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={secondsLeft <= 0 ? 0 : progress}
          sx={{
            height: 2,
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.07)",
            "& .MuiLinearProgress-bar": {
              bgcolor: isWarning ? T.accent : T.green,
              borderRadius: 1,
              transition: "width 1s linear",
            },
          }}
        />
      </Box>
    </Box>
  );
}
