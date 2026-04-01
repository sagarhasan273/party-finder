import type { UserType } from "src/types/type-user";

import { toast } from "sonner";
import { useNavigate } from "react-router";
import React, { useState, useEffect } from "react";
import { X, Shield, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Box,
  Chip,
  Stack,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  DialogContent,
  InputAdornment,
} from "@mui/material";

import { useCredentials } from "src/core/slices";
import { useUpdateUserMutation } from "src/core/apis";
import { ValorantAgents } from "src/pages/profile-page";
import { ValorantRegionalServers } from "src/@mock/constant";

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

// ─── Design tokens ────────────────────────────────────────────────────────────

const RAJ = '"Rajdhani", sans-serif';
const ACCENT = "#FF4655";
const CARD_BG = "rgba(10,12,22,0.99)";
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
  };

// ─── Shared sx ────────────────────────────────────────────────────────────────

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: RAJ,
    fontWeight: 700,
    fontSize: "0.85rem",
    color: TEXT,
    borderRadius: "2px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.09)" },
    "&:hover fieldset": { borderColor: "rgba(255,70,85,0.35)" },
    "&.Mui-focused fieldset": { borderColor: ACCENT, borderWidth: 1 },
    "& input": { padding: "8px 12px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: RAJ,
    fontWeight: 700,
    fontSize: "0.78rem",
    letterSpacing: "0.06em",
    color: MUTED,
    "&.Mui-focused": { color: ACCENT },
  },
};

const selectSx = {
  fontFamily: RAJ,
  fontWeight: 700,
  fontSize: "0.85rem",
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
  "& .MuiSelect-select": { padding: "8px 12px" },
  "& .MuiSvgIcon-root": { color: MUTED },
};

const labelSx = {
  fontFamily: RAJ,
  fontWeight: 700,
  fontSize: "0.78rem",
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
    fontSize: "0.85rem",
    color: TEXT,
    "&:hover": { bgcolor: "rgba(255,70,85,0.08)" },
    "&.Mui-selected": { bgcolor: "rgba(255,70,85,0.14)", color: ACCENT },
    "&.Mui-selected:hover": { bgcolor: "rgba(255,70,85,0.2)" },
  },
};

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Identity", "Rank", "Playstyle", "agents-select"];

