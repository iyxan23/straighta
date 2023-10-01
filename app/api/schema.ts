import { z } from "zod";

export const responseResultSchema = <T>(payloadSchema: z.ZodSchema<T>) =>
  z.discriminatedUnion("status", [
    z.object({ status: z.literal("ok"), payload: payloadSchema }),
    z.object({ status: z.literal("err"), reason: z.string() }),
  ]);

// /api/auth/login
export const authLoginPostRequest = z.object({
  username: z.string(),
  password: z.string(),
});
export const authLoginPostResponse = responseResultSchema(
  z.object({ redirect: z.string() })
);

export type AuthLoginPostRequest = z.infer<typeof authLoginPostRequest>;
export type AuthLoginPostResponse = z.infer<typeof authLoginPostResponse>;

// /api/auth/register
export const authRegisterPostRequest = z.object({
  username: z.string(),
  password: z.string().min(8, "password minimal 8 karakter"),
});
export const authRegisterPostResponse = responseResultSchema(
  z.object({ redirect: z.string() })
);

export type AuthRegisterPostRequest = z.infer<typeof authRegisterPostRequest>;
export type AuthRegisterPostResponse = z.infer<typeof authRegisterPostResponse>;

// /api/subject
//  -> GET: retrieve a specific subject and its materials
export const subjectGetRequest = z.object({
  id: z.coerce.number(),
});
export const subjectGetResponse = z.object({
  title: z.string(),
  overallScore: z.number(),
  materials: z.array(z.number()),
});
export const subjectGetResponseResult =
  responseResultSchema(subjectGetResponse);

//  -> POST: create a new subject
export const subjectPostRequest = z.object({
  title: z.string(),
  materials: z.optional(z.array(z.string())),
});
export const subjectPostResponse = z.object({
  id: z.number(),
});
export const subjectPostResponseResult =
  responseResultSchema(subjectPostResponse);

export type SubjectGetRequest = z.infer<typeof subjectGetRequest>;
export type SubjectGetResponse = z.infer<typeof subjectGetResponse>;
export type SubjectGetResponseResult = z.infer<typeof subjectGetResponseResult>;

export type SubjectPostRequest = z.infer<typeof subjectPostRequest>;
export type SubjectPostResponse = z.infer<typeof subjectPostResponse>;
export type SubjectPostResponseResult = z.infer<
  typeof subjectPostResponseResult
>;

// /api/subject/list
export const subjectListGetRequest = z.object({
  limit: z.coerce
    .number()
    .min(1, "limit setidaknya berisi 1")
    .max(100, "limit memiliki maksimum 100")
    .default(10),
  offset: z.coerce
    .number()
    .min(0, "offset tidak boleh kurang dari 0")
    .default(0),
});
export const subjectListGetResponse = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    overallScore: z.number(),
  })
);
export const subjectListGetResponseResult = responseResultSchema(
  subjectListGetResponse
);

export type SubjectListGetRequest = z.infer<typeof subjectListGetRequest>;
export type SubjectListGetResponse = z.infer<typeof subjectListGetResponse>;
export type SubjectListGetResponseResult = z.infer<
  typeof subjectListGetResponseResult
>;

// /api/material
export const materialGetRequest = z.object({
  id: z.coerce.number(),
});
export const materialGetResponse = z.object({
  id: z.number(),
  title: z.string(),
  overallScore: z.number(),
  subjectId: z.number(),
});
export const materialGetResponseResult =
  responseResultSchema(materialGetResponse);

export type MaterialGetRequest = z.infer<typeof materialGetRequest>;
export type MaterialGetResponse = z.infer<typeof materialGetResponse>;
export type MaterialGetResponseResult = z.infer<
  typeof materialGetResponseResult
>;

