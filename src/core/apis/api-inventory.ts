// services/inventoryApi.ts
import type { ResponseType } from "src/types/type-common";
import type { LobbyType, CreateLobbyInput } from "src/types/type-inventory";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CONFIG } from "src/config-global";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CONFIG.serverUrl,
    prepareHeaders: (headers) => {
      const accessToken = sessionStorage.getItem(CONFIG.googleAccessToken);
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }), // your REST API base
  tagTypes: [
    "inventory-lobbies-recall",
    "inventory-requested-lobbies-recall",
    "inventory-my-lobby-recall",
  ],
  endpoints: (builder) => ({
    getLobbies: builder.query<ResponseType, null>({
      query: () => `inventory/lobbies`,
      providesTags: ["inventory-lobbies-recall"],
    }),

    getMyLobby: builder.query<ResponseType, null>({
      query: () => `inventory/lobby/me`,
      providesTags: ["inventory-my-lobby-recall"],
    }),

    getJoinRequestedLobbies: builder.query<ResponseType, null>({
      query: () => `inventory/lobby/join-requests`,
      providesTags: ["inventory-requested-lobbies-recall"],
    }),

    createLobby: builder.mutation<ResponseType, CreateLobbyInput>({
      query: (newUser) => ({
        url: `inventory/lobby/create`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["inventory-my-lobby-recall"],
    }),

    updateLobby: builder.mutation<ResponseType, Partial<LobbyType>>({
      query: (body) => ({
        url: `inventory/lobby/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["inventory-my-lobby-recall"],
    }),

    lobbyStatus: builder.mutation<
      ResponseType,
      { lobbyId: string; userId: string }
    >({
      query: (body) => ({
        url: `inventory/lobby/status`,
        method: "POST",
        body,
      }),
    }),

    deleteLobby: builder.mutation<
      ResponseType,
      { lobbyId: string; userId: string }
    >({
      query: ({ lobbyId, userId }) => ({
        url: `inventory/lobby/delete`,
        method: "POST",
        body: { lobbyId, userId },
      }),
      invalidatesTags: ["inventory-my-lobby-recall"],
    }),

    requestToJoinLobby: builder.mutation<
      ResponseType,
      { lobbyId: string; userId: string }
    >({
      query: ({ lobbyId, userId }) => ({
        url: `inventory/lobby/request-to-join`,
        method: "POST",
        body: { lobbyId, userId },
      }),
      invalidatesTags: ["inventory-requested-lobbies-recall"],
    }),

    acceptJoinRequest: builder.mutation<
      ResponseType,
      { lobbyId: string; userId: string }
    >({
      query: ({ lobbyId, userId }) => ({
        url: `inventory/lobby/accept-join-request`,
        method: "POST",
        body: { lobbyId, userId },
      }),
      invalidatesTags: ["inventory-my-lobby-recall"],
    }),

    rejectJoinRequest: builder.mutation<
      ResponseType,
      { lobbyId: string; userId: string }
    >({
      query: ({ lobbyId, userId }) => ({
        url: `inventory/lobby/reject-join-request`,
        method: "POST",
        body: { lobbyId, userId },
      }),
      invalidatesTags: ["inventory-my-lobby-recall"],
    }),

    cancelJoinRequest: builder.mutation<
      ResponseType,
      { lobbyId: string; userId: string }
    >({
      query: ({ lobbyId, userId }) => ({
        url: `inventory/lobby/cancel-join-request`,
        method: "POST",
        body: { lobbyId, userId },
      }),
      invalidatesTags: ["inventory-requested-lobbies-recall"],
    }),
  }),
});

export const {
  useGetLobbiesQuery,
  useGetMyLobbyQuery,
  useGetJoinRequestedLobbiesQuery,
  useCreateLobbyMutation,
  useUpdateLobbyMutation,
  useLobbyStatusMutation,
  useDeleteLobbyMutation,
  useRequestToJoinLobbyMutation,
  useAcceptJoinRequestMutation,
  useRejectJoinRequestMutation,
  useCancelJoinRequestMutation,
} = inventoryApi;
