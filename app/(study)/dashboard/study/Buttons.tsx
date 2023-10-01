"use client";

import CallbackButton from "@/components/CallbackButton";
import {
  endStudySession,
  startBreakTime,
  startStudyTime,
} from "@/redux/features/studySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEndStudySessionMutation } from "@/redux/services/studyApi";
import { useRouter } from "next/navigation";

export default function Buttons() {
  const currentAgenda = useAppSelector((state) => state.study.currentAgenda)!;
  const studySessionId = useAppSelector((state) => state.study.studySessionId)!;
  const studyItems = useAppSelector((state) => state.study.studyItems)!;
  const elapsed = useAppSelector((state) =>
    state.study.studyItems.reduce((acc, i) => acc + i.elapsed, 0)
  );
  const start = useAppSelector((state) => state.study.start)!;

  const dispatch = useAppDispatch();

  const router = useRouter();

  const [
    invokeEndStudySession,
    { data: endStudySessionData, error: endStudySessionError },
  ] = useEndStudySessionMutation();

  return (
    <div className="flex flex-row gap-4">
      <CallbackButton
        className="bg-white text-sky-500"
        text="Selesai"
        size="lg"
        onClick={() => {
          if (!studySessionId || !studyItems) {
            throw new Error("studySessionId or studyItems is not set");
          }

          dispatch(endStudySession());
          invokeEndStudySession({
            id: studySessionId,
            score: 80, // todo: change this
            time: {
              studyTime: studyItems
                .filter((i) => i.agenda == "study")
                .reduce((acc, i) => acc + i.elapsed, 0),
              breakTime: studyItems
                .filter((i) => i.agenda == "break")
                .reduce((acc, i) => acc + i.elapsed, 0),
            },
          });

          router.back();
        }}
      />
      <CallbackButton
        className="bg-white text-sky-500"
        text={currentAgenda == "study" ? "Istirahat" : "Lanjut Belajar"}
        size="lg"
        onClick={() => {
          if (currentAgenda == "study") {
            dispatch(
              startBreakTime({
                elapsed: new Date().getTime() - (start + elapsed),
              })
            );
          } else {
            dispatch(
              startStudyTime({
                elapsed: new Date().getTime() - (start + elapsed),
              })
            );
          }
        }}
      />
    </div>
  );
}
