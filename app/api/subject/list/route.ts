import { subjectListGetRequest, subjectListGetResponse } from "./../../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const payload = await subjectListGetRequest.safeParseAsync(await req.json());

  if (!payload.success) {
    return NextResponse.json(
      await subjectListGetResponse.parseAsync({
        status: "err",
        reason: payload.error.message,
      }),
      { status: 400 }
    );
  }

  const { limit, offset } = payload.data;

  return NextResponse.json(
    prisma.subject.findMany({
      skip: offset,
      take: limit,
      where: {
        owner_username: username,
      },
    })
  );
}
