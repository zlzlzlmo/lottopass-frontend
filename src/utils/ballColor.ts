export const getBallColor = (ball: number): string => {
  const ballColors = [
    "#FBE44E", // 1 ~ 10번 (노란색)
    "#4A90E2", // 11 ~ 20번 (파란색)
    "#E94E77", // 21 ~ 30번 (빨간색)
    "#A9A9A9", // 31 ~ 40번 (회색)
    "#6FCF97", // 41 ~ 45번 (초록색)
  ];

  const idx = Math.floor((ball - 1) / 10);
  return ballColors[idx];
};
