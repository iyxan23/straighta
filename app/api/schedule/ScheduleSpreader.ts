import { sec } from "@/lib/utils";
import { DISCARD_WEIGHT_TRESHOLD, ScheduleWeek } from "./Scheduler";

// this class' task is to spread multiple materials with their own weights to 7 consecutive days
export default class ScheduleSpreader {
  private materials: MaterialWithTime[];

  private get materialsTotal() {
    return this.materials.length;
  }

  constructor(materials: MaterialWithTime[]) {
    this.materials = materials;
  }

  spread({ times }: { times: number[] }): ScheduleWeek {
    const totalTimes = times.reduce((p, n) => p + n, 0);
    const weighedMaterials = ScheduleSpreader.eliminateLowWeights(
      this.weighMaterials({
        timePerWeight: totalTimes / times.length,
        weightMax: times.length,
      }),
    );

    // sort them by ascending order
    weighedMaterials.sort((a, b) => b.weight - a.weight);

    /*
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
    */

    return testData(5);
  }

  private static eliminateLowWeights(
    materials: MaterialWithWeight[],
  ): MaterialWithWeight[] {
    return materials.filter(({ weight }) => weight > DISCARD_WEIGHT_TRESHOLD);
  }

  private weighMaterials({
    timePerWeight,
    weightMax,
  }: {
    timePerWeight: number;
    weightMax: number;
  }): MaterialWithWeight[] {
    return this.materials.map(({ materialId, timeNeeded }) => ({
      materialId,
      weight: (timeNeeded / timePerWeight / this.materialsTotal) * weightMax,
    }));
  }
}

type Material = { materialId: number };
type MaterialWithTime = Material & { timeNeeded: number };
type MaterialWithWeight = Material & { weight: number };

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
