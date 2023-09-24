import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getJWTSecretKey } from "./lib/auth";

const publicEndpoints = [
  "/api/auth/login",
  "/api/auth/register",
  "/auth/login",
  "/auth/register",
  "/_next",
];

// if the user is logged in, kick 'em to /dashboard when user tries to access these endpoints
const kickWhenLoggedInEndpoints = [
  "/api/auth/login",
  "/api/auth/register",
  "/auth/login",
  "/auth/register",
];

export default async function middleware(
  req: NextRequest
): Promise<NextResponse> {
  console.log("am a middleware mayyn");
  console.log(req.nextUrl.pathname);
  const isPublic =
    publicEndpoints.find((ep) => req.nextUrl.pathname.startsWith(ep)) !=
    undefined;

  if (!isPublic) {
    if (!req.cookies.has("token")) {
      return NextResponse.redirect(
        `${req.nextUrl.protocol}//${req.nextUrl.host}/auth/login`
      );
    }

    const token = req.cookies.get("token")!;

    try {
      await jwtVerify(token.value, getJWTSecretKey());
    } catch {
      // invalid token! invalidate it
      const response = NextResponse.redirect(
        `${req.nextUrl.protocol}//${req.nextUrl.host}/auth/login`
      );
      response.cookies.delete("token");
      return response;
    }

    // valid request yay!
    return NextResponse.next();
  } else {
    const token = req.cookies.get("token");

    if (token) {
      try {
        await jwtVerify(token.value, getJWTSecretKey());
      } catch {
        // invalid token! invalidate it
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }

      // valid token and public endpoint, check if we should kick em
      const shouldKick =
        kickWhenLoggedInEndpoints.find((ep) =>
          req.nextUrl.pathname.startsWith(ep)
        ) != undefined;

      if (shouldKick) {
        return NextResponse.redirect(
          `${req.nextUrl.protocol}//${req.nextUrl.host}/dashboard`
        );
      }
    }

    return NextResponse.next();
  }
}
