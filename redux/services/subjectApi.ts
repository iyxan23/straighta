"use client";

import {
  subjectGetResponse,
  SubjectGetResponse,
  SubjectListGetRequest,
  SubjectListGetResponse,
  subjectListGetResponseResult,
} from "@/app/api/schema";
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const subjectApi = createApi({
  reducerPath: "subjectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      window.location.origin ?? process.env["NEXT_PUBLIC_URL"]
    }/api/subject`,
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
      merge: (currentCache, newItems) => currentCache.concat(newItems),
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
