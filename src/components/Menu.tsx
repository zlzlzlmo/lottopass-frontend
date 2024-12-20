import React, { useState } from "react";

const options = [
  "제외 번호 직접 선택",
  "최근 당첨 번호 조합",
  "제외 없이 번호 생성",
  "수동으로 번호 선택",
  "미 출현 번호 조합",
  "직전 회차 번호 제외",
  "짝수 4개 홀수 2개",
  "홀수 4개 짝수 2개",
  "짝수 3개 홀수 3개",
];

const Menu = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {options.map((option, index) => (
        <div key={index} className="flex flex-col items-center">
          <button
            className={`w-full py-3 px-4 text-sm rounded-lg shadow-lg transition-all text-gray-800 border border-gray-300 hover:bg-yellow-300 hover:text-white ${
              selectedOption === option
                ? "bg-yellow-400 text-white"
                : "bg-white"
            }`}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </button>
          {selectedOption === option && (
            <span className="mt-2 text-yellow-400 text-sm font-semibold">
              선택 {index + 1}위
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;
