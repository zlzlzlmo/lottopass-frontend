import { LottoDraw } from "lottopass-shared";
import { MinMaxGenerator } from "./minMaxGenerator";
import { describe, expect } from "vitest";

describe("MinMaxGenerator", () => {
  const mockData: Omit<LottoDraw, "prizeStatistics">[] = [
    {
      drawNumber: 1,
      date: "2025-01-01",
      winningNumbers: [1, 2, 3, 4, 5, 6],
      bonusNumber: 7,
    },
    {
      drawNumber: 2,
      date: "2025-01-08",
      winningNumbers: [7, 8, 9, 10, 11, 12],
      bonusNumber: 13,
    },
  ];
  const generator = new MinMaxGenerator(mockData as LottoDraw[], 1, 2);

  test("특정 범위 출현 번호 조합 생성", () => {
    const result = generator.generateAppearedNumbers();

    // 결과는 항상 6개의 번호를 포함해야 함
    expect(result).toHaveLength(6);

    // 결과는 중복되지 않아야 함
    const uniqueNumbers = new Set(result);
    expect(uniqueNumbers.size).toBe(6);

    // 특정 범위의 출현 번호 포함 확인
    const appearedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    result.forEach((num) => {
      expect(appearedNumbers).toContain(num);
    });
  });

  test("특정 범위 미출현 번호 조합 생성", () => {
    const result = generator.generateUnappearedNumbers();

    // 결과는 항상 6개의 번호를 포함해야 함
    expect(result).toHaveLength(6);

    // 결과는 중복되지 않아야 함
    const uniqueNumbers = new Set(result);
    expect(uniqueNumbers.size).toBe(6);

    // 특정 범위의 미출현 번호 확인
    const appearedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    result.forEach((num) => {
      expect(appearedNumbers).not.toContain(num);
    });
  });
});
