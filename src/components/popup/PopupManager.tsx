/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import NumberSelectPopup from "./NumberSelectPopup";
import NumberControlPopup from "./NumberControlPopup";

interface PopupManagerProps {
  popupType: "numberSelect" | "numberControl";
  onClose: () => void;
  onConfirm: (...args: any[]) => void;
  [key: string]: any;
}

const PopupManager: React.FC<PopupManagerProps> = ({
  popupType,
  onClose,
  onConfirm,
  ...rest
}) => {
  const renderPopupContent = () => {
    switch (popupType) {
      case "numberSelect":
        return (
          <NumberSelectPopup
            onConfirm={onConfirm}
            onClose={onClose}
            {...rest}
          />
        );
      case "numberControl":
        return (
          <NumberControlPopup
            onConfirm={onConfirm}
            onClose={onClose}
            {...rest}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={true}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      bodyStyle={{
        maxHeight: "70vh",
        overflowY: "auto",
        padding: "16px",
      }}
    >
      {renderPopupContent()}
    </Modal>
  );
};

export default PopupManager;
