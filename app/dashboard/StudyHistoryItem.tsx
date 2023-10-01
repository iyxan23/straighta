import { CustomCard } from "@/components";
import { StudySession } from "@/lib/types";
import { useGetMaterialByIdQuery } from "@/redux/services/materialApi";
import { useLazyGetSubjectByIdQuery } from "@/redux/services/subjectApi";
import { useEffect } from "react";

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

  const { data: materialData, error: materialError } = useGetMaterialByIdQuery({
    id: materialId,
  });

  const [
    fetchSubject,
    { data: subjectData, error: subjectError, isFetching: subjectIsFetching },
  ] = useLazyGetSubjectByIdQuery();

  useEffect(() => {
    if (materialData && !subjectData && !subjectIsFetching) {
      fetchSubject({ id: materialData.subjectId });
    }
  }, [materialData, subjectData, materialId, subjectIsFetching, fetchSubject]);

  if (materialError) {
    return (
      <li key={id} className="flex justify-between items-center gap-2">
        <CustomCard className="p-4" hoverable>
          <div>
            <p className="text-sm text-red-400">
              Err: {JSON.stringify(materialError)}
            </p>
          </div>
        </CustomCard>
      </li>
    );
  }

  if (subjectError) {
    return (
      <li key={id} className="flex justify-between items-center gap-2">
        <CustomCard className="p-4" hoverable>
          <div>
            <p className="text-sm text-red-400">
              Err: {JSON.stringify(subjectError)}
            </p>
          </div>
        </CustomCard>
      </li>
    );
  }

  return (
    <li key={id} className="flex justify-between items-center gap-2">
      <CustomCard className="p-4" hoverable>
        <div>
          <h4 className="font-bold text-slate-700">
            {materialData?.title ?? "Loading..."}
          </h4>
          <p className="text-sm text-slate-400">
            {subjectData?.title ?? "Loading..."}
          </p>
        </div>
        <div>
          <p className="whitespace-nowrap text-slate-700">
            {start
              ? `${new Date(start).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })} - ${
                  end
                    ? new Date(end).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "Sekarang"
                }`
              : "Loading..."}
          </p>
        </div>
      </CustomCard>
    </li>
  );
}
