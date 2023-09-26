import SubjectsView from "./SubjectsView";

export default function SubjectPage() {
  return (
    <div className="h-full p-8 bg-slate-100 overflow-y-scroll flex flex-col items-center">
      <h1 className="text-3xl font-bold text-slate-700">Materials</h1>
      <SubjectsView />
      {/* <div className="flex flex-col items-center w-screen">
        <div className="sticky -top-8 flex flex-col items-center p-8 w-full bg-slate-100">
          <SubjectItemSearch />
        </div>
        <div className="flex flex-col w-2/3 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <CustomCard key={index} className="h-36" hoverable />
          ))}
        </div>
      </div> */}
    </div>
  );
}
