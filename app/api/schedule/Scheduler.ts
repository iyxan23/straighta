import {
  lowestMaterialScoreDiffs,
  lowestMaterialScoreAvgs,
  materialGrowthOverTimeOnStudySession,
  lastHighestScoreOfMaterial,
  avgScoreOfMaterial,
} from "./../../../prisma/queries/scheduler";
import prisma from "@/prisma";
import setDay from "date-fns/setDay";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import {
  Schedule as DbSchedule,
  ScheduleDay as DbScheduleDay,
  ScheduleTimeBlock as DbScheduleTimeBlock,
} from "@prisma/client";
import { sec } from "@/lib/utils";

export const FULL_SCORE = 100;

// temporary fixed schedule
// later implementation will feature dynamic schedule
// using study intensity
const SCHEDULE_ITEM_MS = 3 * 60 * 60 * 1000; // 3 hours
const SCHEDULE_COUNT = 7; // 7 days a week
const SCHEDULE_STARTS_AT = 16 * 60 * 60 * 1000; // 16:00

// The one and only, scheduler
// This is made as a class so it's easier to pass things around
// Parameters to be passed:
//  -
export default class Scheduler {
  private now: Date;
  private startOfTheWeek: Date;
  private username: string;

  // the now paramter can be of any time range
  // Scheduler will automatically determine the first day of the week
  constructor(username: string, now: Date) {
    this.now = now;
    this.username = username;
    this.startOfTheWeek = startOfDay(setDay(now, 0));
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
          gte: startOfDay(this.startOfTheWeek),
          lte: endOfDay(this.startOfTheWeek),
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
      afterDate: this.startOfTheWeek,
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
    const lowestScoreDiffWeights = await Promise.all(
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
        const weight = timeNeeded / SCHEDULE_ITEM_MS;

        console.log(`\n================ LOWEST DIFFS`);
        console.log(`calculating time required for mid$${d.material_id}`);
        console.log(d);
        console.log(`score growth over time: ${score_growth_over_time}`);
        console.log(`peak score: ${peakScore}`);
        console.log(`avg score: ${avg}`);
        console.log(`time needed: ${timeNeeded}`);
        console.log(`weight: ${weight}`);

        return { materialId: d.material_id, weight };
      }),
    );

    const lowestScoreWeights = await Promise.all(
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
        const weight = timeNeeded / SCHEDULE_ITEM_MS;

        console.log(`\n================ LOWEST SCORES`);
        console.log(`calculating time required for mid$${d.id}`);
        console.log(d);
        console.log(`score growth over time: ${score_growth_over_time}`);
        console.log(`avg score: ${d.avg_score}`);
        console.log(`target: ${target}`);
        console.log(`time needed: ${timeNeeded}`);
        console.log(`weight: ${weight}`);

        return { materialId: d.id, weight };
      }),
    );

    // combine the materials, and remove those that is below a certain treshold
    const materialCandidates = [
      ...lowestScoreDiffWeights,
      ...lowestScoreWeights,
    ].filter(({ weight }) => weight > DISCARD_WEIGHT_TRESHOLD);

    // sort them by ascending order
    materialCandidates.sort((a, b) => b.weight - a.weight);
    console.log(materialCandidates);

    // choose them
    let chosenMaterials: { materialId: number; weight: number }[] = [];
    let currentWeight = 0;

    materialCandidates.forEach((candidate) => {
      if (currentWeight >= SCHEDULE_COUNT) {
        // we got the right spot!
        return;
      }

      console.log(candidate.weight);
      currentWeight += candidate.weight;
      chosenMaterials.push({
        materialId: candidate.materialId,
        weight: candidate.weight,
      });
    });

    console.log(chosenMaterials);

    // done! normalize their weights to they would match the desired weight
    chosenMaterials = chosenMaterials.map(({ materialId, weight }) => ({
      materialId,
      weight: (weight / currentWeight) * SCHEDULE_COUNT,
    }));
    console.log("bbb");

    // todo: OOP the hell code below me
    // we've got our materials to be scheduled!
    // turn them into a real schedule
    let scheduleResult: ScheduleWeek = [[], [], [], [], [], [], []];

    let usedWeightInDay = 0;

    let currentDay = 0;
    let currentMaterialIdx = 0;

    while (true) {
      console.log("whiel");
      console.log(scheduleResult);
      console.log(`today is ${currentDay}`);
      const currentMaterial = chosenMaterials[currentMaterialIdx];
      const minimumMaterialTime = currentMaterial.weight * SCHEDULE_ITEM_MS;
      console.log("aftere dez");

      if (minimumMaterialTime > 1 - usedWeightInDay) {
        scheduleResult[currentDay].push({
          materialId: currentMaterial.materialId,
          startRelativeTimestamp: SCHEDULE_STARTS_AT + usedWeightInDay,
          endRelativeTimestamp:
            SCHEDULE_STARTS_AT +
            usedWeightInDay +
            (1 - usedWeightInDay) * SCHEDULE_ITEM_MS,
        });
        const weightForTheNextDay = minimumMaterialTime - (1 - usedWeightInDay);

        usedWeightInDay = 0;
        currentDay++;

        if (currentDay >= 7) {
          // warning: material candidates summed up into a value more than 7
          break;
        }

        // put the rest for the next day
        scheduleResult[currentDay].push({
          materialId: currentMaterial.materialId,
          startRelativeTimestamp: SCHEDULE_STARTS_AT,
          endRelativeTimestamp:
            SCHEDULE_STARTS_AT + weightForTheNextDay * SCHEDULE_ITEM_MS,
        });
        usedWeightInDay = weightForTheNextDay;
      } else {
        // we're fine, add it
        scheduleResult[currentDay].push({
          materialId: currentMaterial.materialId,
          startRelativeTimestamp: SCHEDULE_STARTS_AT + usedWeightInDay,
          endRelativeTimestamp:
            SCHEDULE_STARTS_AT + usedWeightInDay + minimumMaterialTime,
        });
      }

      if (currentDay >= 7) {
        break;
      }

      currentMaterialIdx++;
    }

    return scheduleResult;
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

