import {
  lowestMaterialScoreDiffs,
  lowestMaterialScoreAvgs,
  materialGrowthOverTimeOnStudySession,
  lastHighestScoreOfMaterial,
  avgScoreOfMaterial,
} from "./../../../prisma/queries/scheduler";
import prisma from "@/prisma";
import subWeeks from "date-fns/subWeeks";
import startOfWeek from "date-fns/startOfWeek";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import {
  Schedule as DbSchedule,
  ScheduleDay as DbScheduleDay,
  ScheduleTimeBlock as DbScheduleTimeBlock,
} from "@prisma/client";
import { sec } from "@/lib/utils";
import ScheduleSpreader from "./ScheduleSpreader";

export const FULL_SCORE = 100;

// temporary fixed schedule
// later implementation will feature dynamic schedule
// using study intensity
const SCHEDULE_ITEM_MS = 3 * 60 * 60 * 1000; // 3 hours
const SCHEDULE_COUNT = 7; // 7 days a week
const SCHEDULE_STARTS_AT = 16 * 60 * 60 * 1000; // 16:00

// any weight lower than this weight will be discarded
export const DISCARD_WEIGHT_TRESHOLD = 0.5;

// The one and only, scheduler
// This is made as a class so it's easier to pass things around
// Parameters to be passed:
//  -
export default class Scheduler {
  private now: Date;
  private startOfLastWeek: Date;
  private username: string;

  // the now paramter can be of any time range
  // Scheduler will automatically determine the first day of the week
  constructor(username: string, now: Date) {
    this.now = now;
    this.username = username;
    this.startOfLastWeek = startOfWeek(subWeeks(now, 1));
  }

  // floating point from 0 to 1
  private async retrieveStudyIntensity(): Promise<number> {
    // todo: retrieve from database
    return 0.8;
  }

  /*
  // in ms
  private async retrievePlannedTimeBlocks(): Promise<ShallowTimeBlockWeek> {
    // todo: do something with study intensity
    const DURATION = 2 * 60 * 60 * 1000; // 2 hours

    const perDay = (): ShallowTimeBlockDay => [
      {
        startRelativeTimestamp: sec("16:00"),
        endRelativeTimestamp: sec("16:00") + DURATION,
      },
    ];

    return [
      perDay(),
      perDay(),
      perDay(),
      perDay(),
      perDay(),
      perDay(),
      perDay(),
    ];
  }
  */

  private async retrieveExistingSchedule(): Promise<
    | (DbSchedule & {
        days: (DbScheduleDay & { time_blocks: DbScheduleTimeBlock[] })[];
      })
    | null
  > {
    return prisma.schedule.findFirst({
      where: {
        first_day_timestamp: {
          gte: startOfDay(this.startOfLastWeek),
          lte: endOfDay(this.startOfLastWeek),
        },
      },
      include: {
        days: {
          include: {
            time_blocks: true,
          },
        },
      },
    });
  }

