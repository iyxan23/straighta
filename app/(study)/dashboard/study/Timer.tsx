"use client";

import { useAppSelector } from "@/redux/hooks";

export default function Timer() {
  const currentAgenda = useAppSelector((state) => state.study.currentAgenda)!;

  return (
    <div className="flex flex-col gap-2 items-center">
      <h2 className="text-9xl text-white font-bold tracking-widest">12:34</h2>
      <h2 className="text-2xl text-white opacity-75 tracking-wide">
        {currentAgenda == "study" ? "Belajar" : "Istirahat"}
      </h2>
    </div>
  );
}
