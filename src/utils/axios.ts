import type { AxiosRequestConfig } from "axios";

import axios from "axios";

import { CONFIG } from "../config-global";

const AXIOS = axios.create({
  baseURL: CONFIG.serverUrl,
});

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

AXIOS.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data ?? "Something went wrong"),
);

export default AXIOS;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const response = await AXIOS.get(url, { ...config });
  return response.data;
};

export const endpoints = {
  auth: { me: "/user/me" },
};
