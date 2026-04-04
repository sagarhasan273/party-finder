// services/inventoryApi.ts
import type { ResponseType } from "src/types/type-common";
import type { LobbyType, CreateLobbyInput } from "src/types/type-inventory";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CONFIG } from "src/config-global";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CONFIG.serverUrl,
    prepareHeaders: (headers, { endpoint }) => {
      const publicEndpoints = ["getLobbies"];

      if (publicEndpoints.includes(endpoint)) {
        return headers;
      }

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
      query: () => `inventory/my-lobby`,
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
      { lobbyId: string; hostId: string; applicantIds: string[] }
    >({
      query: ({ lobbyId, hostId, applicantIds }) => ({
        url: `inventory/lobby/delete`,
        method: "POST",
        body: { lobbyId, hostId, applicantIds },
      }),
    }),

    requestToJoinLobby: builder.mutation<
      ResponseType,
      { lobbyId: string; applicantId: string }
    >({
      query: ({ lobbyId, applicantId }) => ({
        url: `inventory/lobby/request-to-join`,
        method: "POST",
        body: { lobbyId, applicantId },
      }),
    }),

    acceptJoinRequest: builder.mutation<
      ResponseType,
      { lobbyId: string; applicantId: string }
    >({
      query: ({ lobbyId, applicantId }) => ({
        url: `inventory/lobby/accept-join-request`,
        method: "POST",
        body: { lobbyId, applicantId },
      }),
    }),

    rejectJoinRequest: builder.mutation<
      ResponseType,
      { lobbyId: string; applicantId: string }
    >({
      query: ({ lobbyId, applicantId }) => ({
        url: `inventory/lobby/reject-join-request`,
        method: "POST",
        body: { lobbyId, applicantId },
      }),
    }),

    applicantJoining: builder.mutation<
      ResponseType,
      { lobbyId: string; applicantId: string; message?: string }
    >({
      query: ({ lobbyId, applicantId, message }) => ({
        url: `inventory/lobby/applicant-joining`,
        method: "POST",
        body: { lobbyId, applicantId, message },
      }),
    }),

    cancelJoinRequest: builder.mutation<
      ResponseType,
      { lobbyId: string; applicantId: string }
    >({
      query: ({ lobbyId, applicantId }) => ({
        url: `inventory/lobby/cancel-join-request`,
        method: "POST",
        body: { lobbyId, applicantId },
      }),
    }),
    removeJoinRequest: builder.mutation<
      ResponseType,
      { lobbyId: string; applicantId: string }
    >({
      query: ({ lobbyId, applicantId }) => ({
        url: `inventory/lobby/remove-join-request`,
        method: "POST",
        body: { lobbyId, applicantId },
      }),
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
  useApplicantJoiningMutation,
  useRemoveJoinRequestMutation,
} = inventoryApi;
