import { subjectsAllAvgScore } from "./../../../../prisma/queries/subject";
import {
  subjectListGetRequest,
  type SubjectListGetResponseResult,
  subjectListGetResponseResult,
} from "./../../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { searchParamsToObject } from "@/lib/utils";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<SubjectListGetResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const data = searchParamsToObject(req.nextUrl.searchParams);

  const result = await subjectListGetRequest.safeParseAsync(data);
  if (!result.success) {
    return NextResponse.json({
      status: "err",
      reason: result.error.message,
    });
  }

  const { limit, offset } = result.data;

  const subjects = await subjectsAllAvgScore({
    limit,
    offset,
    username,
  });

  return NextResponse.json({
    status: "ok",
    payload: subjects.map((s) => {
      return {
        id: s.id,
        title: s.title,
        overallScore: Number(s.avg),
      };
    }),
  });
}
