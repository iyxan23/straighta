import prisma from "..";
import { Subject } from "@prisma/client";

export const subjectWithMaterialIdAndAvgScore = ({
  subjectId,
  username,
}: {
  subjectId: number;
  username: string;
}): Promise<
  [Subject & { avg: unknown; material_ids: number[] }]
> => prisma.$queryRaw`
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
    subject.*,
    array_agg(material.id) AS material_ids,
    ROUND(AVG(ss.avg)) AS avg
  FROM subject
  JOIN material
    ON material.subject_id = subject.id
  JOIN study_sessions ss
    ON ss.material_id = material.id
  WHERE
    subject.id = ${subjectId} AND
    subject.owner_username = ${username}
  GROUP BY subject.id;`;

export const subjectsAllAvgScore = ({
  limit,
  offset,
  username,
}: {
  limit: number;
  offset: number;
  username: string;
}): Promise<(Subject & { avg: unknown })[]> => prisma.$queryRaw`
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
    subject.*,
    ROUND(AVG(ss.avg)) as avg
  FROM subject
  JOIN material
    ON material.subject_id = subject.id
  JOIN study_sessions ss
    ON ss.material_id = material.id
  WHERE subject.owner_username = ${username}
  GROUP BY subject.id
  OFFSET ${offset}
  LIMIT ${limit};`;
