import CustomForm from "@/components/CustomForm";
import SearchIcon from "mdi-react/SearchIcon";
import React from "react";

export default function SubjectItemSearch({
  onSearch,
  onChange,
  query,
}: {
  onSearch: (text: string) => void;
  onChange: (text: string) => void;
  query: string;
}): JSX.Element {
  return (
    <CustomForm className="md:w-1/3 flex flex-row items-center border rounded-full border-slate-200">
      <input
        type="text"
        className="py-2 px-4 rounded-l-full w-full focus:outline-none focus:ring focus:ring-sky-200"
        value={query}
        onChange={(ev) => onChange(ev.target.value)}
      />
      <button
        className="py-2 px-6 rounded-r-full group hover:bg-sky-400 bg-sky-500 h-full flex items-center focus:outline-none focus:ring focus:ring-sky-200 active:bg-sky-600 active:scale-95 transition-all"
        onClick={() => onSearch(query)}
      >
        <SearchIcon size={24} className="fill-white" />
      </button>
    </CustomForm>
  );
}
