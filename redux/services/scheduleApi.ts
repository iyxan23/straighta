"use client";

import {
  ScheduleGetRequest,
  ScheduleGetResponse,
  scheduleGetResponseResult,
} from "./../../app/api/schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/schedule",
  }),
  tagTypes: ["schedule"],
  endpoints: (builder) => ({
    getSchedule: builder.query<ScheduleGetResponse, ScheduleGetRequest>({
      query: (body) => {
        const params = new URLSearchParams({
          time: body.time.toString(),
        });
        return { url: `/?${params}` };
      },
      transformResponse: async (resp) => {
        try {
          const result = await scheduleGetResponseResult.parseAsync(resp);
          if (result.status === "err") {
            throw new Error(result.reason);
          }
          return result.payload;
        } catch (e) {
          console.error(`Server sent an invalid response of /api/schedule:`);
          console.error(e);
          throw e;
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((_i, idx) => ({
                type: "schedule" as const,
                id: idx,
              })),
              { type: "schedule", id: "LIST" },
            ]
          : [{ type: "schedule", id: "LIST" }],
    }),
  }),
});

export const { useGetScheduleQuery, useLazyGetScheduleQuery } = scheduleApi;
