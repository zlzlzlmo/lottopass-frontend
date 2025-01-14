import mockLottoDraws from "../mockData";
import { SelectedGenerator } from "./selectedGenerator";
import { describe, expect } from "vitest";

describe("SelectedGenerator", () => {
  const generator = new SelectedGenerator(mockLottoDraws);

  test("필수 포함 번호 테스트", () => {
    const selectedNumbers = [1, 2, 3];
    const result = generator.getRequiredNumbers(selectedNumbers);

    // 결과는 항상 6개의 번호를 포함해야 함
    expect(result).toHaveLength(6);

    // 필수 번호가 포함되어 있는지 확인
    selectedNumbers.forEach((num) => {
      expect(result).toContain(num);
    });

    // 결과는 고유 번호로만 구성되어야 함
    const uniqueNumbers = new Set(result);
    expect(uniqueNumbers.size).toBe(6);
  });

  test("제외 번호 테스트", () => {
    const excludedNumbers = [1, 2, 3];
    const result = generator.getExcludedNumbers(excludedNumbers);

    // 결과는 항상 6개의 번호를 포함해야 함
    expect(result).toHaveLength(6);

    // 제외 번호가 포함되지 않았는지 확인
    excludedNumbers.forEach((num) => {
      expect(result).not.toContain(num);
    });

    // 결과는 고유 번호로만 구성되어야 함
    const uniqueNumbers = new Set(result);
    expect(uniqueNumbers.size).toBe(6);
  });
});
