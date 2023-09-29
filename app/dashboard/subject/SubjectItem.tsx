import CustomCard from '@/components/CustomCard';
// import SubjectItemMaterials from "./SubjectItemMaterials";

export const materialList = [
  'Menyimak Puisi',
  'Menulis Teks Berita',
  'Menulis Cerpen',
  'Menulis Karangan Deskripsi',
  'Menulis Karangan Argumentasi',
  'Menulis Karangan Narasi',
  'Menulis Karangan Eksposisi',
  'Menulis Surat Resmi',
  'Menulis Surat Pribadi',
  'Menulis Teks Drama',
];

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
    <CustomCard
      key={subjectId}
      className='group p-8'
      hoverable
    >
      <div className='flex flex-row justify-between'>
        <h2 className='text-xl font-bold text-slate-600'>{title}</h2>
        <p>{overallScore}</p>
      </div>
      <ul className='text-neutral-700 mt-3'>
        {title === 'Bahasa Indonesia' &&
          materialList.map((item, index) => <li key={index} className='flex items-center justify-between py-1'>
            <p>{item}</p>
            <hr className='grow mx-4 border-dashed border-neutral-400 group-hover:border-neutral-500' />
            <p className='text-yellow-500'>75%</p>
          </li>)}
      </ul>
      {/* @ts-ignore Server component */}
      {/* <SubjectItemMaterials subjectId={subjectId} /> */}
    </CustomCard>
  );
}
