import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StudyHistoryOffsetState = {
  offset: number;
};

const initialState = {
  offset: 0,
} as StudyHistoryOffsetState;

export const counter = createSlice({
  name: "studyHistoryOffset",
  initialState,
  reducers: {
    reset: () => initialState,
    addOffset: (state: StudyHistoryOffsetState, action: PayloadAction<number>) => {
      state.offset += action.payload;
    },
  },
});

export const { reset, addOffset } = counter.actions;
export default counter.reducer;