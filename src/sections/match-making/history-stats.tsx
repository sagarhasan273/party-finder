import React from "react";

import { Box, Chip, Typography } from "@mui/material";
import { Public, TrendingUp } from "@mui/icons-material";

const SYSTEM_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export interface HistoryStatsData {
  totalVisits: number;
  searches: Record<string, number>;
}

export const HistoryStats: React.FC<{ data: HistoryStatsData }> = ({
  data,
}) => {
  // Sort the searches from highest count to lowest
  const sortedSearches = Object.entries(data.searches).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <Box
      sx={{
        mt: 2.5,
        p: { xs: 2, sm: 2.5 },
        bgcolor: "#17212B",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <TrendingUp sx={{ color: "#2ED573", fontSize: 20 }} />
        <Typography
          sx={{
            fontFamily: SYSTEM_FONT,
            fontWeight: 600,
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            color: "#F0F3F6",
          }}
        >
          Paste History of search
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gap: 2,
        }}
      >
        {/* Total Visits Card */}
        <Box
          sx={{
            p: 2,
            bgcolor: "#141D26",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              color: "#8E9AA8",
              fontSize: "0.8rem",
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            Total Players Reached
          </Typography>
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              color: "#F0F3F6",
              fontSize: "2rem",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {data.totalVisits.toLocaleString()}
          </Typography>
        </Box>

        {/* Server Leaderboard */}
        <Box
          sx={{
            p: 2,
            bgcolor: "#141D26",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              color: "#8E9AA8",
              fontSize: "0.8rem",
              fontWeight: 500,
              mb: 1.5,
            }}
          >
            Most Searched Regions
          </Typography>

          {sortedSearches.length === 0 ? (
            <Typography
              sx={{
                color: "#5E6A78",
                fontSize: "0.8rem",
                fontFamily: SYSTEM_FONT,
              }}
            >
              No search data available yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {sortedSearches.map(([region, count]) => (
                <Chip
                  key={region}
                  icon={
                    <Public
                      sx={{ fontSize: "14px !important", color: "#8E9AA8" }}
                    />
                  }
                  label={
                    <span>
                      {region}:{" "}
                      <strong style={{ color: "#F0F3F6" }}>{count}</strong>
                    </span>
                  }
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#8E9AA8",
                    fontFamily: SYSTEM_FONT,
                    fontSize: "0.75rem",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
