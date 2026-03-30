// ─── Internal: meta chip ─────────────────────────────────────────────────────

import { Chip } from "@mui/material";

const RAJ = '"Rajdhani", sans-serif';

export function MetaChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Chip
      icon={icon as any}
      label={label.toUpperCase()}
      size="small"
      sx={{
        backgroundColor: "rgba(255,255,255,0.04)",
        color: "rgb(250, 250, 250)",
        border: `1px solid rgb(250, 250, 250)`,
        borderRadius: "2px",
        fontFamily: RAJ,
        fontWeight: 500,
        fontSize: "0.72rem",
        letterSpacing: "0.08em",
        height: 20,
        "& .MuiChip-icon": { ml: 0.6, color: "rgba(225, 231, 252, 0.98)" },
        "& .MuiChip-label": { px: 0.7 },
      }}
    />
  );
}
