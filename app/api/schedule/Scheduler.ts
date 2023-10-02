import prisma from "@/prisma";
import setDay from "date-fns/setDay";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import {
  Schedule as DbSchedule,
  ScheduleDay as DbScheduleDay,
  ScheduleTimeBlock as DbScheduleTimeBlock,
} from "@prisma/client";

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

  private async retrieveExistingSchedule(): Promise<
    | (DbSchedule & {
        days: (DbScheduleDay & { time_blocks: DbScheduleTimeBlock[] })[];
      })
    | null
  > {
    return prisma.schedule.findFirst({
      where: {
        first_day_timestamp: {
          gt: startOfDay(this.startOfTheWeek).getTime(),
          lt: endOfDay(this.startOfTheWeek).getTime(),
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
  async createSchedule(): Promise<Schedule> {
    // check if there is a schedule
    const existingSchedule = await this.retrieveExistingSchedule();
    if (existingSchedule) {
      const schedule = existingSchedule.days.map((d) =>
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

    throw new Error("Not implemented");
  }
}

export type Schedule = [
  ScheduleDay,
  ScheduleDay,
  ScheduleDay,
  ScheduleDay,
  ScheduleDay,
  ScheduleDay,
  ScheduleDay,
];

export type ScheduleDay = ScheduleTimeBlock[];

export type ScheduleTimeBlock = {
  materialId: number;
  startRelativeTimestamp: number;
  endRelativeTimestamp: number;
};
