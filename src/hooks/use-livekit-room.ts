import { Room, Track, RoomEvent } from "livekit-client";
import { useRef, useState, useEffect, useCallback } from "react";

import type { DataChannelPayload } from "../types/type-common";

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
