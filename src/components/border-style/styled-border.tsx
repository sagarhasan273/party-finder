import type { ReactNode } from "react";
import type { PaperProps } from "@mui/material";
import type { MotionProps } from "framer-motion";

import { motion } from "framer-motion";

import { Paper } from "@mui/material";

const T = {
  bg: "rgba(13,15,26,0.97)",
  bgCard: "rgba(14,16,28,0.97)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  accent: "#FF4655",
  text: "#dde3f0",
  textMuted: "rgba(74,84,112,1)",
  textSub: "#7f8fad",
  green: "#22c55e",
  blue: "#4fc3f7",
  gold: "#f5c842",
  purple: "#a78bfa",
  RAJ: '"Rajdhani", sans-serif',
} as const;

// Color mapping - just add colors here as needed
const colorMap: Record<string, string> = {
  red: T.accent,
  green: T.green,
  blue: T.blue,
  gold: T.gold,
  purple: T.purple,
  white: T.text,
  gray: T.textMuted,
};

interface StyledBorderProps extends PaperProps {
  children: ReactNode;
  color?: keyof typeof colorMap; // Just pass the color name!
  index?: number;
  motionProps?: MotionProps;
  hoverEffect?: boolean;
  noClipPath?: boolean;
}

export function StyledBorder({
  children,
  color = "red",
  index = 0,

  hoverEffect = true,
  noClipPath = false,
  sx,
  ...paperProps
}: StyledBorderProps) {
  const accentColor = colorMap[color] || T.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.3, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          backgroundColor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: "4px",
          clipPath: noClipPath
            ? "none"
            : "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: hoverEffect
            ? "border-color 0.2s, box-shadow 0.2s"
            : "none",
          ...(hoverEffect && {
            "&:hover": {
              borderColor: T.borderHover,
              boxShadow: `0 8px 36px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}22`,
            },
          }),
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: accentColor,
            zIndex: 2,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 3,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${accentColor}77, transparent 55%)`,
            zIndex: 2,
          },
          ...(sx as any),
        }}
        {...paperProps}
      >
        {children}
      </Paper>
    </motion.div>
  );
}
