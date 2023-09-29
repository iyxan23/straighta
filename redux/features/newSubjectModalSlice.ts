import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NewSubjectModalState = {
  visible: boolean;
  newSubjectName: string;
  subjectMaterials: string;
};

const initialState = {
  visible: false,
  newSubjectName: "",
  subjectMaterials: "",
} as NewSubjectModalState;

export const counter = createSlice({
  name: "newSubjectModal",
  initialState,
  reducers: {
    reset: () => initialState,
    finishNewSubjectModal: (state: NewSubjectModalState) => {
      state.visible = false;
      state.newSubjectName = "";
      state.subjectMaterials = "";
    },
    setSubjectName: (
      state: NewSubjectModalState,
      payload: PayloadAction<string>
    ) => {
      state.newSubjectName = payload.payload;
    },
    setSubjectMaterials: (
      state: NewSubjectModalState,
      payload: PayloadAction<string>
    ) => {
      state.subjectMaterials = payload.payload;
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
  setSubjectMaterials,
  closeNewSubjectModal,
  openNewSubjectModal,
  finishNewSubjectModal,
} = counter.actions;
export default counter.reducer;
