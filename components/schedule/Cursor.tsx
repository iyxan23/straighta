import { MAX_SCHEDULE_RANGE } from "./Schedule";

export default function Cursor({
  position,
  text,
}: {
  position: number;
  text: string;
}) {
  return (
    <>
      <div
        className="
          absolute w-full bg-purple-500 z-30

          before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0
          before:transform before:-translate-y-[2px] before:-translate-x-1/2 before:w-2 before:h-2
          before:rounded-full before:bg-purple-500

          after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0
          after:transform after:-translate-y-[2px] after:translate-x-1/2 after:w-2 after:h-2
          after:rounded-full after:bg-purple-500"
        style={{
          height: 4,
          bottom: `${(position / MAX_SCHEDULE_RANGE) * 100}%`,
        }}
      ></div>
      <div
        className="
          absolute left-1/2 transform -translate-x-1/2 text-sm text-center text-white
          bg-purple-500 px-2 py-1 rounded-full shadow-md font-bold
          hover:scale-105
          transition-all cursor-pointer"
        style={{
          bottom: `calc(${(position / MAX_SCHEDULE_RANGE) * 100}% + .5rem)`,
        }}
      >
        {text}
      </div>
    </>
  );
}
