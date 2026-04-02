import type { RankTier } from "src/types/type-inventory";

import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  Sword,
  MapPin,
  Crosshair,
  ChevronLeft,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

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
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import { GoogleSignIn } from "src/core/auth";
import { ValorantRegionalServers } from "src/@mock";
import { useInventory, useCredentials } from "src/core/slices";
import { useCreateLobbyMutation } from "src/core/apis/api-inventory";

import { RANKS, ROLES, ROLE_COLORS } from "../lib/valorant";

// ─── Design tokens ────────────────────────────────────────────────────────────

const RAJ = '"Rajdhani", sans-serif';
const CARD_BG = "rgba(13,15,26,0.97)";
const ACCENT = "#FF4655";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(74,84,112,1)";
const TEXT = "#edf0f4";

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
    "& textarea": { padding: "7px 10px" },
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
  backgroundColor: "rgba(28,32,48,0.6)",
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

function SectionTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Stack direction="row" alignItems="center" gap={1.25} mb={2}>
      {icon && (
        <Box sx={{ color: ACCENT, display: "flex", alignItems: "center" }}>
          {icon}
        </Box>
      )}
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreateLobbyPage() {
  const { user, region, isLoading, isAuthenticated } = useCredentials();
  const { myLobby, setMyLobby } = useInventory();

  const navigate = useNavigate();

  const [title, setTitle] = useState("sdfs");
  const [hostUsername, setHostUsername] = useState("sdfs");
  const [hostTag, setHostTag] = useState("sdfs");
  const [description, setDescription] = useState("sdf");
  const [partyCode, setPartyCode] = useState("sdfs");
  const [rankMin, setRankMin] = useState<RankTier>("Gold");
  const [rankMax, setRankMax] = useState<RankTier>("Platinum");
  const [rolesNeeded, setRolesNeeded] = useState<string[]>(["Any"]);
  const [discordLink, setDiscordLink] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(region?.region || "ap");
  const [selectedServer, setSelectedServer] = useState("Mumbai");
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
        host: user?.id || "",
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
      }).unwrap();

      if (response?.status) {
        navigate("/my-lobby");
        if (response?.data) setMyLobby(response.data);
      }
    } catch {
      toast.info("Failed to create! You have requested for a lobby.", {
        style: {
          background: "rgba(61, 34, 38, 0.77)",
          border: "1px solid rgba(255, 51, 68, 0.84)",
          color: "#fae2e4d0",
        },
      });
      navigate("/applied-lobbies");
    } finally {
      setIsSubmitting(false);
    }
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
          <CircularProgress size={40} sx={{ color: ACCENT }} />
          <Typography
            sx={{
              fontFamily: RAJ,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: MUTED,
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
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <VCard>
          <Stack alignItems="center" gap={2.5} textAlign="center" py={3}>
            <AlertCircle size={48} color={ACCENT} />
            <Typography
              sx={{
                fontFamily: RAJ,
                fontWeight: 800,
                fontSize: "1.5rem",
                letterSpacing: "0.06em",
                color: TEXT,
                textTransform: "uppercase",
              }}
            >
              SIGN IN REQUIRED
            </Typography>
            <Typography
              sx={{
                fontFamily: RAJ,
                fontWeight: 600,
                color: MUTED,
                fontSize: "0.85rem",
              }}
            >
              You need to sign in to create a lobby.
            </Typography>
            <Box pt={1}>
              <GoogleSignIn />
            </Box>
          </Stack>
        </VCard>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2.5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Page header ── */}
        <Box mb={3}>
          <Button
            component={Link}
            to="/"
            startIcon={<ChevronLeft size={14} />}
            sx={{
              fontFamily: RAJ,
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              color: MUTED,
              textTransform: "uppercase",
              mb: 1.5,
              "&:hover": {
                color: ACCENT,
                background: "transparent",
              },
            }}
          >
            BACK TO BROWSE
          </Button>

          <Stack direction="row" alignItems="center" gap={1.5} mb={0.75}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "4px",
                background: "rgba(255,70,85,0.12)",
                border: `1px solid ${ACCENT}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Crosshair size={22} color={ACCENT} />
            </Box>
            <Typography
              sx={{
                fontFamily: RAJ,
                fontWeight: 800,
                fontSize: "1.8rem",
                letterSpacing: "0.06em",
                color: TEXT,
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              POST A LOBBY
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontFamily: RAJ,
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            Fill in the details below to find your perfect 5th teammate
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack gap={2}>
            {/* ── Basic Info Card ── */}
            <VCard>
              <SectionTitle icon={<Users size={14} />}>
                Basic Information
              </SectionTitle>

              <TextField
                size="small"
                label="Lobby Title"
                placeholder="e.g., Gold-Plat ranked, chill vibes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                inputProps={{ maxLength: 80 }}
                sx={inputSx}
              />

              <Box mt={2}>
                <TextField
                  size="small"
                  label="Description"
                  placeholder="Tell players about your playstyle, mic requirements, schedule..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 300 }}
                  sx={inputSx}
                />
                <Typography
                  sx={{
                    fontFamily: RAJ,
                    fontSize: "0.6rem",
                    color: MUTED,
                    textAlign: "right",
                    mt: 0.5,
                  }}
                >
                  {description.length}/300
                </Typography>
              </Box>

              <Divider sx={{ borderColor: BORDER, my: 2 }} />

              <SectionTitle icon={<Sword size={14} />}>
                Host Information
              </SectionTitle>

              <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                <TextField
                  size="small"
                  label="Game Name"
                  placeholder="Gamer123"
                  value={hostUsername}
                  onChange={(e) => setHostUsername(e.target.value)}
                  fullWidth
                  required
                  inputProps={{ maxLength: 32 }}
                  sx={inputSx}
                />
                <TextField
                  size="small"
                  label="Tagline"
                  placeholder="V5V5"
                  value={hostTag}
                  onChange={(e) => setHostTag(e.target.value.replace("#", ""))}
                  required
                  inputProps={{ maxLength: 8 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{
                            fontFamily: RAJ,
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            color: `${ACCENT}80`,
                          }}
                        >
                          #
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...inputSx, maxWidth: { sm: 160 } }}
                />
              </Stack>

              <Box mt={2}>
                <TextField
                  size="small"
                  label="Party Code"
                  placeholder="Enter a unique code for your party"
                  value={partyCode}
                  onChange={(e) => setPartyCode(e.target.value)}
                  fullWidth
                  required
                  sx={inputSx}
                />
              </Box>
            </VCard>

            {/* ── Rank & Region Card ── */}
            <VCard>
              <SectionTitle icon={<MapPin size={14} />}>
                Rank & Region
              </SectionTitle>

              <Stack direction={{ xs: "column", sm: "row" }} gap={2} mb={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel sx={labelSx}>Minimum Rank</InputLabel>
                  <Select
                    value={rankMin}
                    label="Minimum Rank"
                    onChange={(e) => setRankMin(e.target.value as RankTier)}
                    sx={selectSx}
                    MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                  >
                    {RANKS.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel sx={labelSx}>Maximum Rank</InputLabel>
                  <Select
                    value={rankMax}
                    label="Maximum Rank"
                    onChange={(e) => setRankMax(e.target.value as RankTier)}
                    sx={selectSx}
                    MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                  >
                    {RANKS.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel sx={labelSx}>Region</InputLabel>
                  <Select
                    value={selectedRegion}
                    label="Region"
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setSelectedServer("");
                    }}
                    sx={selectSx}
                    MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                  >
                    {ValorantRegionalServers.map((rgon) => (
                      <MenuItem key={rgon.code} value={rgon.code}>
                        {rgon.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel sx={labelSx}>
                    Server {selectedRegion.toUpperCase()}
                  </InputLabel>
                  <Select
                    value={selectedServer}
                    label={`Server ${selectedRegion.toUpperCase()}`}
                    onChange={(e) => setSelectedServer(e.target.value)}
                    sx={selectSx}
                    MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                  >
                    {serverList.map((server) => (
                      <MenuItem key={server} value={server}>
                        {server}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </VCard>

            {/* ── Roles & Players Card ── */}
            <VCard>
              <SectionTitle icon={<Sword size={14} />}>
                Roles Needed
              </SectionTitle>

              <Stack direction="row" flexWrap="wrap" gap={1} mb={3}>
                {ROLES.map((role) => {
                  const isSelected = rolesNeeded.includes(role);
                  const colors = ROLE_COLORS[role] ?? {
                    bg: "rgba(100,100,130,0.15)",
                    color: "#a0a0c0",
                    border: "rgba(100,100,130,0.35)",
                  };
                  return (
                    <Chip
                      key={role}
                      label={role}
                      onClick={() => toggleRole(role)}
                      sx={{
                        fontFamily: RAJ,
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderRadius: "2px",
                        height: 30,
                        cursor: "pointer",
                        background: isSelected
                          ? colors.bg
                          : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isSelected ? colors.border : "rgba(255,255,255,0.1)"}`,
                        color: isSelected
                          ? colors.color
                          : "rgba(136,146,170,0.8)",
                        transition: "all 0.15s",
                        "& .MuiChip-label": { px: 1.5 },
                        "&:hover": {
                          background: colors.bg,
                          borderColor: colors.border,
                          color: colors.color,
                        },
                      }}
                    />
                  );
                })}
              </Stack>

              <Divider sx={{ borderColor: BORDER, my: 2 }} />

              <SectionTitle icon={<Users size={14} />}>Party Size</SectionTitle>

              <FormControl size="small" fullWidth>
                <InputLabel sx={labelSx}>Current Players</InputLabel>
                <Select
                  value={currentPlayers}
                  label="Current Players"
                  onChange={(e) => setCurrentPlayers(Number(e.target.value))}
                  sx={selectSx}
                  MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? "player" : "players"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </VCard>

            {/* ── Contact Card ── */}
            <VCard>
              <SectionTitle icon={<MessageSquare size={14} />}>
                Contact (Optional)
              </SectionTitle>

              <TextField
                size="small"
                label="Discord Server / Invite Link"
                placeholder="https://discord.gg/yourserver"
                value={discordLink}
                onChange={(e) => setDiscordLink(e.target.value)}
                type="url"
                fullWidth
                sx={inputSx}
              />
            </VCard>

            {/* ── Submit Button ── */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || !!myLobby}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} sx={{ color: "white" }} />
                ) : (
                  <Plus size={16} />
                )
              }
              sx={{
                fontFamily: RAJ,
                fontWeight: 800,
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: "2px",
                height: 48,
                background: ACCENT,
                boxShadow: "none",
                "&:hover": {
                  background: "#e03040",
                  boxShadow: `0 0 24px ${ACCENT}80`,
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
