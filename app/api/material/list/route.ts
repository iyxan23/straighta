import {
  materialListGetRequest,
  type MaterialListGetResponseResult,
} from "../../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { searchParamsToObject } from "@/lib/utils";

export async function GET(
  req: NextRequest
): Promise<NextResponse<MaterialListGetResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const data = searchParamsToObject(req.nextUrl.searchParams);

  const result = await materialListGetRequest.safeParseAsync(data);
  if (!result.success) {
    return NextResponse.json({
      status: "err",
      reason: result.error.message,
    });
  }

  const { subjectId, limit, offset } = result.data;

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
      subjectId: m.subject_id,
    })),
  });
}
