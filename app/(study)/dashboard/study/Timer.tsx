"use client";

import {
  Agenda,
  startBreakTime,
  startLongBreakTime,
  startStudyTime,
} from "@/redux/features/studySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

const STUDY_TIME = 25 * 60 * 1000; // 25 minutes
const BREAK_TIME = 5 * 60 * 1000; // 5 minutes
const LONG_BREAK_TIME = 25 * 60 * 1000; // 25 minutes

function determineTimeToSpend(agenda: Agenda): number {
  switch (agenda) {
    case "study":
      return STUDY_TIME;
    case "break":
      return BREAK_TIME;
    case "longBreak":
      return LONG_BREAK_TIME;
  }
}

export default function Timer() {
  const currentAgenda = useAppSelector((state) => state.study.currentAgenda)!;
  const timeFrom = useAppSelector(
    (state) =>
      state.study.start! +
      state.study.studyItems.reduce((acc, i) => acc + i.elapsed, 0),
  )!;
  const lastFourItems = useAppSelector((state) =>
    state.study.studyItems.slice(-4),
  );
  const dispatch = useAppDispatch();

  const [timer, setTimer] = useState("--:--");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const differenceFromPrevAgenda = new Date().getTime() - timeFrom;
      const timeToSpend = determineTimeToSpend(currentAgenda);
      const time = timeToSpend - differenceFromPrevAgenda;

      if (time <= 0) {
        // stop!
        if (currentAgenda == "study") {
          // do a long break if the last four items doesn't contain any long break,
          // and its length is 4
          if (
            lastFourItems.length == 4 &&
            !lastFourItems.find((i) => i.agenda == "longBreak")
          ) {
            dispatch(startLongBreakTime({ elapsed: differenceFromPrevAgenda }));
          } else {
            dispatch(startBreakTime({ elapsed: differenceFromPrevAgenda }));
          }
        } else {
          dispatch(startStudyTime({ elapsed: differenceFromPrevAgenda }));
        }
      }
      // todo long break time

      const timeText = new Date(time).toLocaleTimeString(undefined, {
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      if (timer != timeText && timer != "Invalid Date") {
        setTimer(timeText);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div className="flex flex-col gap-2 items-center">
      <h2 className="text-9xl text-white font-bold tracking-widest">{timer}</h2>
      <h2 className="text-2xl text-white opacity-75 tracking-wide animate-pulse">
        {currentAgenda == "study"
          ? "Belajar"
          : `Istirahat${currentAgenda == "longBreak" ? " Panjang" : ""}`}
      </h2>
    </div>
  );
}
