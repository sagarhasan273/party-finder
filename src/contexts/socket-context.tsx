/**
 * realtime.tsx: everything that talks to the network, in one file.
 *
 *   Types              shapes shared by the server events and the UI
 *   SocketProvider     one socket.io connection to the /val5th namespace (JWT in the handshake)
 *   useSocket          emit(event, data) and on(event, handler) -> unsubscribe
 *   useLiveKitRoom     voice, who is speaking, mute, and chat/party-code data channel
 */
import type { Socket } from "socket.io-client";

import { io } from "socket.io-client";
import { Room, Track, RoomEvent } from "livekit-client";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";

import { CONFIG } from "../config-global";
import { useCredentials } from "../core/slices";

// ── Types ────────────────────────────────────────────────────────────────────
export interface Telemetry {
  onlinePlayers: number;
  inQueueCount: number;
  timestamp?: number;
}

export type QueueState = "idle" | "searching" | "matched";

export interface Participant {
  userId: string;
  username: string;
  rank: string;
  currentGroupSize: number;
}

export interface MatchData {
  roomId: string;
  participants: Participant[];
  livekit: { url: string; token: string };
}

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
  self?: boolean;
}

export interface SearchRequest {
  username: string;
  region: string;
  server: string;
  rank: string;
  minRank: string;
  maxRank: string;
  currentGroupSize: number;
}

/** What travels over the LiveKit data channel. The sender name comes from the LiveKit token, not from the payload. */
export type DataChannelPayload =
  | { type: "CHAT"; message: string; timestamp: string }
  | { type: "PARTY_CODE"; partyCode: string };

// ── Socket ───────────────────────────────────────────────────────────────────
interface SocketContextValue {
  isConnected: boolean;
  socketId: string | undefined;
  emit: (event: string, payload?: unknown) => void;
  /** Subscribes and returns the unsubscribe function. */
  on: <T = unknown>(event: string, handler: (data: T) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { logout } = useCredentials();
  // useCredentials() returns a new `logout` whenever user state changes; a ref
  // keeps the socket from reconnecting every time that happens.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string>();

  // One socket for the lifetime of the provider; it only connects once we have a token.
  const [socket] = useState<Socket>(() =>
    io(`${CONFIG.serverUrl}/val5th`, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    }),
  );

  useEffect(() => {
    socket.auth = { token: sessionStorage.getItem(CONFIG.googleAccessToken) };

    const onConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id);
    };
    const onDisconnect = () => setIsConnected(false);
    const onError = (err: Error) => {
      // Expired or invalid JWT: drop the session so the login page shows.
      if (err.message === "unauthorized") {
        sessionStorage.removeItem(CONFIG.googleAccessToken);
        logoutRef.current();
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.disconnect();
    };
  }, [socket]);

  const emit = useCallback(
    (event: string, payload?: unknown) => {
      socket.emit(event, payload);
    },
    [socket],
  );

  const on = useCallback(
    <T,>(event: string, handler: (data: T) => void) => {
      socket.on(event, handler as (...args: unknown[]) => void);
      return () => {
        socket.off(event, handler as (...args: unknown[]) => void);
      };
    },
    [socket],
  );

  const value = useMemo(
    () => ({ isConnected, socketId, emit, on }),
    [isConnected, socketId, emit, on],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside <SocketProvider>");
  return ctx;
};

// ── LiveKit voice + data channel ─────────────────────────────────────────────
export type VoiceStatus = "idle" | "connecting" | "connected" | "failed";

