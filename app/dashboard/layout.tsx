import BookIcon from "mdi-react/BookIcon";
import ViewWeekIcon from "mdi-react/ViewWeekIcon";
import Link from "next/link";
import React from "react";
import Navigation from "./Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <header className="fixed bottom-0 z-10 w-full bg-white shadow-lg border-slate-200 border-t-2 flex flex-row justify-between py-3 px-4">
        <div className="flex flex-row gap-4 w-full">
          <div className="bg-black rounded-full h-full aspect-square"></div>
          <div className="">
            <div className="font-bold">Nur Ihsan Al Ghifari</div>
            <div className="opacity-50 text-sm">What in the world</div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button className="rounded-lg text-lg shadow-md bg-sky-500 active:bg-sky-600 active:scale-[97%] px-8 py-2 align-middle text-center text-white font-bold hover:bg-sky-400 focus:outline-none focus:ring focus:ring-sky-200 hover:shadow-lg transition-all">
            Study
          </button>
        </div>
        <Navigation />
      </header>
      {children}
    </div>
  );
}
