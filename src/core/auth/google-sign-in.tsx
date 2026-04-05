import type { SxProps } from "@mui/material";

import axios from "axios";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useRef, useState, useEffect, useCallback } from "react";

import { Button, SvgIcon, Typography, CircularProgress } from "@mui/material";

import AXIOS, { endpoints } from "src/utils/axios";

import { CONFIG } from "src/config-global";
import { getUserRegionSmart } from "src/@mock";
import { useCredentials } from "src/core/slices";

// utils/is-mobile.ts
export const isMobileBrowser = (): boolean =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent,
  );

export const GoogleSignIn = ({
  sx,
  textSx,
  title = "Sign in",
  onSuccess,
}: {
  sx?: SxProps;
  textSx?: SxProps;
  title?: string;
  onSuccess?: () => void;
}) => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    setUser,
    logout,
    region,
    setRegion,
    setRegionLoading,
  } = useCredentials();

  const [isLoading, setIsLoading] = useState(false);

  const userSectionRef = useRef(false);
  const regionRef = useRef(false);

  // ── Mobile: redirect flow ─────────────────────────────────────────────────
  const mobileLogin = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: window.location.origin,
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${CONFIG.serverUrl}/auth/google/mobile`,
          {
            code: codeResponse?.code,
            redirect_uri: window.location.origin,
          },
        );

        if (response.data?.status && response.data?.token) {
          sessionStorage.setItem(CONFIG.googleAccessToken, response.data.token);
          setUser(response.data.user || {});
          onSuccess?.();
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Google login failed", err);
        // Add user-facing error message here
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Login failed", error);
      setIsLoading(false);
    },
  });

  // ── Desktop: popup flow ───────────────────────────────────────────────────
  const desktopLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const response = await axios.post(`${CONFIG.serverUrl}/auth/google`, {
          token: credentialResponse.access_token,
        });
        const { data } = response;
        if (data.status) {
          if (!data.token)
            throw new Error("Access token not found in response");
          sessionStorage.setItem(CONFIG.googleAccessToken, data.token);
          setUser(data.user);
          onSuccess?.();
        }
      } catch (err) {
        console.error("Google login failed", err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      console.log("Login failed");
      setIsLoading(false);
    },
  });

  const handleLogin = () => {
    setIsLoading(true);
    if (isMobileBrowser()) {
      mobileLogin(); // redirect flow
    } else {
      desktopLogin(); // popup flow
    }
  };

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(CONFIG.googleAccessToken);
      if (accessToken) {
        const res = await AXIOS.get(endpoints.auth.me);

        const { data, status } = res.data;
        if (status) {
          setUser(data);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      logout();
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-detect user's location and set region
    const autoDetectRegion = async () => {
      regionRef.current = true;
      try {
        setRegionLoading(true);
        // Try IP-based detection first (faster, no permission needed)
        const detectedRegion = await getUserRegionSmart();
        setRegion(detectedRegion);
      } catch (error) {
        console.log("Auto-detection failed, using default");
        setRegion(null);
        regionRef.current = false;
      }
    };
    if (region === null && !regionRef.current) autoDetectRegion();
  }, [region, setRegion, setRegionLoading]);

  useEffect(() => {
    if (!userSectionRef.current) {
      userSectionRef.current = true;
      checkUserSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Button
      fullWidth
      variant="outlined"
      disabled={isLoading}
      onClick={handleLogin}
      sx={{
        py: 2,
        px: 1,
        borderRadius: 1,
        borderColor: "divider",
        color: "primary.darker",
        backgroundColor: "primary.lighter",
        textTransform: "none",
        fontWeight: 600,
        fontSize: 14,
        gap: 1.5,
        "&:hover": {
          backgroundColor: "primary.lighter",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
        "&:active": { transform: "scale(0.99)" },
        transition: "all 0.15s ease",
        ...sx,
      }}
    >
      {isLoading ? (
        <CircularProgress size={18} thickness={5} />
      ) : (
        <SvgIcon sx={{ color: "primary.darker" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="640"
            height="640"
            viewBox="0 0 640 640"
          >
            <path
              fill="currentColor"
              d="M416 160h64c17.7 0 32 14.3 32 32v256c0 17.7-14.3 32-32 32h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c53 0 96-43 96-96V192c0-53-43-96-96-96h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32m-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H96c-17.7 0-32 14.3-32 32s14.3 32 32 32h210.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"
            />
          </svg>
        </SvgIcon>
      )}
      <Typography
        component="span"
        sx={{
          fontWeight: 600,
          fontSize: { xs: 14, sm: 16 },
          letterSpacing: 0.1,
          ...textSx,
        }}
      >
        {isLoading ? "Signing in..." : title}
      </Typography>
    </Button>
  );
};
