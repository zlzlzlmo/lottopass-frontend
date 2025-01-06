/* eslint-disable @typescript-eslint/no-explicit-any */

interface Option {
  label: string;
  action?: () => void;
  tooltip?: string;
}

export const options = (
  handleSelectConfirm: (
    numbers: number[],
    confirmType: "exclude" | "require"
  ) => void,
  handleControlConfirm: (
    roundCount: number,
    minCount: number,
    confirmType: "exclude" | "require"
  ) => void,
  setPopupProps: (props: any) => void,
  handleRangeSelect: (min: number, max: number) => void
): Option[] => [
  {
    label: "제외 번호\n직접 선택",
    action: () =>
      setPopupProps({
        popupType: "numberSelect",
        confirmType: "exclude",
        onClose: () => setPopupProps(null),
        onConfirm: (numbers: number[]) =>
          handleSelectConfirm(numbers, "exclude"),
      }),
  },
  {
    label: "필수 번호\n직접 선택",
    action: () =>
      setPopupProps({
        popupType: "numberSelect",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (numbers: number[]) =>
          handleSelectConfirm(numbers, "require"),
      }),
  },
  {
    label: "미출현 번호\n조합",
    action: () =>
      setPopupProps({
        popupType: "numberControl",
        confirmType: "exclude",
        onClose: () => setPopupProps(null),
        onConfirm: (roundCount: number, minCount: number) =>
          handleControlConfirm(roundCount, minCount, "exclude"),
      }),
  },
  {
    label: "출현 번호\n조합",
    action: () =>
      setPopupProps({
        popupType: "numberControl",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (roundCount: number, minCount: number) =>
          handleControlConfirm(roundCount, minCount, "require"),
      }),
  },
  {
    label: "특정 회차 번호 조합",
    action: () =>
      setPopupProps({
        popupType: "rangeSelect",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (min: number, max: number) => handleRangeSelect(min, max),
      }),
  },
];
