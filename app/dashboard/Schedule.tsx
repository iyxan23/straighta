"use client";

import { TimeoutId } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";
import React, { useEffect } from "react";
import ScheduleItem from "./ScheduleItem";

function sec(time: `${number}:${number}`) {
  const [hours, minutes] = time.split(":", 2).map((s) => Number(s));
  return minutes * 60 + hours * 60 * 60;
}

type Range = [number, number];
type TimeBlock = { text: string; range: Range };
type DaySchedule = { scheduled: TimeBlock[]; completed: string[] };
type Schedule = [
  DaySchedule,
  DaySchedule,
  DaySchedule,
  DaySchedule,
  DaySchedule,
  DaySchedule,
  DaySchedule,
];

const schedule: Schedule = [
  {
    scheduled: [{ text: "Membaca teks", range: [sec("18:00"), sec("20:00")] }],
    completed: ["Membaca teks"],
  },
  {
    scheduled: [
      { text: "Memahami Pertambahan", range: [sec("18:00"), sec("20:00")] },
    ],
    completed: ["Memahami Pertambahan"],
  },
  {
    scheduled: [{ text: "Materi 2", range: [sec("18:00"), sec("20:00")] }],
    completed: [],
  },
  {
    scheduled: [{ text: "Materi 7", range: [sec("18:00"), sec("20:00")] }],
    completed: [],
  },
  {
    scheduled: [
      { text: "Menyusun Proposal", range: [sec("18:00"), sec("20:00")] },
    ],
    completed: [],
  },
  {
    scheduled: [
      { text: "Selektor dalam CSS", range: [sec("18:00"), sec("20:00")] },
    ],
    completed: [],
  },
  {
    scheduled: [
      { text: "Kegunaan Edge Servers", range: [sec("08:00"), sec("10:00")] },
      { text: "Kenapa air bening?", range: [sec("15:45"), sec("17:00")] },
    ],
    completed: [],
  },
];

const weekdays = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jum'at",
  "Sabtu",
  "Minggu",
];

export default function Schedule() {
  const [timeMs, setTimeMs] = React.useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const msSinceMidnight =
        new Date().getTime() - new Date().setUTCHours(0, 0, 0, 0);

      setTimeMs(msSinceMidnight);
    }, 100);

    return () => {
      clearInterval(id);
    };
  });

  return (
    <>
      {schedule.map((s, index) => {
        const nowTime = new Date(timeMs);
        const seconds = timeMs / 1000 - nowTime.getTimezoneOffset() * 60;
        const dayOfTheWeek = nowTime.getUTCDay();

        const completedSchedules = s.scheduled.filter((t) =>
          s.completed.includes(t.text)
        );

        function isScheduleDismissed(
          block: TimeBlock,
          dayOfTheWeek: number,
          timeBlockDayOfTheWeek: number
        ): boolean {
          const SECONDS_IN_ONE_DAY = 60 * 60 * 24;
          const secsFromMonday = dayOfTheWeek * SECONDS_IN_ONE_DAY;
          const secsFromTimeBlock = timeBlockDayOfTheWeek * SECONDS_IN_ONE_DAY;

          return secsFromTimeBlock + block.range[1] < secsFromMonday + seconds;
        }

        return (
          <ScheduleItem
            weekday={weekdays[index]}
            scheduledRanges={s.scheduled.map((s) => s.range)}
            completedRanges={completedSchedules.map((t) => t.range)}
            dismissedRanges={s.scheduled
              .filter(
                (t) =>
                  !completedSchedules.includes(t) &&
                  isScheduleDismissed(t, dayOfTheWeek, index)
              )
              .map((s) => s.range)}
            cursor={
              dayOfTheWeek == index
                ? {
                    position: seconds,
                    text: nowTime.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }),
                  }
                : undefined
            }
            blocked={
              dayOfTheWeek == index
                ? [sec("00:00"), seconds]
                : dayOfTheWeek > index
                ? [sec("00:00"), sec("24:00")]
                : undefined
            }
            key={index}
          />
        );
      })}
    </>
  );
}
