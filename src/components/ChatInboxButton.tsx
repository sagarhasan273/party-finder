import { motion, AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import { Box, Typography } from "@mui/material";

const RAJ = '"Rajdhani", sans-serif';

interface ChatInboxButtonProps {
  visible: boolean;
  count: number;
  onClick: () => void;
}

export function ChatInboxButton({ visible, count, onClick }: ChatInboxButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1300,
          }}
        >
          <Box
            onClick={onClick}
            role="button"
            aria-label={`Open inbox — ${count} pending`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: "9px",
              borderRadius: "4px",
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
              background: "rgba(13,15,26,0.98)",
              border: "1px solid rgba(255,70,85,0.35)",
              cursor: "pointer",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,70,85,0.1)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.15s",
              "&:hover": {
                borderColor: "rgba(255,70,85,0.65)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(255,70,85,0.2)",
                "& .inbox-label": { color: "#edf0f4" },
              },
              // Left accent
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: 2,
                height: "100%",
                background: "#FF4655",
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
                  "transparent rgba(255,70,85,0.35) transparent transparent",
              }}
            />

            <Box sx={{ position: "relative", display: "flex", flexShrink: 0 }}>
              <Inbox size={16} color="#FF4655" />
              {/* Count badge */}
              {count > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -7,
                    minWidth: 14,
                    height: 14,
                    borderRadius: "2px",
                    background: "#FF4655",
                    border: "1.5px solid rgba(13,15,26,1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 0.3,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: RAJ,
                      fontWeight: 700,
                      fontSize: "0.52rem",
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {count > 9 ? "9+" : count}
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography
              className="inbox-label"
              sx={{
                fontFamily: RAJ,
                fontWeight: 700,
                fontSize: "0.68rem",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "rgba(90,100,130,1)",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
                position: "relative",
                zIndex: 1,
              }}
            >
              {count} Request{count !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
