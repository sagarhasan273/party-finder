import React from "react";

import { Box, Typography } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

import { tokens } from "../../theme/theme";
import { Panel } from "../../components/panel";

export interface HistoryStatsData {
  totalVisits: number;
  searches: Record<string, number>;
}

export const HistoryStats: React.FC<{ data: HistoryStatsData }> = ({
  data,
}) => {
  const rows = Object.entries(data.searches).sort((a, b) => b[1] - a[1]);
  const max = rows[0]?.[1] ?? 1;

  return (
    <Panel
      title="Community activity"
      icon={<TrendingUp sx={{ color: tokens.live }} />}
      sx={{ mt: 2.5 }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(160px, 1fr) 3fr" },
          gap: { xs: 2.5, md: 4 },
          alignItems: "start",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: "2.6rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {data.totalVisits.toLocaleString()}
          </Typography>
          <Typography
            sx={{ color: tokens.muted, fontSize: "0.85rem", mt: 0.5 }}
          >
            players connected so far
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.2 }}>
            Searches by region
          </Typography>
          {rows.length === 0 ? (
            <Typography sx={{ color: tokens.muted, fontSize: "0.85rem" }}>
              No searches yet. Yours will be the first.
            </Typography>
          ) : (
            <Box
              component="ul"
              sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1 }}
            >
              {rows.map(([region, count]) => (
                <Box
                  component="li"
                  key={region}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr 48px",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {region}
                  </Typography>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: tokens.inset,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${(count / max) * 100}%`,
                        bgcolor: tokens.accent,
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      color: tokens.muted,
                      textAlign: "right",
                    }}
                  >
                    {count.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Panel>
  );
};
