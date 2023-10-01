import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EDGE_RUNTIME_WEBPACK } from "next/dist/shared/lib/constants";

export type Agenda = "break" | "study" | "longBreak";

export type StudyItem = {
  agenda: Agenda;
  elapsed: number;
};

export type StudyItems = StudyItem[];

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
    startLongBreakTime: (
      state: StudyState,
      payload: PayloadAction<{ elapsed: number }>,
    ) => {
      if (!state.currentAgenda) {
        throw new Error(
          "currentAgenda is not set while trying to take a long break",
        );
      }

      state.studyItems = [
        ...state.studyItems,
        {
          agenda: state.currentAgenda,
          elapsed: payload.payload.elapsed,
        },
      ];

      state.currentAgenda = "longBreak";
    },
    startBreakTime: (
      state: StudyState,
      payload: PayloadAction<{ elapsed: number }>,
    ) => {
      if (!state.currentAgenda) {
        throw new Error(
          "currentAgenda is not set while trying to take a break",
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
      payload: PayloadAction<{ elapsed: number }>,
    ) => {
      if (!state.currentAgenda) {
        throw new Error(
          "currentAgenda is not set while trying to take a break",
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
        start: number;
      }>,
    ) => {
      state.studying = true;
      state.studySessionId = payload.payload.studySessionId;
      state.focusMaterialId = payload.payload.materialId;
      state.start = payload.payload.start;
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
  startLongBreakTime,
  startBreakTime,
  startStudyTime,
  startStudySession,
  endStudySession,
} = study.actions;
export default study.reducer;
