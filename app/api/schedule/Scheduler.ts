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

    const plannedTimeBlocks = await this.retrievePlannedTimeBlocks();

    // calculate the time needed of each materials
    await Promise.all(
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

        console.log(`================`);
        console.log(`calculating time required for mid$${d.material_id}`);
        console.log(d);
        console.log(`score growth over time: ${score_growth_over_time}`);
        console.log(`peak score: ${peakScore}`);
        console.log(`avg score: ${avg}`);
        const timeNeeded = (peakScore - avg) * score_growth_over_time;
        console.log(`time needed: ${timeNeeded}`);

        return { ...d, timeNeeded };
      }),
    );

    return testData(150);
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
