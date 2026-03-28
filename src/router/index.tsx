import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { HomePage } from '../pages/HomePage';
import { CreateLobbyPage } from '../pages/CreateLobbyPage';
import { MyLobbiesPage } from '../pages/MyLobbiesPage';
import { Box } from '@mui/material';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateLobbyPage />} />
            <Route path="/my-lobbies" element={<MyLobbiesPage />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
