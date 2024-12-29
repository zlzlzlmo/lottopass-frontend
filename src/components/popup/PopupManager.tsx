import React from "react";
import NumberSelectPopup from "./NumberSelectPopup";
import NumberControlPopup from "./NumberControlPopup";
// import RecentRoundsPopup from "./RecentRoundsPopup";

// 공통 props

// 모든 팝업 타입의 Union
interface PopupProps {
  popupType: "numberSelect" | "numberControl";
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const PopupManager: React.FC<PopupProps> = (props) => {
  if (props.popupType === null) {
    // popupType이 null인 경우 아무것도 렌더링하지 않음
    return null;
  }

  const { popupType, onClose, onConfirm } = props;

  switch (popupType) {
    case "numberSelect":
      return (
        <NumberSelectPopup
          onClose={onClose}
          onConfirm={onConfirm}
          maxSelection={props.maxSelection ?? 39}
          confirmType={props.confirmType}
        />
      );
    case "numberControl":
      return (
        <NumberControlPopup
          onClose={onClose}
          onConfirm={onConfirm}
          confirmType={props.confirmType}
        />
      );

    default:
      return null;
  }
};

export default PopupManager;
