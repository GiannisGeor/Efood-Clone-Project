import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import CartReducer from "./CartReducer";
import AuthReducer from "./AuthReducer";
import AddressReducer from "./AddressReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "address"], // only auth will be persisted
};

const combinedReducers = combineReducers({
  cart: CartReducer,
  auth: AuthReducer,
  address: AddressReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
