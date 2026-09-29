import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";

import { Box } from "@mui/material";

import { HomePage } from "../pages/home-page";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
