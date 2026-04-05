import { X, Lock } from "lucide-react";

import {
  Box,
  Stack,
  Button,
  Dialog,
  Typography,
  IconButton,
  DialogContent,
} from "@mui/material";

import { GoogleSignIn } from "src/core/auth";
import { useCredentials } from "src/core/slices";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(10,11,20,0.99)",
  border: "rgba(255,255,255,0.06)",
  accent: "#FF4655",
  accentDim: "rgba(255,70,85,0.1)",
  accentBorder: "rgba(255,70,85,0.25)",
  text: "#dde3f0",
  textSub: "#7f8fad",
  textMuted: "#3e4d6b",
  RAJ: '"Rajdhani", sans-serif',
} as const;

const PERKS = [
  "Send and manage join requests",
  "Get lobby by rank, role & server",
  "Receive party codes instantly",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SignInRequiredDialogProps {
  open: boolean;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SignInRequiredDialog({
  open,
  onClose,
}: SignInRequiredDialogProps) {
  const { setIsSignInRequired } = useCredentials();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: "4px",
          clipPath:
            "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 24px 60px rgba(0,0,0,0.75)",
          // Left accent bar
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: T.accent,
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
            background: `linear-gradient(90deg, ${T.accent}66, transparent 60%)`,
            zIndex: 10,
          },
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(6px)", background: "rgba(4,5,12,0.82)" },
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
          zIndex: 11,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 18px 18px 0",
          borderColor: `transparent ${T.accent}33 transparent transparent`,
        }}
      />

      {/* Close button */}
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Close"
        sx={{
          position: "absolute",
          top: 10,
          right: 20,
          zIndex: 12,
          color: T.textMuted,
          p: 0.5,
          borderRadius: "2px",
          "&:hover": { color: T.textSub },
        }}
      >
        <X size={15} />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ pl: "26px", pr: "22px", pt: "26px", pb: "22px" }}>
          {/* Lock icon */}
          <Box
            sx={{
              width: 52,
              height: 52,
              mb: 2.25,
              flexShrink: 0,
              borderRadius: "4px",
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
              background: T.accentDim,
              border: `1px solid ${T.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={22} color={T.accent} strokeWidth={2} />
          </Box>

          {/* Header */}
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              color: "rgba(255,70,85,0.72)",
              textTransform: "uppercase",
              mb: 0.6,
            }}
          >
            Sign in required
          </Typography>

          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "1.35rem",
              letterSpacing: "0.04em",
              color: T.text,
              textTransform: "uppercase",
              lineHeight: 1.15,
              mb: 0.6,
            }}
          >
            Join the lobby
          </Typography>

          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.03em",
              color: T.textSub,
              lineHeight: 1.55,
              mb: 2.25,
            }}
          >
            You need an account to send join requests and connect with other
            players.
          </Typography>

          {/* Divider */}
          <Box sx={{ borderTop: `1px solid rgba(255,255,255,0.05)`, mb: 2 }} />

          {/* Perk list */}
          <Stack gap={1} mb={2.5}>
            {PERKS.map((perk) => (
              <Stack key={perk} direction="row" alignItems="center" gap={1.25}>
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: T.accent,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: T.RAJ,
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    letterSpacing: "0.04em",
                    color: T.textSub,
                  }}
                >
                  {perk}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* Google sign-in */}
          <GoogleSignIn
            onSuccess={() => {
              setIsSignInRequired(false);
            }}
          />

          {/* Skip / maybe later */}
          <Button
            onClick={onClose}
            fullWidth
            sx={{
              mt: 1,
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: T.textMuted,
              borderRadius: "2px",
              "&:hover": { color: T.textSub, background: "transparent" },
            }}
          >
            Maybe later
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
