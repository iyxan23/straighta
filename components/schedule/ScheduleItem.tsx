"use client";

import React from "react";

// A schedule item ranges from 0 - 86.400 (seconds)
// from bottom, to top
export default function ScheduleItem({
  weekday,
  children,
}: {
  weekday: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row-reverse md:flex-col gap-4 items-center h-32 md:h-full w-full">
      <div className="h-full relative border border-slate-200 bg-white rounded-md w-full select-none overflow-hidden">
        {children}
      </div>
      <p className="text-sm text-slate-600">{weekday}</p>
    </div>
  );
}
