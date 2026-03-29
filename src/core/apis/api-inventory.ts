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
  tagTypes: ["user-recall"],
  endpoints: (builder) => ({
    getLobbies: builder.query<ResponseType, null>({
      query: () => `inventory/lobbies`,
      providesTags: ["user-recall"],
    }),

    createLobby: builder.mutation<ResponseType, CreateLobbyInput>({
      query: (newUser) => ({
        url: `inventory/lobby/create`,
        method: "POST",
        body: newUser,
      }),
    }),

    updateUser: builder.mutation<ResponseType, Partial<LobbyType>>({
      query: (body) => ({
        url: `user/profile/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user-recall"],
    }),

    deleteLobby: builder.mutation<ResponseType, string>({
      query: (lobbyId) => ({
        url: `inventory/lobby/delete/${lobbyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user-recall"],
    }),
  }),
});

export const {
  useGetLobbiesQuery,
  useCreateLobbyMutation,
  useUpdateUserMutation,
  useDeleteLobbyMutation,
} = inventoryApi;
