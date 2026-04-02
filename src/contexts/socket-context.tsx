import type { Socket } from "socket.io-client";

import { io } from "socket.io-client";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";

import { useCredentials } from "src/core/slices";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocketContextValue {
  socketId: string | null;
  isConnected: boolean;
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener?: (...args: any[]) => void) => void;
  connect: () => void;
  disconnect: () => void;
  userId: string | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SocketContext = createContext<SocketContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface SocketProviderProps {
  url: string;
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  url,
  children,
}) => {
  const { user, isAuthenticated } = useCredentials();

  const socketRef = useRef<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

  const registrationSentRef = useRef<boolean>(false);
  const isConnectingRef = useRef<boolean>(false);

  const connect = useCallback(() => {
    // CRITICAL: Only connect if we have user ID
    if (!user?.id || !isAuthenticated) {
      console.log("Socket connection blocked: No user ID");
      return;
    }

    if (socketRef.current?.connected || isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;
    console.log("Establishing socket connection for user:", user.id);

    const socket = io(url, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      query: {
        userId: user.id,
        region: user?.region,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected for user:", user.id);
      setIsConnected(true);
      setSocketId(socket.id ?? null);
      isConnectingRef.current = false;
      registrationSentRef.current = false;

      // Register immediately after connection
      socket.emit("register", { userId: user.id });
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected for user:", user.id, reason);
      setIsConnected(false);
      setSocketId(null);
      setRegisteredUserId(null);
      registrationSentRef.current = false;
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error for user:", user.id, error);
      setIsConnected(false);
      isConnectingRef.current = false;
    });

    socket.on("registered", (data) => {
      console.log("User registered successfully:", data);
      if (data.success && data.userId) {
        setRegisteredUserId(data.userId);
        registrationSentRef.current = true;
      }
    });

    // Store cleanup handlers
    (socket as any).__userId = user.id;
  }, [url, user?.id, user?.region, isAuthenticated]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log("Disconnecting socket");
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setSocketId(null);
      setRegisteredUserId(null);
      registrationSentRef.current = false;
      isConnectingRef.current = false;
    }
  }, []);

  // Connect only when we have user.id and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const emit = useCallback(
    (event: string, ...args: any[]) => {
      if (!socketRef.current?.connected) {
        console.warn(
          `Socket not connected for user ${user?.id}, cannot emit: ${event}`,
        );
        return;
      }
      socketRef.current.emit(event, ...args);
    },
    [user?.id],
  );

  const on = useCallback(
    (event: string, listener: (...args: any[]) => void) => {
      socketRef.current?.on(event, listener);
    },
    [],
  );

  const off = useCallback(
    (event: string, listener?: (...args: any[]) => void) => {
      if (listener) {
        socketRef.current?.off(event, listener);
      } else {
        socketRef.current?.off(event);
      }
    },
    [],
  );

  const memoValue = useMemo(
    () => ({
      socketId,
      isConnected,
      emit,
      on,
      off,
      connect,
      disconnect,
      userId: registeredUserId,
    }),
    [
      socketId,
      isConnected,
      emit,
      on,
      off,
      connect,
      disconnect,
      registeredUserId,
    ],
  );

  return (
    <SocketContext.Provider value={memoValue}>
      {children}
    </SocketContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSocket = (): SocketContextValue => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside <SocketProvider>");
  return ctx;
};
