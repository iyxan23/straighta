"use client";

import { twMerge } from "tailwind-merge";

export default function CallbackButton({
  text,
  onClick,
  size = "md",
  className = "",
}: {
  text: string;
  onClick: () => void;
  size: "md" | "lg";
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      tabIndex={1}
      role="button"
      className={twMerge(
        `
        rounded-lg 
        ${size === "lg" && "text-lg"}
        shadow-md
        bg-sky-500 active:bg-sky-600
        active:scale-[97%]
        ${size === "md" ? "px-4 py-2" : "px-8 py-3"}
        align-middle
        text-center text-white font-bold
        hover:bg-sky-400 focus:outline-none focus:ring focus:ring-sky-200
        hover:shadow-lg
        transition-all`,
        className
      )}
    >
      {text}
    </button>
  );
}
