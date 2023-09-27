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
export const subjectGetResponse = responseResultSchema(
  z.object({
    title: z.string(),
    overallScore: z.number(),
    materials: z.array(z.number()),
  })
);

//  -> POST: create a new subject
export const subjectPostRequest = z.object({
  title: z.string(),
  materials: z.optional(z.array(z.string())),
});
export const subjectPostResponse = responseResultSchema(
  z.object({
    id: z.number(),
  })
);

export type SubjectGetRequest = z.infer<typeof subjectGetRequest>;
export type SubjectGetResponse = z.infer<typeof subjectGetResponse>;

export type SubjectPostRequest = z.infer<typeof subjectPostRequest>;
export type SubjectPostResponse = z.infer<typeof subjectPostResponse>;

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

// /api/materials
export const materialsGetRequest = z.object({
  subjectId: z.coerce.number(),
  limit: z.coerce
    .number()
    .min(1, "limit setidaknya berisi 1")
    .max(100, "limit memiliki maksimum 100"),
  offset: z.coerce.number().min(0, "offset tidak boleh kurang dari 0"),
});
export const materialsGetResponse = responseResultSchema(
  z.array(
    z.object({ id: z.number(), title: z.string(), overallScore: z.number() })
  )
);

export type MaterialsGetRequest = z.infer<typeof materialsGetRequest>;
export type MaterialsGetResponse = z.infer<typeof materialsGetResponse>;

// /api/study/new
export const studyNewPostRequest = z.object({
  materialId: z.coerce.number(),
  score: z.coerce.number(),
});
export const studyNewPostResponse = responseResultSchema(
  z.object({ id: z.number() })
);

export type StudyNewPostRequest = z.infer<typeof studyNewPostRequest>;
export type StudyNewPostResponse = z.infer<typeof studyNewPostResponse>;

// /api/study/end
export const studyEndPostRequest = z.object({
  id: z.coerce.number(),
  time: z.object({
    studyTime: z.coerce.number(), // relative time in seconds
    breakTime: z.coerce.number(), // relative time in seconds
  }),
  score: z.coerce.number(),
});
export const studyEndPostResponse = responseResultSchema(
  z.object({ id: z.number() })
);

export type StudyEndPostRequest = z.infer<typeof studyEndPostRequest>;
export type StudyEndPostResponse = z.infer<typeof studyEndPostResponse>;
