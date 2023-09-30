"use client";
import {
  MaterialGetRequest,
  MaterialGetResponse,
  materialGetResponseResult,
  MaterialListAllGetRequest,
  MaterialListAllGetResponse,
  MaterialListGetRequest,
  MaterialListGetResponse,
  materialListGetResponseResult,
} from "@/app/api/schema";
import { Material, Subject } from "@/lib/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const materialApi = createApi({
  reducerPath: "materialApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/material",
  }),
  tagTypes: ["material", "materialAll"],
  endpoints: (builder) => ({
    getMaterialById: builder.query<MaterialGetResponse, MaterialGetRequest>({
      query: (body) => {
        const params = new URLSearchParams({
          id: body.id.toString(),
        });
        return {
          url: `?${params}`,
        };
      },
      serializeQueryArgs: ({ queryArgs }) => queryArgs.id,
      transformResponse: async (resp) => {
        try {
          const result = await materialGetResponseResult.parseAsync(resp);
          if (result.status === "err") {
            throw new Error(result.reason);
          }
          return result.payload;
        } catch (e) {
          console.error(`Server sent an invalid response of /api/material:`);
          console.error(e);

          throw e;
        }
      },
    }),
    listMaterials: builder.query<
      MaterialListGetResponse,
      MaterialListGetRequest
    >({
      query: (body) => {
        const params = new URLSearchParams({
          limit: body.limit.toString(),
          offset: body.offset.toString(),
        });
        return { url: `list?${params}` };
      },
      transformResponse: async (resp) => {
        try {
          const result = await materialListGetResponseResult.parseAsync(resp);
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
            {} as Record<number, Material>
          )
        ),
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: "material" as const, id: r.id })),
              { type: "material", id: "LIST" },
            ]
          : [{ type: "material", id: "LIST" }],
    }),
    listAllMaterials: builder.query<
      MaterialListAllGetResponse,
      MaterialListAllGetRequest
    >({
      query: (body) => {
        const params = new URLSearchParams({
          limit: body.limit.toString(),
          offset: body.offset.toString(),
        });
        return { url: `list/all?${params}` };
      },
      transformResponse: async (resp) => {
        try {
          const result = await materialListGetResponseResult.parseAsync(resp);
          if (result.status === "err") {
            throw new Error(result.reason);
          }
          return result.payload;
        } catch (e) {
          console.error(`Server sent an invalid response of /api/material/list/all:`);
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
            {} as Record<number, Material>
          )
        ),
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: "materialAll" as const, id: r.id })),
              { type: "materialAll", id: "LIST" },
            ]
          : [{ type: "materialAll", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMaterialByIdQuery,
  useLazyGetMaterialByIdQuery,

  useListMaterialsQuery,
  useLazyListMaterialsQuery,

  useListAllMaterialsQuery,
  useLazyListAllMaterialsQuery,
} = materialApi;
