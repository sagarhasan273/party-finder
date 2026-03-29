import { configureStore } from "@reduxjs/toolkit";

import { userApi, inventoryApi } from "./apis";
import { accountSlice, inventorySlice } from "./slices";

const apis = [userApi, inventoryApi];

const rootReducer = {
  account: accountSlice.reducer,
  inventory: inventorySlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
};

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apis.map((api) => api.middleware)),
});
