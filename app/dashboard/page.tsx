import { CustomCard } from "@/components";
import ScheduleItem from "./ScheduleItem";

function sec(time: `${number}:${number}`) {
  const [hours, minutes] = time.split(":", 2).map((s) => Number(s));
  return minutes * 60 + hours * 60 * 60;
}

export default function DashbardMainPage() {
  return (
    <div className="overflow-y-scroll flex flex-col md:flex-row md:h-[calc(100%-70px)] bg-slate-100">
      <div className="flex flex-col gap-4 w-full bg-white p-8 md:rounded-r-3xl shadow-lg md:max-h-full">
        <h2 className="font-bold text-2xl text-slate-700">Jadwal</h2>
        <div className="flex flex-col md:flex-row h-auto md:h-full w-full gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <ScheduleItem
              weekday={"Kamis"}
              scheduledRanges={[[sec("16:00"), sec("20:15")]]}
              completedRanges={[[sec("06:30"), sec("09:00")]]}
              dismissedRanges={[[sec("10:30"), sec("14:00")]]}
              cursor={{ position: sec("10:00"), text: "10:00" }}
              blocked={[sec("00:00"), sec("10:00")]}
              key={index}
            />
          ))}
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
