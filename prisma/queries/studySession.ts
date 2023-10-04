import { StudySession } from "@/lib/types";
import prisma from "..";

export const studySessionsAvgScore = (
  limit: number,
  offset: number,
): Promise<StudySession & { avg: number }> => prisma.$queryRaw`
  WITH scores AS (
    SELECT
      id,
      before_score AS score
    FROM study_session ss
    UNION ALL
    SELECT
      study_session_id as id,
      after_score AS score
    FROM study_session_conclusion ssc
  ) SELECT
    ss.id,
    ss.start,
    ss.username,
    ss.material_id,
    AVG(scores.score)
  FROM scores
  JOIN study_session ss ON scores.id = ss.id
  GROUP BY ss.id
  OFFSET ${offset}
  LIMIT ${limit};`;

export const studySessionsAvgScoreFast = (
  limit: number,
  offset: number,
): Promise<StudySession & { avg: number }> => prisma.$queryRaw`
  WITH scores AS (
    SELECT
      id,
      start,
      username,
      material_id,
      before_score AS score,
    NULL AS break_time
    FROM study_session ss
    UNION ALL
    SELECT
      study_session_id AS id,
      NULL AS start,
      NULL AS username,
      NULL AS material_id,
      after_score AS score,
    FROM study_session_conclusion ssc
  ) SELECT
    scores.id,
    (array_agg(scores.start))[1]
      AS start,
    (array_agg(scores.username))[1]
      AS username,
    (array_agg(scores.material_id))[1]
      AS material_id,
    AVG(scores.score)
  FROM scores
  GROUP BY scores.id
  OFFSET ${offset}
  LIMIT ${limit};`;
