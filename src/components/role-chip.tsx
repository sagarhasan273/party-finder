import { Shield } from "lucide-react";

import { Chip } from "@mui/material";

import { ROLE_COLORS } from "../lib/valorant";

interface RoleChipProps {
  role: string;
  size?: "small" | "medium";
}

export function RoleChip({ role, size = "small" }: RoleChipProps) {
  const colors = ROLE_COLORS[role] ?? {
    bg: "rgba(100,100,130,0.2)",
    color: "#a0a0c0",
    border: "rgba(100,100,130,0.3)",
  };

  return (
    <Chip
      icon={<Shield size={10} style={{ color: colors.color }} />}
      label={role?.toUpperCase()}
      size={size}
      sx={{
        borderRadius: "2px",
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 700,
        letterSpacing: "0.05em",
        fontSize: "0.68rem",
        height: 22,
        "& .MuiChip-label": { px: 0.75 },
        "& .MuiChip-icon": { ml: 0.5 },
      }}
    />
  );
}
