import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getJWTSecretKey } from "./lib/auth";
import { HEADER_TOKEN_USERNAME } from "./middlewareHeaders";

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

function injectTokenPayload(req: NextRequest, username: string): NextResponse {
  const headers = new Headers(req.headers);
  headers.append(HEADER_TOKEN_USERNAME, username);
  return NextResponse.next({ request: { headers } });
}

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
    let jwt;

    try {
      jwt = await jwtVerify(token.value, getJWTSecretKey());
    } catch {
      // invalid token! invalidate it
      const response = NextResponse.redirect(
        `${req.nextUrl.protocol}//${req.nextUrl.host}/auth/login`
      );
      response.cookies.delete("token");
      return response;
    }

    // valid request yay!
    return injectTokenPayload(req, jwt.payload["username"] as string);
  } else {
    const token = req.cookies.get("token");
    let jwt;

    if (token) {
      try {
        jwt = await jwtVerify(token.value, getJWTSecretKey());
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

    if (jwt) {
      return injectTokenPayload(req, jwt.payload["username"] as string);
    } else {
      return NextResponse.next();
    }
  }
}
