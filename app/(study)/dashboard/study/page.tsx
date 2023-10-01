"use client";

import { useAppSelector } from "@/redux/hooks";
import StudyView from "./StudyView";

export default function StudyPage() {
  const currentAgenda = useAppSelector((state) => state.study.currentAgenda);

  return (
    <main
      className={`h-screen w-screen ${
        currentAgenda == "study"
          ? "bg-sky-500"
          : currentAgenda == "longBreak"
          ? "bg-violet-700"
          : "bg-violet-500"
      } flex flex-col justify-around items-center transition-colors`}
    >
      <StudyView />
    </main>
  );
}
