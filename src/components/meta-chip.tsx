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
        backgroundColor: "rgba(30,40,65,0.6)", // dark blue-slate fill
        color: "#7f8fad", // textSub — mid silver-blue
        border: "1px solid rgba(80,100,150,0.25)", // subtle blue-slate border
        borderRadius: "2px",
        fontFamily: RAJ,
        fontWeight: 600,
        fontSize: "0.68rem",
        letterSpacing: "0.08em",
        height: 20,
        "& .MuiChip-icon": { ml: 0.6, color: "#3e4d6b" }, // textMuted — dim icon
        "& .MuiChip-label": { px: 0.7 },
        transition: "border-color 0.15s, color 0.15s",
        "&:hover": {
          borderColor: "rgba(127,143,173,0.35)",
          color: "#a0b0cc",
          "& .MuiChip-icon": { color: "#7f8fad" },
        },
      }}
    />
  );
}
