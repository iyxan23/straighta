"use client";

import {
  subjectGetResponse,
  SubjectGetResponse,
  SubjectListGetRequest,
  SubjectListGetResponse,
  subjectListGetResponseResult,
} from "@/app/api/schema";
import { Subject } from "@/lib/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subjectApi = createApi({
  reducerPath: "subjectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/subject",
  }),
  endpoints: (builder) => ({
    getSubjectById: builder.query<SubjectGetResponse, void>({
      query: () => "",
      transformResponse: async (resp) => {
        try {
          return await subjectGetResponse.parseAsync(resp);
        } catch (e) {
          console.error(`Server sent an invalid response of /api/subject:`);
          console.error(e);
          return {
            status: "err",
            reason: "Server mengirim respon yang tidak valid",
          };
        }
      },
    }),
    listSubjects: builder.query<SubjectListGetResponse, SubjectListGetRequest>({
      query: (body) => {
        const params = new URLSearchParams({
          limit: body.limit.toString(),
          offset: body.offset.toString(),
        });
        return { url: `list?${params}` };
      },
      transformResponse: async (resp) => {
        try {
          const result = await subjectListGetResponseResult.parseAsync(resp);
          if (result.status === "err") {
            throw new Error(result.reason);
          }
          return result.payload;
        } catch (e) {
          console.error(`Server sent an invalid response of /api/subject:`);
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
            {} as Record<number, Subject>
          )
        ),
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
    }),
  }),
});

export const {
  useGetSubjectByIdQuery,
  useLazyGetSubjectByIdQuery,

  useListSubjectsQuery,
  useLazyListSubjectsQuery,
} = subjectApi;
