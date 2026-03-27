// src/pages/LobbiesPage.tsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from "@mui/material";
import { LobbyCard } from "../components/LobbyCard";
import { StatsCard } from "../components/StatsCard";
import { useLobby } from "../contexts/LobbyContext";
import { useAuth } from "../contexts/AuthContext";

const rankFilters = [
  "All",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Plat",
  "Diamond",
  "Radiant",
];
const styleFilters = ["All", "Chill Only", "Comp Only"];

export const LobbiesPage: React.FC = () => {
  const { lobbies, filter, setFilter, joinLobby } = useLobby();
  const { user } = useAuth();
  const [rankFilter, setRankFilter] = useState("All");
  const [styleFilter, setStyleFilter] = useState("All");
  const [onlineCount] = useState(247);

  const filteredLobbies = useMemo(() => {
    let filtered = [...lobbies];

    if (rankFilter !== "All") {
      filtered = filtered.filter((l) =>
        l.rank.toLowerCase().includes(rankFilter.toLowerCase()),
      );
    }

    if (styleFilter === "Chill Only") {
      filtered = filtered.filter((l) => l.style === "chill");
    } else if (styleFilter === "Comp Only") {
      filtered = filtered.filter((l) => l.style === "comp");
    }

    return filtered;
  }, [lobbies, rankFilter, styleFilter]);

  const handleRankFilter = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string | null,
  ) => {
    if (newFilter !== null) setRankFilter(newFilter);
  };

  const handleStyleFilter = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string | null,
  ) => {
    if (newFilter !== null) setStyleFilter(newFilter);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 800,
            fontFamily: '"Barlow Condensed", sans-serif',
            letterSpacing: "0.3px",
            color: "#e8eaf0",
          }}
        >
          Active Lobbies
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: "#9aa0b8",
            mt: 0.5,
          }}
        >
          4-stacks looking for their fifth — sorted by rank proximity to you
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <StatsCard
          label="Open Lobbies"
          value={filteredLobbies.length}
          sub="Across all regions"
          accent
        />
        <StatsCard
          label="Online Now"
          value={onlineCount}
          sub="Active players"
          green
        />
        <StatsCard label="Your Rank" value="Gold II" sub="64 RR" />
        <StatsCard label="Avg Wait" value="2.3min" sub="To find a game" green />
      </Stack>

      <Box sx={{ mb: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            gap: 1, 
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ToggleButtonGroup
            value={rankFilter}
            exclusive
            onChange={handleRankFilter}
            size="small"
            sx={{
              flexWrap: "wrap",
              gap: 0.5,
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              "& .MuiToggleButton-root": {
                px: 1.75,
                py: 0.75,
                borderRadius: 2,
                border: "1px solid #2a2b35",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: '"Barlow", sans-serif',
                color: "#9aa0b8",
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 70, 85, 0.1)",
                  borderColor: "rgba(255, 70, 85, 0.4)",
                  color: "#ff4655",
                },
              },
            }}
          >
            {rankFilters.map((f) => (
              <ToggleButton key={f} value={f}>
                {f}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={styleFilter}
            exclusive
            onChange={handleStyleFilter}
            size="small"
            sx={{
              gap: 1,
              "& .MuiToggleButton-root": {
                px: 1.75,
                py: 0.75,
                borderRadius: 2,
                border: "1px solid #2a2b35",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: '"Barlow", sans-serif',
                color: "#9aa0b8",
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 70, 85, 0.1)",
                  borderColor: "rgba(255, 70, 85, 0.4)",
                  color: "#ff4655",
                },
              },
            }}
          >
            {styleFilters.map((f) => (
              <ToggleButton key={f} value={f}>
                {f}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Box>

      <Stack spacing={1.75}>
        {filteredLobbies.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "#5c6070" }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ margin: "0 auto 12px", opacity: 0.4 }}
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 700,
                color: "#9aa0b8",
                mb: 0.5,
                fontFamily: '"Barlow Condensed", sans-serif',
              }}
            >
              No lobbies found
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#5c6070" }}>
              Try a different filter or create your own lobby
            </Typography>
          </Box>
        ) : (
          filteredLobbies.map((lobby) => (
            <LobbyCard key={lobby.id} lobby={lobby} onJoin={joinLobby} />
          ))
        )}
      </Stack>
    </Box>
  );
};
