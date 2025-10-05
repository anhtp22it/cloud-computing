import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { rootApi } from "@api/rootApi";
import snackbarReducer from "@store/slices/snackbarSlice";
import authReducer from "@store/slices/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "tokenType", "user"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  snackbar: snackbarReducer,
  [rootApi.reducerPath]: rootApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(rootApi.middleware);
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
