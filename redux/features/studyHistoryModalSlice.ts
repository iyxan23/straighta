import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StudyHistoryModalState = {
  visible: boolean;
  id?: number;
};

const initialState = {
  visible: false,
} as StudyHistoryModalState;

export const studyHistoryModal = createSlice({
  name: "studyHistoryModal",
  initialState,
  reducers: {
    reset: () => initialState,
    closeStudyHistoryModal: (state: StudyHistoryModalState) => {
      state.visible = false;
    },
    openStudyHistoryModal: (
      state: StudyHistoryModalState,
      action: PayloadAction<number>,
    ) => {
      state.visible = true;
      state.id = action.payload;
    },
  },
});

export const { reset, closeStudyHistoryModal, openStudyHistoryModal } =
  studyHistoryModal.actions;
export default studyHistoryModal.reducer;
