import {
  subjectListGetRequest,
  type SubjectListGetResponseResult,
  subjectListGetResponseResult,
} from "./../../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(
  req: NextRequest
): Promise<NextResponse<SubjectListGetResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 10);
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);
  // console.log(username);
  // const payload = await subjectListGetRequest.safeParseAsync(await req.json());
  // console.log(payload);

  // if (!payload.success) {
  //   console.log("err");
  //   return NextResponse.json(
  //     await subjectListGetResponseResult.parseAsync({
  //       status: "err",
  //       reason: payload.error.message,
  //     }),
  //     { status: 400 }
  //   );
  // }

  // const { limit, offset } = payload.data;
  const subjects = await prisma.subject.findMany({
    skip: offset,
    take: limit,
    where: {
      owner_username: username,
    },
  });

  return NextResponse.json({
    status: "ok",
    payload: subjects.map((s) => {
      return {
        id: s.id,
        title: s.title,
        overallScore: 1, // todo
      };
    }),
  });
}
