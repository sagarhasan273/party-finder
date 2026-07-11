import React from "react";
import {
  X,
  Bell,
  UserPlus,
  Activity,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

import { Box, Fade, Paper, Typography, IconButton } from "@mui/material";

import type { Toast as ToastType } from "../../../hooks/use-toast";

interface ToastProps {
  toast: ToastType;
  onRemove: (id: number) => void;
}

const toastIcons = {
  success: <CheckCircle size={15} />,
  message: <MessageSquare size={15} />,
  invite: <UserPlus size={15} />,
  warning: <Activity size={15} />,
  info: <Bell size={15} />,
};

const toastColors = {
  success: { bg: "#00382e", border: "#00f3c5", text: "#00f3c5" },
  warning: { bg: "#3b2b00", border: "#ffb000", text: "#ffb000" },
  message: { bg: "#0f1d33", border: "#3b82f6", text: "#60a5fa" },
  invite: { bg: "#2d0f1c", border: "#ff4655", text: "#ff4655" },
  info: { bg: "#101726", border: "#1e293b", text: "#94a3b8" },
};

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const toastType = toast.type as keyof typeof toastColors;
  const colors = toastColors[toastType];

  return (
    <Fade in>
      <Paper
        sx={{
          p: 1.5,
          borderRadius: 1,
          bgcolor: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          boxShadow: 8,
          minWidth: 200,
          maxWidth: 320,
        }}
      >
        <Box sx={{ mt: 0.25, flexShrink: 0 }}>{toastIcons[toastType]}</Box>
        <Typography variant="body2" sx={{ flex: 1, fontSize: "0.75rem" }}>
          {toast.text}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onRemove(toast.id)}
          sx={{ color: "inherit", opacity: 0.7, "&:hover": { opacity: 1 } }}
        >
          <X size={14} />
        </IconButton>
      </Paper>
    </Fade>
  );
};
