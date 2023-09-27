"use client";

import React from "react";
import { useEffect, useMemo, useRef } from "react";

export type Range = [number, number];

const MAX_RANGE = 86400; // seconds in a day

type TimeBlockColor = "blue" | "green" | "black" | "opaque-gray";

function renderTimeBlock(
  [from, to]: Range,
  color: TimeBlockColor,
  containerHeight: number
) {
  return (
    <div
      key={`${from}${to}`}
      className={`
          ${color == "blue" && "bg-sky-500"}
          ${color == "green" && "bg-green-500"}
          ${color == "black" && "bg-slate-500"}
          ${color == "opaque-gray" && "bg-slate-400 opacity-50"}
          w-full absolute`}
      style={{
        height: ((to - from) / MAX_RANGE) * containerHeight,
        bottom: (from / MAX_RANGE) * containerHeight,
      }}
    ></div>
  );
}

function renderTimeBlocks(
  ranges: Range[],
  color: TimeBlockColor,
  containerHeight: number
) {
  return (
    <>{ranges.map((range) => renderTimeBlock(range, color, containerHeight))}</>
  );
}

// A schedule item ranges from 0 - 86.400 (seconds)
// from bottom, to top
export default function ScheduleItem({
  weekday,
  scheduledRanges,
  completedRanges,
  dismissedRanges,
  blocked,
  cursor,
}: {
  weekday: string;
  scheduledRanges: Range[]; // blue, in seconds
  completedRanges: Range[]; // green, in seconds
  dismissedRanges: Range[]; // black, in seconds
  blocked?: Range;
  cursor?: {
    position: number;
    text: string;
  };
}) {
  const container = useRef<HTMLDivElement>();
  const [containerHeight, setContainerHeight] = React.useState(0);

  useEffect(() => {
    const calculateContainerHeight = () => {
      setContainerHeight(
        container.current?.getBoundingClientRect().height ?? 128
      );
    };

    window.addEventListener("resize", calculateContainerHeight);

    if (containerHeight == 0) {
      calculateContainerHeight();
    }
  });

  return (
    <div className="flex flex-row-reverse md:flex-col gap-4 items-center h-32 md:h-full w-full">
      <div
        // @ts-ignore bro this works just fine
        ref={container}
        className="h-full relative border border-slate-200 bg-white rounded-md w-full select-none"
      >
        {renderTimeBlocks(scheduledRanges, "blue", containerHeight)}
        {renderTimeBlocks(completedRanges, "green", containerHeight)}
        {renderTimeBlocks(dismissedRanges, "black", containerHeight)}
        {blocked && renderTimeBlock(blocked, "opaque-gray", containerHeight)}
        {cursor && (
          <>
            <div
              className="absolute w-full bg-red-500 z-10"
              style={{
                height: 4,
                bottom: (cursor.position / MAX_RANGE) * containerHeight,
              }}
            ></div>
            <div
              className="absolute w-full text-sm text-center text-red-500"
              style={{
                bottom: (cursor.position / MAX_RANGE) * containerHeight + 4,
              }}
            >
              {cursor.text}
            </div>
          </>
        )}
      </div>
      <p className="text-sm text-slate-600">{weekday}</p>
    </div>
  );
}
