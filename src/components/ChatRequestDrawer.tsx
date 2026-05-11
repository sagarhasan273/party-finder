import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Inbox,
  MessageCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material";
import type { ChatRequest } from "../types/type-social";

const RAJ = '"Rajdhani", sans-serif';

const STATUS_CFG = {
  pending: { color: "#f59e0b", label: "Pending" },
  accepted: { color: "#22c55e", label: "Accepted" },
  rejected: { color: "rgba(90,100,130,1)", label: "Declined" },
} as const;

// ─── Single request row ───────────────────────────────────────────────────────

function RequestRow({
  request,
  onAccept,
  onReject,
  index,
}: {
  request: ChatRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  index: number;
}) {
  const isPending = request.status === "pending";
  const cfg = STATUS_CFG[request.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
    >
      <Box
        sx={{
          p: "12px 14px",
          borderRadius: "4px",
          background: isPending
            ? "rgba(255,70,85,0.04)"
            : "rgba(255,255,255,0.02)",
          border: `1px solid ${
            isPending
              ? "rgba(255,70,85,0.15)"
              : "rgba(255,255,255,0.06)"
          }`,
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.15s",
          "&:hover": {
            borderColor: isPending
              ? "rgba(255,70,85,0.28)"
              : "rgba(255,255,255,0.09)",
          },
          // Micro left bar
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 2,
            height: "100%",
            background: cfg.color,
          },
        }}
      >
        {/* Player row */}
        <Stack direction="row" alignItems="flex-start" gap={1.25} mb={isPending ? 1 : 0}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              borderRadius: "3px",
              background: "rgba(255,70,85,0.15)",
              border: "1px solid rgba(255,70,85,0.25)",
              fontFamily: RAJ,
              fontWeight: 700,
              fontSize: "0.72rem",
              color: "#FF4655",
              flexShrink: 0,
            }}
          >
            {request.from.avatar}
          </Avatar>

          <Box flex={1} minWidth={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    letterSpacing: "0.04em",
                    color: "#edf0f4",
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                  }}
                >
                  {request.from.name}
                  <Box component="span" sx={{ opacity: 0.35, fontWeight: 400, textTransform: "none" }}>
                    {request.from.tag}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontFamily: RAJ,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "rgba(74,84,112,1)",
                    textTransform: "uppercase",
                    mt: 0.2,
                  }}
                >
                  {request.from.rank} · {request.from.role}
                </Typography>
              </Box>

              {/* Status indicator */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  flexShrink: 0,
                }}
              >
                {request.status === "accepted" && (
                  <CheckCircle2 size={12} color="#22c55e" />
                )}
                {request.status === "rejected" && (
                  <XCircle size={12} color="rgba(90,100,130,1)" />
                )}
                {request.status === "pending" && (
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#f59e0b",
                      animation: "pendingPulse 2s ease-in-out infinite",
                      "@keyframes pendingPulse": {
                        "0%,100%": { opacity: 1 },
                        "50%": { opacity: 0.3 },
                      },
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.58rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: cfg.color,
                  }}
                >
                  {cfg.label}
                </Typography>
              </Box>
            </Stack>

            {/* Message */}
            {request.message && (
              <Typography
                sx={{
                  fontFamily: RAJ,
                  fontWeight: 500,
                  fontSize: "0.68rem",
                  color: "rgba(136,146,170,1)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.4,
                  fontStyle: "italic",
                  mt: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                "{request.message}"
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Action buttons — only for pending */}
        {isPending && (
          <Stack direction="row" gap={0.6} pl="46px">
            <Button
              size="small"
              onClick={() => onAccept(request.id)}
              startIcon={<Check size={11} />}
              sx={{
                flex: 1,
                fontFamily: RAJ,
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                height: 24,
                borderRadius: "2px",
                background: "rgba(34,197,94,0.12)",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.25)",
                boxShadow: "none",
                "&:hover": {
                  background: "rgba(34,197,94,0.22)",
                  boxShadow: "none",
                },
              }}
            >
              Accept
            </Button>
            <Button
              size="small"
              onClick={() => onReject(request.id)}
              startIcon={<X size={11} />}
              sx={{
                flex: 1,
                fontFamily: RAJ,
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                height: 24,
                borderRadius: "2px",
                background: "transparent",
                color: "rgba(90,100,130,1)",
                border: "1px solid rgba(255,255,255,0.08)",
                "&:hover": {
                  borderColor: "rgba(255,70,85,0.35)",
                  color: "#FF4655",
                  background: "rgba(255,70,85,0.06)",
                },
              }}
            >
              Decline
            </Button>
          </Stack>
        )}
      </Box>
    </motion.div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface ChatRequestDrawerProps {
  open: boolean;
  requests: ChatRequest[];
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function ChatRequestDrawer({
  open,
  requests,
  onClose,
  onAccept,
  onReject,
}: ChatRequestDrawerProps) {
  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 1400,
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: 340,
              zIndex: 1500,
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "rgba(13,15,26,0.99)",
                borderLeft: "1px solid rgba(255,70,85,0.2)",
                boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: "16px 16px 14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  position: "relative",
                  // Top accent
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(90deg, #FF4655, rgba(255,70,85,0.1))",
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "3px",
                        background: "rgba(255,70,85,0.1)",
                        border: "1px solid rgba(255,70,85,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Inbox size={14} color="#FF4655" />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: RAJ,
                          fontWeight: 900,
                          fontSize: "1rem",
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          color: "#edf0f4",
                          lineHeight: 1,
                        }}
                      >
                        Chat Inbox
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: RAJ,
                          fontWeight: 600,
                          fontSize: "0.6rem",
                          letterSpacing: "0.06em",
                          color: "rgba(74,84,112,1)",
                          textTransform: "uppercase",
                        }}
                      >
                        {pending.length} pending
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    onClick={onClose}
                    role="button"
                    aria-label="Close drawer"
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "2px",
                      border: "1px solid rgba(255,255,255,0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.3)",
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: "rgba(255,70,85,0.4)",
                        color: "#FF4655",
                        background: "rgba(255,70,85,0.08)",
                      },
                    }}
                  >
                    <X size={13} strokeWidth={2.5} />
                  </Box>
                </Stack>
              </Box>

              {/* Body — scrollable */}
              <Box sx={{ flex: 1, overflowY: "auto", p: "14px 14px 80px", display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Pending section */}
                {pending.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontFamily: RAJ,
                        fontWeight: 700,
                        fontSize: "0.58rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(74,84,112,1)",
                        mb: 0.5,
                      }}
                    >
                      Pending · {pending.length}
                    </Typography>
                    {pending.map((r, i) => (
                      <RequestRow
                        key={r.id}
                        request={r}
                        onAccept={onAccept}
                        onReject={onReject}
                        index={i}
                      />
                    ))}
                  </>
                )}

                {/* Resolved section */}
                {resolved.length > 0 && (
                  <>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 0.5 }} />
                    <Typography
                      sx={{
                        fontFamily: RAJ,
                        fontWeight: 700,
                        fontSize: "0.58rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(74,84,112,1)",
                        mb: 0.5,
                      }}
                    >
                      History · {resolved.length}
                    </Typography>
                    {resolved.map((r, i) => (
                      <RequestRow
                        key={r.id}
                        request={r}
                        onAccept={onAccept}
                        onReject={onReject}
                        index={i}
                      />
                    ))}
                  </>
                )}

                {/* Empty state */}
                {requests.length === 0 && (
                  <Box sx={{ py: 8, textAlign: "center" }}>
                    <MessageCircle
                      size={32}
                      color="rgba(74,84,112,0.4)"
                      style={{ marginBottom: 12 }}
                    />
                    <Typography
                      sx={{
                        fontFamily: RAJ,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(74,84,112,1)",
                      }}
                    >
                      No requests yet
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
