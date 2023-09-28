"use client";

import CallbackButton from "@/components/CallbackButton";
import { useRouter } from "next/navigation";

export default function Buttons() {
  const router = useRouter();

  return (
    <div className="flex flex-row gap-4">
      <CallbackButton
        className="bg-white text-sky-500"
        text="Selesai"
        size="lg"
        onClick={() => router.back()}
      />
      <CallbackButton
        className="bg-white text-sky-500"
        text="Istirahat"
        size="lg"
        onClick={() => console.log("esteerahaat")}
      />
    </div>
  );
}