import type { LobbyType } from "src/types/type-inventory";

import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";

import { useSocket } from "src/contexts/socket-context";
import { useInventory, useCredentials } from "src/core/slices";

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
    case "create":
      return "✨"; // Creation/sparkle icon
    case "delete":
      return "🗑️"; // Trash can icon
    case "on":
      return "🟢"; // Green circle for online/active
    case "off":
      return "⚫"; // Black circle for offline/inactive
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
  const { user } = useCredentials();

  const { on, off, isConnected } = useSocket();

  const {
    lobbies,
    myLobby,
    appliedLobbies,
    setMyLobbyStatus,
    setLobbies,
    setMyLobby,
    setAppliedLobbies,
    setAppliedLobbiesStatus,
    setMyLobbyApplicantStatus,
  } = useInventory();

  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptedLobby, setAcceptedLobby] = useState<LobbyType | null>(null);

  // Memoize handlers to prevent unnecessary re-renders
  const handleReceiveNewLobby = useCallback(
    (data: any) => {
      if (data?.lobby) setLobbies([data.lobby, ...lobbies]);
    },
    [lobbies, setLobbies],
  );

  const handleReceiveDeletedLobby = useCallback(
    (data: any) => {
      if (data?.lobbyId) {
        const isLobbyExist = appliedLobbies.some(
          (lobby) => lobby.id === data?.lobbyId,
        );
        if (isLobbyExist) {
          const templobby = appliedLobbies.filter(
            (lobby) => lobby.id !== data?.lobbyId,
          );
          setAppliedLobbies(templobby);
          toast.info(
            data?.hostId === user.id
              ? "Lobby Deleted!"
              : data?.message || "Lobby Deleted!",
            {
              duration: 4000,
              position: "top-right",
              icon: getIcon("delete"),
              style: {
                ...toastStyles.base,
              },
            },
          );
        }
        setLobbies(lobbies.filter((lobby) => lobby.id !== data?.lobbyId));
      }
    },
    [user.id, lobbies, appliedLobbies, setAppliedLobbies, setLobbies],
  );

  const handleReceiveJoinRequest = useCallback(
    (data: any) => {
      toast.info(data?.message || "New Lobby Created!", {
        duration: 4000,
        position: "top-right",
        icon: getIcon("request"),
        style: {
          ...toastStyles.base,
          ...toastStyles.request,
        },
      });

      if (data?.applicant && myLobby) {
        setMyLobby({
          ...myLobby,
          applicants: [
            ...(Array.isArray(myLobby.applicants) ? myLobby.applicants : []),
            data.applicant,
          ],
        });
      }

      if (data?.applicantId === user?.id) {
        setLobbies(
          lobbies.map((lobby) => {
            if (lobby.id === data?.lobbyId) {
              return {
                ...lobby,
                applicants: [
                  ...(Array.isArray(lobby.applicants) ? lobby.applicants : []),
                  data.applicant,
                ],
              };
            }
            return lobby;
          }),
        );
      }
    },
    [user?.id, myLobby, lobbies, setMyLobby, setLobbies],
  );

  const handleReceiveRequestAccept = useCallback(
    (data: any) => {
      toast.error(data?.message || "Your request has accepted", {
        duration: 4000,
        position: "top-right",
        icon: getIcon("accept"),
        style: {
          ...toastStyles.base,
          ...toastStyles.accept,
        },
      });
      if (data?.lobbyId && data?.lobby) {
        setIsAccepted(true);
        setAcceptedLobby(data.lobby);
        setMyLobbyApplicantStatus({
          lobbyId: data.lobbyId,
          applicantId: user?.id as string,
          status: "accepted",
        });
      }
    },
    [user?.id, setMyLobbyApplicantStatus],
  );

  const handleReceiveRequestReject = useCallback(
    (data: any) => {
      toast.error(data?.message || "Your request has rejected", {
        duration: 4000,
        position: "top-right",
        icon: getIcon("reject"),
        style: {
          ...toastStyles.base,
          ...toastStyles.reject,
        },
      });
      if (data?.lobbyId) {
        setMyLobbyApplicantStatus({
          lobbyId: data?.lobbyId,
          applicantId: user?.id as string,
          status: "rejected",
        });
      }
    },
    [user?.id, setMyLobbyApplicantStatus],
  );

  const handleReceiveLobbyStatus = useCallback(
    (data: any) => {
      if (data?.sentTo === "host") setMyLobbyStatus(data?.status);
      if (data?.sentTo === "applicant")
        setAppliedLobbiesStatus({
          lobbyId: data?.lobbyId,
          status: data?.status,
        });
    },
    [setMyLobbyStatus, setAppliedLobbiesStatus],
  );

  useEffect(() => {
    if (!isConnected) {
      return undefined;
    }

    // Register listeners
    on("receive-new-lobby", handleReceiveNewLobby);
    on("receive-deleted-lobby", handleReceiveDeletedLobby);
    on("receive-join-request", handleReceiveJoinRequest);
    on("receive-request-accept", handleReceiveRequestAccept);
    on("receive-request-reject", handleReceiveRequestReject);
    on("receive-lobby-status", handleReceiveLobbyStatus);

    // Cleanup function
    return () => {
      off("receive-new-lobby", handleReceiveNewLobby);
      off("receive-deleted-lobby", handleReceiveDeletedLobby);
      off("receive-join-request", handleReceiveJoinRequest);
      off("receive-request-accept", handleReceiveRequestAccept);
      off("receive-request-reject", handleReceiveRequestReject);
      off("receive-lobby-status", handleReceiveLobbyStatus);
    };
  }, [
    isConnected,
    on,
    off,
    handleReceiveNewLobby,
    handleReceiveDeletedLobby,
    handleReceiveJoinRequest,
    handleReceiveRequestAccept,
    handleReceiveRequestReject,
    handleReceiveLobbyStatus,
  ]);

  return {
    isAccepted,
    setIsAccepted: (value: boolean) => {
      setIsAccepted(value);
    },
    acceptedLobby,
  };
};
