// services/userApi.ts
import type { UserType } from "src/types/type-user";
import type { ResponseType } from "src/types/type-common";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CONFIG } from "src/config-global";

export const userApi = createApi({
  reducerPath: "userApi",
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
    getUser: builder.query<ResponseType, null>({
      query: () => `user/u/me`,
      providesTags: ["user-recall"],
    }),

    getUserById: builder.query<{ user: UserType; status: boolean }, string>({
      query: (id) => `user/profile/${id}`,
      providesTags: ["user-recall"],
    }),

    updateUser: builder.mutation<ResponseType, Partial<UserType>>({
      query: (body) => ({
        url: `user/profile/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user-recall"],
    }),

    createUser: builder.mutation<UserType, UserType>({
      query: (newUser) => ({
        url: `users`,
        method: "POST",
        body: newUser,
      }),
    }),
  }),
});

export const { useGetUserQuery, useGetUserByIdQuery, useUpdateUserMutation } =
  userApi;
