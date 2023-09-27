/**
 * @jest-environment node
 */

import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import { POST as subjectPost, GET as subjectGET } from "./route";
import { GET as subejctListGET } from "./list/route";
import prisma from "@/prisma";
import { createMockRequest, zip } from "@/lib/utils";
import {
  subjectGetResponse,
  subjectListGetResponse,
  subjectListGetResponseResult,
  subjectPostResponseResult,
} from "../schema";

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
      const request = createMockRequest({
        method: "POST",
        json: subject,
        headers: {
          [HEADER_TOKEN_USERNAME]: username,
        },
      });
      const response = await subjectPost(request);

      const data = await response
        .json()
        .then((json) => subjectPostResponseResult.safeParseAsync(json));

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
      const request = createMockRequest({
        method: "GET",
        searchParams: new URLSearchParams({ id: String(id) }),
        headers: {
          [HEADER_TOKEN_USERNAME]: username,
        },
      });
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

  test("listing subjects", async () => {
    const request = createMockRequest({
      method: "GET",
      searchParams: new URLSearchParams({
        limit: String(SUBJECT_DATASET.length),
        offset: "0",
      }),
      headers: {
        [HEADER_TOKEN_USERNAME]: username,
      },
    });
    const response = await subejctListGET(request);

    const data = await response
      .json()
      .then((json) => subjectListGetResponseResult.safeParseAsync(json));

    expect(data.success).toBe(true);

    // to not make typescript complain lol
    if (!data.success) {
      throw new Error("expect failed");
    }

    expect(data.data.status).toBe("ok");

    if (data.data.status != "ok") {
      throw new Error("expect failed");
    }

    expect(
      data.data.payload.map(({ title, id }) => {
        return { title, id };
      })
    ).toStrictEqual(
      zip<number, SubjectRecord, number[], SubjectRecord[]>(
        subjectIds,
        SUBJECT_DATASET
      ).map(([id, { title }]) => {
        return { title, id };
      })
    );
  });
});
