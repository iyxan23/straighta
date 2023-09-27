import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NewSubjectModalState = {
  visible: boolean;
  newSubjectName: string;
  finalizedSubjectName?: string;
};

const initialState = {
  visible: false,
  newSubjectName: "",
} as NewSubjectModalState;

export const counter = createSlice({
  name: "newSubjectModalVisibility",
  initialState,
  reducers: {
    reset: () => initialState,
    finishNewSubjectModal: (state: NewSubjectModalState) => {
      state.visible = false;
      state.finalizedSubjectName = state.newSubjectName;
    },
    setSubjectName: (
      state: NewSubjectModalState,
      payload: PayloadAction<string>
    ) => {
      state.newSubjectName = payload.payload;
    },
    closeNewSubjectModal: (state: NewSubjectModalState) => {
      state.visible = false;
    },
    openNewSubjectModal: (state: NewSubjectModalState) => {
      state.visible = true;
    },
  },
});

export const {
  reset,
  setSubjectName,
  closeNewSubjectModal,
  openNewSubjectModal,
  finishNewSubjectModal,
} = counter.actions;
export default counter.reducer;
