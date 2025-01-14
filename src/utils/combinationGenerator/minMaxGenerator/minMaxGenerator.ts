import { LottoDraw } from "lottopass-shared";
import { BaseCombinationGenerator } from "../baseCombinationGenerator";

export class MinMaxGenerator extends BaseCombinationGenerator {
  private min: number;
  private max: number;
  private appearedNumbers: number[];

  constructor(allDraws: LottoDraw[], min: number, max: number) {
    super(allDraws);
    this.min = min;
    this.max = max;

    const draws = this.allDraws.filter(
      (draw) => draw.drawNumber >= this.min && draw.drawNumber <= this.max
    );
    this.appearedNumbers = draws.flatMap((d) => d.winningNumbers);
  }

  generateAppearedNumbers(): number[] {
    return this.getWithRemainingNumbers(this.appearedNumbers);
  }

  generateUnappearedNumbers(): number[] {
    const unappearedNumbers = this.getRemainingNumbers(this.appearedNumbers);
    return this.getWithRemainingNumbers(unappearedNumbers);
  }
}
