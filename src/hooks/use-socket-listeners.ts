import type { LobbyType } from "src/types/type-inventory";

import { toast } from "sonner";
import { useLocation } from "react-router";
import { useState, useEffect, useCallback } from "react";

import { playRingtone } from "src/utils/play-sound";

import luster from "src/assets/sounds/luster.mp3";
import long_pop from "src/assets/sounds/long-pop.wav";
import bewitched from "src/assets/sounds/bewitched.mp3";
import { useSocket } from "src/contexts/socket-context";
import universfield from "src/assets/sounds/universfield.mp3";
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

  // Rejected style (red theme)
  suspended: {
    background: "rgba(61, 34, 52, 0.56)",
    border: "1px solid rgba(255, 51, 228, 0.84)",
    color: "#ffc7f1d0",
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
  const location = useLocation();

  const { user } = useCredentials();

  const { on, off, isConnected } = useSocket();

  const {
    lobbies,
    myLobby,
    appliedLobbies,
    setHasNewRequests,
    setMyLobbyStatus,
    setLobbies,
    setMyLobby,
    setAppliedLobbies,
    setAppliedLobbiesStatus,
    setLobbyApplicantStatus,
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

  const handleReceiveLobbyStatus = useCallback(
    (data: any) => {
      if (data?.sentTo === "host") setMyLobbyStatus(data?.status);
      if (data?.sentTo === "applicant")
        setAppliedLobbiesStatus({
          lobbyId: data?.lobbyId,
          status: data?.status,
        });

      if (data?.sentTo === "broadcast") {
        setMyLobbyStatus(data?.status);
        setAppliedLobbiesStatus({
          lobbyId: data?.lobbyId,
          status: data?.status,
        });
      }
    },
    [setMyLobbyStatus, setAppliedLobbiesStatus],
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
          setIsAccepted(false);
          setAcceptedLobby(null);
          playRingtone(universfield);
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
        playRingtone(luster);
        setMyLobby({
          ...myLobby,
          applicants: [
            ...(Array.isArray(myLobby.applicants) ? myLobby.applicants : []),
            data.applicant,
          ],
        });

        setHasNewRequests(location?.pathname !== "/my-lobby");
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
    [
      user?.id,
      myLobby,
      lobbies,
      location,
      setMyLobby,
      setLobbies,
      setHasNewRequests,
    ],
  );

  const handleReceiveRequestAccept = useCallback(
    (data: any) => {
      if (data?.lobbyId && data?.lobby) {
        playRingtone(luster);
        setIsAccepted(true);
        setAcceptedLobby(data.lobby);
        setLobbyApplicantStatus({
          lobbyId: data.lobbyId,
          applicantId: user?.id as string,
          status: "accepted",
          updatedAt: new Date().toDateString(),
        });
      }
    },
    [user?.id, setLobbyApplicantStatus],
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
      playRingtone(bewitched);
      if (data?.lobbyId) {
        setLobbyApplicantStatus({
          lobbyId: data?.lobbyId,
          applicantId: user?.id as string,
          status: "rejected",
        });
      }
    },
    [user?.id, setLobbyApplicantStatus],
  );

  const handleReceiveSuspendedApplicant = useCallback(
    (data: any) => {
      if (data?.applicantId) {
        toast.error(data?.message || "Your request has suspended", {
          duration: 4000,
          position: "top-right",
          icon: getIcon("suspended"),
          style: {
            ...toastStyles.base,
            ...toastStyles.suspended,
          },
        });
        playRingtone(long_pop);
        setIsAccepted(false);
        setAcceptedLobby(null);
        setLobbyApplicantStatus({
          lobbyId: data?.lobbyId,
          applicantId: data?.applicantId,
          status: "suspended",
        });
        setLobbyApplicantStatus({
          applicantId: data?.applicantId,
          status: "suspended",
        });
      }
    },
    [setLobbyApplicantStatus],
  );

  const handleReceiveJoiningApplicant = useCallback(
    (data: any) => {
      if (data?.applicantId) {
        toast.success(
          data?.applicantMessage || "Applicant has responded to join.",
          {
            duration: data?.applicantMessage ? 8000 : 4000,
            position: "top-right",
            style: {
              ...toastStyles.base,
              ...toastStyles.accept,
            },
          },
        );
        playRingtone(universfield);
        setLobbyApplicantStatus({
          applicantId: data?.applicantId,
          status: "joining",
          message: data?.applicantMessage,
        });
      }
    },
    [setLobbyApplicantStatus],
  );

  useEffect(() => {
    if (!isConnected) {
      return undefined;
    }

    // Register listeners
    on("receive-new-lobby", handleReceiveNewLobby);
    on("receive-lobby-status", handleReceiveLobbyStatus);
    on("receive-deleted-lobby", handleReceiveDeletedLobby);
    on("receive-join-request", handleReceiveJoinRequest);
    on("receive-request-accept", handleReceiveRequestAccept);
    on("receive-request-reject", handleReceiveRequestReject);
    on("receive-suspended-applicant", handleReceiveSuspendedApplicant);
    on("receive-joining-applicant", handleReceiveJoiningApplicant);

    // Cleanup function
    return () => {
      off("receive-new-lobby", handleReceiveNewLobby);
      off("receive-lobby-status", handleReceiveLobbyStatus);
      off("receive-deleted-lobby", handleReceiveDeletedLobby);
      off("receive-join-request", handleReceiveJoinRequest);
      off("receive-request-accept", handleReceiveRequestAccept);
      off("receive-request-reject", handleReceiveRequestReject);
      off("receive-suspended-applicant", handleReceiveSuspendedApplicant);
      off("receive-joining-applicant", handleReceiveJoiningApplicant);
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
    handleReceiveSuspendedApplicant,
    handleReceiveJoiningApplicant,
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
