import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EDGE_RUNTIME_WEBPACK } from "next/dist/shared/lib/constants";

type Agenda = "break" | "study";

type StudyItem = {
  agenda: Agenda;
  elapsed: number;
};

type StudyItems = StudyItem[];

type StudyState = {
  studying: boolean;

  studySessionId?: number;
  focusMaterialId?: number;
  start?: number;

  currentAgenda?: Agenda;
  studyItems: StudyItems;
};

const initialState = {
  studying: false,
  studyItems: [],
} as StudyState;

export const study = createSlice({
  name: "study",
  initialState,
  reducers: {
    reset: () => initialState,
    startBreakTime: (
      state: StudyState,
      payload: PayloadAction<{ elapsed: number }>
    ) => {
      if (!state.currentAgenda) {
        throw new Error(
          "currentAgenda is not set while trying to take a break"
        );
      }

      state.studyItems = [
        ...state.studyItems,
        {
          agenda: state.currentAgenda,
          elapsed: payload.payload.elapsed,
        },
      ];

      state.currentAgenda = "break";
    },
    startStudyTime: (
      state: StudyState,
      payload: PayloadAction<{ elapsed: number }>
    ) => {
      if (!state.currentAgenda) {
        throw new Error(
          "currentAgenda is not set while trying to take a break"
        );
      }

      state.studyItems = [
        ...state.studyItems,
        { agenda: state.currentAgenda, elapsed: payload.payload.elapsed },
      ];

      state.currentAgenda = "study";
    },
    startStudySession: (
      state: StudyState,
      payload: PayloadAction<{
        studySessionId: number;
        materialId: number;
        startDate: Date;
      }>
    ) => {
      state.studying = true;
      state.studySessionId = payload.payload.studySessionId;
      state.focusMaterialId = payload.payload.materialId;
      state.start = payload.payload.startDate.getTime();
      state.currentAgenda = "study";
      state.studyItems = [];
    },
    endStudySession: (state: StudyState) => {
      state.studying = false;
      state.focusMaterialId = undefined;
      state.start = undefined;
      state.studyItems = [];
    },
  },
});

export const {
  reset,
  startBreakTime,
  startStudyTime,
  startStudySession,
  endStudySession,
} = study.actions;
export default study.reducer;
