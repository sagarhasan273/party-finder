import { configureStore } from "@reduxjs/toolkit";

import { userApi } from "./apis";
import { accountSlice } from "./slices";

const apis = [userApi];

// Combine reducers
const rootReducer = {
  account: accountSlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
};

export const store = configureStore({
  // 2. Pass that pre-built object to the store. ✅
  reducer: rootReducer,

  // This middleware configuration will now work correctly.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.map((api) => api.middleware)),
});
