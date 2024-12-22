import React from "react";
import { useNavigate } from "react-router-dom";

type Option = {
  label: string;
  path:
    | "/exclude-numbers"
    | "/results"
    | "/generate-numbers"
    | "/manual-selection"
    | "/unseen-numbers"
    | "/exclude-last"
    | "/even-4-odd-2"
    | "/odd-4-even-2"
    | "/even-3-odd-3";
};

type Path = (typeof options)[number]["path"];

const options: Option[] = [
  { label: "제외 번호 직접 선택", path: "/exclude-numbers" },
  { label: "최근 당첨 번호 조합", path: "/results" },
  { label: "제외 없이 번호 생성", path: "/generate-numbers" },
  { label: "수동으로 번호 선택", path: "/manual-selection" },
  { label: "미 출현 번호 조합", path: "/unseen-numbers" },
  { label: "직전 회차 번호 제외", path: "/exclude-last" },
  { label: "짝수 4개 홀수 2개", path: "/even-4-odd-2" },
  { label: "홀수 4개 짝수 2개", path: "/odd-4-even-2" },
  { label: "짝수 3개 홀수 3개", path: "/even-3-odd-3" },
] as const;

const Menu = () => {
  const navigate = useNavigate();

  const mockRecentNumbers = [
    { round: 1020, numbers: [3, 8, 15, 22, 31, 38] },
    { round: 1019, numbers: [4, 11, 23, 28, 35, 44] },
    { round: 1018, numbers: [2, 7, 13, 29, 37, 41] },
    { round: 1017, numbers: [1, 14, 19, 24, 36, 42] },
    { round: 1016, numbers: [5, 12, 20, 27, 33, 45] },
  ];

  const handleRecentNumbers = (path: Path) => {
    // 1부터 45까지의 번호 중 최근 당첨 번호를 제외한 번호 리스트
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const recentNumbersFlat = mockRecentNumbers
      .flat()
      .map((v) => v.numbers)
      .flat(); // 최근 5회차 당첨 번호 플랫화
    const excludedNumbers = allNumbers.filter(
      (num) => !recentNumbersFlat.includes(num)
    );

    navigate(path, {
      state: {
        excludedNumbers,
        optionLabel: "최근 당첨 번호 조합",
      },
    });
  };

  const onClick = (path: Path) => {
    if (path === "/results") {
      handleRecentNumbers(path);
      return;
    }
    navigate(path);
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {options.map((option, index) => (
        <div key={index} className="flex flex-col items-center">
          <button
            className="w-full py-3 px-4 text-sm rounded-lg shadow-lg transition-all text-gray-800 border border-gray-300 hover:bg-yellow-300 hover:text-white bg-white"
            onClick={() => onClick(option.path)}
          >
            {option.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Menu;
