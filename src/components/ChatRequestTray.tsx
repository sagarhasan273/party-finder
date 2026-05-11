import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Check, UserCheck } from "lucide-react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import type { ChatRequest } from "../types/type-social";

const RAJ = '"Rajdhani", sans-serif';
const DISMISS_MS = 5000;

interface ChatRequestTrayProps {
  request: ChatRequest | null;
  visible: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onDismiss: () => void;
  onViewAll: () => void;
  pendingCount: number;
}

export function ChatRequestTray({
  request,
  visible,
  onAccept,
  onReject,
  onDismiss,
  onViewAll,
  pendingCount,
}: ChatRequestTrayProps) {
  // Progress bar draining to 0
  const [progress, setProgress] = useState(100);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!visible) {
      setProgress(100);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startRef.current = Date.now();
    setProgress(100);

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / DISMISS_MS) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, request?.id]);

  const handleAccept = () => {
    if (!request) return;
    onAccept(request.id);
    onDismiss();
  };

  const handleReject = () => {
    if (!request) return;
    onReject(request.id);
    onDismiss();
  };

  return (
    <AnimatePresence>
      {visible && request && (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            zIndex: 1400,
            width: 320,
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(13,15,26,0.98)",
              border: "1px solid rgba(255,70,85,0.35)",
              borderRadius: "4px",
              clipPath:
                "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
              position: "relative",
              overflow: "hidden",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,70,85,0.15)",

              // Left accent
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: 3,
                height: "100%",
                background: "#FF4655",
                zIndex: 2,
              },
              // Top tint
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 3,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(90deg, rgba(255,70,85,0.8), transparent 55%)",
                zIndex: 2,
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
                borderWidth: "0 14px 14px 0",
                borderColor:
                  "transparent rgba(255,70,85,0.4) transparent transparent",
                zIndex: 3,
              }}
            />

            <Box
              sx={{ p: "14px 16px 12px 20px", position: "relative", zIndex: 1 }}
            >
              {/* Header row */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1.25}
              >
                <Stack direction="row" alignItems="center" gap={0.6}>
                  <MessageCircle size={11} color="#FF4655" />
                  <Typography
                    sx={{
                      fontFamily: RAJ,
                      fontWeight: 700,
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#FF4655",
                    }}
                  >
                    Chat Request
                  </Typography>
                  {pendingCount > 1 && (
                    <Box
                      sx={{
                        px: 0.75,
                        py: "1px",
                        borderRadius: "2px",
                        background: "rgba(255,70,85,0.12)",
                        border: "1px solid rgba(255,70,85,0.3)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: RAJ,
                          fontWeight: 700,
                          fontSize: "0.58rem",
                          color: "#FF4655",
                          lineHeight: 1.6,
                        }}
                      >
                        +{pendingCount - 1} more
                      </Typography>
                    </Box>
                  )}
                </Stack>
                <Box
                  onClick={onDismiss}
                  role="button"
                  aria-label="Dismiss"
                  sx={{
                    width: 22,
                    height: 22,
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
                  <X size={11} strokeWidth={2.5} />
                </Box>
              </Stack>

              {/* Player info */}
              <Stack direction="row" alignItems="center" gap={1.25} mb={1.25}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "3px",
                    background: "rgba(255,70,85,0.2)",
                    border: "1px solid rgba(255,70,85,0.3)",
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: "#FF4655",
                    flexShrink: 0,
                  }}
                >
                  {request.from.avatar}
                </Avatar>
                <Box minWidth={0}>
                  <Typography
                    sx={{
                      fontFamily: RAJ,
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      letterSpacing: "0.04em",
                      color: "#edf0f4",
                      textTransform: "uppercase",
                      lineHeight: 1.2,
                    }}
                  >
                    {request.from.name}
                    <Box
                      component="span"
                      sx={{ opacity: 0.38, fontWeight: 400, textTransform: "none" }}
                    >
                      {request.from.tag}
                    </Box>
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={0.6} mt={0.25}>
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background:
                          request.from.status === "online"
                            ? "#22c55e"
                            : "rgba(90,100,130,1)",
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: RAJ,
                        fontWeight: 600,
                        fontSize: "0.62rem",
                        letterSpacing: "0.05em",
                        color: "rgba(74,84,112,1)",
                        textTransform: "uppercase",
                      }}
                    >
                      {request.from.rank} · {request.from.role}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* Message preview */}
              {request.message && (
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    mb: 1.25,
                    borderRadius: "3px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: RAJ,
                      fontWeight: 500,
                      fontSize: "0.72rem",
                      color: "rgba(136,146,170,1)",
                      letterSpacing: "0.02em",
                      lineHeight: 1.45,
                      fontStyle: "italic",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    "{request.message}"
                  </Typography>
                </Box>
              )}

              {/* Action buttons */}
              <Stack direction="row" gap={0.75}>
                <Button
                  size="small"
                  onClick={handleAccept}
                  startIcon={<Check size={12} />}
                  fullWidth
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    height: 30,
                    borderRadius: "2px",
                    background: "rgba(34,197,94,0.15)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.3)",
                    boxShadow: "none",
                    "&:hover": {
                      background: "rgba(34,197,94,0.25)",
                      boxShadow: "none",
                    },
                  }}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  onClick={handleReject}
                  fullWidth
                  sx={{
                    fontFamily: RAJ,
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    height: 30,
                    borderRadius: "2px",
                    background: "transparent",
                    color: "rgba(90,100,130,1)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    "&:hover": {
                      borderColor: "rgba(255,70,85,0.4)",
                      color: "#FF4655",
                      background: "rgba(255,70,85,0.07)",
                    },
                  }}
                >
                  Decline
                </Button>
              </Stack>

              {/* View all link */}
              {pendingCount > 1 && (
                <Box
                  onClick={onViewAll}
                  role="button"
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover .view-all-text": { color: "#edf0f4" },
                  }}
                >
                  <Typography
                    className="view-all-text"
                    sx={{
                      fontFamily: RAJ,
                      fontWeight: 700,
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(74,84,112,1)",
                      transition: "color 0.15s",
                    }}
                  >
                    View all {pendingCount} requests →
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Auto-dismiss progress bar */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "rgba(255,255,255,0.04)",
                zIndex: 4,
              }}
            >
              <Box
                sx={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "rgba(255,70,85,0.6)",
                }}
              />
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
