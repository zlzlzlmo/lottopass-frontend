import React from "react";
import NumberSelectPopup from "./NumberSelectPopup";
// import RecentRoundsPopup from "./RecentRoundsPopup";

// 공통 props
interface BasePopupProps {
  onClose: () => void;
  onConfirm: (selectedNumbers: number[]) => void;
}

// NumberSelectPopup props
interface NumberSelectPopupProps extends BasePopupProps {
  popupType: "numberSelect";
  maxSelection: number;
  confirmType: "exclude" | "require";
}

// RecentRoundsPopup props
interface RecentRoundsPopupProps extends BasePopupProps {
  popupType: "recentRounds";
  // rounds: number[];
}

// 모든 팝업 타입의 Union
type PopupProps =
  | NumberSelectPopupProps
  | RecentRoundsPopupProps
  | { popupType: null };

const PopupManager: React.FC<PopupProps> = (props) => {
  if (props.popupType === null) {
    // popupType이 null인 경우 아무것도 렌더링하지 않음
    return null;
  }

  const { popupType, onClose } = props;

  switch (popupType) {
    case "numberSelect":
      return (
        <NumberSelectPopup
          onClose={onClose}
          onConfirm={props.onConfirm as (selectedNumbers: number[]) => void}
          maxSelection={props.maxSelection ?? 39}
          confirmType={props.confirmType}
        />
      );

    default:
      return null;
  }
};

export default PopupManager;
