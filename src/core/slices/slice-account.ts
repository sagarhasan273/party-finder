import type { PayloadAction } from "@reduxjs/toolkit";

import { useMemo } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

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

// Initial state
const initialState: UserState = {
  user: {} as UserType,
  isProfileUpdated: true,
  region: null,
  isRegionLoading: false,
  isAuthenticated: false,
  isSignInRequired: false,
  isLoading: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState["user"]>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.isProfileUpdated = !(
        !action.payload.gamename || !action.payload.tagline
      );
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
  logout,
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

      setUser: (payload: UserState["user"]) => dispatch(setUser(payload)),
      setLoading: (payload: UserState["isLoading"]) =>
        dispatch(setLoading(payload)),
      logout: () => dispatch(logout()),
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
    ],
  );

  return memoCredentials;
};
