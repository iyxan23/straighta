import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function nuke() {
  for (const model of [
    prisma.material,
    prisma.subject,
    prisma.user,
    prisma.studySession,
    prisma.studySessionConclusion,
    prisma.studySessionConclusionItem,
  ]) {
    await (
      model as unknown as { deleteMany: () => Promise<void> }
    ).deleteMany();
  }
}

if (require.main === module) {
  nuke()
    .then(() => console.log("💣 successfully nuked the database"))
    .finally(() => prisma.$disconnect());
}
