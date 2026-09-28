export type ResponseSuccess = {
  status: boolean;
  message: string;
  data: any;
  metaData?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
export type ResponseError = {
  status: boolean;
  message: string;
  data?: any;
};

export type ResponseType = ResponseSuccess | ResponseError;

export type QueueState = "idle" | "searching" | "matched";

export interface Telemetry {
  onlinePlayers: number;
  inQueueCount: number;
}

export interface Participant {
  username: string;
  rank: string;
  currentGroupSize: number;
}

export interface MatchData {
  roomId: string;
  isInitiator: boolean;
  peerSocketId: string;
  participants: Participant[];
}

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

export type DataChannelPayload =
  | { type: "CHAT"; data: ChatMessage }
  | { type: "PARTY_CODE"; data: { partyCode: string } };

export interface SearchRequest {
  username: string;
  region: string;
  server: string;
  rank: string;
  minRank: string;
  maxRank: string;
  currentGroupSize: number;
}
