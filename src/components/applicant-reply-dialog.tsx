import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Copy, Check, Shield } from "lucide-react";

import {
  Box,
  Stack,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
  IconButton,
  DialogContent,
} from "@mui/material";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "rgba(10,11,20,0.99)",
  bgCard: "rgba(14,16,28,0.97)",
  bgInput: "rgba(20,24,42,0.8)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  accent: "#FF4655",
  accentDim: "rgba(255,70,85,0.1)",
  accentBorder: "rgba(255,70,85,0.22)",
  text: "#dde3f0",
  textSub: "#7f8fad",
  textMuted: "#3e4d6b",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.08)",
  greenBorder: "rgba(34,197,94,0.3)",
  RAJ: '"Rajdhani", sans-serif',
} as const;

// ─── Copy hook ────────────────────────────────────────────────────────────────

function useCopyCode(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// ─── PartyCodeReveal ──────────────────────────────────────────────────────────

function PartyCodeReveal({ partyCode }: { partyCode: string }) {
  const { copied, copy } = useCopyCode(partyCode);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <Box
        sx={{
          p: "14px 16px",
          borderRadius: "3px",
          clipPath:
            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
          background: T.greenDim,
          border: `1px solid ${T.greenBorder}`,
          position: "relative",
          overflow: "hidden",
          animation: "pulse 2s ease-in-out infinite",
          "@keyframes pulse": {
            "0%": {
              borderColor: "rgba(34,197,94,0.2)",
              boxShadow: "0 0 0 0 rgba(34,197,94,0.1)",
            },
            "50%": {
              borderColor: "rgba(34,197,94,0.6)",
              boxShadow: "0 0 0 4px rgba(34,197,94,0.08)",
            },
            "100%": {
              borderColor: "rgba(34,197,94,0.2)",
              boxShadow: "0 0 0 0 rgba(34,197,94,0)",
            },
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
            borderWidth: "0 10px 10px 0",
            borderColor:
              "transparent rgba(34,197,94,0.7) transparent transparent",
          }}
        />

        {/* Label */}
        <Stack direction="row" alignItems="center" gap={0.75} mb={1.25}>
          <Shield size={14} color={T.green} />
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              color: T.green,
              textTransform: "uppercase",
            }}
          >
            You&lsquo;ve been accepted — here&lsquo;s your party code
          </Typography>
        </Stack>

        {/* Code + copy */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1.5}
        >
          <Typography
            sx={{
              fontFamily: T.RAJ,
              fontWeight: 700,
              fontSize: "1.75rem",
              letterSpacing: "0.32em",
              color: T.green,
              userSelect: "all",
              lineHeight: 1,
            }}
          >
            {partyCode}
          </Typography>

          <IconButton
            onClick={copy}
            disableRipple
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "2px",
              flexShrink: 0,
              border: copied
                ? `1px solid rgba(34,197,94,0.55)`
                : `1px solid rgba(34,197,94,0.25)`,
              color: copied ? T.green : T.textSub,
              background: copied ? "rgba(34,197,94,0.1)" : "transparent",
              transition: "all 0.15s",
              "&:hover": {
                border: `1px solid rgba(34,197,94,0.5)`,
                color: T.green,
                background: "rgba(34,197,94,0.1)",
              },
            }}
          >
            {copied ? (
              <Check size={13} strokeWidth={2.5} />
            ) : (
              <Copy size={13} />
            )}
          </IconButton>
        </Stack>

        <Typography
          sx={{
            fontFamily: T.RAJ,
            fontWeight: 500,
            fontSize: "0.65rem",
            color: "rgba(34,197,94,0.5)",
            mt: 0.75,
            letterSpacing: "0.04em",
          }}
        >
          Open Valorant → Social → Party → Join with code
        </Typography>
      </Box>
    </motion.div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ApplicantReplyDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
  hostName: string;
  lobbyTitle: string;
  partyCode: string;
  isSending?: boolean;
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

