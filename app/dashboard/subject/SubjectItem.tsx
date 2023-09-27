import CustomCard from "@/components/CustomCard";
// import SubjectItemMaterials from "./SubjectItemMaterials";

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
    <CustomCard key={subjectId} className="h-36 p-8" hoverable>
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-bold text-slate-600">{title}</h2>
        <p>{overallScore}</p>
      </div>
      {/* @ts-ignore Server component */}
      {/* <SubjectItemMaterials subjectId={subjectId} /> */}
    </CustomCard>
  );
}
