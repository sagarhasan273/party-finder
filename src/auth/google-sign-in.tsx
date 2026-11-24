import type { Theme, SxProps } from "@mui/material/styles";

import axios from "axios";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { Alert, Button, SvgIcon, CircularProgress } from "@mui/material";

import { CONFIG } from "../config-global";
import { useCredentials } from "../store/slices";

import type { UserType } from "../types/type-user";

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

interface Props {
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
}: Props) => {
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
