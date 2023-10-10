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
    <>
      Subjek {subject.title}, dibuat oleh {subject.owner_username}. Materi yang
      dimiliki:{" "}
      <ul>
        {subject.materials.map((m) => (
          <li key={m.id}>Materi: {m.title}</li>
        ))}
      </ul>
    </>
  );
}
