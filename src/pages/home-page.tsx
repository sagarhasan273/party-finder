import { Crosshair } from "lucide-react";
import React, { useRef, useState, useEffect, useCallback } from "react";

import {
  Box,
  Chip,
  Alert,
  Stack,
  Button,
  Dialog,
  Snackbar,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useSocket } from "../contexts/socket-context";
import ConnectWithMe from "../components/connect-with-me";
import { LobbyChat } from "../sections/match-making/lobby-chat";
import { PartyCodeShare } from "../sections/match-making/party-code-share";
import { ConnectedPlayers } from "../sections/match-making/connected-players";
import {
  HistoryStats,
  type HistoryStatsData,
} from "../sections/match-making/history-stats";
import {
  VALORANT_RANKS,
  MatchSearchForm,
  VALORANT_REGIONS,
} from "../sections/match-making/match-search-form";

import type {
  Telemetry,
  MatchData,
  QueueState,
  ChatMessage,
  SearchRequest,
  DataChannelPayload,
} from "../types/type-common";

const SYSTEM_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "74d8e1bcc14d1fcb6eb152c3",
      credential: "ybp27pjQ9oRDsDcx",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "74d8e1bcc14d1fcb6eb152c3",
      credential: "ybp27pjQ9oRDsDcx",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "74d8e1bcc14d1fcb6eb152c3",
      credential: "ybp27pjQ9oRDsDcx",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "74d8e1bcc14d1fcb6eb152c3",
      credential: "ybp27pjQ9oRDsDcx",
    },
  ],
};

interface Vad {
  ctx: AudioContext;
  frame: number | null;
}

