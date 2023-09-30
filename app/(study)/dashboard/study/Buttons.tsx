"use client";

import CallbackButton from "@/components/CallbackButton";
import {
  endStudySession,
  startBreakTime,
  startStudyTime,
} from "@/redux/features/studySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function Buttons() {
  const currentAgenda = useAppSelector((state) => state.study.currentAgenda)!;
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <div className="flex flex-row gap-4">
      <CallbackButton
        className="bg-white text-sky-500"
        text="Selesai"
        size="lg"
        onClick={() => {
          dispatch(endStudySession());
          router.back();
        }}
      />
      <CallbackButton
        className="bg-white text-sky-500"
        text={currentAgenda == "study" ? "Istirahat" : "Lanjut Belajar"}
        size="lg"
        onClick={() => {
          if (currentAgenda == "study") {
            dispatch(startBreakTime({ endTime: new Date() }));
          } else {
            dispatch(startStudyTime({ endTime: new Date() }));
          }
          console.log("esteerahaat");
        }}
      />
    </div>
  );
}
