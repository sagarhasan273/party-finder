/**
 * App.tsx: providers, the sign-in page, Google login and session restore.
 *
 *   useSessionBootstrap   restores the session on reload (cached user + JWT)
 *   GoogleSignIn          the button; posts the Google access token to /auth/google
 *   LoginPage             what signed-out users see
 *   AuthGate              signed in -> socket + HomePage, signed out -> LoginPage
 */
import type { Theme, SxProps } from "@mui/material/styles";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import {
  Box,
  Alert,
  Button,
  SvgIcon,
  Typography,
  CssBaseline,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";

import { store } from "./core/store";
import { CONFIG } from "./config-global";
import { HomePage } from "./pages/home-page";
import { useCredentials } from "./core/slices";
import { tokens, gameTheme } from "./theme/theme";
import { SocketProvider } from "./contexts/socket-context";
import { BrandMark, SquadSlots } from "./sections/lobby-ui";

import type { UserType } from "./types/type-user";

// Same endpoint your RTK Query `getUser` already calls.
const ME_ENDPOINT = "user/u/me";

/**
 * Keeps the user signed in across reloads.
 *
 * - Cached user + token: returns `true` at once (no spinner, right page on
 *   first paint) and refreshes the profile from the server in the background.
 * - Token only: waits for the server before deciding which page to show.
 * - Server says the token is invalid: signs out. A network error keeps the
 *   cached session, so a flaky connection doesn't log anyone out.
 */
export function useSessionBootstrap(): boolean {
  const { isAuthenticated, setUser, logout } = useCredentials();
  const [ready, setReady] = useState(
    () => !sessionStorage.getItem(CONFIG.googleAccessToken) || isAuthenticated,
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = sessionStorage.getItem(CONFIG.googleAccessToken);
      if (token) {
        try {
          const res = await axios.get(`${CONFIG.serverUrl}/${ME_ENDPOINT}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!cancelled) {
            if (res.data?.status && res.data.data) setUser(res.data.data);
            else logout();
          }
        } catch (err) {
          const code = axios.isAxiosError(err)
            ? err.response?.status
            : undefined;
          if (!cancelled && (code === 401 || code === 403 || code === 404)) {
            sessionStorage.removeItem(CONFIG.googleAccessToken);
            logout();
          }
        }
      }
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}

const GoogleLogo = () => (
  <SvgIcon viewBox="0 0 48 48" sx={{ fontSize: 20 }}>
    <path
      fill="#EA4335"
      d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
    />
  </SvgIcon>
);

interface GoogleSignInProps {
  title?: string;
  sx?: SxProps<Theme>;
  onSuccess?: () => void;
}

/**
 * Only signs the user in. Session restore lives in useSessionBootstrap,
 * and region detection is no longer tied to this button.
 */
export const GoogleSignIn = ({
  title = "Continue with Google",
  sx,
  onSuccess,
}: GoogleSignInProps) => {
  const { setUser } = useCredentials();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const finish = (data: {
    status?: boolean;
    token?: string;
    user?: UserType;
  }) => {
    if (!data?.status || !data.token)
      throw new Error("Invalid response from server");
    sessionStorage.setItem(CONFIG.googleAccessToken, data.token);
    setUser(data.user ?? ({} as UserType));
    onSuccess?.();
  };

  const fail = (err: unknown) => {
    console.error("Google sign-in failed", err);
    setError("We couldn't sign you in with Google. Try again.");
    setIsLoading(false);
  };

  // One popup flow for desktop and mobile. Your existing /auth/google already
  // accepts the access token it returns, so the backend needs no change.
  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const { data } = await axios.post(`${CONFIG.serverUrl}/auth/google`, {
          token: access_token,
        });
        finish(data);
      } catch (err) {
        fail(err);
      }
    },
    onError: fail,
    onNonOAuthError: () => setIsLoading(false), // user closed the popup
  });

  const handleClick = () => {
    setError("");
    setIsLoading(true);
    login();
  };

  return (
    <>
      <Button
        fullWidth
        size="large"
        variant="contained"
        disabled={isLoading}
        onClick={handleClick}
        startIcon={
          isLoading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <GoogleLogo />
          )
        }
        sx={{
          py: 1.4,
          fontSize: "1rem",
          bgcolor: "#ECE8E1",
          color: "#0F1923",
          "&:hover": { bgcolor: "#FFFFFF" },
          "&.Mui-disabled": {
            bgcolor: "rgba(236,232,225,0.6)",
            color: "#0F1923",
          },
          ...sx,
        }}
      >
        {isLoading ? "Signing in" : title}
      </Button>
      {error && (
        <Alert severity="error" role="alert" sx={{ mt: 1.5 }}>
          {error}
        </Alert>
      )}
    </>
  );
};

export function LoginPage(): React.JSX.Element {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        px: { xs: 2.5, sm: 6 },
        py: { xs: 2.5, sm: 4 },
      }}
    >
      <BrandMark />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          py: { xs: 6, sm: 8 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 520 }}>
          {/* The hero is the product: four seats taken, one still open. */}
          <SquadSlots filled={4} searching size={52} />

          <Typography
            variant="h1"
            sx={{
              mt: 4,
              fontSize: { xs: "3.4rem", sm: "4.8rem" },
              color: tokens.text,
            }}
          >
            Your stack is one short.
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 440,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              lineHeight: 1.55,
              color: tokens.muted,
            }}
          >
            Pick your rank range and server. We match you with a player who
            fits, and you talk on voice before you ever share a party code.
          </Typography>

          <Box sx={{ mt: 4, maxWidth: 360 }}>
            <GoogleSignIn />
            <Typography
              sx={{ mt: 1.5, fontSize: "0.78rem", color: tokens.faint }}
            >
              Google is only used to sign you in. Your browser asks for
              microphone access when a match starts.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

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

  // The socket only exists while signed in, and it carries the JWT.
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
