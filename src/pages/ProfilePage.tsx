import { toast } from "sonner";
import React, { useState } from "react";

import { Container } from "@mui/system";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Select,
  Button,
  Avatar,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";

import { useCredentials } from "src/core/slices";
import { ValorantRegionalServers } from "src/@mock/constant";

const ranks = [
  "Iron I",
  "Iron II",
  "Iron III",
  "Bronze I",
  "Bronze II",
  "Bronze III",
  "Silver I",
  "Silver II",
  "Silver III",
  "Gold I",
  "Gold II",
  "Gold III",
  "Platinum I",
  "Platinum II",
  "Platinum III",
  "Diamond I",
  "Diamond II",
  "Diamond III",
  "Ascendant I",
  "Ascendant II",
  "Ascendant III",
  "Immortal I",
  "Immortal II",
  "Immortal III",
  "Radiant",
];
const roles = ["Duelist", "Initiator", "Controller", "Sentinel"];
const playstyles = ["😌 Chill", "⚖️ Balanced", "🔥 Tryhard"];
const agents = [
  "Sova",
  "Fade",
  "KAY/O",
  "Breach",
  "Jett",
  "Reyna",
  "Omen",
  "Clove",
  "Killjoy",
  "Sage",
];

export const ProfilePage: React.FC = () => {
  const { user } = useCredentials();
  const [rank, setRank] = useState("Gold II");
  const [pickRank, setPickRank] = useState("Platinum I");
  const [mainRole, setMainRole] = useState("Duelist");
  const [hostGamename, setHostGamename] = useState("");
  const [hostTag, setHostTag] = useState("");
  const [playstyle, setPlaystyle] = useState("😌 Chill");
  const [selectedRegion, setSelectedRegion] = useState("ap");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const handleAgentToggle = (agent: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agent)
        ? prev.filter((a) => a !== agent)
        : [...prev, agent].slice(0, 3),
    );
  };

  const handleSave = () => {
    toast.success("Profile saved successfully");
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, fontFamily: '"Barlow Condensed", sans-serif' }}
        >
          My Profile
        </Typography>
        <Typography variant="body2" sx={{ color: "grey.300" }}>
          Edit your Valorant identity and preferences
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3.5,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.600",
          borderRadius: 3,
          mb: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "primary.main",
              fontSize: 24,
              fontWeight: 800,
              border: 3,
              borderColor: "primary.main",
            }}
          >
            {user?.name}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.400", mb: 1 }}>
              {rank} - {playstyle} - {mainRole}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 3,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.600",
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Valorant Identity
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Current Rank</InputLabel>
            <Select
              label="Current Rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            >
              {ranks.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Peak Rank</InputLabel>
            <Select
              label="Peak Rank"
              value={pickRank}
              onChange={(e) => setPickRank(e.target.value)}
            >
              {ranks.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* First Dropdown - Region Selection */}
          <FormControl size="small" sx={{ minWidth: 110 }} fullWidth>
            <InputLabel sx={{ fontFamily: '"Rajdhani", sans-serif' }}>
              Region
            </InputLabel>
            <Select
              value={selectedRegion}
              label="Region"
              onChange={(e) => {
                setSelectedRegion(e.target.value);
              }}
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
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt: 2 }} gap={2}>
          <TextField
            size="small"
            label="Game Name"
            placeholder="Gamer123"
            value={hostGamename}
            onChange={(e) => setHostGamename(e.target.value)}
            fullWidth
            inputProps={{ maxLength: 32 }}
            required
          />
          <TextField
            size="small"
            label="TagLine"
            placeholder="V5V5"
            value={hostTag}
            onChange={(e) => setHostTag(e.target.value.replace("#", ""))}
            fullWidth
            inputProps={{ maxLength: 8 }}
            InputProps={{
              startAdornment: (
                <Typography
                  sx={{
                    color: "text.secondary",
                    mr: 0.25,
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                  }}
                >
                  #
                </Typography>
              ),
            }}
            required
          />
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: 3,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.600",
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Playstyle & Agents
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "grey.400", mb: 1, display: "block" }}
        >
          Main Role
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {roles.map((role) => (
            <Chip
              key={role}
              label={role}
              onClick={() => setMainRole(role)}
              color={mainRole === role ? "primary" : "default"}
              variant={mainRole === role ? "filled" : "outlined"}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>

        <Typography
          variant="caption"
          sx={{ color: "grey.400", mb: 1, display: "block" }}
        >
          Playstyle
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {playstyles.map((ps) => (
            <Chip
              key={ps}
              label={ps}
              onClick={() => setPlaystyle(ps)}
              color={playstyle === ps ? "primary" : "default"}
              variant={playstyle === ps ? "filled" : "outlined"}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>

        <Typography
          variant="caption"
          sx={{ color: "grey.400", mb: 1, display: "block" }}
        >
          Main Agents (select up to 3)
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ gap: 1 }}
        >
          {agents.map((agent) => (
            <Chip
              key={agent}
              label={agent}
              onClick={() => handleAgentToggle(agent)}
              color={selectedAgents.includes(agent) ? "primary" : "default"}
              variant={selectedAgents.includes(agent) ? "filled" : "outlined"}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: 3,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.600",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Social Links
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Discord Username"
            defaultValue="proplayer#1234"
            fullWidth
          />
          <TextField
            label="Tracker.gg Profile"
            defaultValue="tracker.gg/valorant/profile/..."
            fullWidth
          />
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<span>💾</span>}
        >
          Save Profile
        </Button>
      </Stack>
    </Container>
  );
};
