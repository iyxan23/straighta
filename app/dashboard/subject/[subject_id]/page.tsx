import { CustomCard } from "@/components";
import prisma from "@/prisma";
import { materialsAllAvgScore } from "@/prisma/queries/material";
import { notFound } from "next/navigation";
import SubjectDetailItem from "./SubjectDetailItem";
import SubjectDetailList from "./SubjectDetailList";

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
    <article className="flex flex-col md:h-[calc(100%-70px)] p-8 bg-slate-100 overflow-y-scroll">
      {/* Subjek {subject.title}, dibuat oleh {subject.owner_username}. Materi yang
      dimiliki:{" "} */}
      <h2 className="text-4xl font-bold text-slate-700 text-center">{subject.title}</h2>

      <SubjectDetailList {...subject} />
    </article>
  );
}

/* 

const item = () => {
            switch (result) {
              case 1:
                return (
                  <li key={material.id} className="group">
                    <SubjectDetailItem {...material} />
                  </li>
                );
              case 2:
                return (
                  <li key={material.id} className="group">
                    <SubjectDetailItem {...material} />
                  </li>
                );
              case 3:
                return (
                  <li key={material.id} className="group">
                    <SubjectDetailItem {...material} />
                  </li>
                );
            }
          };

*/
