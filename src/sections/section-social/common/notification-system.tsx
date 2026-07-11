import React from "react";

import { Box } from "@mui/material";

import { Toast } from "./toast";

import type { useToast } from "../../../hooks/use-toast";

interface NotificationSystemProps {
  toasts: ReturnType<typeof useToast>["toasts"];
  onRemove: ReturnType<typeof useToast>["removeToast"];
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  toasts,
  onRemove,
}) => (
  <Box
    sx={{
      position: "fixed",
      bottom: 16,
      right: 16,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      maxWidth: "80%",
      width: 320,
    }}
  >
    {toasts.map((toast) => (
      <Toast key={toast.id} toast={toast} onRemove={onRemove} />
    ))}
  </Box>
);
