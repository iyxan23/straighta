"use client";

import { addOffset } from "@/redux/features/studyHistoryOffsetSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLazyListStudySessionsQuery } from "@/redux/services/studyApi";
import { useEffect } from "react";
import HistoryItem from "./StudyHistoryItem";

const LIMIT = 10;

export default function History() {
  const offset = useAppSelector((state) => state.studyHistoryOffset.offset);
  const dispatch = useAppDispatch();

  const [fetchMore, { data, isFetching, error }] =
    useLazyListStudySessionsQuery();

  // for some unknown reason, it always fetches on page render, even after a navigation change.
  // this sounds a bit problematic and inefficient.
  useEffect(() => {
    fetchMore({ limit: LIMIT, offset: offset });
  }, [fetchMore, offset]);

  if (error) {
    return <>Err: {JSON.stringify(error)}</>;
  }

  if (data) {
    if (data.length == 0) {
      return (
        <p className="w-full h-full text-slate-600 text-center">
          Belum ada sesi belajar, klik tombol belajar untuk memulai!
        </p>
      );
    }

    const moreData = data.length < offset + LIMIT;

    return (
      <>
        {data.map((item) => (
          <HistoryItem key={item.id} studySession={item} />
        ))}
        {isFetching && (
          <p className="animate-pulse text-slate-600 w-full text-center">
            Loading...
          </p>
        )}
        {!moreData && (
          <button
            onClick={() => {
              dispatch(addOffset(LIMIT));
            }}
          >
            Muat lebih
          </button>
        )}
      </>
    );
  }

  return (
    <p className="animate-pulse text-slate-600 w-full text-center">
      Loading...
    </p>
  );
}
