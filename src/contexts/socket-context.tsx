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

interface SocketContextValue {
  socket: Socket;
  socketId: string | null;
  isConnected: boolean;
  emit: (event: string, ...args: any[]) => void;
  on: <T = any>(event: string, listener: (payload: T) => void) => () => void;
  off: (event: string, listener?: (...args: any[]) => void) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

interface SocketProviderProps {
  url: string;
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  url,
  children,
}) => {
  const socket = useMemo<Socket>(
    () =>
      io(url, {
        autoConnect: false,
        transports: ["websocket", "polling"],
      }),
    [url],
  );

  const [socketId, setSocketId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const disconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (disconnectTimerRef.current) {
      clearTimeout(disconnectTimerRef.current);
      disconnectTimerRef.current = null;
    }

    const handleConnect = (): void => {
      setIsConnected(true);
      setSocketId(socket.id ?? null);
    };

    const handleDisconnect = (): void => {
      setIsConnected(false);
      setSocketId(null);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      disconnectTimerRef.current = setTimeout(() => {
        socket.disconnect();
      }, 0);
    };
  }, [socket]);

  const emit = useCallback(
    (event: string, ...args: any[]) => {
      if (!socket.connected) {
        console.warn(`[Socket] Not connected. Dropped event: ${event}`);
        return;
      }
      socket.emit(event, ...args);
    },
    [socket],
  );

  const on = useCallback(
    <T = any,>(event: string, listener: (payload: T) => void) => {
      const fn = listener as (...args: any[]) => void;
      socket.on(event, fn);
      return () => {
        socket.off(event, fn);
      };
    },
    [socket],
  );

  const off = useCallback(
    (event: string, listener?: (...args: any[]) => void) => {
      if (listener) {
        socket.off(event, listener);
      } else {
        socket.off(event);
      }
    },
    [socket],
  );

  const value = useMemo(
    () => ({ socket, socketId, isConnected, emit, on, off }),
    [socket, socketId, isConnected, emit, on, off],
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
