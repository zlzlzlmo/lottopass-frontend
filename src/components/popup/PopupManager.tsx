/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import DrawRangeSelectPopup from "./DrawRangeSelectPopup";
import NumberControlPopup from "./NumberControlPopup";
import NumberSelectPopup from "./NumberSelectPopup";
import { LottoDraw } from "lottopass-shared";

export type PopupType = "numberSelect" | "numberControl" | "rangeSelect";
export interface PopupManagerProps {
  popupType: PopupType;
  confirmType?: "exclude" | "require";
  onClose: () => void;
  onConfirm: (...args: any[]) => void;
  [key: string]: any;
  draws: LottoDraw[];
}

const PopupManager: React.FC<PopupManagerProps> = ({
  label,
  popupType,
  confirmType,
  onClose,
  onConfirm,
  draws,
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
        return (
          <DrawRangeSelectPopup
            onClose={onClose}
            onConfirm={onConfirm}
            draws={draws}
          />
        );
      default:
        return null;
    }
  };

  const renderHelpContent = (confirmType: string) => {
    switch (popupType) {
      case "numberSelect":
        return confirmType === "exclude"
          ? `
            선택한 번호를 로또 번호 생성에서 제외합니다.
  
            예시:
            - 선택한 번호: 5, 10, 15
            -> 5, 10, 15를 제외한 번호로 조합됩니다.
          `
          : `
            선택한 번호를 반드시 포함하여 로또 번호를 생성합니다.
  
            예시:
            - 선택한 번호: 5, 10, 15
            -> 조합된 번호에 항상 5, 10, 15가 포함됩니다.
          `;
      case "numberControl":
        return confirmType === "exclude"
          ? `
            최근 N회차 동안 출현하지 않은 번호 중 최소 K개의 번호를 포함하여 로또 번호를 생성합니다.
  
            예시:
            - 최근 10회차 미출현 번호: 2, 4, 6, 8 ...
            - 최소 포함 번호: 2개
            -> 조합된 번호에 2개 이상의 미출현 번호가 포함됩니다.
          `
          : `
            최근 N회차 동안 당첨된 번호 중 최소 K개의 번호를 포함하여 로또 번호를 생성합니다.
  
            예시:
            - 최근 10회차 출현 번호: 1, 3, 5, 7, 9 ...
            - 최소 포함 번호: 3개
            -> 조합된 번호에 3개 이상의 출현 번호가 포함됩니다.
          `;
      case "rangeSelect":
        return `
          특정 회차 범위를 지정해 해당 회차에 나온 번호를 기반으로 로또 번호를 생성합니다.
  
          예시:
          - 범위: 50회차 ~ 60회차
          - 번호 추출: 50~60회차의 당첨 번호만 포함하여 로또 번호를 생성.
        `;
      default:
        return "설명이 없습니다.";
    }
  };

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
          {renderHelpContent(confirmType ?? "")}
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
