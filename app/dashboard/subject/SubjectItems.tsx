"use client";

import { addOffset } from "@/redux/features/subjectOffsetSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useLazyListSubjectsQuery,
  useListSubjectsQuery,
} from "@/redux/services/subjectApi";
import React, { useEffect } from "react";
import SubjectItem from "./SubjectItem";

const LIMIT = 10;

export default function SubjectItems(): JSX.Element {
  const offset = useAppSelector((state) => state.subjectOffset.offset);
  const dispatch = useAppDispatch();

  const [fetchMore, { data, isFetching, error }] = useLazyListSubjectsQuery();

  // for some unknown reason, it always fetches on page render, even after a navigation change.
  // this sounds a bit problematic and inefficient.
  useEffect(() => {
    fetchMore({ limit: LIMIT, offset: offset });
  }, [fetchMore, offset]);

  if (data) {
    const moreData = data.length < offset + LIMIT;

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
        {isFetching && <p>Loading...</p>}
        {!moreData && (
          <button
            onClick={() => {
              console.log("dispatching adding offset");
              dispatch(addOffset(LIMIT));
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

  return <>Loading...</>;
}
