export const formatNumberWithCommas = (num: number): string => {
  return new Intl.NumberFormat("ko-KR").format(num);
};
