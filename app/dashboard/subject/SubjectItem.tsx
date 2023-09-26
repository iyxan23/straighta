import SubjectItemMaterials from "./SubjectItemMaterials";

export default function SubjectItem({
  subjectId,
  title,
  overallScore
}: {
  subjectId: number;
  title: string;
  overallScore: number;
}): JSX.Element {
  return (
    <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer">
      <h2>{subjectId}</h2>
      <h2>{title}</h2>
      {/* @ts-ignore Server component */}
      {/* <SubjectItemMaterials subjectId={subjectId} /> */}
    </div>
  );
}
