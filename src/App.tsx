import { Provider as ReduxProvider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import {
  Box,
  CssBaseline,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";

import { store } from "./core/store";
import { CONFIG } from "./config-global";
import { gameTheme } from "./theme/theme";
import { HomePage } from "./pages/home-page";
import { LoginPage } from "./pages/login-page";
import { useCredentials } from "./store/slices";
import { SocketProvider } from "./contexts/socket-context";
import { useSessionBootstrap } from "./hooks/use-session-bootstrap";

function AuthGate() {
  const ready = useSessionBootstrap();
  const { isAuthenticated } = useCredentials();

  if (!ready) {
    return (
      <Box sx={{ minHeight: "100svh", display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Loading" />
      </Box>
    );
  }

  return isAuthenticated ? (
    <SocketProvider>
      <HomePage />
    </SocketProvider>
  ) : (
    <LoginPage />
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <GoogleOAuthProvider clientId={CONFIG.googleAuthClientId}>
        <ThemeProvider theme={gameTheme}>
          <CssBaseline />
          <AuthGate />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ReduxProvider>
  );
}
