export interface ResponseType {
  status: boolean;
  data?: unknown;
  message?: string;
  [key: string]: unknown;
}
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
