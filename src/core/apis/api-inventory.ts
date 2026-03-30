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
  tagTypes: ["inventory-recall"],
  endpoints: (builder) => ({
    getLobbies: builder.query<ResponseType, null>({
      query: () => `inventory/lobbies`,
      providesTags: ["inventory-recall"],
    }),

    getMyLobby: builder.query<ResponseType, null>({
      query: () => `inventory/lobby/me`,
      providesTags: ["inventory-recall"],
    }),

    createLobby: builder.mutation<ResponseType, CreateLobbyInput>({
      query: (newUser) => ({
        url: `inventory/lobby/create`,
        method: "POST",
        body: newUser,
      }),
    }),

    updateLobby: builder.mutation<ResponseType, Partial<LobbyType>>({
      query: (body) => ({
        url: `inventory/lobby/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["inventory-recall"],
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
      invalidatesTags: ["inventory-recall"],
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
    }),
  }),
});

export const {
  useGetLobbiesQuery,
  useGetMyLobbyQuery,
  useCreateLobbyMutation,
  useUpdateLobbyMutation,
  useDeleteLobbyMutation,
  useRequestToJoinLobbyMutation,
  useAcceptJoinRequestMutation,
} = inventoryApi;
