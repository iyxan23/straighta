import { CustomCard } from "@/components";
import ArrowUp from "mdi-react/ArrowUpIcon";
import ArrowRight from "mdi-react/ArrowRightIcon";

export default function StudyHistoryModal() {
  return (
    <div className="overflow-y-scroll fixed top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 w-full h-96 z-30 rounded-lg shadow-md flex flex-col p-6 gap-2 bg-white max-w-lg">
      <h3 className="font-bold text-2xl case text-slate-700">Nama Materi</h3>
      <p className="text-slate-400">Nama subjek</p>
      <ul className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className="relative flex gap-2">
            <div className="">
              {index === 0 ? (
                <>
                  <div className="w-4 h-4 aspect-square rounded-full bg-sky-400 mt-1" />
                  <div className="w-4 h-4 aspect-square rounded-full bg-sky-200 absolute top-1 -z-10 animate-ping" />
                </>
              ) : (
                <div className="w-4 h-4 aspect-square rounded-full bg-neutral-200 mt-1" />
              )}
              <div className="bg-neutral-300 w-[2px] h-full mx-auto" />
            </div>
            <CustomCard className="p-4 flex-1 flex justify-between items-center">
              <div>
                <p className="font-semibold">08:03 - 09:15</p>
                <p>Waktu belajar: 47 menit</p>
                <p>Waktu istirahat: 10 menit</p>
              </div>
              <div className="inline-flex items-center">
                <span className="text-xl font-bold text-rose-500">64</span>{" "}
                <ArrowRight className="mx-2 stroke-current" />{" "}
                <span className="text-xl font-semibold text-amber-500">84</span>{" "}
                <span className="ml-4 inline-flex items-center text-emerald-500 gap-1">
                  30% <ArrowUp className="stroke-emerald-500" size={16} />
                </span>
              </div>
            </CustomCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
