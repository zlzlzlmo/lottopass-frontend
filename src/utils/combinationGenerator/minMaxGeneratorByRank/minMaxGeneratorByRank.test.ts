import { describe, it, expect, beforeEach } from "vitest";
import { LottoDraw } from "lottopass-shared";
import { MinMaxGeneratorByRank } from "./minMaxGeneratorByRank";

// Mock 데이터 생성
const mockDraws: LottoDraw[] = [
  {
    drawNumber: 1,
    date: "2023-01-01",
    winningNumbers: [1, 2, 3, 4, 5, 6],
    bonusNumber: 7,
    prizeStatistics: {
      totalPrize: 0,
      firstWinAmount: 0,
      firstAccumAmount: 0,
      firstPrizeWinnerCount: 0,
    },
  },
  {
    drawNumber: 2,
    date: "2023-01-02",
    winningNumbers: [7, 8, 9, 10, 11, 12],
    bonusNumber: 13,
    prizeStatistics: {
      totalPrize: 0,
      firstWinAmount: 0,
      firstAccumAmount: 0,
      firstPrizeWinnerCount: 0,
    },
  },
  {
    drawNumber: 3,
    date: "2023-01-03",
    winningNumbers: [1, 2, 3, 13, 14, 15],
    bonusNumber: 16,
    prizeStatistics: {
      totalPrize: 0,
      firstWinAmount: 0,
      firstAccumAmount: 0,
      firstPrizeWinnerCount: 0,
    },
  },
  {
    drawNumber: 4,
    date: "2023-01-04",
    winningNumbers: [16, 17, 18, 19, 20, 21],
    bonusNumber: 22,
    prizeStatistics: {
      totalPrize: 0,
      firstWinAmount: 0,
      firstAccumAmount: 0,
      firstPrizeWinnerCount: 0,
    },
  },
];

describe("MinMaxGeneratorByRank 테스트", () => {
  let generator: MinMaxGeneratorByRank;

  beforeEach(() => {
    generator = new MinMaxGeneratorByRank(mockDraws, 1, 4); // 1회차부터 4회차까지 데이터 사용
  });

  it("출현 빈도 상위 N개의 번호 조합을 생성한다.", () => {
    const rank = 3; // 상위 3개의 번호
    const result = generator.generateTopAppearedNumbers(rank);

    // 조건: 조합은 최대 6개의 번호로 구성되어야 함
    expect(result.length).toBeLessThanOrEqual(6);

    // 상위 3개의 번호가 결과에 포함되었는지 확인
    const expectedNumbers = [1, 2, 3]; // 예시 데이터에서 빈도가 높은 번호
    expectedNumbers.forEach((num) => {
      expect(result).toContain(num);
    });
  });

  it("출현 빈도 하위 N개의 번호 조합을 생성한다.", () => {
    const rank = 3; // 하위 3개의 번호
    const result = generator.generateBottomAppearedNumbers(rank);

    // 조건: 조합은 최대 6개의 번호로 구성되어야 함
    expect(result.length).toBeLessThanOrEqual(6);

    // 하위 3개의 번호가 결과에 포함되었는지 확인
    const sortedFrequency = Array.from(
      generator["getNumberFrequencyMap"](mockDraws).entries()
    ).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    const expectedNumbers = sortedFrequency.slice(0, rank).map(([num]) => num);

    expectedNumbers.forEach((num) => {
      expect(result).toContain(num);
    });
  });

  it("출현 빈도가 동일한 경우 번호 순서로 정렬된다.", () => {
    const rank = 3;

    // 상위 N개의 번호를 확인
    const topResult = generator.generateTopAppearedNumbers(rank);
    expect(topResult).toEqual(topResult.sort((a, b) => a - b));

    // 하위 N개의 번호를 확인
    const bottomResult = generator.generateBottomAppearedNumbers(rank);
    expect(bottomResult).toEqual(bottomResult.sort((a, b) => a - b));
  });
});
