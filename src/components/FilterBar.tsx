import { useMemo, useState } from "react";
import { X, Search, SlidersHorizontal } from "lucide-react";

import {
  Stack,
  Paper,
  Select,
  Button,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  ToggleButton,
  InputAdornment,
} from "@mui/material";

import { MAPS, RANKS, REGIONS } from "../lib/valorant";

export function FilterBar() {
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
        <TextField
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
        />

        {/* Rank */}
        <FormControl size="small" sx={{ ...selectSx, minWidth: 120 }}>
          <InputLabel>MIN RANK</InputLabel>
          <Select
            value={filters.rankMin}
            label="MIN RANK"
            onChange={(e) => update({ rankMin: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            {RANKS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Map */}
        <FormControl size="small" sx={{ ...selectSx, minWidth: 110 }}>
          <InputLabel>MAP</InputLabel>
          <Select
            value={filters.map}
            label="MAP"
            onChange={(e) => update({ map: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            {MAPS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Region */}
        <FormControl size="small" sx={{ ...selectSx, minWidth: 110 }}>
          <InputLabel>REGION</InputLabel>
          <Select
            value={filters.region}
            label="REGION"
            onChange={(e) => update({ region: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            {REGIONS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Toggle */}
        <ToggleButton
          value="openOnly"
          selected={filters.openOnly}
          onChange={() => update({ openOnly: !filters.openOnly })}
        >
          OPEN ONLY
        </ToggleButton>
      </Stack>
    </Paper>
  );
}
