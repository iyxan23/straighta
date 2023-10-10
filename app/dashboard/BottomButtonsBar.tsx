"use client";

import CallbackButton from "@/components/CallbackButton";
import { openNewSubjectModal } from "@/redux/features/newSubjectModalSlice";
import { openStartStudyModal } from "@/redux/features/startStudyModalSlice";
import { useAppDispatch } from "@/redux/hooks";
import { AppDispatch } from "@/redux/store";
import { usePathname } from "next/navigation";

const data: Record<string, (dispatch: AppDispatch) => JSX.Element> = {
  "/dashboard": (dispatch) => (
    <CallbackButton
      text="Belajar"
      size="lg"
      onClick={() => dispatch(openStartStudyModal())}
    />
  ),
  "/dashboard/subject": (dispatch) => (
    <>
      <CallbackButton
        text="Tambah"
        size="lg"
        onClick={() => dispatch(openNewSubjectModal())}
      />
    </>
  ),
};

export default function BottomButtonsBar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  if (data[pathname]) {
    return data[pathname](dispatch);
  }
  return <></>
}
