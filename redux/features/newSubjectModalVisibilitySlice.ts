import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NewSubjectModalVisibilityState = {
  visible: boolean;
};

const initialState = {
  visible: false,
} as NewSubjectModalVisibilityState;

export const counter = createSlice({
  name: "newSubjectModalVisibility",
  initialState,
  reducers: {
    reset: () => initialState,
    closeModal: (state: NewSubjectModalVisibilityState) => {
      state.visible = false;
    },
    openModal: (state: NewSubjectModalVisibilityState) => {
      state.visible = true;
    },
  },
});

export const { reset, closeModal, openModal } = counter.actions;
export default counter.reducer;
