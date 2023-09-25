import {
  subjectGetResponse,
  SubjectGetResponse,
  subjectListGetResponse,
  SubjectListGetResponse,
} from "@/app/api/schema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subjectApi = createApi({
  reducerPath: "subjectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${window.location.origin}/api/subject`,
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
    listSubjects: builder.query<SubjectListGetResponse, void>({
      query: () => "list",
      transformResponse: async (resp) => {
        try {
          return await subjectListGetResponse.parseAsync(resp);
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
  }),
});

export const {
  useGetSubjectByIdQuery,
  useLazyGetSubjectByIdQuery,

  useListSubjectsQuery,
  useLazyListSubjectsQuery,
} = subjectApi;
