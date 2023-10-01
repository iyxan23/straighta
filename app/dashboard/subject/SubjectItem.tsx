import CustomCard from "@/components/CustomCard";
import SubjectItemMaterials from "./SubjectItemMaterials";

export default function SubjectItem({
  subjectId,
  title,
  overallScore,
}: {
  subjectId: number;
  title: string;
  overallScore: number;
}): JSX.Element {
  return (
    <CustomCard key={subjectId} className="group p-8" hoverable>
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-bold text-slate-600">{title}</h2>
        <p className="text-yellow-500 text-lg font-semibold">{overallScore}%</p>
      </div>
      <ul className="text-neutral-700 mt-3">
        <SubjectItemMaterials subjectId={subjectId} />
      </ul>
      {/* @ts-ignore Server component */}
      {/* <SubjectItemMaterials subjectId={subjectId} /> */}
    </CustomCard>
  );
}
