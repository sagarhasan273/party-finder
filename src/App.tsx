// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, GlobalStyles } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { LobbyProvider } from './contexts/LobbyContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthScreen } from './components/AuthScreen';
import { Layout } from './components/Layout';
import { LobbiesPage } from './pages/LobbiesPage';
import { CreateLobbyPage } from './pages/CreateLobbyPage';
import { PlayersPage } from './pages/PlayersPage';
import { FriendsPage } from './pages/FriendsPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('val5th_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('val5th_token', 'demo_token');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('val5th_token');
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.8)' },
        },
        '@keyframes slideUp': {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 }
        },
        '@keyframes slideDown': {
          from: { transform: 'translateY(0)', opacity: 1 },
          to: { transform: 'translateY(20px)', opacity: 0 }
        },
        '.pulse-animation': {
          animation: 'pulse 2s infinite'
        }
      }} />
      <ToastProvider>
        <AuthProvider onLogout={handleLogout}>
          <LobbyProvider>
            <BrowserRouter>
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Navigate to="/lobbies" replace />} />
                  <Route path="/lobbies" element={<LobbiesPage />} />
                  <Route path="/create" element={<CreateLobbyPage />} />
                  <Route path="/players" element={<PlayersPage />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </LobbyProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;