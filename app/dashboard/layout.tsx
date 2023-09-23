import React from "react";
import Navigation from "./Navigation";
import Link from "next/link";
import BottomButtonsBar from "./BottomButtonsBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden h-screen w-screen">
      {children}
      <header className="sticky bottom-0 z-10 w-full h-fit bg-white shadow-lg border-slate-200 border-t-2 flex flex-row justify-between py-3 px-4">
        <div className="flex flex-row gap-4 w-full">
          <div className="bg-black rounded-full h-full aspect-square"></div>
          <div className="">
            <div className="font-bold">Nur Ihsan Al Ghifari</div>
            <div className="opacity-50 text-sm">What in the world</div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BottomButtonsBar />
        </div>
        <Navigation />
      </header>
    </div>
  );
}
