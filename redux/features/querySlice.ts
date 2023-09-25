import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type QueryState = {
  query?: string;
};

const initialState = {
  query: undefined,
} as QueryState;

export const counter = createSlice({
  name: "query",
  initialState,
  reducers: {
    reset: () => initialState,
    setQuery: (state: QueryState, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const { reset, setQuery } = counter.actions;
export default counter.reducer;