interface Options {
  /** `senderName` comes from the LiveKit token the server signed, so it can't be spoofed. */
  onData?: (payload: DataChannelPayload, senderName: string) => void;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Everything the lobby needs from LiveKit: voice, who is speaking,
 * mic mute, and a reliable data channel for chat and party codes.
 */
export function useLiveKitRoom({ onData }: Options = {}) {
  const roomRef = useRef<Room | null>(null);
  const onDataRef = useRef(onData);
  useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);

  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [speakingIds, setSpeakingIds] = useState<string[]>([]);
  const [localIdentity, setLocalIdentity] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);

  const disconnect = useCallback(async () => {
    const room = roomRef.current;
    roomRef.current = null;
    if (room) {
      room.removeAllListeners();
      room.remoteParticipants.forEach((p) =>
        p.trackPublications.forEach((pub) =>
          pub.track?.detach().forEach((el) => el.remove()),
        ),
      );
      await room.disconnect();
    }
    setStatus("idle");
    setSpeakingIds([]);
    setLocalIdentity("");
    setIsMuted(false);
    setMicDenied(false);
    setAudioBlocked(false);
  }, []);

  const connect = useCallback(
    async (url: string, token: string) => {
      await disconnect();

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      roomRef.current = room;
      setStatus("connecting");

      room
        .on(RoomEvent.ActiveSpeakersChanged, (speakers) =>
          setSpeakingIds(speakers.map((s) => s.identity)),
        )
        .on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind !== Track.Kind.Audio) return;
          const el = track.attach(); // LiveKit builds the <audio> element for us
          el.style.display = "none";
          document.body.appendChild(el);
        })
        .on(RoomEvent.TrackUnsubscribed, (track) => {
          track.detach().forEach((el) => el.remove());
        })
        .on(RoomEvent.AudioPlaybackStatusChanged, () =>
          setAudioBlocked(!room.canPlaybackAudio),
        )
        .on(RoomEvent.DataReceived, (bytes, participant) => {
          try {
            const payload = JSON.parse(
              decoder.decode(bytes),
            ) as DataChannelPayload;
            onDataRef.current?.(
              payload,
              participant?.name || participant?.identity || "Teammate",
            );
          } catch {
            /* ignore malformed packets */
          }
        })
        .on(RoomEvent.Reconnecting, () => setStatus("connecting"))
        .on(RoomEvent.Reconnected, () => setStatus("connected"))
        .on(RoomEvent.Disconnected, () => {
          if (roomRef.current === room) setStatus("idle");
        });

      try {
        await room.connect(url, token);
      } catch (err) {
        if (roomRef.current === room) setStatus("failed");
        throw err;
      }

      setLocalIdentity(room.localParticipant.identity);
      setStatus("connected");
      setAudioBlocked(!room.canPlaybackAudio);

      try {
        await room.localParticipant.setMicrophoneEnabled(true);
        setIsMuted(false);
      } catch {
        // No permission or no device: stay in the room, listen-only.
        setMicDenied(true);
        setIsMuted(true);
      }
    },
    [disconnect],
  );

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const enable = isMuted;
    try {
      await room.localParticipant.setMicrophoneEnabled(enable);
      setIsMuted(!enable);
      if (enable) setMicDenied(false);
    } catch {
      setMicDenied(true);
    }
  }, [isMuted]);

  /** Browsers block audio until a click; call this from a button. */
  const enableAudio = useCallback(async () => {
    await roomRef.current?.startAudio();
    setAudioBlocked(false);
  }, []);

  const sendData = useCallback((payload: DataChannelPayload): boolean => {
    const room = roomRef.current;
    if (!room || room.state !== "connected") return false;
    room.localParticipant
      .publishData(encoder.encode(JSON.stringify(payload)), {
        reliable: true,
        topic: "lobby",
      })
      .catch(() => undefined);
    return true;
  }, []);

  // Leave cleanly if the page unmounts mid-lobby.
  useEffect(
    () => () => {
      roomRef.current?.disconnect();
      roomRef.current = null;
    },
    [],
  );

  return {
    status,
    speakingIds,
    localIdentity,
    isMuted,
    micDenied,
    audioBlocked,
    connect,
    disconnect,
    toggleMic,
    enableAudio,
    sendData,
  };
}
