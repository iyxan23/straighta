import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SubjectOffsetState = {
  offset: number;
};

const initialState = {
  offset: 0,
} as SubjectOffsetState;

export const counter = createSlice({
  name: "query",
  initialState,
  reducers: {
    reset: () => initialState,
    addOffset: (state: SubjectOffsetState, action: PayloadAction<number>) => {
      state.offset += action.payload;
    },
  },
});

export const { reset, addOffset } = counter.actions;
export default counter.reducer;
