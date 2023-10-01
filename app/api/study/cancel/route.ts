import {
  studyCancelPostRequest,
  StudyCancelPostResponseResult,
} from "./../../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function POST(
  req: NextRequest
): Promise<NextResponse<StudyCancelPostResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const data = await studyCancelPostRequest.safeParseAsync(await req.json());
  if (!data.success) {
    return NextResponse.json({
      status: "err",
      reason: data.error.message,
    });
  }

  const { id: studySessionId } = data.data;

  const studySession = await prisma.studySession.delete({
    where: {
      id: studySessionId,
      username,
      conclusion: null, // study sessions that is not finished
    },
  });

  if (!studySession) {
    return NextResponse.json(
      {
        status: "err",
        reason: `Tidak ada sesi belajar yang memiliki id ${studySessionId}`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "ok",
    payload: {
      id: studySession.id,
    },
  });
}
