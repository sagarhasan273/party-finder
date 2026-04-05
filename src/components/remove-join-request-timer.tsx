import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

import { Box, Button, Typography } from "@mui/material";

const RAJ = '"Rajdhani", sans-serif';

interface RemoveJoinRequestTimerProps {
  /** ISO string or Date of when the request was sent */
  requestedAt: string | Date;
  /** Cooldown window in minutes — default 2 */
  cooldownMinutes?: number;
  /** Called once the cooldown expires */
  onReady?: () => void;
  onRemoveJoinRequest?: () => void;
}

export function RemoveJoinRequestTimer({
  requestedAt,
  cooldownMinutes = 2,
  onReady,
  onRemoveJoinRequest,
}: RemoveJoinRequestTimerProps) {
  const totalMs = cooldownMinutes * 60 * 1000;

  const getSecondsLeft = () => {
    const deadline = new Date(requestedAt).getTime() + totalMs;
    return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

  useEffect(() => {
    const s = getSecondsLeft();
    setSecondsLeft(s);
    if (s <= 0) {
      onReady?.();
      return undefined;
    }

    const id = setInterval(() => {
      const remaining = getSecondsLeft();
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        onReady?.();
      }
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedAt, cooldownMinutes]);

  const ready = secondsLeft <= 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  // ── Ready state ─────────────────────────────────────────────────────────────
  if (ready) {
    return (
      <Button
        onClick={onRemoveJoinRequest}
        variant="text"
        sx={{
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          fontSize: "0.8rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: "2px",
          py: 1,
          color: "#FF4655",
          "&:hover": {
            background: "rgba(255,70,85,0.08)",
            color: "#ff6b77",
          },
          height: "fit-content",
        }}
      >
        🗑️ Remove
      </Button>
    );
  }

  // ── Cooling down ─────────────────────────────────────────────────────────────
  const progress = (secondsLeft / (totalMs / 1000)) * 100;
  const isWarning = secondsLeft <= 15;
  const color = isWarning ? "#f59e0b" : "rgba(90,100,130,1)";

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 0.5,
        px: 1.25,
        py: "5px",
        borderRadius: "2px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid rgba(255,255,255,0.07)`,
        minWidth: 140,
      }}
    >
      {/* Label + countdown */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Clock size={10} color={color} />
          <Typography
            sx={{
              fontFamily: RAJ,
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color,
            }}
          >
            Dismiss request in
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: RAJ,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            color: isWarning ? "#f59e0b" : "#8892aa",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {mm}:{ss}
        </Typography>
      </Box>

      {/* Thin progress bar */}
      <Box
        sx={{
          width: "100%",
          height: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: "1px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${progress}%`,
            height: "100%",
            background: isWarning ? "#f59e0b" : "rgba(90,100,130,0.6)",
            borderRadius: "1px",
            transition: "width 1s linear, background 0.3s",
          }}
        />
      </Box>
    </Box>
  );
}
