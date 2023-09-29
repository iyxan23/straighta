import { INVALID_CREDENTIALS } from "./../../errors";
import { authLoginPostRequest, authLoginPostResponse } from "./../../schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
import { getJWTSecretKey } from "@/lib/auth";

export const LOGIN_REDIRECT_TO = "/dashboard";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payloadParseResult = await authLoginPostRequest.safeParseAsync(
    await request.json()
  );

  if (!payloadParseResult.success) {
    return NextResponse.json(
      await authLoginPostResponse.parseAsync({
        status: "err",
        reason: payloadParseResult.error.message,
      }),
      { status: 400 }
    );
  }

  const { username, password } = payloadParseResult.data;
  const user = await prisma.user.findFirst({ where: { username } });

  if (!user) {
    return NextResponse.json(
      await authLoginPostResponse.parseAsync({
        status: "err",
        reason: INVALID_CREDENTIALS,
      }),
      { status: 403 }
    );
  }

  // check if the hash matched
  if (!(await bcryptjs.compare(password, user.password))) {
    // invalid password
    return NextResponse.json(
      await authLoginPostResponse.parseAsync({
        status: "err",
        reason: INVALID_CREDENTIALS,
      }),
      { status: 403 }
    );
  }

  // yey! user benarr!
  const response = NextResponse.json(
    await authLoginPostResponse.parseAsync({
      status: "ok",
      payload: {
        redirect: LOGIN_REDIRECT_TO,
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
    // secure: true,
  });

  return response;
}
