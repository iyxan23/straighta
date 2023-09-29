import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StartStudyModalState = {
  visible: boolean;
  selectedMaterialId?: number;
};

const initialState = {
  visible: false,
} as StartStudyModalState;

export const startStudyModal = createSlice({
  name: "startStudyModal",
  initialState,
  reducers: {
    reset: () => initialState,
    setStartStudyModalMaterialId: (
      state: StartStudyModalState,
      payload: PayloadAction<number | undefined>
    ) => {
      state.selectedMaterialId = payload.payload;
    },
    finishStartStudyModal: (state: StartStudyModalState) => {
      state.selectedMaterialId = undefined;
      state.visible = false;
    },
    closeStartStudyModal: (state: StartStudyModalState) => {
      state.visible = false;
    },
    openStartStudyModal: (state: StartStudyModalState) => {
      state.visible = true;
    },
  },
});

export const {
  reset,
  setStartStudyModalMaterialId,
  finishStartStudyModal,
  closeStartStudyModal,
  openStartStudyModal,
} = startStudyModal.actions;
export default startStudyModal.reducer;
