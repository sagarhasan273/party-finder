import type { UserType } from "src/types/type-user";
import type { PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useEffect, useCallback } from "react";

import { endpoints } from "src/utils/axios";

import { CONFIG } from "src/config-global";

import type { RootState } from "../types";

// Define auth state interface
interface UserState {
  user: UserType;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initial state
const initialState: UserState = {
  user: {} as UserType,
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

const { setUser, logout, setLoading } = accountSlice.actions;

const selectIsAuthenticated = (state: RootState) =>
  state.account.isAuthenticated;
const selectAccount = (state: RootState) => state.account.user;
const selectIsLoading = (state: RootState) => state.account.isLoading;

export const useCredentials = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectAccount);
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(CONFIG.googleAccessToken);

      if (accessToken) {
        const res = await axios.get(endpoints.auth.me);

        const { data, status } = res.data;
        if (status) {
          dispatch(setUser(data));
        }
      }
    } catch (error) {
      dispatch(logout());
    }
  }, [dispatch]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const memoCredentials = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      setUser: (payload: UserState["user"]) => dispatch(setUser(payload)),
      setLoading: (payload: UserState["isLoading"]) =>
        dispatch(setLoading(payload)),
      logout: () => dispatch(logout()),
    }),
    [isAuthenticated, isLoading, user, dispatch],
  );

  return memoCredentials;
};
