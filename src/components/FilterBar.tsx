import { X, Search, SlidersHorizontal } from "lucide-react";

import {
  Box,
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
import { useAppDispatch, useAppSelector } from "../store";
import { setFilters, resetFilters } from "../store/lobbiesSlice";

export function FilterBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.lobbies.filters);

  const hasActive =
    filters.search ||
    filters.rankMin ||
    filters.map ||
    filters.region ||
    filters.openOnly;

  const update = (patch: Partial<typeof filters>) => {
    dispatch(setFilters({ ...filters, ...patch }));
  };

  const selectSx = {
    "& .MuiOutlinedInput-root": {
      height: 38,
      backgroundColor: "rgba(28,32,48,0.8)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.18)" },
      "&.Mui-focused fieldset": { borderColor: "#FF4655" },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.72rem",
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 700,
      letterSpacing: "0.07em",
      color: "rgba(255,255,255,0.4)",
      "&.Mui-focused": { color: "#FF4655" },
    },
    "& .MuiSelect-select": {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 700,
      fontSize: "0.8rem",
      letterSpacing: "0.05em",
      color: "#e8ecf0",
      py: 0,
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
        <Typography
          sx={{
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.1em",
            color: "text.secondary",
          }}
        >
          FILTERS
        </Typography>
        {hasActive && (
          <Button
            onClick={() => dispatch(resetFilters())}
            size="small"
            startIcon={<X size={12} />}
            sx={{
              ml: "auto",
              fontSize: "0.72rem",
              fontFamily: '"Rajdhani", sans-serif',
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              minWidth: 0,
              px: 1,
              "&:hover": { color: "text.primary" },
            }}
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
                <Search size={14} color="#7a8499" />
              </InputAdornment>
            ),
            sx: {
              height: 38,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: "0.85rem",
              backgroundColor: "rgba(28,32,48,0.8)",
              "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.18)" },
              "&.Mui-focused fieldset": { borderColor: "#FF4655 !important" },
            },
          }}
          sx={{ flex: "1 1 180px", minWidth: 160 }}
        />

        {/* Min Rank */}
        <FormControl size="small" sx={{ ...selectSx, minWidth: 120 }}>
          <InputLabel>MIN RANK</InputLabel>
          <Select
            value={filters.rankMin}
            label="MIN RANK"
            onChange={(e) => update({ rankMin: e.target.value })}
          >
            <MenuItem value="">
              <em
                style={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                All Ranks
              </em>
            </MenuItem>
            {RANKS.map((r) => (
              <MenuItem
                key={r}
                value={r}
                sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.04em",
                }}
              >
                {r.toUpperCase()}
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
            <MenuItem value="">
              <em
                style={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                All Maps
              </em>
            </MenuItem>
            {MAPS.filter((m) => m !== "Any").map((m) => (
              <MenuItem
                key={m}
                value={m}
                sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                {m.toUpperCase()}
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
            <MenuItem value="">
              <em
                style={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                All Regions
              </em>
            </MenuItem>
            {REGIONS.map((r) => (
              <MenuItem
                key={r}
                value={r}
                sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Open Only Toggle */}
        <ToggleButton
          value="openOnly"
          selected={filters.openOnly}
          onChange={() => update({ openOnly: !filters.openOnly })}
          size="small"
          sx={{
            height: 38,
            px: 1.5,
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            border: "1px solid rgba(255,255,255,0.08) !important",
            color: filters.openOnly ? "#22c55e" : "text.secondary",
            backgroundColor: filters.openOnly
              ? "rgba(34,197,94,0.1) !important"
              : "rgba(28,32,48,0.8) !important",
            borderColor: filters.openOnly
              ? "rgba(34,197,94,0.35) !important"
              : undefined,
            "&.Mui-selected": {
              color: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.1)",
            },
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: filters.openOnly ? "#22c55e" : "text.secondary",
              mr: 0.75,
            }}
          />
          OPEN ONLY
        </ToggleButton>
      </Stack>
    </Paper>
  );
}