function StepDots({ current }: { current: number }) {
  return (
    <Stack direction="row" alignItems="center" gap={0.75}>
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <Stack alignItems="center" gap={0.4}>
            <Box
              sx={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: "3px",
                background:
                  i < current
                    ? "rgba(255,70,85,0.4)"
                    : i === current
                      ? ACCENT
                      : "rgba(255,255,255,0.1)",
                transition: "all 0.3s ease",
              }}
            />
          </Stack>
          {i < STEPS.length - 1 && (
            <Box
              sx={{
                width: 16,
                height: 1,
                background:
                  i < current
                    ? "rgba(255,70,85,0.3)"
                    : "rgba(255,255,255,0.07)",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
}

// ─── VChip ────────────────────────────────────────────────────────────────────

function VChip({
  label,
  active,
  onClick,
  activeStyle,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeStyle: { bg: string; border: string; color: string };
}) {
  return (
    <Chip
      label={label}
      onClick={onClick}
      sx={{
        fontFamily: RAJ,
        fontWeight: 700,
        fontSize: "0.78rem",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        borderRadius: "2px",
        height: 32,
        cursor: "pointer",
        background: active ? activeStyle.bg : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? activeStyle.border : "rgba(255,255,255,0.1)"}`,
        color: active ? activeStyle.color : "rgba(136,146,170,1)",
        transition: "all 0.15s",
        "& .MuiChip-label": { px: 1.5 },
        "&:hover": {
          background: activeStyle.bg,
          borderColor: activeStyle.border,
          color: activeStyle.color,
        },
      }}
    />
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepIdentity({
  gamename,
  setGamename,
  tagline,
  setTagline,
  region,
  setRegion,
}: {
  gamename: string;
  setGamename: (v: string) => void;
  tagline: string;
  setTagline: (v: string) => void;
  region: string;
  setRegion: (v: string) => void;
}) {
  return (
    <Stack gap={2}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
        <TextField
          size="small"
          label="Game name"
          placeholder="Gamer123"
          fullWidth
          required
          value={gamename}
          onChange={(e) => setGamename(e.target.value)}
          inputProps={{ maxLength: 32 }}
          sx={inputSx}
        />
        <TextField
          size="small"
          label="Tagline"
          placeholder="EUW1"
          required
          value={tagline}
          onChange={(e) => setTagline(e.target.value.replace("#", ""))}
          inputProps={{ maxLength: 8 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "rgba(255,70,85,0.7)",
                  }}
                >
                  #
                </Typography>
              </InputAdornment>
            ),
          }}
          sx={{ ...inputSx, maxWidth: { sm: 150 } }}
        />
      </Stack>

      <FormControl size="small" fullWidth>
        <InputLabel sx={labelSx}>Region</InputLabel>
        <Select
          label="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
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
  );
}

function StepRank({
  rank,
  setRank,
  pickRank,
  setPickRank,
}: {
  rank: string;
  setRank: (v: string) => void;
  pickRank: string;
  setPickRank: (v: string) => void;
}) {
  return (
    <Stack gap={2}>
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
    </Stack>
  );
}

function StepPlaystyle({
  mainRole,
  setMainRole,
  playstyle,
  setPlaystyle,
}: {
  mainRole: string;
  setMainRole: (v: string) => void;
  playstyle: string;
  setPlaystyle: (v: string) => void;
}) {
  return (
    <Stack gap={2.5}>
      <Box>
        <Typography
          sx={{
            fontFamily: RAJ,
            fontWeight: 700,
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            color: MUTED,
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Main role
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {roles.map((role) => (
            <VChip
              key={role}
              label={role as any}
              active={mainRole === role}
              onClick={() => setMainRole(role as any)}
              activeStyle={ROLE_COLORS[role as any]}
            />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography
          sx={{
            fontFamily: RAJ,
            fontWeight: 700,
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            color: MUTED,
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Playstyle
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {playstyles.map((ps) => (
            <VChip
              key={ps}
              label={ps as any}
              active={playstyle === ps}
              onClick={() => setPlaystyle(ps as any)}
              activeStyle={PS_COLORS[ps as any]}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEP_META = [
  {
    title: "Your Valorant identity",
    subtitle:
      "Enter your in-game name so others can find and verify your stats.",
  },
  {
    title: "What's your rank?",
    subtitle: "Set your current and peak rank to match with the right lobbies.",
  },
  {
    title: "How do you play?",
    subtitle:
      "Pick your main role and playstyle so the right lobbies find you.",
  },
  {
    title: "How do you play?",
    subtitle: "Pick three main agents so the right lobbies find you.",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

interface CompleteProfileDialogProps {
  open: boolean;
  onClose?: () => void;
}

export const CompleteProfileDialog: React.FC<CompleteProfileDialogProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const { user, setIsProfileUpdated } = useCredentials();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [gamename, setGamename] = useState(user?.gamename || "");
  const [tagline, setTagline] = useState(user?.tagline || "");
  const [region, setRegion] = useState(user?.region || "ap");
  const [rank, setRank] = useState(user?.rank || "Gold II");
  const [pickRank, setPickRank] = useState(user?.pickRank || "Platinum I");
  const [mainRole, setMainRole] = useState(user?.mainRole || "Duelist");
  const [playstyle, setPlaystyle] = useState(user?.playstyle || "😌 Chill");
  const [selectedAgents, setSelectedAgents] = useState<UserType["agents"]>(
    user?.agents || [],
  );

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

  useEffect(() => {
    if (user) {
      setGamename(user.gamename || "");
      setTagline(user.tagline || "");
      setRegion(user.region || "ap");
      setRank(user.rank || "Gold II");
      setPickRank(user.pickRank || "Platinum I");
      setMainRole(user.mainRole || "Duelist");
      setPlaystyle(user.playstyle || "😌 Chill");
    }
  }, [user]);

  const canAdvance = () => {
    if (step === 0)
      return gamename.trim().length > 0 && tagline.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error("Please fill in your Game Name and Tagline");
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleFinish = async () => {
    try {
      const response = await updateUser({
        id: user?.id,
        country: user?.country || undefined,
        rank,
        pickRank,
        mainRole,
        playstyle,
        region,
        gamename,
        tagline,
      }).unwrap();

      if (response?.status) {
        toast.success("Profile set up! Let's find you a lobby.");
        navigate("/");
        setIsProfileUpdated(true);
        onClose?.();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const isLastStep = step === STEPS.length - 1;
  const meta = STEP_META[step];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: "4px",
          clipPath:
            "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
          overflow: "hidden",
          position: "relative",
          // Left accent bar
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: ACCENT,
            zIndex: 10,
          },
          // Top edge tint
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 3,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${ACCENT}99, transparent 60%)`,
            zIndex: 10,
          },
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(4px)", background: "rgba(5,6,14,0.75)" },
        },
      }}
    >
      {/* Corner ornament */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 18px 18px 0",
          borderColor: `transparent ${ACCENT}50 transparent transparent`,
          zIndex: 11,
        }}
      />

      {/* Close button */}
      {onClose && (
        <Box
          component="button"
          onClick={onClose}
          aria-label="Close"
          sx={{
            position: "absolute",
            top: 10,
            right: 20,
            zIndex: 12,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(136,146,170,0.5)",
            display: "flex",
            alignItems: "center",
            p: 0.5,
            borderRadius: "2px",
            transition: "color 0.15s",
            "&:hover": { color: ACCENT },
          }}
        >
          <X size={16} />
        </Box>
      )}

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ pl: "26px", pr: "22px", pt: "22px", pb: "20px" }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
            <Shield size={14} color={ACCENT} />
            <Typography
              sx={{
                fontFamily: RAJ,
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                color: "rgba(255,70,85,0.75)",
                textTransform: "uppercase",
              }}
            >
              Complete your profile
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontFamily: RAJ,
              fontWeight: 700,
              fontSize: "1.35rem",
              letterSpacing: "0.04em",
              color: TEXT,
              textTransform: "uppercase",
              lineHeight: 1.15,
              mb: 0.5,
            }}
          >
            {meta?.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: RAJ,
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.03em",
              color: MUTED,
              lineHeight: 1.5,
              mb: 2.5,
            }}
          >
            {meta?.subtitle}
          </Typography>

          {/* Animated step content */}
          <Box sx={{ position: "relative", minHeight: 160, mb: 3 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -28 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {step === 0 && (
                  <StepIdentity
                    gamename={gamename}
                    setGamename={setGamename}
                    tagline={tagline}
                    setTagline={setTagline}
                    region={region}
                    setRegion={setRegion}
                  />
                )}
                {step === 1 && (
                  <StepRank
                    rank={rank}
                    setRank={setRank}
                    pickRank={pickRank}
                    setPickRank={setPickRank}
                  />
                )}
                {step === 2 && (
                  <StepPlaystyle
                    mainRole={mainRole}
                    setMainRole={setMainRole as any}
                    playstyle={playstyle}
                    setPlaystyle={setPlaystyle as any}
                  />
                )}

                {step === 3 && (
                  <>
                    <Stack
                      direction="row"
                      alignItems="baseline"
                      gap={1}
                      mb={0.75}
                    >
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
                      {ValorantAgents?.map((agent) => {
                        const isActive = selectedAgents?.includes(agent);
                        const isDisabled =
                          !isActive && (selectedAgents?.length ?? 0) >= 3;
                        return (
                          <Chip
                            key={agent}
                            label={agent}
                            onClick={() =>
                              !isDisabled && handleAgentToggle(agent)
                            }
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
                                ? {
                                    background: "rgba(255,70,85,0.2)",
                                    color: "white",
                                  }
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
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Footer */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <StepDots current={step} />

            <Stack direction="row" gap={1}>
              {step > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleBack}
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.72rem",
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
                  Back
                </Button>
              )}

              <Button
                variant="contained"
                size="small"
                onClick={isLastStep ? handleFinish : handleNext}
                disabled={isLoading}
                endIcon={!isLastStep ? <ChevronRight size={14} /> : undefined}
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  px: 2.5,
                  boxShadow: "none",
                  background: ACCENT,
                  "&:hover": { background: "#e03040", boxShadow: "none" },
                  "&.Mui-disabled": {
                    background: "rgba(255,70,85,0.3)",
                    color: "rgba(255,255,255,0.35)",
                  },
                }}
              >
                {isLoading ? "Saving…" : isLastStep ? "Let's go" : "Next"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
