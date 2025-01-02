import NumberSelectPopup from "./NumberSelectPopup";
import NumberControlPopup from "./NumberControlPopup";
interface PopupProps {
  popupType: "numberSelect" | "numberControl";
  onClose: () => void;
  onConfirm: (...args: any[]) => void;
  [key: string]: any;
}

const PopupManager: React.FC<PopupProps> = (props) => {
  if (props.popupType === null) {
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
