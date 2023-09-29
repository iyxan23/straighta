"use client";

import { StudySession } from "./../../lib/types";
import {
  StudyListGetRequest,
  StudyListGetResponse,
  studyListGetResponseResult,
} from "./../../app/api/schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studyApi = createApi({
  reducerPath: "studyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/study",
  }),
  tagTypes: ["study"],
  endpoints: (builder) => ({
    listStudySessions: builder.query<StudyListGetResponse, StudyListGetRequest>(
      {
        query: (body) => {
          const params = new URLSearchParams({
            limit: body.limit.toString(),
            offset: body.offset.toString(),
          });
          return { url: `list?${params}` };
        },
        transformResponse: async (resp) => {
          try {
            const result = await studyListGetResponseResult.parseAsync(resp);
            if (result.status === "err") {
              throw new Error(result.reason);
            }
            return result.payload;
          } catch (e) {
            console.error(
              `Server sent an invalid response of /api/study/list:`
            );
            console.error(e);
            throw e;
          }
        },
        serializeQueryArgs: ({ endpointName }) => endpointName,
        merge: (currentCache, newItems) =>
          // to ensure that there will no objects with the same key
          // newItems is deliberately placed after currentCache so that it will override
          // currentCache's values, since it has newer data.
          Object.values(
            [...currentCache, ...newItems].reduce(
              (prev, cur) => {
                prev[cur.id] = cur;
                return prev;
              },
              {} as Record<number, StudySession>
            )
          ),
        forceRefetch: ({ currentArg, previousArg }) =>
          currentArg !== previousArg,
        providesTags: (result) =>
          result
            ? [
                ...result.map((r) => ({ type: "study" as const, id: r.id })),
                { type: "study", id: "LIST" },
              ]
            : [{ type: "study", id: "LIST" }],
      }
    ),
  }),
});

export const { useListStudySessionsQuery, useLazyListStudySessionsQuery } =
  studyApi;