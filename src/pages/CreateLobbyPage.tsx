import type { RankTier } from "src/types/type-inventory";

import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Crosshair, ChevronLeft, AlertCircle } from "lucide-react";

import {
  Box,
  Chip,
  Stack,
  Paper,
  Select,
  Button,
  Divider,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";

import { GoogleSignIn } from "src/core/auth";
import { useCredentials } from "src/core/slices";
import { ValorantRegionalServers } from "src/@mock";
import { useCreateLobbyMutation } from "src/core/apis/api-inventory";

import { RANKS, ROLES, ROLE_COLORS } from "../lib/valorant";

const sectionSx = {
  p: 2,
  backgroundColor: "rgba(22,25,38,0.9)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "8px",
};

const sectionLabel = {
  fontFamily: '"Rajdhani", sans-serif' as const,
  fontWeight: 700,
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  color: "rgba(255,255,255,0.35)",
  mb: 2.5,
};

export function CreateLobbyPage() {
  const { user, region, isLoading, isAuthenticated } = useCredentials();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [hostUsername, setHostUsername] = useState("");
  const [hostTag, setHostTag] = useState("");
  const [description, setDescription] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [rankMin, setRankMin] = useState<RankTier>("Gold");
  const [rankMax, setRankMax] = useState<RankTier>("Platinum");
  const [rolesNeeded, setRolesNeeded] = useState<string[]>(["Any"]);
  const [discordLink, setDiscordLink] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(region?.region || "ap");
  const [selectedServer, setSelectedServer] = useState("");
  const [currentPlayers, setCurrentPlayers] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createLobby] = useCreateLobbyMutation();

  const currentRegion = ValorantRegionalServers.find(
    (r) => r.code === selectedRegion,
  );
  const serverList = currentRegion?.servers || [];

  const toggleRole = (role: string) => {
    setRolesNeeded((prev) => {
      if (role === "Any") return ["Any"];
      const withoutAny = prev.filter((r) => r !== "Any");
      if (withoutAny.includes(role)) {
        const next = withoutAny.filter((r) => r !== role);
        return next.length === 0 ? ["Any"] : next;
      }
      return [...withoutAny, role];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to create a lobby.");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }
    if (!hostUsername.trim()) {
      toast.error("Host game name is required!");
      return;
    }
    if (!hostUsername.trim()) {
      toast.error("Host game name is required!");
      return;
    }

    if (!hostTag.trim()) {
      toast.error("Host tagline is required!");
      return;
    }

    if (!selectedRegion.trim()) {
      toast.error("Region is required!");
      return;
    }

    if (!selectedServer.trim()) {
      toast.error("Server is required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createLobby({
        userId: user?.id || "",
        title,
        description,
        partyCode,
        rankMin,
        rankMax,
        hostGamename: hostUsername,
        hostTagline: hostTag,
        rolesNeeded,
        region: selectedRegion,
        server: selectedServer,
        status: "open",
        currentPlayers,
        discordLink: discordLink.trim() || undefined,
      });
      console.log("Create Lobby Response:", response);
      if (response?.data?.status) {
        toast.success("Lobby posted! Good luck finding your 5th 🎯");
        navigate("/");
      }
    } catch {
      toast.error("Failed to create lobby. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectSx = {
    backgroundColor: "rgba(28,32,48,0.8)",
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 700,
    fontSize: "0.85rem",
    letterSpacing: "0.04em",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.08)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.2)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF4655",
    },
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Stack alignItems="center" gap={2}>
          <CircularProgress size={40} sx={{ color: "#FF4655" }} />
          <Typography
            sx={{
              fontFamily: '"Rajdhani", sans-serif',
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "text.secondary",
              fontSize: "0.8rem",
            }}
          >
            LOADING...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Stack alignItems="center" gap={2.5} textAlign="center">
          <AlertCircle size={44} color="#FF4655" />
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 800 }}
          >
            SIGN IN REQUIRED
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            You need to sign in to create a lobby.
          </Typography>
          <GoogleSignIn />
        </Stack>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back + header */}
        <Box mb={4}>
          <Button
            component={Link}
            to="/"
            startIcon={<ChevronLeft size={15} />}
            size="small"
            sx={{
              fontFamily: '"Rajdhani", sans-serif',
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.07em",
              color: "text.secondary",
              mb: 2,
              "&:hover": { color: "text.primary" },
            }}
          >
            BACK TO BROWSE
          </Button>
          <Stack direction="row" alignItems="center" gap={1.5} mb={0.75}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "6px",
                background: "rgba(255,70,85,0.12)",
                border: "1px solid rgba(255,70,85,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Crosshair size={18} color="#FF4655" />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 900,
                fontSize: "1.8rem",
                letterSpacing: "0.04em",
              }}
            >
              POST A LOBBY
            </Typography>
          </Stack>
          <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>
            Fill in the details below to find your perfect 5th teammate.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack gap={2.5}>
            {/* ── Basic Info ── */}
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={sectionLabel}>BASIC INFO</Typography>
              <Stack gap={2.5}>
                <TextField
                  size="small"
                  label="Lobby Title"
                  placeholder="e.g. Gold-Plat ranked, chill vibes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  inputProps={{ maxLength: 80 }}
                  required
                />
                <Box>
                  <TextField
                    size="small"
                    label="Description (optional)"
                    placeholder="Tell players about your playstyle, mic requirements, schedule..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 300 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      textAlign: "right",
                      mt: 0.5,
                    }}
                  >
                    {description.length}/300
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    ...sectionLabel,
                    py: 0,
                    my: 0,
                  }}
                >
                  HOST INFO
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                  <TextField
                    size="small"
                    label="Game Name"
                    placeholder="Gamer123"
                    value={hostUsername}
                    onChange={(e) => setHostUsername(e.target.value)}
                    fullWidth
                    inputProps={{ maxLength: 32 }}
                    required
                  />
                  <TextField
                    size="small"
                    label="TagLine"
                    placeholder="V5V5"
                    value={hostTag}
                    onChange={(e) =>
                      setHostTag(e.target.value.replace("#", ""))
                    }
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
                <Typography
                  sx={{
                    ...sectionLabel,
                    py: 0,
                    my: 0,
                  }}
                >
                  PARTY CODE FOR PLAYERS TO JOIN
                </Typography>
                <TextField
                  size="small"
                  label="Party Code"
                  placeholder="Enter a unique code for your party"
                  value={partyCode}
                  onChange={(e) => setPartyCode(e.target.value)}
                  fullWidth
                  required
                />
              </Stack>
            </Paper>

            {/* ── Rank & Region ── */}
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={sectionLabel}>RANK & REGION</Typography>
              <Stack gap={2.5}>
                <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Min Rank</InputLabel>
                    <Select
                      value={rankMin}
                      label="Min Rank"
                      onChange={(e) => setRankMin(e.target.value as RankTier)}
                      sx={selectSx}
                    >
                      {RANKS.map((r) => (
                        <MenuItem
                          key={r}
                          value={r}
                          sx={{
                            fontFamily: '"Rajdhani", sans-serif',
                            fontWeight: 700,
                          }}
                        >
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Max Rank</InputLabel>
                    <Select
                      value={rankMax}
                      label="Max Rank"
                      onChange={(e) => setRankMax(e.target.value as RankTier)}
                      sx={selectSx}
                    >
                      {RANKS.map((r) => (
                        <MenuItem
                          key={r}
                          value={r}
                          sx={{
                            fontFamily: '"Rajdhani", sans-serif',
                            fontWeight: 700,
                          }}
                        >
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                  {/* First Dropdown - Region Selection */}
                  <FormControl size="small" fullWidth>
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
                    >
                      {ValorantRegionalServers.map((rgon) => (
                        <MenuItem
                          key={rgon.code}
                          value={rgon.code}
                          sx={{
                            fontFamily: '"Rajdhani", sans-serif',
                            fontWeight: 700,
                          }}
                        >
                          {rgon.label}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Second Dropdown - Server List (depends on selected region) */}
                  <FormControl size="small" fullWidth>
                    <InputLabel sx={{ fontFamily: '"Rajdhani", sans-serif' }}>
                      Server {selectedRegion.toUpperCase()}
                    </InputLabel>
                    <Select
                      value={selectedServer}
                      label={`Server ${selectedRegion.toUpperCase()}`}
                      onChange={(e) => setSelectedServer(e.target.value)}
                      sx={selectSx}
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
                </Stack>
              </Stack>
            </Paper>

            {/* ── Roles ── */}
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={sectionLabel}>ROLES NEEDED</Typography>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1.5, mb: 2 }}>
                {ROLES.map((role) => {
                  const isSelected = rolesNeeded.includes(role);
                  const colors = ROLE_COLORS[role] ?? {
                    bg: "rgba(100,100,130,0.2)",
                    color: "#a0a0c0",
                    border: "rgba(100,100,130,0.3)",
                  };
                  return (
                    <Chip
                      key={role}
                      label={role.toUpperCase()}
                      onClick={() => toggleRole(role)}
                      sx={{
                        fontFamily: '"Rajdhani", sans-serif',
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.05em",
                        cursor: "pointer",
                        height: 30,
                        backgroundColor: isSelected
                          ? colors.bg
                          : "rgba(28,32,48,0.8)",
                        color: isSelected
                          ? colors.color
                          : "rgba(255,255,255,0.45)",
                        border: `1px solid ${isSelected ? colors.border : "rgba(255,255,255,0.08)"}`,
                        transition: "all 0.15s",
                        "&:hover": {
                          backgroundColor: isSelected
                            ? colors.bg
                            : "rgba(255,255,255,0.05)",
                          filter: "brightness(1.1)",
                        },
                        "& .MuiChip-label": { px: 1.5 },
                      }}
                    />
                  );
                })}
              </Stack>

              <Typography sx={sectionLabel}>PLAYERS IN PARTY</Typography>

              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontFamily: '"Rajdhani", sans-serif' }}>
                  Number of Players
                </InputLabel>
                <Select
                  value={currentPlayers}
                  label="Number of Players"
                  onChange={(e) => setCurrentPlayers(Number(e.target.value))}
                  sx={selectSx}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem
                      key={num}
                      value={num}
                      sx={{
                        fontFamily: '"Rajdhani", sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            {/* ── Contact ── */}
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={sectionLabel}>CONTACT (OPTIONAL)</Typography>
              <TextField
                size="small"
                label="Discord Server / Invite Link"
                placeholder="https://discord.gg/yourserver"
                value={discordLink}
                onChange={(e) => setDiscordLink(e.target.value)}
                type="url"
                fullWidth
              />
            </Paper>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} sx={{ color: "white" }} />
                ) : (
                  <Plus size={18} />
                )
              }
              sx={{
                background: isSubmitting ? "rgba(255,70,85,0.5)" : "#FF4655",
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontSize: "0.95rem",
                height: 48,
                "&:hover": {
                  background: "#ff6b77",
                  boxShadow: "0 0 24px rgba(255,70,85,0.4)",
                },
                "&.Mui-disabled": {
                  background: "rgba(255,70,85,0.3)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              {isSubmitting ? "POSTING..." : "POST LOBBY"}
            </Button>
          </Stack>
        </Box>
      </motion.div>
    </Container>
  );
}
