import { ChatRequestTray } from "./ChatRequestTray";
import { ChatInboxButton } from "./ChatInboxButton";
import { ChatRequestDrawer } from "./ChatRequestDrawer";
import type { UseChatRequestsReturn } from "../hooks/use-chat-requests";

/**
 * Drop this once anywhere in your app tree (e.g. in App.tsx or layout).
 * Pass the return value of `useChatRequests()` straight in.
 *
 * <ChatRequestSystem {...chatRequestState} />
 */
export function ChatRequestSystem({
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
}: UseChatRequestsReturn) {
  return (
    <>
      {/* 1. Floating tray — auto-dismisses after 5 s */}
      <ChatRequestTray
        request={trayRequest}
        visible={trayVisible}
        onAccept={acceptRequest}
        onReject={rejectRequest}
        onDismiss={dismissTray}
        onViewAll={openDrawer}
        pendingCount={pendingCount}
      />

      {/* 2. Persistent inbox button — appears after tray dismisses */}
      <ChatInboxButton
        visible={showInboxButton && !drawerOpen}
        count={pendingCount}
        onClick={openDrawer}
      />

      {/* 3. Full drawer */}
      <ChatRequestDrawer
        open={drawerOpen}
        requests={requests}
        onClose={closeDrawer}
        onAccept={acceptRequest}
        onReject={rejectRequest}
      />
    </>
  );
}
