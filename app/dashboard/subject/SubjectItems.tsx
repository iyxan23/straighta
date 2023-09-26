"use client";

import {
  useLazyListSubjectsQuery,
  useListSubjectsQuery,
} from "@/redux/services/subjectApi";
import React from "react";
import SubjectItem from "./SubjectItem";

const INITIAL_OFFSET = 0;
const LIMIT = 10;

export default function SubjectItems(): JSX.Element {
  const [offset, setOffset] = React.useState(INITIAL_OFFSET);
  const { data, isFetching, error } = useListSubjectsQuery({
    limit: LIMIT,
    offset: INITIAL_OFFSET,
  });
  const [fetchMore] = useLazyListSubjectsQuery();

  if (isFetching) {
    return <>Loading</>;
  }

  if (data && !isFetching) {
    const moreData = data.length < offset + LIMIT;

    console.log("items");
    console.log(data);
    return (
      <>
        {data.map(({ id, title, overallScore }) => (
          <SubjectItem
            key={id}
            subjectId={id}
            title={title}
            overallScore={overallScore}
          />
        ))}
        {!moreData && (
          <button
            onClick={() => {
              const newOffset = offset + LIMIT;
              setOffset(newOffset);

              fetchMore({ limit: LIMIT, offset: newOffset });
            }}
          >
            More
          </button>
        )}
      </>
    );
  }

  if (error) {
    return <>Err: {JSON.stringify(error)}</>;
  }

  return <>Unk state</>;
}
