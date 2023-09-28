"use client";

import React from "react";

export type Range = [number, number];

const MAX_RANGE = 86400; // seconds in a day

type TimeBlockColor = "blue" | "green" | "black" | "blocked";

function renderTimeBlock([from, to]: Range, color: TimeBlockColor) {
  return (
    <div
      key={`${from}${to}`}
      className={`
          ${color == "blue" && "bg-sky-500 hover:ring-sky-200"}
          ${color == "green" && "bg-green-500 hover:ring-green-200"}
          ${color == "black" && "bg-slate-500 hover:ring-slate-200"}
          ${color == "blocked" && "bg-purple-300 opacity-50 z-10"}
          w-full absolute text-white text-sm
          flex justify-center
          items-center text-opacity-75
          ${
            color != "blocked" &&
            "hover:scale-105 hover:ring hover:shadow-md cursor-pointer"
          }
          transition-all rounded-sm`}
      style={{
        height: `${((to - from) / MAX_RANGE) * 100}%`,
        bottom: `${(from / MAX_RANGE) * 100}%`,
      }}
    >
      {color != "blocked" && "Hello world"}
    </div>
  );
}

function renderTimeBlocks(ranges: Range[], color: TimeBlockColor) {
  return <>{ranges.map((range) => renderTimeBlock(range, color))}</>;
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
  // const container = useRef<HTMLDivElement>();
  // const [containerHeight, setContainerHeight] = React.useState(0);

  // useEffect(() => {
  //   const calculateContainerHeight = () => {
  //     setContainerHeight(
  //       container.current?.getBoundingClientRect().height ?? 128
  //     );
  //   };

  //   window.addEventListener("resize", calculateContainerHeight);

  //   if (containerHeight == 0) {
  //     calculateContainerHeight();
  //   }
  // });

  return (
    <div className="flex flex-row-reverse md:flex-col gap-4 items-center h-32 md:h-full w-full">
      <div className="h-full relative border border-slate-200 bg-white rounded-md w-full select-none">
        {renderTimeBlocks(scheduledRanges, "blue")}
        {renderTimeBlocks(completedRanges, "green")}
        {renderTimeBlocks(dismissedRanges, "black")}
        {blocked && renderTimeBlock(blocked, "blocked")}
        {cursor && (
          <>
            <div
              className="
                absolute w-full bg-purple-500 z-30

                before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0
                before:transform before:-translate-y-[2px] before:-translate-x-1/2 before:w-2 before:h-2
                before:rounded-full before:bg-purple-500

                after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0
                after:transform after:-translate-y-[2px] after:translate-x-1/2 after:w-2 after:h-2
                after:rounded-full after:bg-purple-500"
              style={{
                height: 4,
                bottom: `${(cursor.position / MAX_RANGE) * 100}%`,
              }}
            ></div>
            <div
              className="
              absolute left-1/2 transform -translate-x-1/2 text-sm text-center text-white
              bg-purple-500 px-2 py-1 rounded-full shadow-md font-bold
              hover:scale-105
              transition-all cursor-pointer"
              style={{
                bottom: `calc(${(cursor.position / MAX_RANGE) * 100}% + .5rem)`,
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
