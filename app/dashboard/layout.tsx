import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { headers } from "next/headers";
import React from "react";
import Navigation from "../../components/client/Navigation";
import BottomButtonsBar from "./BottomButtonsBar";
import LogoutButton from "./LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = headers().get(HEADER_TOKEN_USERNAME)!;

  return (
    <div className="h-screen max-h-screen w-screen flex flex-col-reverse md:flex-col">
      {children}
      <header className="md:relative h-20 z-10 w-full bg-white shadow-md border-slate-200 border-t-2 flex flex-row justify-between py-3 px-4">
        <div className="flex items-center gap-4 w-full">
          <div className="bg-black rounded-full h-full aspect-square" />
          <div>
            <strong>{username}</strong>
            <p className="opacity-50 text-sm">PELAJAR</p>
          </div>
          <LogoutButton />
        </div>
        <div className="absolute max-md:bottom-2 md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <BottomButtonsBar />
        </div>
        <Navigation />
      </header>
    </div>
  );
}
