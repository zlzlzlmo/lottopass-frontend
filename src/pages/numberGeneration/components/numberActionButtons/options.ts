import { PopupManagerProps } from "@/components/popup/PopupManager";
import { ConfirmType } from "./NumberActionButtons";

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
  confirmType: ConfirmType
) => void;

type GenerateRangeNumbers = (
  min: number,
  max: number,
  confirmType: ConfirmType
) => void;

type SetPopupProps = (props: PopupManagerProps | null) => void;

type ConfirmEvenOddSelection = (
  even: number,
  odd: number,
  confirmType: ConfirmType
) => void;

type GenerateRangeTopNumbers = (
  min: number,
  max: number,
  topNumber: number,
  confirmType: ConfirmType
) => void;

export const generateOptions = (
  setPopupProps: SetPopupProps,
  confirmNumberSelection: ConfirmNumberSelection,
  confirmMinCountDrawSelection: ConfirmMinCountDrawsSelection,
  generateRangeNumbers: GenerateRangeNumbers,
  confirmEvenOddSelection: ConfirmEvenOddSelection,
  generateRangeAndBottomNumbers: GenerateRangeTopNumbers,
  generateRangeAndTopNumbers: GenerateRangeTopNumbers
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
    label: "최근 미출현\n번호 조합",
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
    label: "최근 출현\n번호 조합",
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
    label: "특정 회차\n미출현 번호",
    action: () =>
      setPopupProps({
        label: "특정 회차\n미출현 번호",
        popupType: "rangeSelect",
        confirmType: "exclude",
        onClose: () => setPopupProps(null),
        onConfirm: (min: number, max: number) =>
          generateRangeNumbers(min, max, "exclude"),
      }),
  },
  {
    label: "특정 회차\n출현 번호",
    action: () =>
      setPopupProps({
        label: "특정 회차\n출현 번호",
        popupType: "rangeSelect",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (min: number, max: number) =>
          generateRangeNumbers(min, max, "require"),
      }),
  },
  {
    label: "짝수 홀수\n개수 선택",
    action: () =>
      setPopupProps({
        label: "짝수,홀수 개수 선택",
        popupType: "evenOddControl",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (even: number, odd: number) =>
          confirmEvenOddSelection(even, odd, "require"),
      }),
  },
  {
    label: "특정 회차\n하위 출현",
    action: () =>
      setPopupProps({
        label: "특정 회차\n하위 출현",
        popupType: "rangeAndBottomNumberSelect",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (min: number, max: number, topNumber: number) =>
          generateRangeAndBottomNumbers(min, max, topNumber, "exclude"),
      }),
  },
  {
    label: "특정 회차\n상위 출현",
    action: () =>
      setPopupProps({
        label: "특정 회차\n상위 출현",
        popupType: "rangeAndTopNumberSelect",
        confirmType: "require",
        onClose: () => setPopupProps(null),
        onConfirm: (min: number, max: number, topNumber: number) =>
          generateRangeAndTopNumbers(min, max, topNumber, "require"),
      }),
  },
];