export function ApplicantReplyDialog({
  open,
  onClose,
  onSend,
  hostName,
  lobbyTitle,
  partyCode,
  isSending = false,
}: ApplicantReplyDialogProps) {
  const { copy } = useCopyCode(partyCode);
  const [message, setMessage] = useState("");
  const MAX = 280;

  const handleSend = async () => {
    await onSend(message.trim());
    setMessage("");
    copy();
  };

  const handleSkip = () => {
    onClose();
  };

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
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          // Left accent bar
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: "100%",
            background: partyCode ? T.green : T.accent,
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
            background: partyCode
              ? `linear-gradient(90deg, ${T.green}77, transparent 60%)`
              : `linear-gradient(90deg, ${T.accent}77, transparent 60%)`,
            zIndex: 10,
          },
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(6px)", background: "rgba(4,5,12,0.8)" },
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
          borderColor: partyCode
            ? `transparent ${T.green}44 transparent transparent`
            : `transparent ${T.accent}44 transparent transparent`,
        }}
      />

      {/* Close button */}
      <IconButton
        onClick={onClose}
        size="small"
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
        <Box sx={{ pl: "26px", pr: "22px", pt: "22px", pb: "20px" }}>
          {/* Header */}
          <Box mb={2}>
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                color: partyCode ? T.green : "rgba(255,70,85,0.75)",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              {partyCode ? "Lobby accepted" : "Reply to host"}
            </Typography>
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "1.2rem",
                letterSpacing: "0.04em",
                color: T.text,
                textTransform: "uppercase",
                lineHeight: 1.15,
              }}
            >
              {lobbyTitle}
            </Typography>
            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 500,
                fontSize: "0.72rem",
                color: T.textSub,
                mt: 0.4,
                letterSpacing: "0.03em",
              }}
            >
              hosted by{" "}
              <Box component="span" sx={{ color: T.text, fontWeight: 700 }}>
                {hostName}
              </Box>
            </Typography>
          </Box>

          {/* Party code — shown when accepted */}
          <AnimatePresence>
            {partyCode && (
              <Box mb={2}>
                <PartyCodeReveal partyCode={partyCode} />
              </Box>
            )}
          </AnimatePresence>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 2 }} />

          {/* Message input */}
          <Box mb={0.5}>
            <Stack
              direction="row"
              alignItems="baseline"
              justifyContent="space-between"
              mb={0.75}
            >
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  color: T.textSub,
                  textTransform: "uppercase",
                }}
              >
                Message to host
              </Typography>
              <Typography
                sx={{
                  fontFamily: T.RAJ,
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: message.length > MAX * 0.85 ? T.accent : T.textMuted,
                  letterSpacing: "0.04em",
                }}
              >
                {message.length}/{MAX}
              </Typography>
            </Stack>

            <TextField
              multiline
              minRows={2}
              maxRows={3}
              fullWidth
              placeholder="Say anything to the host… (optional)"
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= MAX) setMessage(e.target.value);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: T.RAJ,
                  fontWeight: 500,
                  fontSize: "0.82rem",
                  color: T.text,
                  letterSpacing: "0.02em",
                  lineHeight: 1.6,
                  background: T.bgInput,
                  borderRadius: "2px",
                  "& fieldset": { borderColor: T.border },
                  "&:hover fieldset": { borderColor: T.borderHover },
                  "&.Mui-focused fieldset": {
                    borderColor: partyCode
                      ? "rgba(34,197,94,0.45)"
                      : "rgba(255,70,85,0.4)",
                    borderWidth: 1,
                  },
                  "& textarea": { padding: "4px 6px" },
                  "& textarea::placeholder": { color: T.textMuted, opacity: 1 },
                },
              }}
            />

            <Typography
              sx={{
                fontFamily: T.RAJ,
                fontSize: "0.7rem",
                fontWeight: 500,
                color: T.textMuted,
                mt: 0.75,
                letterSpacing: "0.03em",
              }}
            >
              This is optional — you can skip and join directly with the party
              code.
            </Typography>
          </Box>

          {/* Actions */}
          <Stack direction="row" gap={1} mt={2.5} justifyContent="flex-end">
            <Button
              onClick={handleSkip}
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "2px",
                px: 2,
                borderColor: T.border,
                color: T.textSub,
                border: `1px solid ${T.border}`,
                "&:hover": {
                  borderColor: T.borderHover,
                  color: T.text,
                  background: "rgba(255,255,255,0.04)",
                },
              }}
            >
              Skip
            </Button>

            <Button
              onClick={handleSend}
              disabled={isSending}
              startIcon={message ? <Send size={13} /> : null}
              sx={{
                fontFamily: T.RAJ,
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "2px",
                px: 2.5,
                boxShadow: "none",
                background: partyCode ? T.green : T.accent,
                color: "#fff",
                "&:hover": {
                  background: partyCode ? "#1da84f" : "#e03040",
                  boxShadow: partyCode
                    ? "0 0 16px rgba(34,197,94,0.3)"
                    : "0 0 16px rgba(255,70,85,0.3)",
                },
                "&.Mui-disabled": {
                  background: "rgba(255,255,255,0.07)",
                  color: T.textMuted,
                },
              }}
            >
              {isSending
                ? "Sending…"
                : !message
                  ? "Yes, I'm joining"
                  : "Send message"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
