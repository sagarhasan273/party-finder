import { toast } from "sonner";
import { useEffect, useCallback } from "react";

import { useSocket } from "src/contexts/socket-context";

// toaster style -------------

const toastStyles = {
  // Base style for all toasts
  base: {
    background: "rgba(13, 15, 26, 0.95)",
    borderRadius: "4px",
    backdropFilter: "blur(10px)",
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 600,
    fontSize: "0.90rem",
    padding: "16px 16px",
  },

  // Join request style
  request: {
    background: "rgba(13, 15, 26, 0.95)",
    border: "1px solid rgba(255, 70, 85, 0.3)",
    color: "#edf0f4",
  },

  // Accepted style (green theme)
  accept: {
    background: "rgba(13, 26, 18, 0.95)",
    border: "1px solid rgba(34, 197, 94, 0.4)",
    color: "#22c55e",
  },

  // Rejected style (red theme)
  reject: {
    background: "rgba(61, 34, 38, 0.56)",
    border: "1px solid rgba(255, 51, 68, 0.84)",
    color: "#ffc7ccd0",
  },

  // Canceled style (orange/yellow theme)
  canceled: {
    background: "rgba(26, 20, 13, 0.95)",
    border: "1px solid rgba(255, 165, 0, 0.4)",
    color: "#FFA500",
  },
};

const getIcon = (type: string) => {
  switch (type) {
    case "request":
      return "🎮";
    case "accept":
      return "✅";
    case "reject":
      return "❌";
    case "canceled":
      return "⚠️";
    default:
      return "🔔";
  }
};

export const useSocketListeners = () => {
  const { on, off, isConnected } = useSocket();

  // Memoize handlers to prevent unnecessary re-renders
  const handleReceiveJoinRequest = useCallback((data: any) => {
    toast.info(data?.message || "New join request received!", {
      duration: 4000,
      position: "top-right",
      icon: getIcon("request"),
      style: {
        ...toastStyles.base,
        ...toastStyles.request,
      },
    });
  }, []);

  const handleReceiveRequestReject = useCallback((data: any) => {
    toast.error(data?.message || "Your request was rejected", {
      duration: 4000,
      position: "top-right",
      icon: getIcon("reject"),
      style: {
        ...toastStyles.base,
        ...toastStyles.reject,
      },
    });
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return undefined;
    }

    // Register listeners
    on("receive-join-request", handleReceiveJoinRequest);
    on("receive-request-reject", handleReceiveRequestReject);

    // Cleanup function
    return () => {
      off("receive-join-request", handleReceiveJoinRequest);
      off("receive-request-reject", handleReceiveRequestReject);
    };
  }, [
    on,
    off,
    isConnected,
    handleReceiveJoinRequest,
    handleReceiveRequestReject,
  ]);
};
