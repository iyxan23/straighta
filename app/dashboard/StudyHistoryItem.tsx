import { CustomCard } from "@/components";
import { StudySession } from "@/lib/types";
import {
  useGetMaterialByIdQuery,
  useLazyGetMaterialByIdQuery,
} from "@/redux/services/materialApi";
import { useLazyGetSubjectByIdQuery } from "@/redux/services/subjectApi";
import { useEffect, useRef } from "react";
import formatDistance from "date-fns/formatDistance";
import addMilliseconds from "date-fns/addMilliseconds";
import ArrowRightIcon from "mdi-react/ArrowRightIcon";
import SchoolIcon from "mdi-react/SchoolIcon";
import SleepIcon from "mdi-react/SleepIcon";
import { classNameOfScore } from "@/lib/utils";

export default function HistoryItem({
  studySession,
}: {
  studySession: StudySession;
}) {
  const elemRef = useRef(null);
  const {
    id,
    timestamp: { start, end },
    agendas,
    scores,
    materialId,
  } = studySession;

  const [fetchMaterial, { data: materialData, error: materialError }] =
    useLazyGetMaterialByIdQuery();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!materialData) {
          fetchMaterial({
            id: materialId,
          });
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.5 },
    );

    if (elemRef.current) observer.observe(elemRef.current);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (elemRef.current) observer.unobserve(elemRef.current);
    };
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

  return (
    <li
      ref={elemRef}
      key={id}
      className="flex justify-between items-center gap-2"
    >
      {materialError ? (
        <CustomCard className="p-4" hoverable>
          <div>
            <p className="text-sm text-red-400">
              Err: {JSON.stringify(materialError)}
            </p>
          </div>
        </CustomCard>
      ) : subjectError ? (
        <CustomCard className="p-4" hoverable>
          <div>
            <p className="text-sm text-red-400">
              Err: {JSON.stringify(subjectError)}
            </p>
          </div>
        </CustomCard>
      ) : (
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
              <span
                className={`font-semibold ${classNameOfScore(scores.before)}`}
              >
                {scores.before}
              </span>
              {scores.after && (
                <>
                  <ArrowRightIcon size={16} />
                  <span
                    className={`font-semibold ${classNameOfScore(
                      scores.after,
                    )}`}
                  >
                    {scores.after}
                  </span>
                </>
              )}
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
      )}
    </li>
  );
}
