import { LottoDraw } from "lottopass-shared";
import { BaseCombinationGenerator } from "../baseCombinationGenerator";
import { shuffle } from "@/utils/number";

export class MinMaxGeneratorByRank extends BaseCombinationGenerator {
  private min: number;
  private max: number;
  private draws: LottoDraw[];
  private sortedDraws: [number, number][];

  constructor(allDraws: LottoDraw[], min: number, max: number) {
    super(allDraws);
    this.min = min;
    this.max = max;
    this.draws = this.allDraws.filter(
      (draw) => draw.drawNumber >= this.min && draw.drawNumber <= this.max
    );
    const frequencyMap = this.getNumberFrequencyMap(this.draws);
    this.sortedDraws = Array.from(frequencyMap.entries()).sort((a, b) => {
      const diff = a[1] - b[1];
      return diff !== 0 ? diff : a[0] - b[0];
    });
  }

  generateTopAppearedNumbers(rank: number): number[] {
    const sliced = this.sortedDraws.slice(-1 * rank);
    return this.getCombinationNumbers(sliced);
  }

  generateBottomAppearedNumbers(rank: number) {
    const sliced = this.sortedDraws.slice(0, rank);
    return this.getCombinationNumbers(sliced);
  }

  private getCombinationNumbers(nums: [number, number][]): number[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return shuffle(nums.map(([ballNumber, _]) => ballNumber)).slice(0, 6);
  }
}
