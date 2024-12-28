export const formatNumberWithCommas = (num: number): string => {
  return new Intl.NumberFormat("ko-KR").format(num);
};

export const shuffle = (nums: number[]): number[] => {
  const array = [...nums];
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
};

export const getRandomNum = (from: number, to: number): number => {
  if (from > to) {
    throw new Error("`from` must be less than or equal to `to`");
  }
  return Math.floor(Math.random() * (to - from + 1)) + from;
};
