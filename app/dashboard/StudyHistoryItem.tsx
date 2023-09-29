import { StudySession } from "@/lib/types";
import { useGetMaterialByIdQuery } from "@/redux/services/materialApi";

export default function HistoryItem({
  studySession,
}: {
  studySession: StudySession;
}) {
  const {
    id,
    timestamp: { start, end },
    materialId,
  } = studySession;

  const { data, error, isFetching } = useGetMaterialByIdQuery({
    id: materialId,
  });

  return (
    <div className="border border-slate-200 bg-white rounded-md w-full select-none p-4 flex flex-col">
      {JSON.stringify(data) /* todo: design this */}
    </div>
  );
}
