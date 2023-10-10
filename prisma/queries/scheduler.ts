import { Material } from "@prisma/client";
import { number, string } from "zod";
import prisma from "..";

export const lowestMaterialScoreDiffs = async ({
  afterDate,
  username,
}: {
  afterDate: Date;
  username: string;
}): Promise<
  {
    material_id: number;
    study_sessions: number[];
    scores: number[];
    points: Date[];
    diffs: number[];
    avg_diff: number;
  }[]
> => prisma.$queryRaw`
  WITH scores AS (
    SELECT
      id AS study_session_id,
      ss.material_id,
      ss.before_score AS score,
      ss.start as point
    FROM study_session ss
    WHERE ss.username = ${username}
    UNION ALL
    SELECT
      ssc.study_session_id AS study_session_id,
      NULL as material_id,
      ssc.after_score AS score,
      ssc.end as point
    FROM study_session_conclusion ssc
    WHERE ssc.username = ${username}
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
    material_id,
    array_agg(study_session_id) AS study_sessions,
    array_agg(score) AS scores,
    array_agg(point) AS points,
    array_remove(array_agg(diff), NULL) AS diffs,
    AVG(diff) AS avg_diff
  FROM (
    SELECT
      *,
      (score - LAG(score)
        OVER (PARTITION BY material_id ORDER BY point ASC)
      ) AS diff
    FROM flattened_material_id
  ) tb
  GROUP BY material_id
  ORDER BY avg_diff ASC`;

export const lowestMaterialScoreAvgs = async ({
  limit,
  offset,
  username,
}: {
  limit: number;
  offset: number;
  username: string;
}): Promise<(Material & { avg_score: number })[]> => prisma.$queryRaw`
  WITH scores AS (
    SELECT
      id AS study_session_id,
      ss.material_id,
      ss.before_score AS score,
      ss.start as point
    FROM study_session ss
    WHERE ss.username = ${username}
    UNION ALL
    SELECT
      ssc.study_session_id AS study_session_id,
      NULL as material_id,
      ssc.after_score AS score,
      ssc.end as point
    FROM study_session_conclusion ssc
    WHERE ssc.username = ${username}
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

export const lastHighestScoreOfMaterial = async ({
  materialId,
  username,
}: {
  materialId: number;
  username: string;
}): Promise<
  [
    {
      material_id: number;
      study_session_id: number;
      score: number;
      point: Date;
    },
  ]
> => prisma.$queryRaw`
  WITH scores AS (
    SELECT 
      id AS study_session_id, 
      ss.material_id, 
      ss.before_score AS score, 
      ss.start as point 
    FROM study_session ss 
    WHERE ss.username = ${username}
    UNION ALL 
    SELECT 
      ssc.study_session_id AS study_session_id, 
      NULL as material_id, 
      ssc.after_score AS score, 
      ssc.end as point 
    FROM study_session_conclusion ssc
    WHERE ssc.username = ${username}
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
  ) SELECT * FROM 
    (
      SELECT 
        ROW_NUMBER() OVER (
          PARTITION BY material_id 
          ORDER BY 
            score DESC
        ) AS rownum, 
        material_id, 
        study_session_id, 
        score, 
        point 
      FROM flattened_material_id
      WHERE material_id = ${materialId}
    ) T 
  WHERE rownum = 1`;

export const materialGrowthOverTimeOnStudySession = async ({
  materialId,
  username,
}: {
  materialId: number;
  username: string;
}): Promise<
  [Material & { score_growth_over_time: number }]
> => prisma.$queryRaw`
  SELECT
    AVG(ssc.after_score - ss.before_score) / SUM(ssc.study_time)
      AS score_growth_over_time,
    material.*
  FROM study_session ss
  JOIN study_session_conclusion ssc ON ssc.study_session_id = ss.id
  JOIN material ON ss.material_id = material.id
  WHERE ss.material_id = ${materialId} AND ss.username = ${username}
  GROUP BY material.id`;

export const avgScoreOfMaterial = async ({
  materialId,
  username,
}: {
  materialId: number;
  username: string;
}): Promise<[{ avg: number }]> => prisma.$queryRaw`
WITH scores AS (
    SELECT
      id AS study_session_id,
      ss.material_id,
      ss.before_score AS score,
      ss.start as point
    FROM study_session ss
    WHERE ss.username = ${username}
    UNION ALL
    SELECT
      ssc.study_session_id AS study_session_id,
      NULL as material_id,
      ssc.after_score AS score,
      ssc.end as point
    FROM study_session_conclusion ssc
    WHERE ssc.username = ${username}
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
    AVG(score)
  FROM flattened_material_id
  WHERE material_id = ${materialId}
  GROUP BY material_id
  LIMIT 1`;
