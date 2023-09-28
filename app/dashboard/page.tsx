import { CustomCard } from "@/components";
import Schedule from "./Schedule";

export default function DashbardMainPage() {
  return (
    <div className="overflow-y-scroll flex flex-col md:flex-row md:h-[calc(100%-70px)] bg-slate-100">
      <div className="flex flex-col gap-4 w-full bg-white p-8 md:rounded-r-3xl shadow-lg md:max-h-full">
        <h2 className="font-bold text-2xl text-slate-700">Jadwal</h2>
        <div className="flex flex-col md:flex-row h-auto md:h-full w-full gap-2">
          <Schedule />
        </div>
      </div>
      <div className="md:w-80 lg:w-1/3 p-8 h-full md:overflow-y-scroll max-h-full">
        <h2 className="font-bold text-2xl text-slate-700 mb-4">Riwayat</h2>
        <div className="flex flex-col w-full gap-4">
          {Array.from({ length: 17 }).map((_, index) => (
            <CustomCard key={index} className="h-36" hoverable />
          ))}
        </div>
      </div>
    </div>
  );
}
