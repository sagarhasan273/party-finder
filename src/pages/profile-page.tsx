import type { UserType } from "src/types/type-user";

import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { Save, Globe, ArrowUpRight } from "lucide-react";

import {
  Box,
  Chip,
  Stack,
  Paper,
  Button,
  Avatar,
  Select,
  Divider,
  MenuItem,
  TextField,
  Container,
  Typography,
  InputLabel,
  FormControl,
  InputAdornment,
} from "@mui/material";

import { useCredentials } from "src/core/slices";
import { useUpdateUserMutation } from "src/core/apis";
import { getTrackerProfileUrl } from "src/lib/valorant";
import { ValorantRegionalServers } from "src/@mock/constant";
import valorant_icon from "src/assets/images/valorant_icon.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const ranks: UserType["rank"][] = [
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

const roles: UserType["mainRole"][] = [
  "Duelist",
  "Initiator",
  "Controller",
  "Sentinel",
];

const playstyles: UserType["playstyle"][] = [
  "😌 Chill",
  "⚖️ Balanced",
  "🔥 Tryhard",
];

export const ValorantAgents: UserType["agents"] = [
  "Astra",
  "Breach",
  "Brimstone",
  "Chamber",
  "Clove",
  "Cypher",
  "Deadlock",
  "Fade",
  "Gekko",
  "Harbor",
  "Iso",
  "Jett",
  "KAY/O",
  "Killjoy",
  "Neon",
  "Omen",
  "Phoenix",
  "Raze",
  "Reyna",
  "Sage",
  "Skye",
  "Sova",
  "Viper",
  "Vyse",
  "Yoru",
  "Waylay",
  "Miks",
];

// ─── Design tokens ────────────────────────────────────────────────────────────

const RAJ = '"Rajdhani", sans-serif';
const CARD_BG = "rgba(13,15,26,0.97)";
const ACCENT = "#FF4655";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(74,84,112,1)";
const TEXT = "#edf0f4";

const ROLE_COLORS: Record<
  string,
  { bg: string; border: string; color: string }
> = {
  Duelist: {
    bg: "rgba(99,153,34,0.15)",
    border: "rgba(99,153,34,0.4)",
    color: "#97c459",
  },
  Initiator: {
    bg: "rgba(53,74,183,0.15)",
    border: "rgba(85,151,235,0.4)",
    color: "#85b7eb",
  },
  Controller: {
    bg: "rgba(186,117,23,0.15)",
    border: "rgba(186,117,23,0.4)",
    color: "#ef9f27",
  },
  Sentinel: {
    bg: "rgba(93,202,165,0.15)",
    border: "rgba(93,202,165,0.4)",
    color: "#5DCAA5",
  },
};

const PS_COLORS: Record<string, { bg: string; border: string; color: string }> =
  {
    "😌 Chill": {
      bg: "rgba(93,202,165,0.12)",
      border: "rgba(93,202,165,0.35)",
      color: "#5DCAA5",
    },
    "⚖️ Balanced": {
      bg: "rgba(55,138,221,0.12)",
      border: "rgba(55,138,221,0.35)",
      color: "#85b7eb",
    },
    "🔥 Tryhard": {
      bg: "rgba(255,70,85,0.14)",
      border: "rgba(255,70,85,0.45)",
      color: ACCENT,
    },
    "⚔️ Competitive": {
      bg: "rgba(255,165,0,0.12)",
      border: "rgba(255,165,0,0.35)",
      color: "#FFA500",
    },
    "🎯 Serious": {
      bg: "rgba(138,43,226,0.12)",
      border: "rgba(138,43,226,0.35)",
      color: "#8A2BE2",
    },
  };

// ─── Shared MUI sx helpers ────────────────────────────────────────────────────

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: RAJ,
    fontWeight: 700,
    fontSize: "0.82rem",
    color: TEXT,
    borderRadius: "2px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.09)" },
    "&:hover fieldset": { borderColor: "rgba(255,70,85,0.35)" },
    "&.Mui-focused fieldset": { borderColor: ACCENT, borderWidth: 1 },
    "& input": { padding: "7px 10px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: RAJ,
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.06em",
    color: MUTED,
    "&.Mui-focused": { color: ACCENT },
  },
};

