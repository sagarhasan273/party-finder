import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";

import { Box } from "@mui/material";

import { MyLobbyPage } from "src/pages/my-lobby-page";
import { LobbyJoinRequested } from "src/pages/lobby-join-requested";

import { Navbar } from "src/components/Navbar";

import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/profile-page";
import { CreateLobbyPage } from "../pages/CreateLobbyPage";

export function AppRouter() {
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
            <Route path="/applied-lobbies" element={<LobbyJoinRequested />} />
            <Route path="/my-lobby" element={<MyLobbyPage />} />
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
