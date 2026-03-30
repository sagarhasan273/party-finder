import type { PayloadAction } from "@reduxjs/toolkit";
import type { LobbyType } from "src/types/type-inventory";

import { useMemo } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../types";

// Define auth state interface
interface InventoryState {
  lobbies: LobbyType[];
  appliedLobbies: LobbyType[];
  myLobby: LobbyType | null;
  isLoading: boolean;
}

// Initial state
const initialState: InventoryState = {
  lobbies: [],
  appliedLobbies: [],
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

    setAppliedLobbies(
      state,
      action: PayloadAction<InventoryState["appliedLobbies"]>,
    ) {
      state.appliedLobbies = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    reset(state) {
      state.lobbies = [];
      state.appliedLobbies = [];
      state.isLoading = false;
    },
  },
});

const { setLobbies, setMyLobby, setAppliedLobbies, reset, setLoading } =
  inventorySlice.actions;

const selectLobbies = (state: RootState) => state.inventory.lobbies;
const selectMyLobby = (state: RootState) => state.inventory.myLobby;
const selectAppliedLobbies = (state: RootState) =>
  state.inventory.appliedLobbies;
const selectIsLoading = (state: RootState) => state.inventory.isLoading;

export const useInventory = () => {
  const dispatch = useDispatch();

  const lobbies = useSelector(selectLobbies);
  const myLobby = useSelector(selectMyLobby);
  const appliedLobbies = useSelector(selectAppliedLobbies);

  const isLoading = useSelector(selectIsLoading);

  const memoCredentials = useMemo(
    () => ({
      lobbies,
      myLobby,
      appliedLobbies,
      isLoading,
      setLobbies: (payload: InventoryState["lobbies"]) =>
        dispatch(setLobbies(payload)),
      setMyLobby: (payload: InventoryState["myLobby"]) =>
        dispatch(setMyLobby(payload)),
      setAppliedLobbies: (payload: InventoryState["appliedLobbies"]) =>
        dispatch(setAppliedLobbies(payload)),
      setLoading: (payload: InventoryState["isLoading"]) =>
        dispatch(setLoading(payload)),
      reset: () => dispatch(reset()),
    }),
    [lobbies, myLobby, appliedLobbies, isLoading, dispatch],
  );

  return memoCredentials;
};
