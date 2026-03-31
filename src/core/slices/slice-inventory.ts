import type { PayloadAction } from "@reduxjs/toolkit";
import type { LobbyType, ApplicantStatus } from "src/types/type-inventory";

import { useMemo } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../types";

// Define auth state interface
interface InventoryState {
  lobbies: LobbyType[];
  appliedLobbies: LobbyType[];
  myLobby: LobbyType | null;
  myLobbyLoading: boolean;
  appliedLobbiesLoading: boolean;
  isLoading: boolean;
}

// Initial state
const initialState: InventoryState = {
  lobbies: [],
  appliedLobbies: [],
  myLobby: null,
  myLobbyLoading: false,
  appliedLobbiesLoading: false,
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

    setMyLobbyStatus(state, action: PayloadAction<LobbyType["status"]>) {
      if (state.myLobby) state.myLobby.status = action.payload ?? "open";
      console.log(action.payload);
    },

    setMyLobbyApplicantStatus(
      state,
      action: PayloadAction<{ applicantId: string; status: ApplicantStatus }>,
    ) {
      if (!state.myLobby) return;

      const applicants = state.myLobby.applicants?.map((applicant) => {
        if (applicant.user.id === action.payload.applicantId) {
          return { ...applicant, status: action.payload.status };
        }
        return applicant;
      });

      state.myLobby.applicants = applicants;
    },

    setMyLobbyLoading(state, action: PayloadAction<boolean>) {
      state.myLobbyLoading = action.payload;
    },

    setAppliedLobbiesLoading(state, action: PayloadAction<boolean>) {
      state.appliedLobbiesLoading = action.payload;
    },

    setAppliedLobbies(
      state,
      action: PayloadAction<InventoryState["appliedLobbies"]>,
    ) {
      state.appliedLobbies = action.payload;
    },

    setAppliedLobbiesStatus(
      state,
      action: PayloadAction<{ lobbyId: string; status: LobbyType["status"] }>,
    ) {
      const { lobbyId, status } = action.payload;

      if (!state.appliedLobbies) {
        state.appliedLobbies = [];
        return;
      }

      const lobby = state.appliedLobbies.find((l) => l.id === lobbyId);
      if (lobby) {
        lobby.status = status;
      }
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

const {
  setLobbies,
  setMyLobby,
  setAppliedLobbies,
  setMyLobbyStatus,
  setMyLobbyApplicantStatus,
  setAppliedLobbiesStatus,
  reset,
  setLoading,
  setMyLobbyLoading,
  setAppliedLobbiesLoading,
} = inventorySlice.actions;

const selectLobbies = (state: RootState) => state.inventory.lobbies;
const selectMyLobby = (state: RootState) => state.inventory.myLobby;
const selectAppliedLobbies = (state: RootState) =>
  state.inventory.appliedLobbies;
const selectIsLoading = (state: RootState) => state.inventory.isLoading;
const selectMyLobbyLoading = (state: RootState) =>
  state.inventory.myLobbyLoading;
const selectAppliedLobbiesLoading = (state: RootState) =>
  state.inventory.appliedLobbiesLoading;

export const useInventory = () => {
  const dispatch = useDispatch();

  const lobbies = useSelector(selectLobbies);
  const isLoading = useSelector(selectIsLoading);
  const myLobby = useSelector(selectMyLobby);
  const myLobbyLoading = useSelector(selectMyLobbyLoading);
  const appliedLobbies = useSelector(selectAppliedLobbies);
  const appliedLobbiesLoading = useSelector(selectAppliedLobbiesLoading);

  const memoCredentials = useMemo(
    () => ({
      lobbies,
      isLoading,
      myLobby,
      myLobbyLoading,
      appliedLobbies,
      appliedLobbiesLoading,
      setLobbies: (payload: InventoryState["lobbies"]) =>
        dispatch(setLobbies(payload)),

      setMyLobby: (payload: InventoryState["myLobby"]) =>
        dispatch(setMyLobby(payload)),

      setMyLobbyStatus: (payload: LobbyType["status"]) =>
        dispatch(setMyLobbyStatus(payload)),

      setMyLobbyApplicantStatus: (payload: {
        applicantId: string;
        status: ApplicantStatus;
      }) => dispatch(setMyLobbyApplicantStatus(payload)),

      setAppliedLobbiesStatus: (payload: {
        lobbyId: string;
        status: LobbyType["status"];
      }) => dispatch(setAppliedLobbiesStatus(payload)),

      setAppliedLobbies: (payload: InventoryState["appliedLobbies"]) =>
        dispatch(setAppliedLobbies(payload)),

      setMyLobbyLoading: (payload: InventoryState["myLobbyLoading"]) =>
        dispatch(setMyLobbyLoading(payload)),

      setAppliedLobbiesLoading: (
        payload: InventoryState["appliedLobbiesLoading"],
      ) => dispatch(setAppliedLobbiesLoading(payload)),

      setLoading: (payload: InventoryState["isLoading"]) =>
        dispatch(setLoading(payload)),

      reset: () => dispatch(reset()),
    }),
    [
      lobbies,
      myLobby,
      appliedLobbies,
      isLoading,
      myLobbyLoading,
      appliedLobbiesLoading,
      dispatch,
    ],
  );

  return memoCredentials;
};
