import type { UserType } from "src/types/type-user";
import type { PayloadAction } from "@reduxjs/toolkit";

import { useMemo } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../types";

// Define auth state interface
interface UserState {
  user: UserType;
  region?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initial state
const initialState: UserState = {
  user: {} as UserType,
  region: undefined,
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
    },
    setRegion(state, action: PayloadAction<string | undefined>) {
      state.region = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.user = {} as UserType;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

const { setUser, logout, setLoading, setRegion } = accountSlice.actions;

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

  const memoCredentials = useMemo(
    () => ({
      user,
      region,
      isLoading,
      isAuthenticated,
      setUser: (payload: UserState["user"]) => dispatch(setUser(payload)),
      setLoading: (payload: UserState["isLoading"]) =>
        dispatch(setLoading(payload)),
      logout: () => dispatch(logout()),
      setRegion: (payload: UserState["region"]) => dispatch(setRegion(payload)),
    }),
    [isAuthenticated, isLoading, user, region, dispatch],
  );

  return memoCredentials;
};
