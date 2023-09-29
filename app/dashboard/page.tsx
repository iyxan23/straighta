import DashboardAnimatePresence from "./DashboardAnimatePresence";
import { CustomCard } from "@/components";
import Schedule from "./Schedule";
import { materialList } from "./subject/SubjectItem";

export default function DashboardMainPage() {
  return (
    <DashboardAnimatePresence>
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
            {/* <StudyHistory /> */}
            <ul className="space-y-2">
              {materialList.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center gap-2"
                >
                  <CustomCard className="p-4" hoverable>
                    <div>
                      <h4 className="font-bold text-slate-700">{item}</h4>
                      <p className="text-sm text-slate-400">Bahasa Indonesia</p>
                    </div>
                    <div>
                      <p className="whitespace-nowrap text-slate-700">
                        08:00 - 23:30
                      </p>
                    </div>
                  </CustomCard>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardAnimatePresence>
  );
}
