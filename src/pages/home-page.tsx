import type { SelectChangeEvent } from "@mui/material";

import React, { useRef, useState, useEffect, useCallback } from "react";

import {
  Mic,
  Send,
  Radar,
  MicOff,
  Groups,
  GraphicEq,
  ExitToApp,
  ContentCopy,
  CheckCircle,
  FiberManualRecord,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Alert,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
} from "@mui/material";

import { useSocket } from "../contexts/socket-context";
import ConnectWithMe from "../components/connect-with-me";

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
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
  ],
};

const VALORANT_REGIONS: Record<string, string[]> = {
  NA: [
    "Ashburn (Virginia)",
    "Atlanta (Georgia)",
    "Chicago (Illinois)",
    "Dallas (Texas)",
    "Portland (Oregon)",
    "San Jose (California)",
  ],
  EU: [
    "Frankfurt (Germany)",
    "Paris (France)",
    "London (United Kingdom)",
    "Warsaw (Poland)",
    "Stockholm (Sweden)",
    "Madrid (Spain)",
    "Istanbul (Turkey)",
    "Dubai (United Arab Emirates)",
    "Manama (Bahrain)",
    "Cape Town (South Africa)",
  ],
  AP: [
    "Singapore",
    "Hong Kong",
    "Tokyo (Japan)",
    "Mumbai (India)",
    "Sydney (Australia)",
    "Manila (Philippines)",
  ],
  LATAM: [
    "Mexico City (Mexico)",
    "Santiago (Chile)",
    "Miami (Florida, USA)",
    "Bogotá (Colombia)",
  ],
  BR: ["São Paulo"],
  KR: ["Seoul"],
};

const VALORANT_RANKS: string[] = [
  "Iron 1",
  "Iron 2",
  "Iron 3",
  "Bronze 1",
  "Bronze 2",
  "Bronze 3",
  "Silver 1",
  "Silver 2",
  "Silver 3",
  "Gold 1",
  "Gold 2",
  "Gold 3",
  "Platinum 1",
  "Platinum 2",
  "Platinum 3",
  "Diamond 1",
  "Diamond 2",
  "Diamond 3",
  "Ascendant 1",
  "Ascendant 2",
  "Ascendant 3",
  "Immortal 1",
  "Immortal 2",
  "Immortal 3",
  "Radiant",
];

interface Vad {
  ctx: AudioContext;
  frame: number | null;
}

