"use client"

export default function LinkButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      tabIndex={1}
      role="button"
      className="rounded-lg text-lg shadow-md bg-sky-500 active:bg-sky-600 active:scale-[97%] px-8 py-3 align-middle text-center text-white font-bold hover:bg-sky-400 focus:outline-none focus:ring focus:ring-sky-200 hover:shadow-lg transition-all"
    >
      {text}
    </button>
  );
}
