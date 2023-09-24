import { authRegisterResponse, authRegisterRequest } from "./../../schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
import { getJWTSecretKey } from "@/lib/auth";

export const REGISTER_REDIRECT_TO = "/auth/register/questions";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payloadParseResult = await authRegisterRequest.safeParseAsync(
    request.body
  );

  if (!payloadParseResult.success) {
    return NextResponse.json(
      await authRegisterResponse.parseAsync({
        status: "err",
        reason: payloadParseResult.error.toString(),
      }),
      { status: 400 }
    );
  }

  const { username, password } = payloadParseResult.data;

  // buat akuun
  const _user = await prisma.user.create({
    data: { username, password: await bcryptjs.hash(password, 12) },
  });

  const response = NextResponse.json(
    await authRegisterResponse.parseAsync({
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
    .setExpirationTime("30s") // Set your own expiration time
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
