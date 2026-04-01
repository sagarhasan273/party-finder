import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserType, LocationWithRegion } from "src/types/type-user";

import { useMemo } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../types";

// Define auth state interface
interface UserState {
  user: UserType;
  isProfileUpdated: boolean;
  region: LocationWithRegion | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initial state
const initialState: UserState = {
  user: {} as UserType,
  isProfileUpdated: true,
  region: {} as LocationWithRegion,
  isAuthenticated: false,
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

const { setUser, logout, setLoading, setRegion, setIsProfileUpdated } =
  accountSlice.actions;

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

  const memoCredentials = useMemo(
    () => ({
      user,
      region,
      isLoading,
      isAuthenticated,
      isProfileUpdated,
      setUser: (payload: UserState["user"]) => dispatch(setUser(payload)),
      setLoading: (payload: UserState["isLoading"]) =>
        dispatch(setLoading(payload)),
      logout: () => dispatch(logout()),
      setRegion: (payload: UserState["region"]) => dispatch(setRegion(payload)),
      setIsProfileUpdated: (payload: UserState["isProfileUpdated"]) =>
        dispatch(setIsProfileUpdated(payload)),
    }),
    [isAuthenticated, isLoading, user, region, isProfileUpdated, dispatch],
  );

  return memoCredentials;
};
