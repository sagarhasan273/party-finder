import type { PayloadAction } from "@reduxjs/toolkit";
import type { LobbyType } from "src/types/type-inventory";

import { useMemo } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../types";

// Define auth state interface
interface InventoryState {
  lobbies: LobbyType[];
  myLobby: LobbyType | null;
  isLoading: boolean;
}

// Initial state
const initialState: InventoryState = {
  lobbies: [],
  myLobby: null,
  isLoading: false,
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setLobbies(state, action: PayloadAction<InventoryState["lobbies"]>) {
      state.lobbies = action.payload;
    },

    setMyLobby(state, action: PayloadAction<InventoryState["myLobby"]>) {
      state.myLobby = action.payload ?? null;
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

const { setLobbies, setMyLobby, reset, setLoading } = inventorySlice.actions;

const selectLobbies = (state: RootState) => state.inventory.lobbies;
const selectMyLobby = (state: RootState) => state.inventory.myLobby;
const selectIsLoading = (state: RootState) => state.inventory.isLoading;

export const useInventory = () => {
  const dispatch = useDispatch();

  const lobbies = useSelector(selectLobbies);
  const myLobby = useSelector(selectMyLobby);

  const isLoading = useSelector(selectIsLoading);

  const memoCredentials = useMemo(
    () => ({
      lobbies,
      myLobby,
      isLoading,
      setLobbies: (payload: InventoryState["lobbies"]) =>
        dispatch(setLobbies(payload)),
      setMyLobby: (payload: InventoryState["myLobby"]) =>
        dispatch(setMyLobby(payload)),
      setLoading: (payload: InventoryState["isLoading"]) =>
        dispatch(setLoading(payload)),
      reset: () => dispatch(reset()),
    }),
    [lobbies, myLobby, isLoading, dispatch],
  );

  return memoCredentials;
};
