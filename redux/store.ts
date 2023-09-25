import { configureStore } from "@reduxjs/toolkit";
import querySlice from "./features/querySlice";
import { subjectApi } from "./services/subjectApi";

export const store = configureStore({
  reducer: {
    query: querySlice,
    [subjectApi.reducerPath]: subjectApi.reducer,
  },
  middleware: (gDM) => gDM().concat(subjectApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
