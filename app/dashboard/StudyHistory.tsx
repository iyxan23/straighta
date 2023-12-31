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
      <ul className="space-y-2 flex flex-col">
        {data.map((item) => (
          <HistoryItem key={item.id} studySession={item} onClick={(id) => {}} />
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
            className='bg-sky-500 text-white rounded-full px-4 py-2 mx-auto'
          >
            Muat lebih
          </button>
        )}
      </ul>
    );
  }

  return (
    <p className="animate-pulse text-slate-600 w-full text-center">
      Loading...
    </p>
  );
}
