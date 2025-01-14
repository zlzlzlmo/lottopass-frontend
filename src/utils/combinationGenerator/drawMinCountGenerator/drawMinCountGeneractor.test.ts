import { describe, it, expect, beforeEach } from "vitest";
import { DrawMinCountGenerator } from "./drawMinCountGeneractor";
import { LottoDraw } from "@/components/popup/StatisticPopup";

const mockDraws = [
  { winningNumbers: [1, 2, 3, 4, 5, 6] },
  { winningNumbers: [7, 8, 9, 10, 11, 12] },
  { winningNumbers: [13, 14, 15, 16, 17, 18] },
  { winningNumbers: [19, 20, 21, 22, 23, 24] },
];

describe("DrawMinCountGeneractor 테스트", () => {
  let generator: DrawMinCountGenerator;

  beforeEach(() => {
    // Mock 데이터를 초기화합니다.
    generator = new DrawMinCountGenerator(mockDraws as LottoDraw[]);
  });

  it("최근 N회차의 번호에서 최소 K개 포함된 조합을 생성한다.", () => {
    const drawCount = 2; // 최근 2회차
    const minCount = 3; // 최소 3개 번호 포함
    const combination = generator.getRandomCombinationWithMinCount(
      drawCount,
      minCount
    );

    // 조건 확인
    expect(combination.length).toBe(6);
    let matchCount = 0;
    combination.forEach((num) => {
      if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(num)) {
        matchCount++;
      }
    });

    // 최소 K개의 번호가 포함되었는지 확인
    expect(matchCount).toBeGreaterThanOrEqual(minCount);
  });

  it("미출현 번호에서 최소 K개의 번호를 포함한 조합을 생성한다.", () => {
    const drawCount = 3; // 최근 3회차
    const minCount = 2; // 최소 2개 번호 포함
    const combination = generator.getRandomUnappearedNumbers(
      drawCount,
      minCount
    );

    // 미출현 번호 계산
    const appearedNumbers = new Set<number>(
      mockDraws.slice(0, drawCount).flatMap((draw) => draw.winningNumbers)
    );
    const unappearedNumbers = Array.from(
      { length: 45 },
      (_, i) => i + 1
    ).filter((num) => !appearedNumbers.has(num));

    console.log("미출현 번호:", unappearedNumbers);
    console.log("최종 조합:", combination);

    // 조건: 결과는 항상 6개의 번호로 구성되어야 함
    expect(combination.length).toBe(6);

    // 조건: 조합에 포함된 번호가 최소 K개의 미출현 번호를 포함해야 함
    const countUnappeared = combination.filter((num) =>
      unappearedNumbers.includes(num)
    ).length;

    expect(countUnappeared).toBeGreaterThanOrEqual(minCount);
  });

  it("선택된 번호 외 나머지 번호를 채워 조합을 완성한다.", () => {
    const selectedNumbers = [1, 2, 3];
    const combination = generator.getWithRemainingNumbers(selectedNumbers);

    // 조건 확인
    expect(combination.length).toBe(6);
    selectedNumbers.forEach((num) => {
      expect(combination).toContain(num);
    });
  });
});
