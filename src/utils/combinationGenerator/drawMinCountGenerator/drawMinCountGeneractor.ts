import { getRandomNum, shuffle } from "../../number";
import { BaseCombinationGenerator } from "../baseCombinationGenerator";

export class DrawMinCountGenerator extends BaseCombinationGenerator {
  // 최근 N회차동안 출현 번호에서 최소 K개의 번호 조합을 생성
  getRandomCombinationWithMinCount(
    drawCount: number,
    minCount: number
  ): number[] {
    const recentDraws = this.allDraws.slice(0, drawCount);

    const recentNumbers = new Set<number>();

    recentDraws.forEach((draw) => {
      draw.winningNumbers.forEach((num) => recentNumbers.add(num));
    });

    const randomIdx = getRandomNum(
      minCount,
      Math.max(minCount, recentNumbers.size)
    );

    const shuffled = shuffle([...recentNumbers]).slice(0, randomIdx);

    return this.getWithRemainingNumbers(shuffled);
  }

  getRandomUnappearedNumbers(drawCount: number, minCount: number): number[] {
    const recentDraws = this.allDraws.slice(0, drawCount);

    const numberFrequencyMap = this.getNumberFrequencyMap(recentDraws);

    // 미출현 번호 계산
    const unappearedNumbers: number[] = [];
    for (let i = 1; i <= this.maxNumber; i++) {
      if ((numberFrequencyMap.get(i) || 0) === 0) {
        unappearedNumbers.push(i);
      }
    }

    const randomIdx = getRandomNum(
      minCount,
      Math.max(minCount, unappearedNumbers.length)
    );

    const shuffled = shuffle(unappearedNumbers).slice(0, randomIdx);

    return this.getWithRemainingNumbers(shuffled);
  }

  getWithRemainingNumbers(selectedNumbers: number[]) {
    if (selectedNumbers.length >= 6) return selectedNumbers.slice(0, 6);
    const allNumbers = new Set<number>(
      Array.from({ length: this.maxNumber }, (_, i) => i + 1)
    );
    const usedNumbers = new Set<number>(selectedNumbers);
    const remainingNumbers = shuffle(
      Array.from(allNumbers).filter((num) => !usedNumbers.has(num))
    );

    return [...selectedNumbers, ...remainingNumbers]
      .slice(0, 6)
      .sort((a, b) => a - b);
  }
}