const now = (): string =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export function HomePage(): JSX.Element {
  const { emit, on, isConnected, socketId } = useSocket();

  const [username, setUsername] = useState<string>(
    `Agent#${Math.floor(1000 + Math.random() * 9000)}`,
  );
  const [region, setRegion] = useState<string>("AP");
  const [server, setServer] = useState<string>(VALORANT_REGIONS.AP[0]);
  const [myRank, setMyRank] = useState<string>("Gold 2");
  const [minRank, setMinRank] = useState<string>("Silver 1");
  const [maxRank, setMaxRank] = useState<string>("Platinum 3");
  const [groupSize, setGroupSize] = useState<number>(4);

  const [telemetry, setTelemetry] = useState<Telemetry>({
    onlinePlayers: 1,
    inQueueCount: 0,
  });
  const [queueState, setQueueState] = useState<QueueState>("idle");
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [receivedPartyCode, setReceivedPartyCode] = useState("");
  const [validationError, setValidationError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [peerLeftPopupOpen, setPeerLeftPopupOpen] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isLocalSpeaking, setIsLocalSpeaking] = useState(false);
  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false);

  // Add this new state for your history tracking
  const [historyStats, setHistoryStats] = useState<HistoryStatsData>({
    totalVisits: 0,
    searches: {},
  });

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Use a ref for the physical DOM element to bypass autoplay restrictions
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const vadRef = useRef<Vad[]>([]);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);

  // Create a tracking Promise to solve the WebRTC Answer race condition
  const mediaReadyPromiseRef = useRef<Promise<void> | null>(null);

  const flushPendingIce = async (pc: RTCPeerConnection): Promise<void> => {
    if (!pendingIceRef.current.length) return;
    const candidates = [...pendingIceRef.current];
    pendingIceRef.current = [];

    await Promise.allSettled(
      candidates.map(async (c) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        } catch (err) {
          console.warn("[WebRTC] Error adding buffered ICE candidate:", err);
        }
      }),
    );
  };

  const setupVAD = useCallback(
    (stream: MediaStream, isRemote: boolean): void => {
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new Ctx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const vad: Vad = { ctx, frame: null };
        const tick = (): void => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, v) => a + v, 0) / data.length;
          (isRemote ? setIsRemoteSpeaking : setIsLocalSpeaking)(avg > 22);
          vad.frame = requestAnimationFrame(tick);
        };
        tick();
        vadRef.current.push(vad);
      } catch (e) {
        console.warn("VAD error:", e);
      }
    },
    [],
  );

  const bindDataChannel = useCallback((dc: RTCDataChannel): void => {
    dcRef.current = dc;

    dc.onmessage = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as DataChannelPayload;
        if (payload.type === "CHAT") {
          setChatMessages((p) => [...p, payload.data]);
        } else if (payload.type === "PARTY_CODE") {
          setReceivedPartyCode(payload.data.partyCode);
        }
      } catch (e) {
        console.warn("Bad data channel message", e);
      }
    };
  }, []);

  const teardownWebRTC = useCallback((): void => {
    vadRef.current.forEach((v) => {
      if (v.frame !== null) cancelAnimationFrame(v.frame);
      if (v.ctx.state !== "closed") v.ctx.close().catch(() => undefined);
    });
    vadRef.current = [];

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
    }

    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    pendingIceRef.current = [];
    mediaReadyPromiseRef.current = null;
    setIsLocalSpeaking(false);
    setIsRemoteSpeaking(false);
  }, []);

  const getOrCreatePeerConnection = useCallback(
    (peerSocketId: string): RTCPeerConnection => {
      if (pcRef.current) return pcRef.current;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "failed") {
          setValidationError(
            "Voice channel connection failed. Verify TURN network access.",
          );
        }
      };

      pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
          emit("webrtc-ice-candidate", {
            targetSocketId: peerSocketId,
            candidate: e.candidate,
          });
        }
      };

      pc.ontrack = (e: RTCTrackEvent) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = e.streams[0];
          remoteAudioRef.current.play().catch((err) => {
            console.warn("[WebRTC] Autoplay prevented:", err);
          });
        }
        setupVAD(e.streams[0], true);
      };

      return pc;
    },
    [emit, setupVAD],
  );

  const initWebRTC = useCallback(
    async (isInitiator: boolean, peerSocketId: string): Promise<void> => {
      teardownWebRTC();

      const pc = getOrCreatePeerConnection(peerSocketId);

      // Track the async microphone fetch so we don't accidentally answer
      // an incoming offer before the mic track is added.
      mediaReadyPromiseRef.current = (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          localStreamRef.current = stream;
          stream.getTracks().forEach((t) => pc.addTrack(t, stream));
          setupVAD(stream, false);
        } catch {
          setValidationError(
            "Microphone permission denied. Voice comms are disabled.",
          );
        }
      })();

      // Wait until the mic is fully captured or denied
      await mediaReadyPromiseRef.current;

      if (isInitiator) {
        const dc = pc.createDataChannel("valorantComm", { ordered: true });
        bindDataChannel(dc);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        emit("webrtc-offer", { targetSocketId: peerSocketId, offer });
      } else {
        pc.ondatachannel = (e: RTCDataChannelEvent) => {
          bindDataChannel(e.channel);
        };
      }
    },
    [
      bindDataChannel,
      getOrCreatePeerConnection,
      emit,
      setupVAD,
      teardownWebRTC,
    ],
  );

  useEffect(() => {
    const unsubscribe = [
      on<Telemetry>("telemetry-update", setTelemetry),
      on<{ status: QueueState }>("queue-status", (d) =>
        setQueueState(d.status),
      ),
      on<{ message: string }>("error-msg", (d) => {
        setValidationError(d.message);
        setQueueState("idle");
      }),
      on<MatchData>("match-found", async (d) => {
        setMatchData(d);
        setQueueState("matched");
        setValidationError("");
        await initWebRTC(d.isInitiator, d.peerSocketId);
      }),

      on<{ senderSocketId: string; offer: RTCSessionDescriptionInit }>(
        "webrtc-offer",
        async ({ senderSocketId, offer }) => {
          let pc = pcRef.current;
          if (!pc) {
            pc = getOrCreatePeerConnection(senderSocketId);
          }

          try {
            // CRITICAL FIX: Ensure local mic has been added BEFORE answering
            if (mediaReadyPromiseRef.current) {
              await mediaReadyPromiseRef.current;
            }

            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            await flushPendingIce(pc);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            emit("webrtc-answer", { targetSocketId: senderSocketId, answer });
          } catch (err) {
            console.error("[WebRTC] Error handling offer:", err);
          }
        },
      ),

      on<{ answer: RTCSessionDescriptionInit }>(
        "webrtc-answer",
        async ({ answer }) => {
          const pc = pcRef.current;
          if (!pc) return;
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            await flushPendingIce(pc);
          } catch (err) {
            console.error("[WebRTC] Error handling answer:", err);
          }
        },
      ),

      on<{ senderSocketId: string; candidate: RTCIceCandidateInit }>(
        "webrtc-ice-candidate",
        async ({ candidate }) => {
          const pc = pcRef.current;
          if (!pc || !candidate) return;
          if (pc.remoteDescription && pc.remoteDescription.type) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.warn("[WebRTC] Error adding ICE candidate:", err);
            }
          } else {
            pendingIceRef.current.push(candidate);
          }
        },
      ),

      on<ChatMessage>("room-chat", (msg) => {
        setChatMessages((p) => [...p, msg]);
      }),

      on<HistoryStatsData>("history-stats", (data) => {
        setHistoryStats(data);
      }),

      on<{ partyCode: string }>("party-code-updated", ({ partyCode }) => {
        setReceivedPartyCode(partyCode);
      }),

      on("peer-left", () => {
        teardownWebRTC();
        setMatchData(null);
        setChatMessages([]);
        setReceivedPartyCode("");
        setQueueState("idle");
        setPeerLeftPopupOpen(true);
      }),
    ];

    return () => {
      unsubscribe.forEach((offFn) => offFn());
      teardownWebRTC();
    };
  }, [on, emit, initWebRTC, getOrCreatePeerConnection, teardownWebRTC]);

  const handleToggleMic = (): void => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  };

  const handleStartQueue = (): void => {
    if (VALORANT_RANKS.indexOf(minRank) > VALORANT_RANKS.indexOf(maxRank)) {
      setValidationError("Min rank cannot exceed max rank.");
      return;
    }
    setValidationError("");
    setQueueState("searching");
    const req: SearchRequest = {
      username,
      region,
      server,
      rank: myRank,
      minRank,
      maxRank,
      currentGroupSize: groupSize,
    };
    emit("start-search", req);
  };

  const handleCancelQueue = (): void => {
    emit("cancel-search");
    setQueueState("idle");
  };

  const sendPayload = (payload: DataChannelPayload): void => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      dcRef.current.send(JSON.stringify(payload));
      return;
    }

    if (matchData?.roomId) {
      if (payload.type === "CHAT") {
        emit("send-room-chat", {
          roomId: matchData.roomId,
          ...payload.data,
        });
      } else if (payload.type === "PARTY_CODE") {
        emit("send-party-code", {
          roomId: matchData.roomId,
          partyCode: payload.data.partyCode,
        });
      }
    }
  };

  const handleSendChatMessage = (text: string): void => {
    const msg: ChatMessage = {
      sender: username,
      message: text,
      timestamp: now(),
    };
    sendPayload({ type: "CHAT", data: msg });
    setChatMessages((p) => [...p, msg]);
  };

  const handleSendPartyCode = (partyCode: string): void => {
    sendPayload({ type: "PARTY_CODE", data: { partyCode } });
    setReceivedPartyCode(partyCode);
  };

  const handleLeaveLobby = (): void => {
    if (matchData) emit("leave-room", { roomId: matchData.roomId });
    teardownWebRTC();
    setMatchData(null);
    setQueueState("idle");
    setChatMessages([]);
    setReceivedPartyCode("");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 2, sm: 3 },
        fontFamily: SYSTEM_FONT,
      }}
    >
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4500}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="warning"
          sx={{
            width: "100%",
            bgcolor: "#1E293B",
            color: "#F0F3F6",
            border: "1px solid rgba(255, 70, 85, 0.5)",
            fontFamily: SYSTEM_FONT,
            fontSize: "0.85rem",
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={peerLeftPopupOpen}
        onClose={() => setPeerLeftPopupOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#17212B",
            border: "1px solid rgba(255, 70, 85, 0.4)",
            borderRadius: "8px",
            minWidth: { xs: "90vw", sm: "400px" },
          },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: SYSTEM_FONT, color: "#FF4655", fontWeight: 600 }}
        >
          Lobby Closed
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              color: "#F0F3F6",
              fontSize: "0.9rem",
            }}
          >
            Your teammate has left the lobby. You have been disconnected and
            returned to matchmaking.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => setPeerLeftPopupOpen(false)}
            sx={{
              fontFamily: SYSTEM_FONT,
              textTransform: "none",
              bgcolor: "#FF4655",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "#E03B49" },
            }}
          >
            Acknowledge
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2.5,
          pb: 1.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" alignItems="center" gap={1} sx={{ mr: 4 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "6px",
              background: "#FF4655",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Crosshair size={16} color="#fff" />
          </Box>
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              fontWeight: 700,
              fontSize: "1.15rem",
              letterSpacing: "-0.01em",
              color: "#ECE8E1",
              lineHeight: 1,
            }}
          >
            Valorant <span style={{ color: "#FF4655" }}>5</span>th Finder
          </Typography>
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            size="small"
            label={isConnected ? "Online" : "Connecting"}
            sx={{
              height: 22,
              bgcolor: isConnected
                ? "rgba(46, 213, 115, 0.12)"
                : "rgba(255, 70, 85, 0.12)",
              color: isConnected ? "#2ED573" : "#FF4655",
              border: `1px solid ${isConnected ? "rgba(46, 213, 115, 0.3)" : "rgba(255, 70, 85, 0.3)"}`,
              borderRadius: "4px",
              fontFamily: SYSTEM_FONT,
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              color: "#8E9AA8",
              fontSize: "0.78rem",
            }}
          >
            {username} {socketId && `(${socketId.slice(0, 5)})`}
          </Typography>
        </Box>
      </Box>

      {validationError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            py: 0.5,
            px: 1.5,
            fontSize: "0.8rem",
            fontFamily: SYSTEM_FONT,
            borderRadius: "6px",
            bgcolor: "rgba(255, 70, 85, 0.1)",
            border: "1px solid #FF4655",
            color: "#F0F3F6",
          }}
        >
          {validationError}
        </Alert>
      )}

      {queueState !== "matched" || !matchData ? (
        <MatchSearchForm
          username={username}
          setUsername={setUsername}
          region={region}
          setRegion={setRegion}
          server={server}
          setServer={setServer}
          myRank={myRank}
          setMyRank={setMyRank}
          minRank={minRank}
          setMinRank={setMinRank}
          maxRank={maxRank}
          setMaxRank={setMaxRank}
          groupSize={groupSize}
          setGroupSize={setGroupSize}
          telemetry={telemetry}
          queueState={queueState}
          isConnected={isConnected}
          onStartSearch={handleStartQueue}
          onCancelSearch={handleCancelQueue}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "grid", gap: 2, alignContent: "start" }}>
            <ConnectedPlayers
              matchData={matchData}
              region={region}
              server={server}
              username={username}
              isMuted={isMuted}
              isLocalSpeaking={isLocalSpeaking}
              isRemoteSpeaking={isRemoteSpeaking}
              onToggleMic={handleToggleMic}
              onLeaveLobby={handleLeaveLobby}
            />

            <PartyCodeShare
              receivedPartyCode={receivedPartyCode}
              onSendPartyCode={handleSendPartyCode}
            />
          </Box>

          <LobbyChat
            messages={chatMessages}
            onSendMessage={handleSendChatMessage}
          />
        </Box>
      )}

      <HistoryStats data={historyStats} />

      <ConnectWithMe />

      {/* Hidden Audio element for rendering WebRTC remote tracks correctly */}
      <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }}>
        <track kind="captions" />
      </audio>
    </Container>
  );
}
