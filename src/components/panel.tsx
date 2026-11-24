import type { Theme, SxProps } from "@mui/material/styles";

import React from "react";

import { Box, Typography } from "@mui/material";

import { tokens } from "../theme/theme";

interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

/** One surface style for every card, so spacing and borders stay consistent. */
export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  icon,
  action,
  sx,
  children,
}) => (
  <Box
    component="section"
    sx={[
      {
        boxSizing: "border-box",
        minWidth: 0,
        p: { xs: 2, sm: 3 },
        bgcolor: tokens.surface,
        border: `1px solid ${tokens.line}`,
        borderRadius: "8px",
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {(title || action) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {icon}
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: tokens.muted, fontSize: "0.8rem" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
    )}
    {children}
  </Box>
);
