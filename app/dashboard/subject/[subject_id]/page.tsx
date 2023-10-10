import { CustomCard } from "@/components";
import prisma from "@/prisma";
import { materialsAllAvgScore } from "@/prisma/queries/material";
import { notFound } from "next/navigation";

export default async function SelectedSubjectPage({
  params: { subject_id },
}: {
  params: { subject_id: string };
}) {
  const subject = await prisma.subject.findFirst({
    where: { id: Number(subject_id) },
    include: { materials: true },
  });
  if (!subject) {
    notFound();
  }

  // untuk sementara, use it as client component yah
  // yang bisa digunakan:
  //   subject.id
  //   subject.materials
  //   subject.owner_username
  //   subject.title
  //   subject.materials[] -> sebuah array

  return (
    <div className="flex flex-col md:h-[calc(100%-70px)] p-8 bg-slate-100 overflow-y-scroll">
      {/* Subjek {subject.title}, dibuat oleh {subject.owner_username}. Materi yang
      dimiliki:{" "} */}
      <h2 className="text-4xl font-bold text-slate-700">{subject.title}</h2>
      <ul className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subject.materials.map((material) => (
          <li key={material.id} className="group">
            <CustomCard className="p-4">
              <h4 className="inline-flex text-xl font-semibold text-slate-700 items-center justify-between w-full">
                {material.title}
                <div className="ml-auto flex w-fit h-8 items-center">
                  <hr className="w-2 h-[2px] border-none bg-slate-700 rotate-45 -mr-[1.5px] group-hover:-rotate-45 transition"></hr>
                  <hr className="w-2 h-[2px] border-none bg-slate-700 -rotate-45 -ml-[1.5px] group-hover:rotate-45 transition"></hr>
                </div>
              </h4>
            </CustomCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
