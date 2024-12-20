import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const generateLottoNumbers = (excludedNumbers: number[], count: number) => {
  const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1); // 1~45
  const availableNumbers = allNumbers.filter(
    (n) => !excludedNumbers.includes(n)
  );
  const results = [];

  for (let i = 0; i < count; i++) {
    const selectedNumbers: number[] = [];
    while (selectedNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const randomNumber = availableNumbers[randomIndex];
      if (!selectedNumbers.includes(randomNumber)) {
        selectedNumbers.push(randomNumber);
      }
    }
    results.push(selectedNumbers.sort((a, b) => a - b)); // 오름차순 정렬
  }

  return results;
};

const Results: React.FC = () => {
  const location = useLocation();
  const [lineCount, setLineCount] = useState(1); // 기본 1줄
  const [results, setResults] = useState<number[][]>([]);

  const excludedNumbers = location.state?.excludedNumbers || [];
  const optionLabel = location.state?.optionLabel || "결과 페이지";

  const handleGenerate = () => {
    const lottoResults = generateLottoNumbers(excludedNumbers, lineCount);
    setResults(lottoResults);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4">{optionLabel}</h1>

      {/* 제외된 번호 */}
      <div className="text-center mb-4">
        <p className="text-lg">제외된 번호:</p>
        <p className="text-red-500 font-bold">
          {excludedNumbers.join(", ") || "없음"}
        </p>
      </div>

      {/* 줄 수 입력 */}
      <div className="text-center mb-4">
        <label className="block text-lg font-semibold mb-2" htmlFor="lineCount">
          생성할 줄 수 입력:
        </label>
        <input
          id="lineCount"
          type="number"
          min="1"
          max="10"
          value={lineCount}
          onChange={(e) => setLineCount(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2 w-20 text-center"
        />
      </div>

      {/* 결과 보기 버튼 */}
      <div className="text-center mb-4">
        <button
          className="px-6 py-3 bg-yellow-400 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-500"
          onClick={handleGenerate}
        >
          결과 생성
        </button>
      </div>

      {/* 결과 표시 */}
      <div className="text-center">
        {results.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">생성된 번호:</h2>
            {results.map((line, index) => (
              <p key={index} className="text-green-500 font-semibold mb-2">
                {line.join(", ")}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
