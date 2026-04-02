import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { theme } from "./theme";
import { AppRouter } from "./router";
import { store } from "./core/store";
import { CONFIG } from "./config-global";
import { SocketProvider } from "./contexts/socket-context";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={CONFIG.googleAuthClientId}>
      <Provider store={store}>
        <SocketProvider url={CONFIG.serverUrl}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppRouter />

            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  border: "1px solid rgba(255, 255, 255, 0.94)",
                  color: "#ffffff",
                  background: "rgba(13, 15, 26, 0.95)",
                  borderRadius: "4px",
                  backdropFilter: "blur(10px)",
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 600,
                  fontSize: "0.90rem",
                  padding: "16px 16px",
                },
              }}
            />
          </ThemeProvider>
        </SocketProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}
