import { NextResponse } from "next/server";

export const REGISTER_REDIRECT_TO = "/auth/register/questions";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({
    status: "ok",
    payload: { message: "Telah keluar" },
  });
  response.cookies.delete("token");
  return response;
}
