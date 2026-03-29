import type { PayloadAction } from "@reduxjs/toolkit";
import type { LobbyType } from "src/types/type-inventory";

import { useMemo } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../types";

// Define auth state interface
interface InventoryState {
  lobbies: LobbyType[];
  myLobbies: LobbyType[];
  isLoading: boolean;
}

// Initial state
const initialState: InventoryState = {
  lobbies: [],
  myLobbies: [],
  isLoading: false,
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setLobbies(state, action: PayloadAction<InventoryState["lobbies"]>) {
      state.lobbies = action.payload;
    },

    setMyLobbies(state, action: PayloadAction<InventoryState["myLobbies"]>) {
      state.myLobbies = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    reset(state) {
      state.lobbies = [];
      state.isLoading = false;
    },
  },
});

const { setLobbies, setMyLobbies, reset, setLoading } = inventorySlice.actions;

const selectLobbies = (state: RootState) => state.inventory.lobbies;
const selectMyLobbies = (state: RootState) => state.inventory.myLobbies;
const selectIsLoading = (state: RootState) => state.inventory.isLoading;

export const useInventory = () => {
  const dispatch = useDispatch();

  const lobbies = useSelector(selectLobbies);
  const myLobbies = useSelector(selectMyLobbies);

  const isLoading = useSelector(selectIsLoading);

  const memoCredentials = useMemo(
    () => ({
      lobbies,
      myLobbies,
      isLoading,
      setLobbies: (payload: InventoryState["lobbies"]) =>
        dispatch(setLobbies(payload)),
      setMyLobbies: (payload: InventoryState["myLobbies"]) =>
        dispatch(setMyLobbies(payload)),
      setLoading: (payload: InventoryState["isLoading"]) =>
        dispatch(setLoading(payload)),
      reset: () => dispatch(reset()),
    }),
    [lobbies, myLobbies, isLoading, dispatch],
  );

  return memoCredentials;
};
