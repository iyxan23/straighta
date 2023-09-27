import { configureStore } from "@reduxjs/toolkit";
import newSubjectModalVisibilitySlice from "./features/newSubjectModalVisibilitySlice";
import querySlice from "./features/querySlice";
import subjectOffsetSlice from "./features/subjectOffsetSlice";
import { subjectApi } from "./services/subjectApi";

export const store = configureStore({
  reducer: {
    newSubjectModalVisibility: newSubjectModalVisibilitySlice,
    query: querySlice,
    subjectOffset: subjectOffsetSlice,
    [subjectApi.reducerPath]: subjectApi.reducer,
  },
  middleware: (gDM) => gDM().concat(subjectApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
