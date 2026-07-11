import React from "react";
import { Filter, Search } from "lucide-react";

import {
  Box,
  Paper,
  Select,
  Button,
  Switch,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";

interface Filters {
  search: string;
  rank: string;
  role: string;
  mode: string;
  micRequired: boolean;
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => (
  <Paper sx={{ p: 3 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        pb: 1,
        borderBottom: "1px solid #1b222d",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 900,
          color: "#ff4655",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Filter size={14} />
        Search Filters
      </Typography>
      <Button
        size="small"
        onClick={onReset}
        sx={{ color: "#6e7b8c", fontSize: "0.6rem", fontWeight: 900 }}
      >
        Reset
      </Button>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <TextField
        size="small"
        placeholder="Search Players/Agents..."
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        InputProps={{
          startAdornment: (
            <Search size={14} style={{ marginRight: 8, color: "#556375" }} />
          ),
          sx: { bgcolor: "#121922" },
        }}
        sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.75rem" } }}
      />

      <FormControl size="small" fullWidth>
        <InputLabel sx={{ fontSize: "0.7rem" }}>Rank Bracket</InputLabel>
        <Select
          value={filters.rank}
          onChange={(e) => onFilterChange("rank", e.target.value)}
          label="Rank Bracket"
          sx={{ bgcolor: "#121922", fontSize: "0.75rem" }}
        >
          <MenuItem value="All">All Brackets</MenuItem>
          <MenuItem value="Radiant">Radiant</MenuItem>
          <MenuItem value="Immortal">Immortal</MenuItem>
          <MenuItem value="Ascendant">Ascendant</MenuItem>
          <MenuItem value="Diamond">Diamond</MenuItem>
          <MenuItem value="Platinum">Platinum</MenuItem>
          <MenuItem value="Gold">Gold</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "#8c9ba5",
            fontWeight: 700,
            display: "block",
            mb: 1,
            fontSize: "0.6rem",
          }}
        >
          Preferred Role
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0.5,
          }}
        >
          {["All", "Duelist", "Sentinel", "Controller", "Initiator"].map(
            (role) => (
              <Button
                key={role}
                size="small"
                onClick={() => onFilterChange("role", role)}
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  bgcolor: filters.role === role ? "#ff4655" : "#121922",
                  color: filters.role === role ? "white" : "#8c9ba5",
                  border: `1px solid ${filters.role === role ? "#ff4655" : "#1e2736"}`,
                  "&:hover": {
                    bgcolor:
                      filters.role === role ? "#ff4655" : "rgba(255,70,85,0.1)",
                  },
                }}
              >
                {role}
              </Button>
            ),
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#121922",
          p: 1.5,
          borderRadius: 1,
          border: "1px solid #1e2736",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, fontSize: "0.7rem" }}
          >
            Microphone Comms
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#6e7b8c", fontSize: "0.55rem" }}
          >
            Filter voice players
          </Typography>
        </Box>
        <Switch
          checked={filters.micRequired}
          onChange={(e) => onFilterChange("micRequired", e.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": { color: "#ff4655" },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              bgcolor: "#ff4655",
            },
          }}
        />
      </Box>
    </Box>
  </Paper>
);
