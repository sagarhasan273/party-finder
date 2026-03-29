import { Route, Routes, BrowserRouter } from "react-router-dom";

import { Box } from "@mui/material";

import { MyLobbyPage } from "src/pages/MyLobbyPage";

import { HomePage } from "../pages/HomePage";
import { Navbar } from "../components/Navbar";
import { ProfilePage } from "../pages/ProfilePage";
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
            <Route path="/my-lobby" element={<MyLobbyPage />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
