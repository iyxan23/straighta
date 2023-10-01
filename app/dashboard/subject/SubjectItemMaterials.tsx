"use client";

import { useListMaterialsQuery } from "@/redux/services/materialApi";

export default function SubjectItemMaterials({
  subjectId,
}: {
  subjectId: number;
}): JSX.Element {
  // todo: IntersectionObserver

  const { data, error } = useListMaterialsQuery({
    subjectId,
    limit: 99,
    offset: 0,
  });

  if (error) {
    return (
      <p className="text-sm text-red-500">Error: {JSON.stringify(error)}</p>
    );
  }

  if (data) {
    return (
      <>
        {data.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-1">
            <p>{item.title}</p>
            <hr className="grow mx-4 border-dashed border-neutral-400 group-hover:border-neutral-500" />
            <p className="text-yellow-500">{item.overallScore}%</p>
          </li>
        ))}
      </>
    );
  }

  return <p className="text-slate-500 animate-pulse">Loading...</p>;
}
