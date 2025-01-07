/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import DrawRangeSelectPopup from "./DrawRangeSelectPopup";
import NumberControlPopup from "./NumberControlPopup";
import NumberSelectPopup from "./NumberSelectPopup";

interface PopupManagerProps {
  label: string;
  popupType: "numberSelect" | "numberControl" | "rangeSelect";
  onClose: () => void;
  onConfirm: (...args: any[]) => void;
  [key: string]: any;
}

const PopupManager: React.FC<PopupManagerProps> = ({
  label,
  popupType,
  onClose,
  onConfirm,
  ...rest
}) => {
  const [isHelpModalVisible, setHelpModalVisible] = React.useState(false);

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
      case "rangeSelect":
        return <DrawRangeSelectPopup onClose={onClose} onConfirm={onConfirm} />;
      default:
        return null;
    }
  };

  const renderHelpContent = () => {
    if (popupType === "numberSelect") {
    }
    switch (popupType) {
      case "numberSelect":
        return `
          사용자가 원하는 번호를 직접 선택할 수 있는 기능입니다.

          
        `;
      case "numberControl":
        return `
          최근 회차와 최소 포함 번호 개수를 설정하여 로또 번호를 조합합니다.
        `;
      case "rangeSelect":
        return `
          특정 회차 범위를 지정해 번호를 선택할 수 있습니다.
        `;
      default:
        return "설명이 없습니다.";
    }
  };

  <Modal
    visible={isHelpModalVisible}
    onCancel={() => setHelpModalVisible(false)}
    footer={null}
    centered
    width={500}
  >
    <div
      style={{
        whiteSpace: "pre-line", // 줄바꿈과 공백 반영
        fontSize: "16px", // 텍스트 스타일
        lineHeight: "1.5", // 가독성을 위한 줄 간격
      }}
    >
      {renderHelpContent()}
    </div>
  </Modal>;

  return (
    <>
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
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              animation: "moveUpDown 1.5s infinite",
              marginLeft: "30px",
            }}
            onClick={() => setHelpModalVisible(true)}
          >
            <Tooltip
              visible={true}
              title="자세한 설명 보기"
              placement="top"
              align={{ offset: [0, -10] }}
              getPopupContainer={(trigger) => trigger.parentElement!}
            >
              <QuestionCircleOutlined
                style={{
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#1890ff",
                }}
              />
            </Tooltip>
          </div>
        }
      >
        {renderPopupContent()}
      </Modal>

      <Modal
        visible={isHelpModalVisible}
        onCancel={() => setHelpModalVisible(false)}
        footer={null}
        centered
        width={500}
        title={label}
      >
        <div
          style={{
            whiteSpace: "pre-line",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          {renderHelpContent()}
        </div>
      </Modal>

      <style>
        {`
          @keyframes moveUpDown {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </>
  );
};

export default PopupManager;
