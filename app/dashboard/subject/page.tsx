import SubjectsView from "./SubjectsView";

export default function SubjectPage() {
  return (
    <div className="h-full p-8 bg-slate-100 overflow-y-scroll flex flex-col items-center">
      <h1 className="text-3xl font-bold text-slate-700">Materials</h1>
      <SubjectsView />
    </div>
  );
}
