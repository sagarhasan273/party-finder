import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AppRouter } from "./router";
import { store } from "./core/store";
import { CONFIG } from "./config-global";
import { ThemeProvider } from "./theme/theme-provider";
import { SocketProvider } from "./contexts/socket-context";
import { defaultSettings, SettingsProvider } from "./components/settings";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={CONFIG.googleAuthClientId}>
      <SettingsProvider settings={defaultSettings}>
        <ThemeProvider>
          <Provider store={store}>
            <SocketProvider url={CONFIG.serverUrl}>
              <AppRouter />
            </SocketProvider>
          </Provider>
        </ThemeProvider>
      </SettingsProvider>
    </GoogleOAuthProvider>
  );
}