  // Creates a schedule for the week passed on now
  async createSchedule(): Promise<ScheduleWeek> {
    // check if there is a schedule
    const existingSchedule = await this.retrieveExistingSchedule();
    if (existingSchedule) {
      return scheduleFromDatabase(existingSchedule);
    }

    const lowestScoreDiffs = await lowestMaterialScoreDiffs({
      afterDate: this.startOfLastWeek,
      username: this.username,
    });
    const lowestScores = await lowestMaterialScoreAvgs({
      limit: 10,
      offset: 0,
      username: this.username,
    });

    /*
    const plannedTimeBlocks = await this.retrievePlannedTimeBlocks();
    */
    const studyIntensity = await this.retrieveStudyIntensity();

    // calculate the time needed of each materials
    const lowestScoreDiffTimeNeeded = await Promise.all(
      lowestScoreDiffs.map(async (d) => {
        const [
          [{ score_growth_over_time }],
          [{ score: peakScore }],
          [{ avg }],
        ] = await Promise.all([
          materialGrowthOverTimeOnStudySession({
            materialId: d.material_id,
            username: this.username,
          }),
          lastHighestScoreOfMaterial({
            materialId: d.material_id,
            username: this.username,
          }),
          avgScoreOfMaterial({
            materialId: d.material_id,
            username: this.username,
          }),
        ]);

        // turn score growth to be .5 + positive score_growth if its negative
        const score_growth_n =
          score_growth_over_time < 0
            ? 0.5 + score_growth_over_time * 1
            : score_growth_over_time;

        const timeNeeded = (peakScore - avg) / Math.abs(score_growth_n);
        // time needed is in milliseconds
        // const weight = timeNeeded / SCHEDULE_ITEM_MS;

        console.log(`\n================ LOWEST DIFFS`);
        console.log(`calculating time required for mid$${d.material_id}`);
        console.log(d);
        console.log(`score growth over time: ${score_growth_over_time}`);
        console.log(`peak score: ${peakScore}`);
        console.log(`avg score: ${avg}`);
        console.log(`time needed: ${timeNeeded}`);
        // console.log(`weight: ${weight}`);

        return { materialId: d.material_id, timeNeeded };
      }),
    );

    const lowestScoreTimeNeeded = await Promise.all(
      lowestScores.map(async (d) => {
        const [{ score_growth_over_time }] =
          await materialGrowthOverTimeOnStudySession({
            materialId: d.id,
            username: this.username,
          });

        // turn score growth to be .5 + positive score_growth if its negative
        const score_growth_n =
          score_growth_over_time < 0
            ? 0.5 + score_growth_over_time * 1
            : score_growth_over_time;

        const target = (FULL_SCORE - d.avg_score) * studyIntensity;
        const timeNeeded = target / Math.abs(score_growth_n);
        // const weight = timeNeeded / SCHEDULE_ITEM_MS;

        console.log(`\n================ LOWEST SCORES`);
        console.log(`calculating time required for mid$${d.id}`);
        console.log(d);
        console.log(`score growth over time: ${score_growth_over_time}`);
        console.log(`avg score: ${d.avg_score}`);
        console.log(`target: ${target}`);
        console.log(`time needed: ${timeNeeded}`);
        // console.log(`weight: ${weight}`);

        return { materialId: d.id, timeNeeded };
      }),
    );

    const materialCandidates = [
      ...lowestScoreDiffTimeNeeded,
      ...lowestScoreTimeNeeded,
    ];
    console.log(materialCandidates);

    materialCandidates.forEach((c) => {
      console.log(`  -> ${c.materialId}: ${c.timeNeeded}`);
    });

    const TWO_HOURS = 2 * 60 * 60;
    return new ScheduleSpreader(materialCandidates).spread({
      times: [TWO_HOURS, TWO_HOURS, TWO_HOURS, TWO_HOURS, TWO_HOURS, TWO_HOURS],
    });
  }
}

function scheduleFromDatabase(
  dbSchedule: DbSchedule & {
    days: (DbScheduleDay & { time_blocks: DbScheduleTimeBlock[] })[];
  },
): ScheduleWeek {
  const schedule = dbSchedule.days.map((d) =>
    d.time_blocks.map((tb) => ({
      materialId: tb.material_id,
      startRelativeTimestamp: tb.start_rel_timestamp,
      endRelativeTimestamp: tb.end_rel_timestamp,
    })),
  );

  if (schedule.length != 7) {
    // probably brekover
    throw new Error("schedule is not of length 7");
  }

  return [
    schedule[0],
    schedule[1],
    schedule[2],
    schedule[3],
    schedule[4],
    schedule[5],
    schedule[6],
  ];
}

type SevenTimes<T> = [T, T, T, T, T, T, T];

export type ScheduleWeek = SevenTimes<ScheduleDay>;
export type ScheduleDay = ScheduleTimeBlock[];
export type ScheduleTimeBlock = {
  materialId: number;
  startRelativeTimestamp: number;
  endRelativeTimestamp: number;
};
