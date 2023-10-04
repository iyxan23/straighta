"use client";

import { sec } from "@/lib/utils";
import { useGetScheduleQuery } from "@/redux/services/scheduleApi";
import React, { useEffect, useRef } from "react";
import ScheduleItem, { TimeBlock } from "./ScheduleItem";

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

const weekdays = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jum'at",
  "Sabtu",
];

export default function Schedule() {
  const nowDate = useRef(new Date());
  const { data: schedule, error } = useGetScheduleQuery({
    time: nowDate.current.getTime(),
  });

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
    schedule && (
      <>
        {schedule.map((s, index) => {
          const nowTime = new Date(timeMs);
          const seconds = timeMs / 1000 - nowTime.getTimezoneOffset() * 60;
          const dayOfTheWeek = new Date().getUTCDay();

          // const completedSchedules = s.scheduled.filter((t) =>
          //   s.completed.includes(t.text)
          // );

          function isScheduleDismissed(
            block: [number, number],
            dayOfTheWeek: number,
            timeBlockDayOfTheWeek: number,
          ): boolean {
            const SECONDS_IN_ONE_DAY = 60 * 60 * 24;
            const secsFromMonday = dayOfTheWeek * SECONDS_IN_ONE_DAY;
            const secsFromTimeBlock =
              timeBlockDayOfTheWeek * SECONDS_IN_ONE_DAY;

            return secsFromTimeBlock + block[1] < secsFromMonday + seconds;
          }

          return (
            <ScheduleItem
              weekday={weekdays[index]}
              scheduledRanges={s.map((i) => ({
                text: "test",
                range: [i.startRelativeTimestamp, i.endRelativeTimestamp],
              }))}
              // completedRanges={completedSchedules}
              completedRanges={[]} // todo: include completed schedules in api
              dismissedRanges={s
                .filter((i) =>
                  // !completedSchedules.includes(t) &&
                  isScheduleDismissed(
                    [i.startRelativeTimestamp, i.endRelativeTimestamp],
                    dayOfTheWeek,
                    index,
                  ),
                )
                .map((i) => ({
                  text: "test",
                  range: [i.startRelativeTimestamp, i.endRelativeTimestamp],
                }))}
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
    )
  );
}
