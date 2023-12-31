import { searchParamsToObject } from "@/lib/utils";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { studyListGetRequest, StudyListGetResponseResult } from "../../schema";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<StudyListGetResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const payload = await studyListGetRequest.safeParseAsync(
    searchParamsToObject(req.nextUrl.searchParams),
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
    skip: offset == 0 ? undefined : offset,
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
      agendas: s.conclusion
        ? {
            study: s.conclusion.study_time,
            break: s.conclusion.break_time,
          }
        : undefined,
      scores: {
        before: s.before_score,
        after: s.conclusion ? s.conclusion.after_score : undefined,
      },
      materialId: s.material_id,
    })),
  });
}
