import { BaseCombinationGenerator } from "../baseCombinationGenerator";
import { shuffle } from "@/utils/number";

export class EvenOddGenerator extends BaseCombinationGenerator {
  generateAppearedNumbers(even: number, odd: number): number[] {
    const evens = this.allNumbers.filter((num) => num % 2 === 0);
    const odds = this.allNumbers.filter((num) => num % 2 === 1);

    return [
      ...shuffle(evens).slice(0, even),
      ...shuffle(odds).slice(0, odd),
    ].sort((a, b) => a - b);
  }
}
