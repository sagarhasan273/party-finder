import type { AxiosRequestConfig } from "axios";

import axios from "axios";

import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

const AXIOS = axios.create({
  baseURL: `${CONFIG.serverUrl}`,
});

// ✅ REQUEST INTERCEPTOR (add token here)
AXIOS.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem(CONFIG.googleAccessToken);

    if (accessToken && config.headers) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ RESPONSE INTERCEPTOR
AXIOS.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!",
    ),
);

export default AXIOS;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await AXIOS.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: "/user/me",
    signIn: "/user/auth/sign-in",
    signUp: "/user/auth/sign-up",
  },
  user: {
    profile: "/user/profile/update",
  },
};
