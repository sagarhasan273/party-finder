import type { PayloadAction } from "@reduxjs/toolkit";

import { useMemo, useCallback } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { CONFIG } from "../../config-global";

import type { RootState } from "../types";
import type { UserType, LocationWithRegion } from "../../types/type-user";

// Define auth state interface
interface UserState {
  user: UserType;
  isProfileUpdated: boolean;
  region: LocationWithRegion | null;
  isRegionLoading: boolean;
  isAuthenticated: boolean;
  isSignInRequired: boolean;
  isLoading: boolean;
}

// ── Persistence ───────────────────────────────────────────────────────────────
// The user is cached in sessionStorage so a reload keeps the session. It is only
// trusted while the JWT is also present, and useSessionBootstrap refreshes it
// from the server in the background.
const USER_STORAGE_KEY = "val5th_user";

const readStoredUser = (): UserType | null => {
  try {
    if (!sessionStorage.getItem(CONFIG.googleAccessToken)) return null;
    const raw = sessionStorage.getItem(USER_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UserType) : null;
    return parsed && typeof parsed === "object" && Object.keys(parsed).length
      ? parsed
      : null;
  } catch {
    return null;
  }
};

const persistUser = (user: UserType | null): void => {
  try {
    if (user && Object.keys(user as object).length) {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {
    /* storage full or blocked: the session still works until reload */
  }
};

const storedUser = readStoredUser();

// Initial state
const initialState: UserState = {
  user: storedUser ?? ({} as UserType),
  isProfileUpdated: storedUser
    ? !(!storedUser.gamename || !storedUser.tagline)
    : true,
  region: null,
  isRegionLoading: false,
  isAuthenticated: Boolean(storedUser),
  isSignInRequired: false,
  isLoading: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState["user"]>) {
      const hasUser =
        !!action.payload && Object.keys(action.payload as object).length > 0;
      state.user = action.payload;
      state.isAuthenticated = hasUser;
      state.isLoading = false;
      state.isProfileUpdated = hasUser
        ? !(!action.payload.gamename || !action.payload.tagline)
        : true;
    },

    setRegion(state, action: PayloadAction<UserState["region"]>) {
      state.region = action.payload;
      state.isRegionLoading = false;
    },

    setRegionLoading(
      state,
      action: PayloadAction<UserState["isRegionLoading"]>,
    ) {
      state.isRegionLoading = action.payload;
    },

    setIsSignInRequired(state, action: PayloadAction<boolean>) {
      state.isSignInRequired = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setIsProfileUpdated(state, action: PayloadAction<boolean>) {
      state.isProfileUpdated = action.payload;
    },

    logout(state) {
      state.user = {} as UserType;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isProfileUpdated = true;
    },
  },
});

const {
  setUser,
  logout: logoutAction,
  setLoading,
  setRegion,
  setIsProfileUpdated,
  setIsSignInRequired,
  setRegionLoading,
} = accountSlice.actions;

const selectIsAuthenticated = (state: RootState) =>
  state.account.isAuthenticated;
const selectAccount = (state: RootState) => state.account.user;
const selectIsLoading = (state: RootState) => state.account.isLoading;
const selectRegion = (state: RootState) => state.account.region;

export const useCredentials = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    persistUser(null);
    return dispatch(logoutAction());
  }, [dispatch]);

  const user = useSelector(selectAccount);
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const region = useSelector(selectRegion);
  const isProfileUpdated = useSelector(
    (state: RootState) => state.account.isProfileUpdated,
  );
  const isRegionLoading = useSelector(
    (state: RootState) => state.account.isRegionLoading,
  );
  const isSignInRequired = useSelector(
    (state: RootState) => state.account.isSignInRequired,
  );

  const memoCredentials = useMemo(
    () => ({
      user,
      region,
      isLoading,
      isAuthenticated,
      isProfileUpdated,
      isRegionLoading,
      isSignInRequired,

      setUser: (payload: UserState["user"]) => {
        persistUser(payload);
        return dispatch(setUser(payload));
      },
      setLoading: (payload: UserState["isLoading"]) =>
        dispatch(setLoading(payload)),
      logout,
      setRegion: (payload: UserState["region"]) => dispatch(setRegion(payload)),
      setRegionLoading: (payload: UserState["isRegionLoading"]) =>
        dispatch(setRegionLoading(payload)),
      setIsSignInRequired: (payload: boolean) =>
        dispatch(setIsSignInRequired(payload)),
      setIsProfileUpdated: (payload: UserState["isProfileUpdated"]) =>
        dispatch(setIsProfileUpdated(payload)),
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      region,
      isProfileUpdated,
      isRegionLoading,
      isSignInRequired,
      dispatch,
      logout,
    ],
  );

  return memoCredentials;
};
