"use client";

import CustomCard from "@/components/CustomCard";
import { classNameOfScore } from "@/lib/utils";
import { useLazyListMaterialsQuery } from "@/redux/services/materialApi";
import { useEffect, useRef } from "react";
import SubjectItemMaterials from "./SubjectItemMaterials";
import { usePathname } from 'next/navigation';

export default function SubjectItem({
  subjectId,
  title,
  overallScore,
}: {
  subjectId: number;
  title: string;
  overallScore: number;
}): JSX.Element {
  const elemRef = useRef(null);
  const [fetchMaterials, { data, error }] = useLazyListMaterialsQuery();

  const pathname = usePathname()


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!data) {
          fetchMaterials({
            subjectId,
            limit: 10,
            offset: 0,
          });
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.5 },
    );

    if (elemRef.current) observer.observe(elemRef.current);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (elemRef.current) observer.unobserve(elemRef.current);
    };
  });

  return (
    <CustomCard ref={elemRef} key={subjectId} className="group p-8" hoverable href={`${pathname}/${subjectId}`}>
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-bold text-slate-600">{title}</h2>
        <p className={`text-lg font-semibold ${classNameOfScore(overallScore)}`}>{overallScore}%</p>
      </div>
      <ul className="text-neutral-700 mt-3">
        {error ? (
          <p className="text-red-500">Err: {JSON.stringify(error)}</p>
        ) : data ? (
          <SubjectItemMaterials materials={data} />
        ) : (
          <p className="animate-pulse w-full font-bold text-slate-700">
            Loading...
          </p>
        )}
      </ul>
      {/* @ts-ignore Server component */}
      {/* <SubjectItemMaterials subjectId={subjectId} /> */}
    </CustomCard>
  );
}
