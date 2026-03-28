import { Box, Chip } from "@mui/material";

import type { LobbyStatus } from "../types";

const STATUS_CONFIG: Record<
  LobbyStatus,
  { label: string; bg: string; color: string; border: string }
> = {
  open: {
    label: "OPEN",
    bg: "rgba(34,197,94,0.1)",
    color: "#22c55e",
    border: "rgba(34,197,94,0.35)",
  },
  full: {
    label: "FULL",
    bg: "rgba(255,70,85,0.1)",
    color: "#ff4655",
    border: "rgba(255,70,85,0.35)",
  },
  closed: {
    label: "CLOSED",
    bg: "rgba(120,120,140,0.15)",
    color: "#8a8aaa",
    border: "rgba(120,120,140,0.3)",
  },
};

interface StatusChipProps {
  status: LobbyStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  return (
    <Chip
      icon={
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: cfg.color,
            animation: status === "open" ? "pulse 2s infinite" : "none",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.4 },
            },
          }}
        />
      }
      label={cfg.label}
      size="small"
      sx={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 700,
        letterSpacing: "0.06em",
        fontSize: "0.68rem",
        height: 22,
        "& .MuiChip-icon": { ml: 0.75 },
        "& .MuiChip-label": { px: 0.75 },
      }}
    />
  );
}
