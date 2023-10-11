import { CustomCard } from "@/components";
import prisma from "@/prisma";
import { materialsAllAvgScore } from "@/prisma/queries/material";
import { notFound } from "next/navigation";

export default async function SubjectDetailPage({
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
            <CustomCard className="">
              <hgroup className="inline-flex items-center justify-between w-full p-4 group-hover:border-b border-slate-200">
                <h4 className="text-xl font-semibold text-slate-700">
                  {material.title}
                </h4>
                <div className="ml-auto flex w-fit h-8 items-center">
                  <hr className="w-2 h-[2px] border-none bg-slate-700 rotate-45 -mr-[1.5px] group-hover:-rotate-45 transition"></hr>
                  <hr className="w-2 h-[2px] border-none bg-slate-700 -rotate-45 -ml-[1.5px] group-hover:rotate-45 transition"></hr>
                </div>
              </hgroup>
              <main className='group-hover:block hidden p-4'>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum unde eveniet qui, atque minima tempore id nemo repellat vitae molestiae sint, eum et recusandae laboriosam quo doloremque, illum in optio iure? Et?
              </main>
            </CustomCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
