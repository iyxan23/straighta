"use client";

import { Material } from "@/lib/types";

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
            <p className="text-yellow-500">{item.overallScore}%</p>
          </li>
        ))}
      </>
    );
}
