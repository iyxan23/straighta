"use client";

import { useAppSelector } from "@/redux/hooks";
import { useGetMaterialByIdQuery } from "@/redux/services/materialApi";
import { useRouter } from "next/navigation";
import Buttons from "./Buttons";
import Timer from "./Timer";

export default function StudyView() {
  const isStudying = useAppSelector((state) => state.study.studying);
  const focusMaterialId = useAppSelector(
    (state) => state.study.focusMaterialId
  )!;
  const startTime = useAppSelector((state) => state.study.start)!;

  const { replace } = useRouter();

  // kick em out when there is no study session ongoing
  if (!isStudying) {
    replace("/dashboard");
  }

  const { data, error } = useGetMaterialByIdQuery({
    id: focusMaterialId!,
  });

  if (error) {
    console.error(error);
    return <>Err: {JSON.stringify(error)}</>;
  }

  if (data) {
    return (
      <>
        <div className="flex flex-col gap-4 items-center w-2/3">
          <h2 className="text-3xl tracking-wide text-white opacity-75 font-semibold">
            Fokus
          </h2>
          <h2 className="text-4xl tracking-tight text-white font-semibold text-center">
            {data.title}
          </h2>
        </div>
        <Timer />
        <Buttons />
      </>
    );
  }

  return (
    <p className="animate-pulse text-white font-bold w-full text-center">
      Loading
    </p>
  );
}
