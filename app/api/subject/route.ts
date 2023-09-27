import {
  subjectGetRequest,
  SubjectGetResponse,
  subjectPostRequest,
  SubjectPostResponse,
  subjectPostResponse,
} from "./../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { searchParamsToObject } from "@/lib/utils";

export async function GET(
  req: NextRequest
): Promise<NextResponse<SubjectGetResponse>> {
  const payload = await searchParamsToObject(req.nextUrl.searchParams);
  const data = await subjectGetRequest.safeParseAsync(payload);

  if (!data.success) {
    return NextResponse.json(
      {
        status: "err",
        reason: data.error.message,
      },
      { status: 400 }
    );
  }

  const { id } = data.data;
  const subject = await prisma.subject.findFirst({
    where: {
      id,
    },
    include: {
      materials: {
        select: {
          id: true,
        },
      },
    },
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
      materials: subject.materials.map(({ id }) => id),
      overallScore: 84.3, // todo
    },
  });
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<SubjectPostResponse>> {
  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const payload = await subjectPostRequest.safeParseAsync(await req.json());

  if (!payload.success) {
    return NextResponse.json(
      await subjectPostResponse.parseAsync({
        status: "err",
        reason: payload.error.message,
      }),
      { status: 400 }
    );
  }

  const { title, materials } = payload.data;

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
