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

import { CONFIG } from "../config-global";
import { useCredentials } from "../store/slices";

interface SocketContextValue {
  isConnected: boolean;
  socketId: string | undefined;
  emit: (event: string, payload?: unknown) => void;
  /** Subscribes and returns the unsubscribe function. */
  on: <T = unknown>(event: string, handler: (data: T) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useCredentials();
  // useCredentials() returns a new `logout` whenever user state changes; a ref
  // keeps the socket from reconnecting every time that happens.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string>();

  // One socket for the lifetime of the provider; it only connects once we have a token.
  const [socket] = useState<Socket>(() =>
    io(`${CONFIG.serverUrl}/val5th`, { autoConnect: false, transports: ["websocket", "polling"] }),
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

  const emit = useCallback((event: string, payload?: unknown) => {
    socket.emit(event, payload);
  }, [socket]);

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

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextValue => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside <SocketProvider>");
  return ctx;
};
