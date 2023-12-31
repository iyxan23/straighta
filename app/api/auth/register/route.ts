import {
  authRegisterPostResponse,
  authRegisterPostRequest,
} from "./../../schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
import { getJWTSecretKey } from "@/lib/auth";
import { UNABLE_TO_CREATE_USER } from "../../errors";

export const REGISTER_REDIRECT_TO = "/auth/register/questions";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payloadParseResult = await authRegisterPostRequest.safeParseAsync(
    await request.json()
  );

  if (!payloadParseResult.success) {
    return NextResponse.json(
      await authRegisterPostResponse.parseAsync({
        status: "err",
        reason: payloadParseResult.error.message,
      }),
      { status: 400 }
    );
  }

  const { username, password } = payloadParseResult.data;

  // buat akuun
  try {
    const _user = await prisma.user.create({
      data: { username, password: await bcryptjs.hash(password, 12) },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      await authRegisterPostResponse.parseAsync({
        status: "err",
        reason: UNABLE_TO_CREATE_USER,
      }),
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    await authRegisterPostResponse.parseAsync({
      status: "ok",
      payload: {
        redirect: REGISTER_REDIRECT_TO,
      },
    })
  );

  // create the token oentoek uzr
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4w") // Set your own expiration time
    .sign(getJWTSecretKey());

  response.cookies.set({
    name: "token",
    value: token,
    path: "/",
    httpOnly: true,
    secure: true,
  });

  return response;
}
