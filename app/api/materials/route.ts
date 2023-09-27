import {
  type MaterialsResponse,
  type SubjectListGetResponseResult,
} from "./../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
// import { sleep } from "@/lib/test-utils";

export async function GET(
  req: NextRequest
): Promise<NextResponse<MaterialsResponse>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;

  const subjectIdParam = req.nextUrl.searchParams.get("subjectId");
  if (!subjectIdParam) {
    return NextResponse.json(
      {
        status: "err",
        reason: "Required: subjectId GET parameter",
      },
      { status: 400 }
    );
  }

  const subjectId = Number(subjectIdParam);
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 10);
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);

  const materials = await prisma.material.findMany({
    skip: offset,
    take: limit,
    where: {
      owner_username: username,
      subject_id: subjectId,
    },
  });

  return NextResponse.json({
    status: "ok",
    payload: materials.map((m) => ({
      id: m.id,
      title: m.title,
      overallScore: 1, // todo
    })),
  });
}
