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
    <CustomCard key={subjectId} className="h-36" hoverable>
      <h2>{subjectId}</h2>
      <h2>{title}</h2>
      <h2>{overallScore}</h2>
      {/* @ts-ignore Server component */}
      {/* <SubjectItemMaterials subjectId={subjectId} /> */}
    </CustomCard>
  );
}
