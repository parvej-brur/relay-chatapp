import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import { sessionPersistence } from "./sessionPersistence";
import sessionReducer from "./sessionSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      session: sessionReducer,
      chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(sessionPersistence.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
