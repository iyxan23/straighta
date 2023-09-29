"use client";

import CallbackButton from "@/components/CallbackButton";
import { useRouter } from "next/navigation";
import React from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [progress, setProgress] = React.useState(false);

  return (
    <CallbackButton
      className={`bg-white active:bg-white focus:ring-0 hover:bg-transparent text-red-500 shadow-none ${
        progress ? "animate-pulse opacity-50" : ""
      }`}
      onClick={() => {
        setProgress(true);
        fetch("/api/auth/logout", { method: "POST" }).then(() =>
          router.replace("/auth/login")
        );
      }}
      text="Logout"
      size={"md"}
    />
  );
}
