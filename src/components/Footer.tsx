import React from "react";

const Footer = () => {
  const footerOptions = [
    "고객센터",
    "로또 DATA",
    "번호생성",
    "MY LOTTO",
    "전체메뉴",
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-4 flex justify-around">
      {footerOptions.map((option, index) => (
        <button
          key={index}
          className="text-gray-600 hover:text-yellow-400 text-sm font-medium transition"
        >
          {option}
        </button>
      ))}
    </footer>
  );
};

export default Footer;
