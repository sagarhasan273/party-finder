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

import { alpha } from "@mui/material/styles";
import { Mic, VpnKey, TrendingUp } from "@mui/icons-material";
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
import { fonts, tokens, gameTheme } from "./theme/theme";
import { SocketProvider } from "./contexts/socket-context";
import {
  Pill,
  EqBars,
  BrandMark,
  rankColor,
  SquadSlots,
} from "./sections/lobby-ui";

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
        sx={[
          {
            py: 1.1,
            fontSize: "0.95rem",
            bgcolor: tokens.text,
            color: tokens.bg,
            boxShadow: `0 12px 34px ${alpha(tokens.text, 0.12)}`,
            "&:hover": { bgcolor: "#FFFFFF" },
            "&.Mui-disabled": {
              bgcolor: alpha(tokens.text, 0.6),
              color: tokens.bg,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
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

/** Decorative "match found" card: shows what the product does at a glance. */
const MatchPreview = () => {
  const mates = [
    { name: "You", rank: "Gold 3", talking: false },
    { name: "Nightjar", rank: "Platinum 1", talking: true },
  ];
  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 390,
        justifySelf: { md: "end" },
        p: { xs: 2, sm: 2.5 },
        bgcolor: alpha(tokens.surface, 0.9),
        border: `1px solid ${tokens.line}`,
        borderRadius: "4px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px ${alpha(tokens.accent, 0.06)}`,
        transform: { md: "rotate(-1.5deg)" },
        "&::before": {
          content: '""',
          position: "absolute",
          top: -1,
          left: -1,
          width: 44,
          height: 2,
          bgcolor: tokens.accent,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontSize: "0.68rem",
              color: tokens.accent,
              letterSpacing: "0.08em",
            }}
          >
            AP · MUMBAI
          </Typography>
          <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
            Match found
          </Typography>
        </Box>
        <Pill color={tokens.live} pulse>
          Voice live
        </Pill>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 1.5,
          mb: 2,
          bgcolor: tokens.inset,
          border: `1px solid ${tokens.line}`,
          borderRadius: "4px",
        }}
      >
        <SquadSlots filled={4} searching size={36} />
      </Box>

      <Box sx={{ display: "grid", gap: 1 }}>
        {mates.map((m) => {
          const c = rankColor(m.rank);
          return (
            <Box
              key={m.name}
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.25,
                pl: 1.75,
                overflow: "hidden",
                borderRadius: "4px",
                bgcolor: m.talking ? alpha(tokens.live, 0.06) : tokens.inset,
                border: `1px solid ${m.talking ? alpha(tokens.live, 0.5) : tokens.line}`,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  bgcolor: c,
                },
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: fonts.display,
                  fontWeight: 800,
                  color: c,
                  bgcolor: alpha(c, 0.14),
                  border: `1px solid ${alpha(c, 0.5)}`,
                }}
              >
                {m.name.charAt(0)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: "0.88rem" }}>
                  {m.name}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.76rem", color: c, fontWeight: 700 }}
                >
                  {m.rank}
                </Typography>
              </Box>
              <EqBars
                active={m.talking}
                color={m.talking ? tokens.live : tokens.faint}
              />
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          mt: 2,
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          borderRadius: "4px",
          border: `1px dashed ${alpha(tokens.live, 0.5)}`,
          bgcolor: tokens.liveSoft,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.72rem",
            color: tokens.live,
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}
        >
          PARTY CODE
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.mono,
            fontWeight: 700,
            letterSpacing: "0.14em",
          }}
        >
          ••• ••••
        </Typography>
      </Box>
    </Box>
  );
};

const FEATURES = [
  {
    icon: <TrendingUp fontSize="small" />,
    title: "Rank-matched",
    body: "Only players inside your range.",
  },
  {
    icon: <Mic fontSize="small" />,
    title: "Voice first",
    body: "Talk before you commit.",
  },
  {
    icon: <VpnKey fontSize="small" />,
    title: "Code when ready",
    body: "Share the invite on your terms.",
  },
];

export function LoginPage(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        px: { xs: 2.5, sm: 5, md: 8 },
        pt: { xs: 2.5, sm: 4 },
        pb: { xs: "calc(20px + env(safe-area-inset-bottom))", sm: 4 },
      }}
    >
      {/* Huge outlined "5" behind everything. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: { xs: -70, md: "6%" },
          top: { xs: 30, md: "50%" },
          transform: { md: "translateY(-50%)" },
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: { xs: "20rem", md: "36rem" },
          lineHeight: 0.8,
          color: "transparent",
          WebkitTextStroke: `1.5px ${alpha(tokens.accent, 0.16)}`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        5
      </Box>

      <Box
        component="header"
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandMark />
      </Box>

      <Box
        component="main"
        sx={{
          position: "relative",
          flex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
          alignItems: "center",
          gap: { xs: 6, md: 8 },
          py: { xs: 5, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: 580 }}>
          <Pill color={tokens.accent} pulse>
            Ranked LFG with voice
          </Pill>

          <Typography
            variant="h1"
            sx={{
              mt: 3,
              fontSize: { xs: "2.8rem", sm: "4rem", md: "4.6rem" },
              color: tokens.text,
            }}
          >
            Your stack is
            <Box
              component="span"
              sx={{
                display: "block",
                color: tokens.accent,
                textShadow: `0 0 40px ${alpha(tokens.accent, 0.35)}`,
              }}
            >
              one short.
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 3,
              maxWidth: 460,
              fontSize: { xs: "0.95rem", sm: "1.02rem" },
              lineHeight: 1.6,
              color: tokens.muted,
            }}
          >
            Pick your rank range and server. We match you with a player who
            fits, and you talk on voice before you ever share a party code.
          </Typography>

          <Box sx={{ mt: 3.5, maxWidth: 340 }}>
            <GoogleSignIn />
            <Typography
              sx={{
                mt: 1.5,
                fontSize: "0.76rem",
                color: tokens.faint,
                lineHeight: 1.5,
              }}
            >
              Google is only used to sign you in. Your browser asks for
              microphone access when a match starts.
            </Typography>
          </Box>

          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              mt: { xs: 4, sm: 5 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {FEATURES.map((f) => (
              <Box
                component="li"
                key={f.title}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: { xs: 1.5, sm: 1 },
                  pt: { sm: 1.5 },
                  borderTop: { sm: `1px solid ${tokens.line}` },
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "4px",
                    color: tokens.accent,
                    bgcolor: tokens.accentSoft,
                  }}
                >
                  {f.icon}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: fonts.display,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      fontSize: "0.92rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {f.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: tokens.muted }}>
                    {f.body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <MatchPreview />
      </Box>

      <Typography
        sx={{ position: "relative", fontSize: "0.72rem", color: tokens.faint }}
      >
        Fan-made. Not affiliated with Riot Games.
      </Typography>
    </Box>
  );
}

function AuthGate() {
  const ready = useSessionBootstrap();
  const { isAuthenticated } = useCredentials();

  if (!ready) {
    return (
      <Box
        sx={{
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          gap: 2,
          alignContent: "center",
        }}
      >
        <BrandMark />
        <CircularProgress
          aria-label="Loading"
          size={28}
          sx={{ justifySelf: "center" }}
        />
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
