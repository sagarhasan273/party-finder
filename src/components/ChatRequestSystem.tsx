import { AnimatePresence } from "framer-motion";

import { ChatWindow } from "./ChatWindow";
import { ChatRequestTray } from "./ChatRequestTray";
import { ChatInboxButton } from "./ChatInboxButton";
import { ChatRequestDrawer } from "./ChatRequestDrawer";

import type { UseChatRequestsReturn } from "../hooks/use-chat-requests";

const ME_ID = "me";

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
  // Chat windows
  activeChats,
  closeChat,
  toggleMinimizeChat,
  sendMessage,
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

      {/* 2. Persistent inbox button */}
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

      {/* 4. LinkedIn-style bottom chat windows */}
      <AnimatePresence>
        {activeChats.map((chat, idx) => (
          <ChatWindow
            key={chat.id}
            chat={chat}
            currentUserId={ME_ID}
            onClose={closeChat}
            onToggleMinimize={toggleMinimizeChat}
            onSendMessage={sendMessage}
            index={idx}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
