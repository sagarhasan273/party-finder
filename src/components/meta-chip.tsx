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
        color: "#fd9099",
        border: `1px solid #FF4655`,
        borderRadius: "2px",
        fontFamily: RAJ,
        fontWeight: 500,
        fontSize: "0.72rem",
        letterSpacing: "0.08em",
        height: 20,
        "& .MuiChip-icon": { ml: 0.6, color: "#FF4655" },
        "& .MuiChip-label": { px: 0.7 },
      }}
    />
  );
}