const selectSx = {
  fontFamily: RAJ,
  fontWeight: 700,
  fontSize: "0.82rem",
  color: TEXT,
  borderRadius: "2px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.09)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,70,85,0.35)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: ACCENT,
    borderWidth: 1,
  },
  "& .MuiSelect-select": { padding: "7px 10px" },
  "& .MuiSvgIcon-root": { color: MUTED },
};

const labelSx = {
  fontFamily: RAJ,
  fontWeight: 700,
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  color: MUTED,
  "&.Mui-focused": { color: ACCENT },
};

const menuPaperSx = {
  bgcolor: "#0d0f1a",
  border: `1px solid ${BORDER}`,
  borderRadius: "2px",
  "& .MuiMenuItem-root": {
    fontFamily: RAJ,
    fontWeight: 700,
    fontSize: "0.82rem",
    color: TEXT,
    "&:hover": { bgcolor: "rgba(255,70,85,0.08)" },
    "&.Mui-selected": { bgcolor: "rgba(255,70,85,0.14)", color: ACCENT },
    "&.Mui-selected:hover": { bgcolor: "rgba(255,70,85,0.2)" },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function VCard({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: object;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: "4px",
        clipPath:
          "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
        position: "relative",
        overflow: "hidden",
        mb: 1.75,
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "rgba(255,255,255,0.12)" },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: ACCENT,
          zIndex: 2,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 3,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${ACCENT}88, transparent 55%)`,
          zIndex: 2,
        },
        ...sx,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 14px 14px 0",
          borderColor: `transparent ${ACCENT}40 transparent transparent`,
          zIndex: 3,
        }}
      />
      <Box sx={{ p: "20px 22px 18px 26px", position: "relative", zIndex: 1 }}>
        {children}
      </Box>
    </Paper>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" gap={1} mb={1.75}>
      <Typography
        sx={{
          fontFamily: RAJ,
          fontWeight: 700,
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          color: "rgba(255,70,85,0.8)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </Typography>
      <Box
        sx={{ flex: 1, height: "1px", background: "rgba(255,70,85,0.15)" }}
      />
    </Stack>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: "fit-content",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderRadius: "2px",
        p: "10px 14px",
      }}
    >
      <Typography
        sx={{
          fontFamily: RAJ,
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "rgba(58,64,96,1)",
          textTransform: "uppercase",
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: RAJ,
          fontSize: "0.88rem",
          fontWeight: 700,
          color: TEXT,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ProfilePage: React.FC = () => {
  const { user, region: location } = useCredentials();

  const [rank, setRank] = useState<UserType["rank"]>(user?.rank || "Gold II");
  const [pickRank, setPickRank] = useState<UserType["pickRank"]>(
    user?.pickRank || "Platinum I",
  );
  const [mainRole, setMainRole] = useState<UserType["mainRole"]>(
    user?.mainRole || "Duelist",
  );
  const [hostGamename, setHostGamename] = useState<UserType["gamename"]>(
    user?.gamename || "",
  );
  const [hostTagline, setHostTagline] = useState<UserType["tagline"]>(
    user?.tagline || "",
  );
  const [playstyle, setPlaystyle] = useState<UserType["playstyle"]>(
    user?.playstyle || "😌 Chill",
  );
  const [selectedRegion, setSelectedRegion] = useState<UserType["region"]>(
    user?.region || "ap",
  );
  const [selectedAgents, setSelectedAgents] = useState<UserType["agents"]>(
    user?.agents || [],
  );
  const [discordUsername, setDiscordUsername] = useState("proplayer#1234");

  const [updateUser, { isLoading: userUpdateLoading }] =
    useUpdateUserMutation();

  const handleAgentToggle = (
    agent: Exclude<UserType["agents"], undefined>[number],
  ) => {
    setSelectedAgents((prev) => {
      const current = prev || [];
      return current.includes(agent)
        ? current.filter((a) => a !== agent)
        : current.length < 3
          ? [...current, agent]
          : current;
    });
  };

  const handleSave = async () => {
    if (!hostGamename || !hostTagline) {
      toast.error("Please enter both Game Name and Tagline");
      return;
    }
    try {
      const response = await updateUser({
        id: user?.id,
        country: user?.country || undefined,
        rank,
        pickRank,
        mainRole,
        playstyle,
        region: selectedRegion,
        agents: selectedAgents,
        gamename: hostGamename,
        tagline: hostTagline,
      }).unwrap();

      if (response?.status) toast.success("Profile saved successfully");
      else toast.error("Failed to update profile. Please try again.");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleReset = () => {
    if (!user) return;
    setRank(user.rank || "Gold II");
    setPickRank(user.pickRank || "Platinum I");
    setMainRole(user.mainRole || "Duelist");
    setHostGamename(user.gamename || "");
    setHostTagline(user.tagline || "");
    setPlaystyle(user.playstyle || "😌 Chill");
    setSelectedRegion(user.region || "ap");
    setSelectedAgents(user.agents || []);
  };

  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === selectedRegion,
  );
  const roleColor = ROLE_COLORS[mainRole ?? "Duelist"];
  const psColor = PS_COLORS[playstyle ?? "😌 Chill"];

  useEffect(() => {
    if (!user) return;
    setRank(user.rank || "Gold II");
    setPickRank(user.pickRank || "Platinum I");
    setMainRole(user.mainRole || "Duelist");
    setHostGamename(user.gamename || "");
    setHostTagline(user.tagline || "");
    setPlaystyle(user.playstyle || "😌 Chill");
    setSelectedRegion(user.region || "ap");
    setSelectedAgents(user.agents || []);
  }, [user]);

  return (
    <Container maxWidth="sm" sx={{ py: 2.5 }}>
      {/* ── Page header ── */}
      <Box mb={2.5}>
        <Typography
          sx={{
            fontFamily: RAJ,
            fontWeight: 700,
            fontSize: "1.75rem",
            letterSpacing: "0.06em",
            color: TEXT,
            textTransform: "uppercase",
            lineHeight: 1.1,
          }}
        >
          My Profile
        </Typography>
        <Typography
          sx={{
            fontFamily: RAJ,
            fontWeight: 600,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            color: MUTED,
            textTransform: "uppercase",
            mt: 0.5,
          }}
        >
          Edit your Valorant identity and preferences
        </Typography>
      </Box>

      {/* ── Identity card ── */}
      <VCard>
        <SectionTitle>Player identity</SectionTitle>

        <Stack direction="row" alignItems="center" gap={2.25} mb={2}>
          <Avatar
            src={valorant_icon}
            alt={user?.name}
            sx={{
              width: 68,
              height: 68,
              borderRadius: 2,
              border: "2px solid rgba(255,70,85,0.4)",
              bgcolor: "rgba(255,70,85,0.1)",
              padding: 0.5,
              flexShrink: 0,
            }}
          />
          <Box flex={1}>
            <Typography
              sx={{
                fontFamily: RAJ,
                fontWeight: 700,
                fontSize: "1.15rem",
                letterSpacing: "0.05em",
                color: TEXT,
                textTransform: "uppercase",
                lineHeight: 1.2,
              }}
            >
              {user?.name || "Agent"}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              gap={0.75}
              mt={0.5}
              flexWrap="wrap"
            >
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: "rgba(136,146,170,1)",
                }}
              >
                {rank}
              </Typography>
              <Typography
                sx={{ color: "rgba(58,64,96,1)", fontSize: "0.6rem" }}
              >
                ·
              </Typography>
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: psColor?.color ?? "rgba(136,146,170,1)",
                }}
              >
                {playstyle}
              </Typography>
              <Typography
                sx={{ color: "rgba(58,64,96,1)", fontSize: "0.6rem" }}
              >
                ·
              </Typography>
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: roleColor?.color ?? "rgba(136,146,170,1)",
                }}
              >
                {mainRole}
              </Typography>
            </Stack>
          </Box>
          {location?.country && (
            <Stack
              direction="row"
              alignItems="center"
              gap={0.75}
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: "2px",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid rgba(255,255,255,0.08)`,
                flexShrink: 0,
              }}
            >
              <Globe size={11} color="rgba(136,146,170,0.6)" />
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  color: "rgba(136,146,170,1)",
                  textTransform: "uppercase",
                }}
              >
                {location.country}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Stat tiles */}
        <Stack direction="row" gap={1.25} mb={2} flexWrap="wrap">
          <StatTile label="Current rank" value={rank ?? "—"} />
          <StatTile label="Peak rank" value={pickRank ?? "—"} />
          <StatTile
            label="Region"
            value={currentRegion?.label || selectedRegion || "—"}
          />
          <StatTile
            label="Agents"
            value={`${selectedAgents?.length ?? 0} / 3`}
          />
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.055)", mb: 2 }} />
        <SectionTitle>Social links</SectionTitle>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={1.5}
          alignItems="flex-end"
        >
          <TextField
            size="small"
            label="Discord username"
            value={discordUsername}
            onChange={(e) => setDiscordUsername(e.target.value)}
            fullWidth
            sx={inputSx}
          />
        </Stack>
      </VCard>

      {/* ── Valorant credentials ── */}
      <VCard>
        <SectionTitle>Valorant credentials</SectionTitle>

        <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} mb={1.75}>
          <FormControl size="small" fullWidth>
            <InputLabel sx={labelSx}>Current rank</InputLabel>
            <Select
              label="Current rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              sx={selectSx}
              MenuProps={{ PaperProps: { sx: menuPaperSx } }}
            >
              {ranks.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel sx={labelSx}>Peak rank</InputLabel>
            <Select
              label="Peak rank"
              value={pickRank}
              onChange={(e) => setPickRank(e.target.value)}
              sx={selectSx}
              MenuProps={{ PaperProps: { sx: menuPaperSx } }}
            >
              {ranks.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: "fit-content" }}>
            <InputLabel sx={labelSx}>Region</InputLabel>
            <Select
              label="Region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              sx={selectSx}
              MenuProps={{ PaperProps: { sx: menuPaperSx } }}
            >
              {ValorantRegionalServers.map((r) => (
                <MenuItem key={r.code} value={r.code}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
          <TextField
            size="small"
            label="Game name"
            placeholder="Gamer123"
            fullWidth
            required
            value={hostGamename}
            onChange={(e) => setHostGamename(e.target.value)}
            inputProps={{ maxLength: 32 }}
            sx={inputSx}
          />
          <TextField
            size="small"
            label="Tagline"
            placeholder="V5V5"
            required
            value={hostTagline}
            onChange={(e) => setHostTagline(e.target.value.replace("#", ""))}
            inputProps={{ maxLength: 8 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography
                    sx={{
                      fontFamily: RAJ,
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      color: "rgba(255,70,85,0.7)",
                    }}
                  >
                    #
                  </Typography>
                </InputAdornment>
              ),
            }}
            sx={{ ...inputSx, maxWidth: { sm: 160 } }}
          />
          <Button
            variant="outlined"
            startIcon={<ArrowUpRight size={14} />}
            disabled={!hostGamename || !hostTagline}
            onClick={() => {
              if (hostGamename && hostTagline)
                window.open(
                  getTrackerProfileUrl(hostGamename, hostTagline),
                  "_blank",
                );
            }}
            sx={{
              minWidth: "fit-content",
              fontFamily: RAJ,
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "2px",
              whiteSpace: "nowrap",
              px: 2.5,
              borderColor: "rgba(255,255,255,0.15)",
              color: "rgba(136,146,170,1)",
              "&:hover": {
                borderColor: "rgba(255,70,85,0.45)",
                color: ACCENT,
                background: "rgba(255,70,85,0.06)",
              },
              "&.Mui-disabled": {
                borderColor: "rgba(255,255,255,0.06)",
                color: "rgba(58,64,96,1)",
              },
            }}
          >
            View stats
          </Button>
        </Stack>
      </VCard>

      {/* ── Playstyle & Agents ── */}
      <VCard>
        <SectionTitle>Playstyle &amp; agents</SectionTitle>

        {/* Main role */}
        <Typography
          sx={{
            fontFamily: RAJ,
            fontWeight: 700,
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: MUTED,
            textTransform: "uppercase",
            mb: 0.75,
          }}
        >
          Main role
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.75} mb={2}>
          {roles.map((role) => {
            const active = mainRole === role;
            const c = ROLE_COLORS[role as string];
            return (
              <Chip
                key={role}
                label={role}
                onClick={() => setMainRole(role)}
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  height: 28,
                  cursor: "pointer",
                  background: active ? c.bg : "rgba(255,255,255,0.04)",
                  border: `1px solid ${active ? c.border : "rgba(255,255,255,0.1)"}`,
                  color: active ? c.color : "rgba(136,146,170,1)",
                  transition: "all 0.15s",
                  "& .MuiChip-label": { px: 1.25 },
                  "&:hover": {
                    background: c.bg,
                    borderColor: c.border,
                    color: c.color,
                  },
                }}
              />
            );
          })}
        </Stack>

        {/* Playstyle */}
        <Typography
          sx={{
            fontFamily: RAJ,
            fontWeight: 700,
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: MUTED,
            textTransform: "uppercase",
            mb: 0.75,
          }}
        >
          Playstyle
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.75} mb={2}>
          {playstyles.map((ps) => {
            const active = playstyle === ps;
            const c = PS_COLORS[ps as keyof typeof PS_COLORS];
            return (
              <Chip
                key={ps}
                label={ps}
                onClick={() => setPlaystyle(ps)}
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  borderRadius: "2px",
                  height: 28,
                  cursor: "pointer",
                  background: active ? c.bg : "rgba(255,255,255,0.04)",
                  border: `1px solid ${active ? c.border : "rgba(255,255,255,0.1)"}`,
                  color: active ? c.color : "rgba(136,146,170,1)",
                  transition: "all 0.15s",
                  "& .MuiChip-label": { px: 1.25 },
                  "&:hover": {
                    background: c.bg,
                    borderColor: c.border,
                    color: c.color,
                  },
                }}
              />
            );
          })}
        </Stack>

        {/* Agents */}
        <Stack direction="row" alignItems="baseline" gap={1} mb={0.75}>
          <Typography
            sx={{
              fontFamily: RAJ,
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            Main agents
          </Typography>
          <Typography
            sx={{
              fontFamily: RAJ,
              fontWeight: 700,
              fontSize: "0.6rem",
              color: "rgba(255,70,85,0.5)",
              letterSpacing: "0.06em",
            }}
          >
            {selectedAgents?.length ?? 0} / 3
          </Typography>
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {ValorantAgents.map((agent) => {
            const isActive = selectedAgents?.includes(agent);
            const isDisabled = !isActive && (selectedAgents?.length ?? 0) >= 3;
            return (
              <Chip
                key={agent}
                label={agent}
                onClick={() => !isDisabled && handleAgentToggle(agent)}
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  height: 26,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  background: isActive
                    ? "rgba(255,70,85,0.14)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "rgba(255,70,85,0.45)" : "rgba(255,255,255,0.08)"}`,
                  color: isActive
                    ? ACCENT
                    : isDisabled
                      ? "rgba(58,64,96,1)"
                      : "rgba(100,110,140,1)",
                  opacity: isDisabled ? 0.45 : 1,
                  transition: "all 0.15s",
                  "& .MuiChip-label": { px: 1 },
                  "&:hover": isActive
                    ? { background: "rgba(255,70,85,0.2)", color: "white" }
                    : !isDisabled
                      ? {
                          borderColor: "rgba(255,70,85,0.3)",
                          color: "rgba(200,210,220,1)",
                        }
                      : {},
                }}
              />
            );
          })}
        </Stack>
      </VCard>

      {/* ── Save row ── */}
      <Stack direction="row" gap={1.5} mt={0.5}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={userUpdateLoading}
          startIcon={<Save size={14} />}
          sx={{
            fontFamily: RAJ,
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: "2px",
            px: 2.5,
            boxShadow: "none",
            background: ACCENT,
            "&:hover": { background: "#e03040", boxShadow: "none" },
            "&.Mui-disabled": {
              background: "rgba(255,70,85,0.3)",
              color: "rgba(255,255,255,0.4)",
            },
          }}
        >
          {userUpdateLoading ? "Saving…" : "Save profile"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            fontFamily: RAJ,
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: "2px",
            px: 2,
            borderColor: "rgba(255,255,255,0.12)",
            color: "rgba(136,146,170,1)",
            "&:hover": {
              borderColor: "rgba(255,70,85,0.4)",
              color: ACCENT,
              background: "rgba(255,70,85,0.06)",
            },
          }}
        >
          Reset
        </Button>
      </Stack>
    </Container>
  );
};
