"use client";

import { setQuery } from "@/redux/features/querySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import SubjectItems from "./SubjectItems";
import SubjectItemSearch from "./SubjectItemSearch";

export default function SubjectsView() {
  const query = useAppSelector((state) => state.query.query);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center w-screen">
      <div className="sticky -top-8 flex flex-col items-center p-8 w-full bg-slate-100">
        <SubjectItemSearch
          query={query ?? ""}
          onSearch={(query) => {
            dispatch(setQuery(query));
          }}
          onChange={(query) => {
            dispatch(setQuery(query));
          }}
        />
      </div>
      <div className="flex flex-col w-2/3 gap-4 mb-8">
        <SubjectItems />
      </div>
    </div>
  );
}
