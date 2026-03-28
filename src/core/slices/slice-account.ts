import type { UserType } from "src/types/type-user";
import type { PayloadAction } from "@reduxjs/toolkit";

import { useMemo } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../types";

// Define auth state interface
interface UserState {
  user: UserType;
  isAuthenticated: boolean;
  loading: boolean;
}

// Initial state
const initialState: UserState = {
  user: {} as UserType,
  isAuthenticated: false,
  loading: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = {} as UserType;
      state.isAuthenticated = false;
    },
    setAccountLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAccount, logout, setAccountLoading } = accountSlice.actions;

// Selectors with proper typing
export const selectAccount = (state: RootState) => state.account.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.account.isAuthenticated;

export const useCredentials = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectAccount);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const memoCredentials = useMemo(
    () => ({
      user,
      isAuthenticated,
      setAccount: (payload: UserState["user"]) => dispatch(setAccount(payload)),
    }),
    [isAuthenticated, user, dispatch],
  );

  return memoCredentials;
};
