import { configureStore } from "@reduxjs/toolkit";

import { userApi } from "./apis";
import { accountSlice } from "./slices";

const apis = [userApi];

const rootReducer = {
  account: accountSlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
};

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apis.map((api) => api.middleware)),
});
