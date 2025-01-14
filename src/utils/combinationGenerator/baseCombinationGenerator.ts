import { LottoDraw } from "lottopass-shared";
import { shuffle } from "../number";

export class BaseCombinationGenerator {
  protected maxNumber: number = 45;
  protected allDraws: LottoDraw[];
  protected allNumbers: number[] = Array.from(
    { length: this.maxNumber },
    (_, i) => i + 1
  );

  constructor(allDraws: LottoDraw[]) {
    this.allDraws = allDraws.map((draw) => ({
      ...draw,
      winningNumbers: draw.winningNumbers.map((num) =>
        typeof num === "string" ? parseInt(num, 10) : num
      ),
    }));
  }

  protected getRemainingNumbers(selectedNumbers: number[]): number[] {
    const usedNumbers = new Set<number>(selectedNumbers);
    const remainingNumbers = this.allNumbers.filter(
      (num) => !usedNumbers.has(num)
    );

    return shuffle(remainingNumbers);
  }

  protected getWithRemainingNumbers(selectedNumbers: number[]): number[] {
    if (selectedNumbers.length >= 6)
      return shuffle(selectedNumbers).slice(0, 6);

    return shuffle(
      [...selectedNumbers, ...this.getRemainingNumbers(selectedNumbers)].slice(
        0,
        6
      )
    ).sort((a, b) => a - b);
  }

  protected getNumberFrequencyMap(draws: LottoDraw[]) {
    const numberFrequencyMap = new Map<number, number>();
    draws.forEach((draw) => {
      draw.winningNumbers.forEach((num) => {
        numberFrequencyMap.set(num, (numberFrequencyMap.get(num) || 0) + 1);
      });
    });

    return numberFrequencyMap;
  }
}
