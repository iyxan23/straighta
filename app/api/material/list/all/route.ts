import {
  materialListAllGetRequest,
  type MaterialListGetResponseResult,
} from "../../../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { searchParamsToObject } from "@/lib/utils";
import { materialsAllAvgScore } from "@/prisma/queries/material";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<MaterialListGetResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const data = searchParamsToObject(req.nextUrl.searchParams);

  const result = await materialListAllGetRequest.safeParseAsync(data);
  if (!result.success) {
    return NextResponse.json({
      status: "err",
      reason: result.error.message,
    });
  }

  const { limit, offset } = result.data;

  const materials = await materialsAllAvgScore({
    limit,
    offset,
    username,
  });

  return NextResponse.json({
    status: "ok",
    payload: materials.map((m) => ({
      id: m.id,
      title: m.title,
      overallScore: Number(m.avg),
      subjectId: m.subject_id,
    })),
  });
}