// /api/material/list
export const materialListGetRequest = z.object({
  subjectId: z.coerce.number(),
  limit: z.coerce
    .number()
    .min(1, "limit setidaknya berisi 1")
    .max(100, "limit memiliki maksimum 100"),
  offset: z.coerce.number().min(0, "offset tidak boleh kurang dari 0"),
});
export const materialListGetResponse = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    overallScore: z.number(),
    subjectId: z.number(),
  })
);
export const materialListGetResponseResult = responseResultSchema(
  materialListGetResponse
);

export type MaterialListGetRequest = z.infer<typeof materialListGetRequest>;
export type MaterialListGetResponse = z.infer<typeof materialListGetResponse>;
export type MaterialListGetResponseResult = z.infer<
  typeof materialListGetResponseResult
>;

// /api/material/list/all
export const materialListAllGetRequest = z.object({
  limit: z.coerce
    .number()
    .min(1, "limit setidaknya berisi 1")
    .max(100, "limit memiliki maksimum 100"),
  offset: z.coerce.number().min(0, "offset tidak boleh kurang dari 0"),
});
export const materialListAllGetResponse = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    overallScore: z.number(),
    subjectId: z.number(),
  })
);
export const materialListAllGetResponseResult = responseResultSchema(
  materialListAllGetResponse
);

export type MaterialListAllGetRequest = z.infer<
  typeof materialListAllGetRequest
>;
export type MaterialListAllGetResponse = z.infer<
  typeof materialListAllGetResponse
>;
export type MaterialListAllGetResponseResult = z.infer<
  typeof materialListAllGetResponseResult
>;

// /api/study/new
export const studyNewPostRequest = z.object({
  materialId: z.coerce.number(),
  score: z.coerce.number(),
});
export const studyNewPostResponse = z.object({ id: z.number() });
export const studyNewPostResponseResult =
  responseResultSchema(studyNewPostResponse);

export type StudyNewPostRequest = z.infer<typeof studyNewPostRequest>;
export type StudyNewPostResponse = z.infer<typeof studyNewPostResponse>;
export type StudyNewPostResponseResult = z.infer<
  typeof studyNewPostResponseResult
>;

// /api/study/end
export const studyEndPostRequest = z.object({
  id: z.coerce.number(),
  time: z.object({
    studyTime: z.coerce.number(), // relative time in miliseconds
    breakTime: z.coerce.number(), // relative time in miliseconds
  }),
  score: z.coerce.number(),
});
export const studyEndPostResponse = z.object({ id: z.number() });
export const studyEndPostResponseResult =
  responseResultSchema(studyEndPostResponse);

export type StudyEndPostRequest = z.infer<typeof studyEndPostRequest>;
export type StudyEndPostResponse = z.infer<typeof studyEndPostResponse>;
export type StudyEndPostResponseResult = z.infer<
  typeof studyEndPostResponseResult
>;

// /api/study/cancel
export const studyCancelPostRequest = z.object({
  id: z.coerce.number(),
});
export const studyCancelPostResponse = z.object({});
export const studyCancelPostResponseResult = responseResultSchema(
  studyCancelPostResponse
);

export type StudyCancelPostRequest = z.infer<typeof studyCancelPostRequest>;
export type StudyCancelPostResponse = z.infer<typeof studyCancelPostResponse>;
export type StudyCancelPostResponseResult = z.infer<
  typeof studyCancelPostResponseResult
>;

export const studyListGetRequest = z.object({
  limit: z.coerce.number().min(1).max(100),
  offset: z.coerce.number().min(0),
});
export const studyListGetResponse = z.array(
  z.object({
    id: z.number(),
    timestamp: z.object({
      start: z.number(),
      end: z.optional(z.number()),
    }),
    materialId: z.number(),
  })
);

export const studyListGetResponseResult =
  responseResultSchema(studyListGetResponse);

export type StudyListGetRequest = z.infer<typeof studyListGetRequest>;
export type StudyListGetResponse = z.infer<typeof studyListGetResponse>;
export type StudyListGetResponseResult = z.infer<
  typeof studyListGetResponseResult
>;
