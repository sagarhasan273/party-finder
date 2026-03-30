import { Chip } from "@mui/material";

import { RANK_COLORS } from "../lib/valorant";

interface RankChipProps {
  rank: string;
  size?: "small" | "medium";
}

export function RankChip({ rank, size = "small" }: RankChipProps) {
  const colors = RANK_COLORS[rank] ?? {
    bg: "rgba(100,100,130,0.2)",
    color: "#a0a0c0",
    border: "rgba(100,100,130,0.3)",
  };
  return (
    <Chip
      label={rank?.toUpperCase()}
      size={size}
      sx={{
        borderRadius: "2px",
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 700,
        letterSpacing: "0.06em",
        fontSize: "0.68rem",
        height: 22,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}
