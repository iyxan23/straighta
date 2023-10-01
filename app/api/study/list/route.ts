import { searchParamsToObject } from "@/lib/utils";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { studyListGetRequest, StudyListGetResponseResult } from "../../schema";

export async function GET(
  req: NextRequest
): Promise<NextResponse<StudyListGetResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const payload = await studyListGetRequest.safeParseAsync(
    searchParamsToObject(req.nextUrl.searchParams)
  );

  if (!payload.success) {
    return NextResponse.json({
      status: "err",
      reason: payload.error.message,
    });
  }

  const { offset, limit } = payload.data;

  const studySessions = await prisma.studySession.findMany({
    where: { username },
    skip: offset,
    take: limit,
    include: {
      conclusion: true,
    },
    orderBy: {
      start: "desc",
    },
  });

  return NextResponse.json({
    status: "ok",
    payload: studySessions.map((s) => ({
      id: s.id,
      timestamp: {
        start: s.start.valueOf(),
        end: s.conclusion?.end?.valueOf(),
      },
      materialId: s.material_id,
    })),
  });
}
