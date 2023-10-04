"use client";

import { Material } from "@/lib/types";
import { classNameOfScore } from "@/lib/utils";

export default function SubjectItemMaterials({
  materials
}: {
  materials: Material[]
}): JSX.Element {
    return (
      <>
        {materials.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-1">
            <p>{item.title}</p>
            <hr className="grow mx-4 border-dashed border-neutral-400 group-hover:border-neutral-500" />
            <p className={`${classNameOfScore(item.overallScore)}`}>{item.overallScore}%</p>
          </li>
        ))}
      </>
    );
}
