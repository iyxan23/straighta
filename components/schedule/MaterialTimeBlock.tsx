import { useGetMaterialByIdQuery } from "@/redux/services/materialApi";

const MAX_RANGE = 86400; // seconds in a day

type TimeBlockColor = "scheduled" | "finished" | "dismissed";

export default function MaterialTimeBlock({
  materialId,
  startRelativeTimestamp,
  endRelativeTimestamp,
  status,
}: {
  materialId: number;
  startRelativeTimestamp: number;
  endRelativeTimestamp: number;
  status: TimeBlockColor;
}) {
  const { data, error } = useGetMaterialByIdQuery({ id: materialId });

  return (
    <div
      className={`
          ${
            error
              ? "bg-red-500 hover:ring-red-200"
              : status == "scheduled"
              ? "bg-sky-500 hover:ring-sky-200"
              : status == "finished"
              ? "bg-green-500 hover:ring-green-200"
              : status == "dismissed" && "bg-slate-500 hover:ring-slate-200"
          }
          w-full absolute text-white text-sm
          flex flex-col justify-center
          items-center text-opacity-75
          text-center
          leading-4
          hover:scale-105 hover:ring hover:shadow-md cursor-pointer
          transition-all rounded-sm`}
      style={{
        height: `${
          ((endRelativeTimestamp - startRelativeTimestamp) / MAX_RANGE) * 100
        }%`,
        bottom: `${(startRelativeTimestamp / MAX_RANGE) * 100}%`,
      }}
    >
      {error ? `Err: ${JSON.stringify(error)}` : data ? data.title : "Loading"}
    </div>
  );
}
