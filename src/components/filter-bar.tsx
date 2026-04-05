import { X, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { Box } from "@mui/system";
import {
  Stack,
  Paper,
  Select,
  Button,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
} from "@mui/material";

import { RANKS } from "../lib/valorant";
import { useCredentials } from "../core/slices";
import { ValorantRegionalServers } from "../@mock/constant";

const RegionDetection = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : `${prev}.`));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  return (
    <Box sx={{ ml: 1 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: "0.8rem",
          color: "#22c55e",
          fontFamily: '"Rajdhani", sans-serif',
          letterSpacing: "0.05em",

          animation: "pulseGlow 1.5s ease-in-out infinite",
          "@keyframes pulseGlow": {
            "0%": {
              opacity: 0.5,
              textShadow: "0 0 0px rgba(34, 197, 94, 0.48)",
            },
            "50%": {
              opacity: 1,
              textShadow: "0 0 8px rgba(34,197,94,0.6)",
            },
            "100%": {
              opacity: 0.5,
              textShadow: "0 0 0px rgba(34, 197, 94, 0.37)",
            },
          },
        }}
      >
        🌍 Detecting your region{dots}
      </Typography>
    </Box>
  );
};

export function FilterBar() {
  const { isRegionLoading } = useCredentials();

  const [selectedRegion, setSelectedRegion] = useState("ap");
  const [selectedServer, setSelectedServer] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    rankMin: "",
    map: "",
    region: "",
    openOnly: false,
  });

  const update = (data: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...data }));
  };

  const resetFiltersLocal = () => {
    setFilters({
      search: "",
      rankMin: "",
      map: "",
      region: "",
      openOnly: false,
    });
  };

  const hasActive = useMemo(
    () =>
      filters.search ||
      filters.rankMin ||
      filters.map ||
      filters.region ||
      filters.openOnly,
    [filters],
  );

  const selectSx = {
    "& .MuiOutlinedInput-root": {
      height: 38,
      backgroundColor: "rgba(28,32,48,0.8)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.18)" },
      "&.Mui-focused fieldset": { borderColor: "#FF4655" },
    },
  };

  // Get current region's server list
  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === selectedRegion,
  );
  const serverList = currentRegion?.servers || [];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: "rgba(22,25,38,0.9)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "8px",
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
        <SlidersHorizontal size={14} color="#FF4655" />
        <Typography>FILTERS</Typography>

        {isRegionLoading && <RegionDetection />}

        {hasActive && (
          <Button
            onClick={resetFiltersLocal}
            size="small"
            startIcon={<X size={12} />}
            sx={{ ml: "auto" }}
          >
            Clear
          </Button>
        )}
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={1.25} alignItems="center">
        {/* Search */}
        {/* <TextField
          size="small"
          placeholder="Search lobbies..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={14} />
              </InputAdornment>
            ),
          }}
        /> */}

        {/* First Dropdown - Region Selection */}
        <FormControl size="small" sx={{ ...selectSx, minWidth: 110 }}>
          <InputLabel sx={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Region
          </InputLabel>
          <Select
            value={selectedRegion}
            label="Region"
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedServer(""); // Reset server when region changes
            }}
            sx={selectSx}
            disabled={isRegionLoading}
          >
            {ValorantRegionalServers.map((region) => (
              <MenuItem
                key={region.code}
                value={region.code}
                sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                }}
              >
                {region.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Second Dropdown - Server List (depends on selected region) */}
        <FormControl size="small" sx={{ ...selectSx, minWidth: 110 }}>
          <InputLabel sx={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Server {selectedRegion.toUpperCase()}
          </InputLabel>
          <Select
            value={selectedServer}
            label={`Server ${selectedRegion.toUpperCase()}`}
            onChange={(e) => setSelectedServer(e.target.value)}
            sx={selectSx}
            disabled={isRegionLoading}
          >
            {serverList.map((server) => (
              <MenuItem
                key={server}
                value={server}
                sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                }}
              >
                {server}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Rank */}
        <FormControl size="small" sx={{ ...selectSx, minWidth: 120 }}>
          <InputLabel>MIN RANK</InputLabel>
          <Select
            value={filters.rankMin}
            label="MIN RANK"
            onChange={(e) => update({ rankMin: e.target.value })}
            disabled={isRegionLoading}
          >
            <MenuItem value="">All</MenuItem>
            {RANKS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
