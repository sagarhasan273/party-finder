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
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#1c2030",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e8ecf0",
                  fontFamily: '"DM Sans", sans-serif',
                },
              }}
            />
          </ThemeProvider>
        </SocketProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}
