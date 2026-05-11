import { useRef, useState, useEffect, useCallback } from "react";

import type { ChatRequest } from "../types/type-social";

const TRAY_AUTO_DISMISS_MS = 5000;

export interface UseChatRequestsReturn {
  requests: ChatRequest[];
  // Tray
  trayVisible: boolean;
  trayRequest: ChatRequest | null;
  dismissTray: () => void;
  // Drawer
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  // Button badge
  showInboxButton: boolean;
  pendingCount: number;
  // Actions
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  // Simulate incoming (dev / socket bridge)
  pushRequest: (req: ChatRequest) => void;
}

export function useChatRequests(
  initial: ChatRequest[] = [],
): UseChatRequestsReturn {
  const [requests, setRequests] = useState<ChatRequest[]>(initial);
  const [trayVisible, setTrayVisible] = useState(false);
  const [trayRequest, setTrayRequest] = useState<ChatRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showInboxButton, setShowInboxButton] = useState(false);

  const trayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // Show tray for the most recent pending request when requests change
  useEffect(() => {
    const pending = requests.filter((r) => r.status === "pending");
    if (pending.length === 0) {
      setTrayVisible(false);
      setTrayRequest(null);
      return undefined;
    }

    const latest = pending[pending.length - 1];
    setTrayRequest(latest);
    setTrayVisible(true);

    // Auto-dismiss after 5 s
    if (trayTimerRef.current) clearTimeout(trayTimerRef.current);
    trayTimerRef.current = setTimeout(() => {
      setTrayVisible(false);
      setShowInboxButton(true);
    }, TRAY_AUTO_DISMISS_MS);

    return () => {
      if (trayTimerRef.current) clearTimeout(trayTimerRef.current);
    };
  }, [requests]);

  const dismissTray = useCallback(() => {
    setTrayVisible(false);
    setShowInboxButton(true);
    if (trayTimerRef.current) clearTimeout(trayTimerRef.current);
  }, []);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    setTrayVisible(false);
    if (trayTimerRef.current) clearTimeout(trayTimerRef.current);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    // Keep inbox button visible while there are pending requests
    if (pendingCount > 0) setShowInboxButton(true);
    else setShowInboxButton(false);
  }, [pendingCount]);

  const acceptRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)),
    );
  }, []);

  const rejectRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
  }, []);

  const pushRequest = useCallback((req: ChatRequest) => {
    setRequests((prev) => [...prev, req]);
  }, []);

  return {
    requests,
    trayVisible,
    trayRequest,
    dismissTray,
    drawerOpen,
    openDrawer,
    closeDrawer,
    showInboxButton,
    pendingCount,
    acceptRequest,
    rejectRequest,
    pushRequest,
  };
}
