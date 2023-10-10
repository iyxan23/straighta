"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function ScheduleItemLoading({
  index,
  className,
}: {
  index: number;
  className?: string;
}): JSX.Element {
  return (
    <div
      className={twMerge(
        `
        -translate-y-full
        animate-[shimmer-y_2s_infinite]
        w-full h-full
        bg-gradient-to-t from-transparent via-slate-200/40 to-transparent`,
        className,
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    />
  );
}
