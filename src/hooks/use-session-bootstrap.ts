import { useState, useEffect } from "react";

import { CONFIG } from "../config-global";
import { useCredentials } from "../core/slices";
import AXIOS, { endpoints } from "../utils/axios";

/**
 * Restores the session once on page load. Returns `true` when we know
 * whether the user is signed in, so the app never flashes the wrong page.
 */
export function useSessionBootstrap(): boolean {
  const { setUser, logout } = useCredentials();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (sessionStorage.getItem(CONFIG.googleAccessToken)) {
        try {
          const res = await AXIOS.get(endpoints.auth.me);
          if (res.data?.status) setUser(res.data.data);
          else logout();
        } catch {
          sessionStorage.removeItem(CONFIG.googleAccessToken);
          logout();
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
