import prisma from "..";
import { Material } from "@prisma/client";

export const materialsWithSubjectIdAvgScore = ({
  limit,
  offset,
  subjectId,
  username,
}: {
  limit: number;
  offset: number;
  subjectId: number;
  username: string;
}): Promise<(Material & { avg: unknown })[]> => prisma.$queryRaw`
  WITH scores AS (
    SELECT
      id,
      material_id,
      before_score AS score
    FROM study_session ss
    UNION ALL
    SELECT
      study_session_id AS id,
      NULL AS material_id,
      after_score AS score
    FROM study_session_conclusion ssc
  ), study_sessions AS (
    SELECT
      scores.id,
      (array_agg(scores.material_id))[1]
        AS material_id,
      AVG(scores.score)
    FROM scores
    GROUP BY scores.id
  ) SELECT
    material.*,
    ROUND(AVG(ss.avg)) as avg
  FROM material
  JOIN study_sessions ss
    ON ss.material_id = material.id
  WHERE
    material.subject_id = ${subjectId} AND
    material.owner_username = ${username}
  GROUP BY material.id
  OFFSET ${offset}
  LIMIT ${limit};`;

export const materialsAllAvgScore = ({
  limit,
  offset,
  username,
}: {
  limit: number;
  offset: number;
  username: string;
}): Promise<(Material & { avg: unknown })[]> => prisma.$queryRaw`
  WITH scores AS (
    SELECT
      id,
      material_id,
      before_score AS score
    FROM study_session ss
    UNION ALL
    SELECT
      study_session_id AS id,
      NULL AS material_id,
      after_score AS score
    FROM study_session_conclusion ssc
  ), study_sessions AS (
    SELECT
      scores.id,
      (array_agg(scores.material_id))[1]
        AS material_id,
      AVG(scores.score)
    FROM scores
    GROUP BY scores.id
  ) SELECT
    material.*,
    ROUND(AVG(ss.avg)) as avg
  FROM material
  JOIN study_sessions ss
    ON ss.material_id = material.id
  WHERE
    material.owner_username = ${username}
  GROUP BY material.id
  OFFSET ${offset}
  LIMIT ${limit};`;
