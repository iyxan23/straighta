import { MAX_SCHEDULE_RANGE } from "./Schedule";

export default function MaterialTimeBlock({
  startRelativeTimestamp,
  endRelativeTimestamp,
}: {
  startRelativeTimestamp: number;
  endRelativeTimestamp: number;
}) {
  return (
    <div
      className={`
          w-full absolute text-white text-sm
          flex flex-col justify-center
          items-center text-opacity-75
          bg-purple-300 opacity-50 z-10
          text-center
          leading-4
          transition-all rounded-sm`}
      style={{
        height: `${
          ((endRelativeTimestamp - startRelativeTimestamp) / MAX_SCHEDULE_RANGE) * 100
        }%`,
        bottom: `${(startRelativeTimestamp / MAX_SCHEDULE_RANGE) * 100}%`,
      }}
    />
  );
}
