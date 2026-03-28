import type { TypedUseSelectorHook } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authReducer from "./authSlice";
import lobbiesReducer from "./lobbiesSlice";

export const store = configureStore({
  reducer: {
    lobbies: lobbiesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
