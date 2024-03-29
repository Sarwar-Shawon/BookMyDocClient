import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authReducer"; // Make sure this path is correct
import storageSession from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import storage from "localforage"
const authPersistConfig = {
  key: "auth",
  storage: storage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authSlice.reducer), // Notice .reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);