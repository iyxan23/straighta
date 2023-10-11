"use client";

import { useEffect, useState } from "react";
import SubjectDetailItem from "./SubjectDetailItem";

interface SubjectDetailListProps {
  materials: Array<{
    id: number;
    title: string;
  }>;
}

export default function SubjectDetailList({
  materials,
}: SubjectDetailListProps) {
  const [isMedium, setIsMedium] = useState(false);
  const [isXLarge, setIsXLarge] = useState(false);

  useEffect(() => {
    const firstMediaQuery = window.matchMedia("(min-width: 768px)");
    const secondMediaQuery = window.matchMedia("(min-width: 1280px)");

    setIsMedium(firstMediaQuery.matches);
    setIsXLarge(secondMediaQuery.matches);

    const handleFirstMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMedium(event.matches);
    };

    const handleSecondMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsXLarge(event.matches);
    };

    firstMediaQuery.addEventListener("change", handleFirstMediaQueryChange);
    secondMediaQuery.addEventListener("change", handleSecondMediaQueryChange);

    return () => {
      firstMediaQuery.removeEventListener("change", handleFirstMediaQueryChange);
      secondMediaQuery.removeEventListener("change", handleSecondMediaQueryChange);
    };
  }, []);

  const numberOfList = () => {
    if (isXLarge) return 3;
    if (isMedium) return 2;
    else return 1;
  };

  return (
    <section className={`mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-7xl mx-auto`}>
      {Array.from({ length: numberOfList() }).map((_, indexList) => {
        return (
          <ul key={indexList} className="flex flex-col gap-4">
            {materials.map((material, index) => {
              const result = (index % numberOfList()) + 1;
              return (
                result === indexList + 1 && (
                  <li key={material.id} className="group">
                    <SubjectDetailItem key={material.id} {...material} />
                  </li>
                )
              );
            })}
          </ul>
        );
      })}
    </section>
  );
}
