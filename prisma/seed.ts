import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { fakerID_ID as faker } from "@faker-js/faker";
import { nuke } from "./nuke";

console.log("🔌 connecting to the database");
const prisma = new PrismaClient();

const SUBJECT_DATASET = [
  {
    title: "Bahasa Indonesia",
  },
  {
    title: "Bahasa Inggris",
  },
  {
    title: "Matematika",
  },
  {
    title: "Ilmu Pengetahuan Alam",
  },
  {
    title: "Ilmu Pengetahuan Sosial",
  },
  {
    title: "Sejarah",
  },
  {
    title: "Religius",
  },
  {
    title: "PPKN",
  },
  {
    title: "Seni Budaya",
  },
  {
    title: "PJOK",
  },
  {
    title: "Biologi",
  },
  {
    title: "Fisika",
  },
  {
    title: "Kimia",
  },
  {
    title: "Geografi",
  },
  {
    title: "Ekonomi",
  },
  {
    title: "Sosiologi",
  },
  {
    title: "Antropologi",
  },
];

async function main() {
  const user = await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      password: await bcryptjs.hash("1234567890", 12),
    },
  });

  await prisma.subject.createMany({
    data: SUBJECT_DATASET.map((s) => ({ ...s, owner_username: user.username })),
  });
}

nuke()
  .then(() => console.log("💣 sucessfully nuked the database"))
  .then(() => main())
  .then(() => console.log("🌱 successfully seeded the database"))
  .finally(() => prisma.$disconnect());
