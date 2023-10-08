import { Material } from "@prisma/client";
import prisma from "..";

export const lowestMaterialScoreDiffs = async ({
  afterDate,
}: {
  afterDate: Date;
}): Promise<{
  study_session_id: number;
  material_id: number;
  score: number;
  point: Date;
  diff: number;
  avg_diff: number;
}> => prisma.$queryRaw`
  WITH scores AS (
    SELECT
      id AS study_session_id,
      ss.material_id,
      ss.before_score AS score,
      ss.start as point
    FROM study_session ss
    UNION ALL
    SELECT
      ssc.study_session_id AS study_session_id,
      NULL as material_id,
      ssc.after_score AS score,
      ssc.end as point
    FROM study_session_conclusion ssc
  ), flattened_material_id AS (
    SELECT
      study_session_id,
      (array_remove(
        array_agg(material_id) OVER (PARTITION BY study_session_id),
        NULL
      ))[1] as material_id,
      score,
      point
    FROM scores
    WHERE point > ${afterDate}
  ) SELECT
    *,
    AVG(diff)
      OVER (PARTITION BY material_id)
      AS avg_diff
  FROM (
    SELECT
      *,
      (score - LAG(score)
        OVER (PARTITION BY material_id ORDER BY point ASC)
      ) AS diff
    FROM flattened_material_id
  ) tb
  ORDER BY avg_diff ASC`;

export const lowestMaterialScoreAvgs = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<(Material & { avg_score: number })[]> => prisma.$queryRaw`
  WITH scores AS (
    SELECT
      id AS study_session_id,
      ss.material_id,
      ss.before_score AS score,
      ss.start as point
    FROM study_session ss
    UNION ALL
    SELECT
      ssc.study_session_id AS study_session_id,
      NULL as material_id,
      ssc.after_score AS score,
      ssc.end as point
    FROM study_session_conclusion ssc
  ), flattened_material_id AS (
    SELECT
      study_session_id,
      (array_remove(
        array_agg(material_id) OVER (PARTITION BY study_session_id),
        NULL
      ))[1] as material_id,
      score,
      point
    FROM scores
  ) SELECT
    material.*,
    AVG(score) AS avg_score
  FROM flattened_material_id tb
  JOIN material
    ON material.id = tb.material_id
  GROUP BY material.id
  ORDER BY avg_score ASC
  OFFSET ${offset}
  LIMIT ${limit}`;
