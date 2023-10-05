"use client";

import { useEffect, useState } from "react";

export default function ScheduleItemLoading({
  index,
}: {
  index: number;
}): JSX.Element {
  return (
    <div
      className="
        -translate-y-full
        animate-[shimmer_2s_infinite]
        w-full h-full
        bg-gradient-to-t from-transparent via-slate-200/40 to-transparent"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    />
  );
}
