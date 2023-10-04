import { scheduleGetRequest } from "./../schema";
import { ScheduleGetResponseResult } from "../schema";
import { HEADER_TOKEN_USERNAME } from "@/middlewareHeaders";
import { NextRequest, NextResponse } from "next/server";
import Scheduler from "./Scheduler";
import { searchParamsToObject } from "@/lib/utils";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ScheduleGetResponseResult>> {
  // const data = await req
  const payload = searchParamsToObject(req.nextUrl.searchParams);
  const data = await scheduleGetRequest.safeParseAsync(payload);

  if (!data.success) {
    return NextResponse.json(
      {
        status: "err",
        reason: data.error.message,
      },
      { status: 400 },
    );
  }

  const { time } = data.data;

  const username = req.headers.get(HEADER_TOKEN_USERNAME)!;
  const scheduler = new Scheduler(username, new Date(time));

  return NextResponse.json({
    status: "ok",
    payload: await scheduler.createSchedule(),
  });
}
