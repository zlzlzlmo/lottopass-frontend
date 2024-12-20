import React from "react";
import { useNavigate } from "react-router-dom";

const options = [
  { label: "제외 번호 직접 선택", path: "/exclude-numbers" },
  { label: "최근 당첨 번호 조합", path: "/recent-numbers" },
  { label: "제외 없이 번호 생성", path: "/generate-numbers" },
  { label: "수동으로 번호 선택", path: "/manual-selection" },
  { label: "미 출현 번호 조합", path: "/unseen-numbers" },
  { label: "직전 회차 번호 제외", path: "/exclude-last" },
  { label: "짝수 4개 홀수 2개", path: "/even-4-odd-2" },
  { label: "홀수 4개 짝수 2개", path: "/odd-4-even-2" },
  { label: "짝수 3개 홀수 3개", path: "/even-3-odd-3" },
];

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {options.map((option, index) => (
        <div key={index} className="flex flex-col items-center">
          <button
            className="w-full py-3 px-4 text-sm rounded-lg shadow-lg transition-all text-gray-800 border border-gray-300 hover:bg-yellow-300 hover:text-white bg-white"
            onClick={() => navigate(option.path)}
          >
            {option.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Menu;
