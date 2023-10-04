import {
  subjectGetRequest,
  SubjectGetResponseResult,
  subjectPostRequest,
  SubjectPostResponseResult,
  subjectPostResponseResult,
} from "./../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { searchParamsToObject } from "@/lib/utils";
import { subjectWithMaterialIdAndAvgScore } from "@/prisma/queries/subject";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<SubjectGetResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const payload = await searchParamsToObject(req.nextUrl.searchParams);
  const data = await subjectGetRequest.safeParseAsync(payload);

  if (!data.success) {
    return NextResponse.json(
      {
        status: "err",
        reason: data.error.message,
      },
      { status: 400 },
    );
  }

  const { id } = data.data;

  const [subject] = await subjectWithMaterialIdAndAvgScore({
    subjectId: id,
    username,
  });

  if (!subject) {
    return NextResponse.json({
      status: "err",
      reason: `Tidak ada subject dengan id ${id}`,
    });
  }

  return NextResponse.json({
    status: "ok",
    payload: {
      title: subject.title,
      materials: subject.material_ids,
      overallScore: Number(subject.avg),
    },
  });
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<SubjectPostResponseResult>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const payload = await subjectPostRequest.safeParseAsync(await req.json());

  if (!payload.success) {
    return NextResponse.json(
      await subjectPostResponseResult.parseAsync({
        status: "err",
        reason: payload.error.message,
      }),
      { status: 400 },
    );
  }

  const { title, materials } = payload.data;

  console.log(`creating subject ${title} for ${username}`);

  const result = await prisma.subject.create({
    data: {
      owner_username: username,
      title,
      materials: {
        createMany: {
          data:
            materials?.map((title) => {
              return { owner_username: username, title };
            }) ?? [],
        },
      },
    },
  });

  return NextResponse.json({
    status: "ok",
    payload: {
      id: result.id,
    },
  });
}
