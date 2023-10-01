import {
  studyEndPostRequest,
  StudyEndPostResponseResult,
} from "./../../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

// 1 minute tolerance
const TOLERANCE = 60 * 1000; // in milliseconds

export async function POST(
  req: NextRequest
): Promise<NextResponse<StudyEndPostResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const data = await studyEndPostRequest.safeParseAsync(await req.json());
  if (!data.success) {
    return NextResponse.json({
      status: "err",
      reason: data.error.message,
    });
  }

  const {
    id: studySessionId,
    time: { studyTime, breakTime },
    score,
  } = data.data;

  // this is much better if there would be a postgresql constraint
  // but we're using prisma here
  const studySession = await prisma.studySession.findFirst({
    where: { id: studySessionId, username },
  });

  if (!studySession) {
    return NextResponse.json(
      {
        status: "err",
        reason: `No study session with id ${studySessionId} exists`,
      },
      { status: 404 }
    );
  }

  if (studySession.username !== username) {
    return NextResponse.json(
      {
        status: "err",
        reason: `No study session with id ${studySessionId} exists`,
      },
      { status: 404 }
    );
  }

  // check if studyTime and breakTime correlates to the start study session time
  // not doing new Date(), who knows node and postgres has different dates
  const [{ now }] = await prisma.$queryRaw<
    [{ now: Date }]
  >`SELECT * FROM now()`;

  const start = new Date(studySession.start.getTime() + studyTime + breakTime);

  // compare it to now based on tolerance
  const difference = now.getTime() - start.getTime();

  const toleranceStart = -(TOLERANCE / 2);
  const toleranceEnd = TOLERANCE / 2;

  if (difference < toleranceStart || difference > toleranceEnd) {
    // nah, it aint right, remove the parent
    await prisma.studySession.delete({ where: { id: studySessionId } });
    return NextResponse.json(
      {
        status: "err",
        reason: "Invalid time",
      },
      { status: 400 }
    );
  }

  const session = await prisma.studySessionConclusion.create({
    data: {
      study_session_id: studySessionId,
      after_score: score,
      study_time: studyTime,
      break_time: breakTime,
    },
  });

  return NextResponse.json({
    status: "ok",
    payload: {
      id: session.id,
    },
  });
}
