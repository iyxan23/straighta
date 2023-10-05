"use client";

import { sec } from "@/lib/utils";
import { useGetMaterialByIdQuery } from "@/redux/services/materialApi";
import { useGetScheduleQuery } from "@/redux/services/scheduleApi";
import React, { useEffect, useRef } from "react";
import BlockedTimeBlock from "./BlockedTimeBlock";
import Cursor from "./Cursor";
import MaterialTimeBlock from "./MaterialTimeBlock";
import ScheduleItem from "./ScheduleItem";

export const MAX_SCHEDULE_RANGE = 86400; // seconds in a day

const weekdays = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jum'at",
  "Sabtu",
];

export default function Schedule(): JSX.Element {
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

  return error ? (
    <p className="text-red-500 font-bold">Err: {JSON.stringify(error)}</p>
  ) : schedule ? (
    <>
      {schedule.map((scheduleDay, index) => {
        const nowTime = new Date(timeMs);
        const relativeSeconds =
          timeMs / 1000 - nowTime.getTimezoneOffset() * 60;
        const dayOfTheWeek = new Date().getUTCDay();

        function isScheduleDismissed(
          endRelativeTimestamp: number,
          dayOfTheWeek: number,
          timeBlockDayOfTheWeek: number,
        ): boolean {
          const SECONDS_IN_ONE_DAY = 60 * 60 * 24;
          const secsFromMonday = dayOfTheWeek * SECONDS_IN_ONE_DAY;
          const secsFromTimeBlock = timeBlockDayOfTheWeek * SECONDS_IN_ONE_DAY;

          return (
            secsFromTimeBlock + endRelativeTimestamp <
            secsFromMonday + relativeSeconds
          );
        }

        return (
          <ScheduleItem key={index} weekday={weekdays[index]}>
            {/* The cursor */}
            {dayOfTheWeek == index && (
              <Cursor
                position={relativeSeconds}
                text={nowTime.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              />
            )}
            {/* Block the whole day for schedules other than the index */}
            {dayOfTheWeek == index ? (
              <BlockedTimeBlock
                startRelativeTimestamp={sec("00:00")}
                endRelativeTimestamp={relativeSeconds}
              />
            ) : (
              // only block the whole day if now is less than
              // the schedule day
              dayOfTheWeek > index && (
                <BlockedTimeBlock
                  startRelativeTimestamp={sec("00:00")}
                  endRelativeTimestamp={sec("24:00")}
                />
              )
            )}
            {/* Render schedules based on their status */}
            {scheduleDay.map((scheduleDayItem) => (
              <MaterialTimeBlock
                key={scheduleDayItem.materialId}
                materialId={scheduleDayItem.materialId}
                startRelativeTimestamp={scheduleDayItem.startRelativeTimestamp}
                endRelativeTimestamp={scheduleDayItem.endRelativeTimestamp}
                status={
                  isScheduleDismissed(
                    scheduleDayItem.endRelativeTimestamp,
                    dayOfTheWeek,
                    index,
                  )
                    ? "dismissed"
                    : "scheduled"
                }
              />
            ))}
          </ScheduleItem>
        );
      })}
    </>
  ) : (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <ScheduleItem key={index} weekday={weekdays[index]}>
          <div className="w-full h-full bg-slate-200 animate-pulse" />
        </ScheduleItem>
      ))}
    </>
  );
}
