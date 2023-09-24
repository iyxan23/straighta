/**
 * @jest-environment node
 */

import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import { POST as subjectPost, GET as subjectGET } from "./route";
import prisma from "@/prisma";
import { createMockRequest, zip } from "@/lib/test-utils";
import { subjectGetResponse, subjectPostResponse } from "../schema";

describe("create and list subjects", () => {
  type SubjectRecord = {
    title: string;
    materials: string[];
  };

  const SUBJECT_DATASET = [
    {
      title: "Bahasa Indonesia",
      materials: [
        "Gagasan paragraf",
        "Merancang langkah-langkah",
        "Mengidentifikasi teks prosedur",
        "Tanda baca",
      ],
    },
    {
      title: "Bahasa Inggris",
      materials: [
        "Kitchen Vocabulary",
        "Active speaking #5",
        "Forming past participle sentences",
        "Listening comprehension #7",
      ],
    },
    {
      title: "Matematika",
      materials: [
        "Persamaan aljabar linier dua variabel",
        "Tambah-tambahan",
        "Kalkulasi damage hero posel legendaris",
        "Aljabar boolean",
        "Kalkulus Lanjutan 1",
        "Kalkulus Lanjutan 2",
      ],
    },
  ];

  let subjectIds: number[] = [];
  let username: string;

  beforeAll(async () => {
    await prisma.material.deleteMany();
    await prisma.subject.deleteMany();

    // find user lol
    const someUsername = (await prisma.user.findFirst())?.username;
    if (!someUsername) {
      throw new Error("there are no users in the database");
    }
    username = someUsername;
  });

  afterAll(async () => {
    await prisma.material.deleteMany();
    await prisma.subject.deleteMany();
  });

  for (const subject of SUBJECT_DATASET) {
    test(`create subject '${subject.title}'`, async () => {
      const request = createMockRequest("POST", subject, {
        [HEADER_TOKEN_USERNAME]: username,
      });
      const response = await subjectPost(request);

      const data = await response
        .json()
        .then((json) => subjectPostResponse.safeParseAsync(json));

      expect(data.success).toBe(true);

      // to not make typescript complain lol
      if (!data.success) {
        throw new Error("expect failed");
      }

      expect(data.data.status).toBe("ok");

      if (data.data.status != "ok") {
        throw new Error("expect failed");
      }

      subjectIds.push(data.data.payload.id);
    });
  }

  for (const [id, subject] of zip<
    number,
    SubjectRecord,
    number[],
    SubjectRecord[]
  >(subjectIds, SUBJECT_DATASET)) {
    test(`get subject of '${subject.title}' with id ${id}`, async () => {
      const request = createMockRequest(
        "GET",
        { id },
        {
          [HEADER_TOKEN_USERNAME]: username,
        }
      );
      const response = await subjectGET(request);

      const data = await response
        .json()
        .then((json) => subjectGetResponse.safeParseAsync(json));

      expect(data.success).toBe(true);

      // to not make typescript complain lol
      if (!data.success) {
        throw new Error("expect failed");
      }

      expect(data.data.status).toBe("ok");

      if (data.data.status != "ok") {
        throw new Error("expect failed");
      }

      expect(data.data.payload).toBe(subject);
    });
  }
});
