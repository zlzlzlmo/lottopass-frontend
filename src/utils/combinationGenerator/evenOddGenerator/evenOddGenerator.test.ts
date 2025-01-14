import { describe, it, expect, beforeEach, vi } from "vitest";
import { EvenOddGenerator } from "./evenOddGenerator";
import { LottoDraw } from "@/components/popup/StatisticPopup";

vi.mock("@/utils/number", () => ({
  shuffle: vi.fn((numbers) => [...numbers]),
}));

describe("EvenOddGenerator 테스트", () => {
  let generator: EvenOddGenerator;

  beforeEach(() => {
    const mockDraws = [
      { winningNumbers: [1, 3, 5, 7, 9, 11] },
      { winningNumbers: [2, 4, 6, 8, 10, 12] },
    ];
    generator = new EvenOddGenerator(mockDraws as LottoDraw[]);
  });

  it("짝수와 홀수 비율에 맞는 번호를 생성한다.", () => {
    // 짝수 4개, 홀수 2개로 구성된 번호 생성
    const even = 4;
    const odd = 2;
    const result = generator.generateAppearedNumbers(even, odd);

    // 조건: 배열의 길이가 짝수 + 홀수 합과 동일해야 함
    expect(result.length).toBe(even + odd);

    // 조건: 짝수 개수 확인
    const evens = result.filter((num) => num % 2 === 0);
    expect(evens.length).toBe(even);

    // 조건: 홀수 개수 확인
    const odds = result.filter((num) => num % 2 === 1);
    expect(odds.length).toBe(odd);

    // 결과 정렬 여부 확인
    expect(result).toEqual([...result].sort((a, b) => a - b));
  });
});
