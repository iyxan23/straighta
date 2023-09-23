import { authLoginRequest, authLoginResponse } from "./../../schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
import { getJWTSecretKey } from "@/lib/auth";

const REDIRECT_TO = "/dashboard";

export async function POST(request: NextRequest) {
  const payloadParseResult = await request
    .json()
    .then((json) => authLoginRequest.safeParseAsync(json));

  if (!payloadParseResult.success) {
    return NextResponse.json(
      await authLoginResponse.parseAsync({
        status: "err",
        reason: payloadParseResult.error.toString(),
      })
    );
  }

  const { username, password } = payloadParseResult.data;
  const user = await prisma.user.findFirst({ where: { username } });

  if (!user) {
    return NextResponse.json(
      await authLoginResponse.parseAsync({
        status: "err",
        reason: "Kredensial tidak valid",
      })
    );
  }

  // check if the hash matched
  if (!(await bcryptjs.compare(password, user.password))) {
    // invalid password
    return NextResponse.json(
      await authLoginResponse.parseAsync({
        status: "err",
        reason: "Kredensial tidak valid",
      })
    );
  }

  // yey! user benarr!
  const response = NextResponse.json(
    await authLoginResponse.parseAsync({
      status: "ok",
      redirect: REDIRECT_TO,
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
}
