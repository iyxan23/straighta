import { materialGetRequest, MaterialGetResponseResult } from "./../schema";
import {
  materialListGetRequest,
  type MaterialListGetResponseResult,
} from "../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { searchParamsToObject } from "@/lib/utils";

export async function GET(
  req: NextRequest
): Promise<NextResponse<MaterialGetResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const data = searchParamsToObject(req.nextUrl.searchParams);

  const result = await materialGetRequest.safeParseAsync(data);
  if (!result.success) {
    return NextResponse.json({
      status: "err",
      reason: result.error.message,
    });
  }

  const { id } = result.data;

  const material = await prisma.material.findFirst({
    where: {
      owner_username: username,
      id,
    },
  });

  if (!material) {
    return NextResponse.json({
      status: "err",
      reason: `No such material with id ${id} exists`,
    });
  }

  return NextResponse.json({
    status: "ok",
    payload: {
      id: material.id,
      title: material.title,
      overallScore: 1, // todo
      subjectId: material.subject_id,
    },
  });
}
