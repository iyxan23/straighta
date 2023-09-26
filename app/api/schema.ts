import { string, z } from "zod";

export const responseResultSchema = <T>(payloadSchema: z.ZodSchema<T>) =>
  z.discriminatedUnion("status", [
    z.object({ status: z.literal("ok"), payload: payloadSchema }),
    z.object({ status: z.literal("err"), reason: z.string() }),
  ]);

// /api/auth/login
export const authLoginRequest = z.object({
  username: z.string(),
  password: z.string(),
});
export const authLoginResponse = responseResultSchema(
  z.object({ redirect: z.string() })
);

export type AuthLoginRequest = z.infer<typeof authLoginRequest>;
export type AuthLoginResponse = z.infer<typeof authLoginResponse>;

// /api/auth/register
export const authRegisterRequest = z.object({
  username: z.string(),
  password: z.string().min(8, "password minimal 8 karakter"),
});
export const authRegisterResponse = responseResultSchema(
  z.object({ redirect: z.string() })
);

export type AuthRegisterRequest = z.infer<typeof authRegisterRequest>;
export type AuthRegisterResponse = z.infer<typeof authRegisterResponse>;

// /api/subject
//  -> GET: retrieve a specific subject and its materials
export const subjectGetRequest = z.object({
  id: z.number(),
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
  limit: z
    .number()
    .min(1, "limit setidaknya berisi 1")
    .max(100, "limit memiliki maksimum 100")
    .default(10),
  offset: z.number().min(0, "offset tidak boleh kurang dari 0").default(0),
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
export const materialsRequest = z.object({
  subjectId: z.number(),
  limit: z
    .number()
    .min(1, "limit setidaknya berisi 1")
    .max(100, "limit memiliki maksimum 100"),
  offset: z.number().min(0, "offset tidak boleh kurang dari 0"),
});
export const materialResponse = responseResultSchema(
  z.array(
    z.object({ id: z.number(), title: z.string(), oveallScore: z.number() })
  )
);

export type MaterialsRequest = z.infer<typeof materialsRequest>;
export type MaterialsResponse = z.infer<typeof materialResponse>;

// /api/study/new
export const studyNewRequest = z.object({
  focus: z.object({
    subjectId: z.number(),
    materalIds: z.array(z.number()),
  }),
});
export const studyNewResponse = responseResultSchema(
  z.object({ id: z.number() })
);

export type StudyNewRequest = z.infer<typeof studyNewRequest>;
export type StudyNewResponse = z.infer<typeof studyNewResponse>;

// /api/study/end
export const studyEndRequest = z.object({
  id: z.number(),
  materials: z.record(
    z.number(),
    z.object({
      time: z.object({
        studyTime: z.number(), // relative time in seconds
        breakTime: z.number(), // relative time in seconds
      }),
      score: z.object({
        subjective: z.number(),
        objective: z.optional(z.array(z.number())),
      }),
    })
  ),
});
export const studyEndResponse = responseResultSchema(
  z.object({ id: z.number() })
);

export type StudyEndRequest = z.infer<typeof studyEndRequest>;
export type StudyEndResponse = z.infer<typeof studyEndResponse>;
