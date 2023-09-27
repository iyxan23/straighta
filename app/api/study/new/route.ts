import { studyNewPostRequest, type StudyNewPostResponse } from "./../../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
// import { sleep } from "@/lib/test-utils";

export async function POST(
  req: NextRequest
): Promise<NextResponse<StudyNewPostResponse>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const data = await studyNewPostRequest.safeParseAsync(await req.json());
  if (!data.success) {
    return NextResponse.json({
      status: "err",
      reason: data.error.message,
    });
  }

  const { materialId, score } = data.data;

  const session = await prisma.studySession.create({
    data: {
      username,
      material_id: materialId,
      before_score: score,
    },
  });

  return NextResponse.json({
    status: "ok",
    payload: {
      id: session.id,
    },
  });
}
