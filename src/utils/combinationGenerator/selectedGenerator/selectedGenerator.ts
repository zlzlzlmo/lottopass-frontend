import { BaseCombinationGenerator } from "../baseCombinationGenerator";

export class SelectedGenerator extends BaseCombinationGenerator {
  getRequiredNumbers(selectedNumbers: number[]): number[] {
    return this.getWithRemainingNumbers(selectedNumbers);
  }

  getExcludedNumbers(selectedNumbers: number[]): number[] {
    const required = this.getRemainingNumbers(selectedNumbers);
    return this.getWithRemainingNumbers(required);
  }
}
