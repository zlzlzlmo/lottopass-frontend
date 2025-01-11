import { PopupManagerProps } from "@/components/popup/PopupManager";

interface Option {
  label: string;
  action: () => void;
}

type ConfirmNumberSelection = (
  numbers: number[],
  confirmType: "exclude" | "require"
) => void;

type ConfirmMinCountDrawsSelection = (
  drawCount: number,
  minCount: number,
  confirmType: "exclude" | "require"
) => void;

type GenerateRangeNumbers = (min: number, max: number) => void;

type SetPopupProps = (props: PopupManagerProps | null) => void;

export const generateOptions = (
  confirmNumberSelection: ConfirmNumberSelection,
  confirmMinCountDrawSelection: ConfirmMinCountDrawsSelection,
  generateRangeNumbers: GenerateRangeNumbers,
  setPopupProps: SetPopupProps
): Option[] => [
  {
    label: "제외 번호\n직접 선택",
    action: () =>
      setPopupProps({
        label: "제외 번호\n직접 선택",
        popupType: "numberSelect",
        confirmType: "exclude",
        onClose: () => setPopupProps(null),
        onConfirm: (numbers: number[]) =>
          confirmNumberSelection(numbers, "exclude"),
      }),
  },
  {
    label: "필수 번호\n직접 선택",
    action: () =>
      setPopupProps({
        label: "필수 번호\n직접 선택",
        popupType: "numberSelect",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (numbers: number[]) =>
          confirmNumberSelection(numbers, "require"),
      }),
  },
  {
    label: "미출현\n번호 조합",
    action: () =>
      setPopupProps({
        label: "미출현\n번호 조합",
        popupType: "numberControl",
        confirmType: "exclude",
        onClose: () => setPopupProps(null),
        onConfirm: (drawNum: number, minCount: number) =>
          confirmMinCountDrawSelection(drawNum, minCount, "exclude"),
      }),
  },
  {
    label: "출현\n번호 조합",
    action: () =>
      setPopupProps({
        label: "출현\n번호 조합",
        popupType: "numberControl",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (drawNum: number, minCount: number) =>
          confirmMinCountDrawSelection(drawNum, minCount, "require"),
      }),
  },
  {
    label: "특정 회차\n번호 조합",
    action: () =>
      setPopupProps({
        label: "특정 회차 번호 조합",
        popupType: "rangeSelect",
        onClose: () => setPopupProps(null),
        onConfirm: (min: number, max: number) => generateRangeNumbers(min, max),
      }),
  },
];
