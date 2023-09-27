"use client";

import CallbackButton from "@/components/CallbackButton";
import { openModal } from "@/redux/features/newSubjectModalVisibilitySlice";
import { useAppDispatch } from "@/redux/hooks";
import { AppDispatch } from "@/redux/store";
import { usePathname } from "next/navigation";
import LinkButton from "../../components/LinkButton";

const data: Record<string, (dispatch: AppDispatch) => JSX.Element> = {
  "/dashboard": () => <LinkButton href="/dashboard/study" text="Study" />,
  "/dashboard/subject": (dispatch) => (
    <>
      <CallbackButton text="Create Subject" onClick={() => dispatch(openModal())} />
    </>
  ),
};

export default function BottomButtonsBar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  return data[pathname](dispatch);
}
