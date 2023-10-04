import newSubjectModalSlice from "./features/newSubjectModalSlice";
import querySlice from "./features/querySlice";
import studyHistoryOffsetSlice from "./features/studyHistoryOffsetSlice";
import subjectOffsetSlice from "./features/subjectOffsetSlice";
import startStudyModalSlice from "./features/startStudyModalSlice";
import studySlice from "./features/studySlice";
import studyHistoryModal from './features/studyHistoryModalSlice';

import { subjectApi } from "./services/subjectApi";
import { configureStore } from "@reduxjs/toolkit";
import { studyApi } from "./services/studyApi";
import { materialApi } from "./services/materialApi";

export const store = configureStore({
  reducer: {
    newSubjectModal: newSubjectModalSlice,
    startStudyModal: startStudyModalSlice,
    query: querySlice,
    study: studySlice,
    subjectOffset: subjectOffsetSlice,
    studyHistoryOffset: studyHistoryOffsetSlice,
    studyHistoryModal: studyHistoryModal,
    [subjectApi.reducerPath]: subjectApi.reducer,
    [studyApi.reducerPath]: studyApi.reducer,
    [materialApi.reducerPath]: materialApi.reducer,
  },
  middleware: (gDM) =>
    gDM()
      .concat(subjectApi.middleware)
      .concat(studyApi.middleware)
      .concat(materialApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
