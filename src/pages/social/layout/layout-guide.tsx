import React from "react";
import { X, Brain } from "lucide-react";

import { Box, Chip, Paper, Typography, IconButton } from "@mui/material";

interface LayoutGuideProps {
  onClose: () => void;
}

export const LayoutGuide: React.FC<LayoutGuideProps> = ({ onClose }) => (
  <Paper
    sx={{
      bgcolor: "#111e30",
      border: "1px solid rgba(0,243,197,0.3)",
      borderRadius: 1,
      p: 2,
      position: "relative",
      mx: { xs: 2, md: 3 },
      mt: 2,
      background: "linear-gradient(135deg, #111e30, #0f1925, #12121c)",
    }}
  >
    <IconButton
      onClick={onClose}
      sx={{ position: "absolute", top: 8, right: 8, color: "#6e7b8c" }}
      size="small"
    >
      <X size={16} />
    </IconButton>

    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <Box
        sx={{
          bgcolor: "rgba(0,243,197,0.1)",
          p: 1.5,
          borderRadius: 1,
          color: "#00f3c5",
          border: "1px solid rgba(0,243,197,0.2)",
          flexShrink: 0,
        }}
      >
        <Brain size={20} className="animate-pulse" />
      </Box>
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: "#00f3c5",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          NEW CHAT INLINE & MOBILE-FIRST OPTIMIZATION
          <Chip
            label="STABLE UPDATE"
            size="small"
            sx={{
              bgcolor: "rgba(0,243,197,0.2)",
              color: "#00f3c5",
              fontSize: "0.45rem",
              height: 16,
              fontWeight: 700,
            }}
          />
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#8c9ba5", mt: 0.5, fontSize: "0.75rem" }}
        >
          The chat box is now opened at the bottom of each player&rsquo;s user
          card. The main profile card has been greatly enlarged and placed
          inside a responsive showcase grid.
        </Typography>
      </Box>
    </Box>
  </Paper>
);
