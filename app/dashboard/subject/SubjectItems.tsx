"use client";

import { useListSubjectsQuery } from "@/redux/services/subjectApi";
import SubjectItem from "./SubjectItem";

export default function SubjectItems(): JSX.Element {
  const { data, isFetching, error } = useListSubjectsQuery();
  if (data && !isFetching) {
    if (data.status === "err") {
      // todo
      return <>Err: {data.reason}</>;
    }

    return (
      <>
        {data.payload.map(({ id, title, overallScore }) => (
          <SubjectItem
            key={id}
            subjectId={id}
            title={title}
            overallScore={overallScore}
          />
        ))}
      </>
    );
  }
  return <>Loading</>;
}
