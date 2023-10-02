import { CustomCard } from "@/components";
import { StudySession } from "@/lib/types";
import { useGetMaterialByIdQuery } from "@/redux/services/materialApi";
import { useLazyGetSubjectByIdQuery } from "@/redux/services/subjectApi";
import { useEffect } from "react";
import formatDistance from "date-fns/formatDistance";
import addMilliseconds from "date-fns/addMilliseconds";
import ArrowRightIcon from "mdi-react/ArrowRightIcon";
import SchoolIcon from "mdi-react/SchoolIcon";
import SleepIcon from "mdi-react/SleepIcon";

export default function HistoryItem({
  studySession,
}: {
  studySession: StudySession;
}) {
  const {
    id,
    timestamp: { start, end },
    agendas,
    materialId,
  } = studySession;
  console.log(studySession);

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
      <CustomCard className="p-4 relative flex flex-col gap-2" hoverable>
        <div>
          <h4 className="font-bold text-slate-700">
            {materialData?.title ?? "Loading..."}
          </h4>
          <p className="text-sm text-slate-400 mb-2">
            {subjectData?.title ?? "Loading..."}
          </p>
          <p className="text-sm text-slate-300 absolute top-4 right-4">
            {start
              ? new Date(start).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </p>
        </div>
        <div>
          <p className="text-lg flex flex-row gap-2 items-center">
            <span className="text-green-700 font-semibold">{85}</span>
            <ArrowRightIcon size={16} />
            <span className="text-amber-600 font-semibold">{74}</span>
          </p>
        </div>
        {agendas && (
          <div className="flex flex-col gap-2 items-end text-sm absolute bottom-4 right-4">
            <div className="flex flex-row gap-2">
              <p className="text-slate-400">
                {formatDistance(
                  addMilliseconds(new Date(), agendas.study),
                  new Date(),
                )}
              </p>
              <SchoolIcon className="fill-sky-700 opacity-75" size={16} />
            </div>
            <div className="flex flex-row gap-2">
              <p className="text-slate-400">
                {formatDistance(
                  addMilliseconds(new Date(), agendas.break),
                  new Date(),
                )}
              </p>
              <SleepIcon className=" fill-green-800 opacity-75" size={16} />
            </div>
          </div>
        )}
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