interface RankSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const RankSelect = ({ label, value, onChange }: RankSelectProps) => (
  <FormControl fullWidth size="small">
    <InputLabel
      sx={{ color: "#8E9AA8", fontFamily: SYSTEM_FONT, fontSize: "0.8rem" }}
    >
      {label}
    </InputLabel>
    <Select
      value={value}
      label={label}
      onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
      sx={{
        bgcolor: "#141D26",
        color: "#F0F3F6",
        borderRadius: "6px",
        fontFamily: SYSTEM_FONT,
        fontSize: "0.82rem",
        "& .MuiSelect-select": { py: 1, px: 1.5 },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FF4655" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#FF4655",
        },
      }}
    >
      {VALORANT_RANKS.map((r) => (
        <MenuItem
          key={r}
          value={r}
          sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}
        >
          {r}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const now = (): string =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export function HomePage(): JSX.Element {
  const { emit, on, isConnected } = useSocket();

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
  const [messageInput, setMessageInput] = useState("");
  const [partyCodeInput, setPartyCodeInput] = useState("");
  const [receivedPartyCode, setReceivedPartyCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [isMuted, setIsMuted] = useState(false);
  const [isLocalSpeaking, setIsLocalSpeaking] = useState(false);
  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(new Audio());
  const vadRef = useRef<Vad[]>([]);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const flushPendingIce = async (pc: RTCPeerConnection): Promise<void> => {
    await Promise.all(
      pendingIceRef.current.map((c) =>
        pc.addIceCandidate(new RTCIceCandidate(c)),
      ),
    );
    pendingIceRef.current = [];
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
    dc.onmessage = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as DataChannelPayload;
        if (payload.type === "CHAT") {
          setChatMessages((p) => [...p, payload.data]);
          setTimeout(
            () => chatScrollRef.current?.scrollIntoView({ behavior: "smooth" }),
            40,
          );
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
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    dcRef.current?.close();
    dcRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    pendingIceRef.current = [];
    setIsLocalSpeaking(false);
    setIsRemoteSpeaking(false);
  }, []);

  const initWebRTC = useCallback(
    async (isInitiator: boolean, peerSocketId: string): Promise<void> => {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStreamRef.current = stream;
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        setupVAD(stream, false);
      } catch {
        setValidationError(
          "Microphone permission blocked. Enable mic access to join voice comms.",
        );
      }

      pc.ontrack = (e: RTCTrackEvent) => {
        remoteAudioRef.current.srcObject = e.streams[0];
        setupVAD(e.streams[0], true);
      };

      pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
          emit("webrtc-ice-candidate", {
            targetSocketId: peerSocketId,
            candidate: e.candidate,
          });
        }
      };

      if (isInitiator) {
        const dc = pc.createDataChannel("valorantComm");
        bindDataChannel(dc);
        dcRef.current = dc;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        emit("webrtc-offer", { targetSocketId: peerSocketId, offer });
      } else {
        pc.ondatachannel = (e: RTCDataChannelEvent) => {
          bindDataChannel(e.channel);
          dcRef.current = e.channel;
        };
      }
    },
    [bindDataChannel, setupVAD, emit],
  );

  useEffect(() => {
    remoteAudioRef.current.autoplay = true;

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
          const pc = pcRef.current;
          if (!pc) return;
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          await flushPendingIce(pc);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          emit("webrtc-answer", { targetSocketId: senderSocketId, answer });
        },
      ),
      on<{ answer: RTCSessionDescriptionInit }>(
        "webrtc-answer",
        async ({ answer }) => {
          const pc = pcRef.current;
          if (!pc) return;
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          await flushPendingIce(pc);
        },
      ),
      on<{ candidate: RTCIceCandidateInit }>(
        "webrtc-ice-candidate",
        async ({ candidate }) => {
          const pc = pcRef.current;
          if (!pc || !candidate) return;
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            pendingIceRef.current.push(candidate);
          }
        },
      ),
      on("peer-left", () => {
        setChatMessages((p) => [
          ...p,
          {
            sender: "System",
            message: "Your teammate left the lobby.",
            timestamp: now(),
          },
        ]);
        teardownWebRTC();
      }),
    ];

    return () => {
      unsubscribe.forEach((off) => off());
      teardownWebRTC();
    };
  }, [on, emit, initWebRTC, teardownWebRTC]);

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

  const sendOverChannel = (payload: DataChannelPayload): void => {
    if (dcRef.current?.readyState === "open") {
      dcRef.current.send(JSON.stringify(payload));
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const msg: ChatMessage = {
      sender: username,
      message: messageInput.trim(),
      timestamp: now(),
    };
    sendOverChannel({ type: "CHAT", data: msg });
    setChatMessages((p) => [...p, msg]);
    setMessageInput("");
    setTimeout(
      () => chatScrollRef.current?.scrollIntoView({ behavior: "smooth" }),
      40,
    );
  };

  const handleBroadcastPartyCode = (): void => {
    if (!partyCodeInput.trim()) return;
    const partyCode = partyCodeInput.trim().toUpperCase();
    sendOverChannel({ type: "PARTY_CODE", data: { partyCode } });
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

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      /* clipboard write rejected */
    }
  };

  const needed = 5 - groupSize;

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 2, sm: 3 },
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* ── Top Header ── */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: "#FF4655",
              borderRadius: "2px",
            }}
          />
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              fontWeight: 700,
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              color: "#F0F3F6",
              m: 0,
              lineHeight: 1,
            }}
          >
            Valorant 5th Finder
          </Typography>
        </Box>

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
            {username}
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

      {/* ── Main Workspace ── */}
      {queueState !== "matched" || !matchData ? (
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: "#17212B",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Typography
            sx={{
              fontFamily: SYSTEM_FONT,
              fontWeight: 600,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              color: "#F0F3F6",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 0.8,
            }}
          >
            <Radar sx={{ color: "#FF4655", fontSize: 18 }} /> Find Teammates
          </Typography>

          {/* Form Fields */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Riot ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{
                sx: {
                  color: "#8E9AA8",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.8rem",
                },
              }}
              sx={{
                bgcolor: "#141D26",
                "& .MuiOutlinedInput-root": {
                  color: "#F0F3F6",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontFamily: SYSTEM_FONT,
                  "& input": { py: 1, px: 1.5 },
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&:hover fieldset": { borderColor: "#FF4655" },
                  "&.Mui-focused fieldset": { borderColor: "#FF4655" },
                },
              }}
            />

            <FormControl fullWidth size="small">
              <InputLabel
                sx={{
                  color: "#8E9AA8",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.8rem",
                }}
              >
                Region
              </InputLabel>
              <Select
                value={region}
                label="Region"
                onChange={(e: SelectChangeEvent) => {
                  setRegion(e.target.value);
                  setServer(VALORANT_REGIONS[e.target.value][0]);
                }}
                sx={{
                  bgcolor: "#141D26",
                  color: "#F0F3F6",
                  borderRadius: "6px",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.82rem",
                  "& .MuiSelect-select": { py: 1, px: 1.5 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4655",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4655",
                  },
                }}
              >
                {Object.keys(VALORANT_REGIONS).map((r) => (
                  <MenuItem
                    key={r}
                    value={r}
                    sx={{
                      fontFamily: SYSTEM_FONT,
                      fontSize: "0.82rem",
                      py: 0.8,
                    }}
                  >
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel
                sx={{
                  color: "#8E9AA8",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.8rem",
                }}
              >
                Server
              </InputLabel>
              <Select
                value={server}
                label="Server"
                onChange={(e: SelectChangeEvent) => setServer(e.target.value)}
                sx={{
                  bgcolor: "#141D26",
                  color: "#F0F3F6",
                  borderRadius: "6px",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.82rem",
                  "& .MuiSelect-select": { py: 1, px: 1.5 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4655",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4655",
                  },
                }}
              >
                {VALORANT_REGIONS[region].map((s) => (
                  <MenuItem
                    key={s}
                    value={s}
                    sx={{
                      fontFamily: SYSTEM_FONT,
                      fontSize: "0.82rem",
                      py: 0.8,
                    }}
                  >
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel
                sx={{
                  color: "#8E9AA8",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.8rem",
                }}
              >
                Current Party Size
              </InputLabel>
              <Select
                value={String(groupSize)}
                label="Current Party Size"
                onChange={(e: SelectChangeEvent) =>
                  setGroupSize(Number(e.target.value))
                }
                sx={{
                  bgcolor: "#141D26",
                  color: "#F0F3F6",
                  borderRadius: "6px",
                  fontFamily: SYSTEM_FONT,
                  fontSize: "0.82rem",
                  "& .MuiSelect-select": { py: 1, px: 1.5 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4655",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF4655",
                  },
                }}
              >
                <MenuItem
                  value="4"
                  sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}
                >
                  4 players (need 1 solo)
                </MenuItem>
                <MenuItem
                  value="3"
                  sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}
                >
                  3 players (need 2 players)
                </MenuItem>
                <MenuItem
                  value="2"
                  sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}
                >
                  2 players (need 3 players)
                </MenuItem>
                <MenuItem
                  value="1"
                  sx={{ fontFamily: SYSTEM_FONT, fontSize: "0.82rem", py: 0.8 }}
                >
                  Solo (need 4 players)
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Ranks Row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 1.5,
              mt: 1.5,
            }}
          >
            <RankSelect label="Your Rank" value={myRank} onChange={setMyRank} />
            <RankSelect
              label="Min Rank"
              value={minRank}
              onChange={setMinRank}
            />
            <RankSelect
              label="Max Rank"
              value={maxRank}
              onChange={setMaxRank}
            />
          </Box>

          {/* Live Telemetry Display */}
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: "#141D26",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <FiberManualRecord sx={{ color: "#2ED573", fontSize: 9 }} />
                <Typography
                  sx={{
                    fontFamily: SYSTEM_FONT,
                    color: "#F0F3F6",
                    fontSize: "0.78rem",
                  }}
                >
                  Online: <strong>{telemetry.onlinePlayers}</strong>
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Groups sx={{ color: "#FF4655", fontSize: 16 }} />
                <Typography
                  sx={{
                    fontFamily: SYSTEM_FONT,
                    color: "#F0F3F6",
                    fontSize: "0.78rem",
                  }}
                >
                  In Queue: <strong>{telemetry.inQueueCount}</strong>
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                color: "#8E9AA8",
                fontFamily: SYSTEM_FONT,
                fontSize: "0.75rem",
              }}
            >
              Searching for {needed} player{needed > 1 ? "s" : ""}
            </Typography>
          </Box>

          {/* Search Trigger */}
          <Box sx={{ mt: 2 }}>
            {queueState === "searching" ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 2.5,
                  px: 1.5,
                  borderRadius: "6px",
                  border: "1px dashed rgba(255, 70, 85, 0.4)",
                  bgcolor: "rgba(255, 70, 85, 0.04)",
                }}
              >
                <Radar sx={{ fontSize: 28, color: "#FF4655", mb: 0.5 }} />
                <Typography
                  sx={{
                    fontFamily: SYSTEM_FONT,
                    fontWeight: 600,
                    fontSize: { xs: "0.88rem", sm: "0.95rem" },
                    color: "#FF4655",
                  }}
                >
                  Searching {server} for {needed} teammate
                  {needed > 1 ? "s" : ""}...
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCancelQueue}
                  sx={{
                    mt: 1.5,
                    fontSize: "0.75rem",
                    fontFamily: SYSTEM_FONT,
                    textTransform: "none",
                    py: 0.4,
                    px: 2,
                    color: "#F0F3F6",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#FF4655",
                      bgcolor: "rgba(255, 70, 85, 0.08)",
                    },
                  }}
                >
                  Cancel search
                </Button>
              </Box>
            ) : (
              <Button
                fullWidth
                size="medium"
                variant="contained"
                disabled={!isConnected}
                onClick={handleStartQueue}
                sx={{
                  py: 1,
                  fontSize: "0.88rem",
                  fontFamily: SYSTEM_FONT,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "#FF4655",
                  color: "#FFFFFF",
                  borderRadius: "6px",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#E03B49", boxShadow: "none" },
                }}
              >
                Find Team ({groupSize}/5)
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        /* ── Tactical Room Link (Match Found) ── */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "grid", gap: 2, alignContent: "start" }}>
            {/* Operator Voice Comms Box */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                bgcolor: "#17212B",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                  pb: 1,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  gap: 1,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: SYSTEM_FONT,
                      color: "#2ED573",
                      fontWeight: 700,
                      fontSize: { xs: "0.95rem", sm: "1.05rem" },
                      m: 0,
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Room {matchData.roomId}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#8E9AA8",
                      fontFamily: SYSTEM_FONT,
                      fontSize: "0.72rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {region} · {server}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleToggleMic}
                    sx={{
                      p: 0.7,
                      borderRadius: "6px",
                      bgcolor: isMuted
                        ? "rgba(255, 70, 85, 0.15)"
                        : "rgba(46, 213, 115, 0.15)",
                      border: `1px solid ${isMuted ? "rgba(255, 70, 85, 0.4)" : "rgba(46, 213, 115, 0.4)"}`,
                    }}
                  >
                    {isMuted ? (
                      <MicOff sx={{ color: "#FF4655", fontSize: 16 }} />
                    ) : (
                      <Mic sx={{ color: "#2ED573", fontSize: 16 }} />
                    )}
                  </IconButton>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleLeaveLobby}
                    startIcon={<ExitToApp sx={{ fontSize: 15 }} />}
                    sx={{
                      px: 1.4,
                      py: 0.5,
                      fontSize: "0.75rem",
                      fontFamily: SYSTEM_FONT,
                      fontWeight: 600,
                      textTransform: "none",
                      bgcolor: "#FF4655",
                      color: "#FFFFFF",
                      borderRadius: "6px",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#E03B49", boxShadow: "none" },
                    }}
                  >
                    Leave
                  </Button>
                </Box>
              </Box>

              {/* Roster Cards */}
              <Typography
                sx={{
                  fontFamily: SYSTEM_FONT,
                  color: "#8E9AA8",
                  fontSize: "0.75rem",
                }}
              >
                Connected Players
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.2,
                  mt: 0.8,
                }}
              >
                {matchData.participants.map((p) => {
                  const isSelf = p.username === username;
                  const speaking = isSelf ? isLocalSpeaking : isRemoteSpeaking;
                  return (
                    <Box
                      key={p.username}
                      sx={{
                        p: 1.5,
                        bgcolor: "#141D26",
                        border: `1px solid ${speaking ? "#2ED573" : "rgba(255, 255, 255, 0.06)"}`,
                        borderRadius: "6px",
                        position: "relative",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: SYSTEM_FONT,
                            fontWeight: 600,
                            color: "#F0F3F6",
                            fontSize: "0.82rem",
                          }}
                        >
                          {p.username} {isSelf && "(You)"}
                        </Typography>
                        {speaking ? (
                          <GraphicEq sx={{ color: "#2ED573", fontSize: 15 }} />
                        ) : (
                          <Typography
                            sx={{
                              color: "#8E9AA8",
                              fontFamily: SYSTEM_FONT,
                              fontSize: "0.68rem",
                            }}
                          >
                            Idle
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: SYSTEM_FONT,
                          color: "#FF4655",
                          fontWeight: 600,
                          fontSize: "0.78rem",
                          mt: 0.2,
                        }}
                      >
                        {p.rank}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: SYSTEM_FONT,
                          color: "#8E9AA8",
                          fontSize: "0.7rem",
                        }}
                      >
                        Has {p.currentGroupSize} player
                        {p.currentGroupSize > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Direct Party Code Box */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                bgcolor: "#17212B",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: SYSTEM_FONT,
                  fontWeight: 600,
                  fontSize: { xs: "0.92rem", sm: "1rem" },
                  color: "#F0F3F6",
                  mb: 0.5,
                }}
              >
                Share Party Code
              </Typography>
              <Typography
                sx={{
                  fontFamily: SYSTEM_FONT,
                  color: "#8E9AA8",
                  fontSize: "0.75rem",
                  mb: 1.5,
                }}
              >
                Talk over voice first, then share your in-game invite code.
              </Typography>

              {receivedPartyCode && (
                <Alert
                  severity="success"
                  icon={<CheckCircle sx={{ color: "#2ED573", fontSize: 16 }} />}
                  sx={{
                    mb: 1.5,
                    py: 0.4,
                    px: 1.2,
                    fontSize: "0.78rem",
                    fontFamily: SYSTEM_FONT,
                    borderRadius: "6px",
                    bgcolor: "rgba(46, 213, 115, 0.1)",
                    border: "1px solid rgba(46, 213, 115, 0.3)",
                    color: "#F0F3F6",
                    "& .MuiAlert-message": { py: 0.2 },
                  }}
                  action={
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(receivedPartyCode)}
                    >
                      <ContentCopy
                        sx={{
                          color: isCopied ? "#2ED573" : "#8E9AA8",
                          fontSize: 14,
                        }}
                      />
                    </IconButton>
                  }
                >
                  Party Code: <strong>{receivedPartyCode}</strong>
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Paste party code (#TAG)"
                  value={partyCodeInput}
                  onChange={(e) => setPartyCodeInput(e.target.value)}
                  sx={{
                    bgcolor: "#141D26",
                    "& .MuiOutlinedInput-root": {
                      color: "#F0F3F6",
                      borderRadius: "6px",
                      fontFamily: SYSTEM_FONT,
                      fontSize: "0.82rem",
                      "& input": { py: 0.8, px: 1.2 },
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleBroadcastPartyCode}
                  sx={{
                    px: 2,
                    py: 0.8,
                    fontSize: "0.78rem",
                    fontFamily: SYSTEM_FONT,
                    textTransform: "none",
                    bgcolor: "#2ED573",
                    color: "#0E151D",
                    fontWeight: 600,
                    borderRadius: "6px",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#26AF5F", boxShadow: "none" },
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Text Chat */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              bgcolor: "#17212B",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              minHeight: 280,
            }}
          >
            <Typography
              sx={{
                fontFamily: SYSTEM_FONT,
                fontWeight: 600,
                fontSize: { xs: "0.92rem", sm: "1rem" },
                color: "#F0F3F6",
                mb: 1,
              }}
            >
              Lobby Chat
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                minHeight: 180,
                maxHeight: { xs: 220, md: 360 },
                overflowY: "auto",
                bgcolor: "#141D26",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "6px",
                p: 1.2,
                mb: 1.5,
              }}
            >
              {chatMessages.length === 0 && (
                <Typography
                  sx={{
                    color: "#8E9AA8",
                    fontFamily: SYSTEM_FONT,
                    fontSize: "0.75rem",
                  }}
                >
                  Say hello. Messages go straight to your teammate.
                </Typography>
              )}
              {chatMessages.map((m, i) => (
                <Box key={i} sx={{ py: 0.4 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{
                        color: m.sender === "System" ? "#FF4655" : "#2ED573",
                        fontWeight: 600,
                        fontFamily: SYSTEM_FONT,
                        fontSize: "0.72rem",
                      }}
                    >
                      {m.sender}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#8E9AA8",
                        fontFamily: SYSTEM_FONT,
                        fontSize: "0.65rem",
                      }}
                    >
                      {m.timestamp}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: "#F0F3F6",
                      wordBreak: "break-word",
                      mt: 0.1,
                      fontSize: "0.78rem",
                    }}
                  >
                    {m.message}
                  </Typography>
                </Box>
              ))}
              <div ref={chatScrollRef} />
            </Box>

            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{ display: "flex", gap: 0.8 }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                sx={{
                  bgcolor: "#141D26",
                  "& .MuiOutlinedInput-root": {
                    color: "#F0F3F6",
                    borderRadius: "6px",
                    fontFamily: SYSTEM_FONT,
                    fontSize: "0.82rem",
                    "& input": { py: 0.8, px: 1.2 },
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  },
                }}
              />
              <IconButton
                type="submit"
                size="small"
                sx={{
                  p: 0.9,
                  bgcolor: "rgba(255, 70, 85, 0.15)",
                  color: "#FF4655",
                  borderRadius: "6px",
                  "&:hover": { bgcolor: "rgba(255, 70, 85, 0.25)" },
                }}
              >
                <Send sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* ── Footer Dossier & Viral Share ── */}
      <ConnectWithMe />
    </Container>
  );
}
