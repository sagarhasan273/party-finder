import { useState } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";

import { Box } from "@mui/material";

import { HomePage } from "../pages/home-page";
import { Navbar } from "../components/Navbar";
import { SocialPage } from "../pages/social-page";
import { ProfilePage } from "../pages/profile-page";
import { FriendsPage } from "../pages/friends-page";
import { MyLobbyPage } from "../pages/my-lobby-page";
import { CreateLobbyPage } from "../pages/create-lobby-page";
import { LobbyJoinRequested } from "../pages/lobby-join-requested";
import { ChatDrawer, ChatMinimizedButton } from "../pages/chat-drawer";

export function AppRouter() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);

  const handleOpenChat = () => {
    setChatMinimized(false);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setChatMinimized(false);
  };

  return (
    <BrowserRouter>
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Navbar />
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={<CreateLobbyPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/applied-lobbies" element={<LobbyJoinRequested />} />
            <Route path="/my-lobby" element={<MyLobbyPage />} />
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
      {/* Chat Drawer */}
      <ChatDrawer open={chatOpen} onClose={handleCloseChat} />

      {/* Minimized Chat Button */}
      {(chatMinimized || !chatOpen) && (
        <ChatMinimizedButton onClick={handleOpenChat} />
      )}
    </BrowserRouter>
  );
}
