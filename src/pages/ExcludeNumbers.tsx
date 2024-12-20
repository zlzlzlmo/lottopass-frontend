import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ExcludeNumbers: React.FC = () => {
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const navigate = useNavigate();

  // 1~45까지의 번호 생성
  const numbers = Array.from({ length: 45 }, (_, i) => i + 1);

  // 번호 클릭 핸들러
  const handleNumberClick = (number: number) => {
    if (excludedNumbers.includes(number)) {
      // 이미 선택된 번호는 제외
      setExcludedNumbers(excludedNumbers.filter((n) => n !== number));
    } else {
      // 선택되지 않은 번호는 추가
      setExcludedNumbers([...excludedNumbers, number]);
    }
  };

  // 결과 보기 핸들러
  const handleShowResults = () => {
    navigate("/results", {
      state: {
        excludedNumbers,
        optionLabel: "제외 번호 직접 선택",
      },
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4">
        제외 번호 직접 선택
      </h1>
      <div className="grid grid-cols-6 gap-4">
        {numbers.map((number) => (
          <button
            key={number}
            className={`py-2 px-4 rounded-lg transition-all ${
              excludedNumbers.includes(number)
                ? "bg-red-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="mt-4 text-center">
        <button
          className="px-6 py-3 bg-yellow-400 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-500"
          onClick={handleShowResults}
        >
          결과 보기
        </button>
      </div>
    </div>
  );
};

export default ExcludeNumbers;