const testData = (materialId: number): ScheduleWeek => [
  [
    {
      materialId,
      startRelativeTimestamp: sec("18:00"),
      endRelativeTimestamp: sec("20:00"),
    },
  ],
  [
    {
      materialId,
      startRelativeTimestamp: sec("18:00"),
      endRelativeTimestamp: sec("20:00"),
    },
  ],
  [
    {
      materialId,
      startRelativeTimestamp: sec("18:00"),
      endRelativeTimestamp: sec("20:00"),
    },
  ],
  [
    {
      materialId,
      startRelativeTimestamp: sec("18:00"),
      endRelativeTimestamp: sec("20:00"),
    },
  ],
  [
    {
      materialId,
      startRelativeTimestamp: sec("18:00"),
      endRelativeTimestamp: sec("20:00"),
    },
  ],
  [
    {
      materialId,
      startRelativeTimestamp: sec("18:00"),
      endRelativeTimestamp: sec("20:00"),
    },
  ],
  [
    {
      materialId,
      startRelativeTimestamp: sec("08:15"),
      endRelativeTimestamp: sec("10:15"),
    },
    {
      materialId,
      startRelativeTimestamp: sec("16:00"),
      endRelativeTimestamp: sec("18:00"),
    },
  ],
];

function fillShallowTimeBlock(
  shallow: ShallowTimeBlock,
  materialId: number,
): ScheduleTimeBlock {
  return {
    ...shallow,
    materialId,
  };
}

type SevenTimes<T> = [T, T, T, T, T, T, T];

type ShallowTimeBlock = Omit<ScheduleTimeBlock, "materialId">;
type ShallowTimeBlockDay = ShallowTimeBlock[];
type ShallowTimeBlockWeek = SevenTimes<ShallowTimeBlockDay>;

export type ScheduleWeek = SevenTimes<ScheduleDay>;
export type ScheduleDay = ScheduleTimeBlock[];
export type ScheduleTimeBlock = {
  materialId: number;
  startRelativeTimestamp: number;
  endRelativeTimestamp: number;
};
