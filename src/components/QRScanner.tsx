/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, message, Typography } from "antd";
import { CloseOutlined, QrcodeOutlined } from "@ant-design/icons";
import { BrowserQRCodeReader } from "@zxing/browser";
import SaveRecordPopup from "./SaveRecordPopup";
import { CreateRecord } from "@/api/recordService";
import { recordService } from "@/api";
import { ROUTES } from "@/constants/routes";
import { useLocation, useNavigate } from "react-router-dom";

const { Text } = Typography;

interface LottoData {
  drawNumber: number;
  combinations: number[][];
  transactionId: string;
}

interface QRScannerProps {
  handleRefetch?: () => Promise<void>;
}

const QRScanner: React.FC<QRScannerProps> = ({ handleRefetch }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lottoData, setLottoData] = useState<LottoData | null>(null);
  const [savePopupVisible, setSavePopupVisible] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const parseLottoNumber = (input: string): number[] => {
    return (
      input.match(/.{1,2}/g)?.map((num) => parseInt(num, 10)) || []
    ).slice(0, 6);
  };

  const parseLottoQR = (qrResult: string): LottoData | null => {
    try {
      const params = new URLSearchParams(qrResult.split("?")[1]);
      const data = params.get("v")?.split("m");
      if (!data) return null;

      const drawNumber = Number(data[0]);
      const combinations = data.slice(1).map((v) => parseLottoNumber(v));
      const transactionId = data[data.length - 1].substring(12);
      return { drawNumber, combinations, transactionId };
    } catch (error: any) {
      console.error("QR 코드 파싱 실패:", error.message);
      return null;
    }
  };

  const handleOpenScanner = () => {
    setIsModalVisible(true);
  };

  const handleCloseScanner = () => {
    setIsModalVisible(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSave = async (record: CreateRecord) => {
    try {
      await recordService.createRecord(record);
      setSavePopupVisible(false);
      setLottoData(null);
      if (location.pathname === ROUTES.DASHBOARD.path) {
        message.success("저장 성공");
        if (handleRefetch) handleRefetch();
        return;
      }
      Modal.confirm({
        title: "저장 성공",
        content:
          "저장한 정보를 대시보드에서 확인할 수 있습니다. 지금 이동하시겠습니까?",
        okText: "대시보드로 이동",
        cancelText: "닫기",
        onOk: () => {
          navigate(ROUTES.DASHBOARD.path);
        },
      });
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (isModalVisible && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();

      codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result) {
            const parsed = parseLottoQR(result.getText());
            if (parsed) {
              setLottoData(parsed);
              setSavePopupVisible(true);
            } else {
              message.error("QR 코드 데이터가 유효하지 않습니다.");
            }
            handleCloseScanner();
          }
        }
      );

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
    }
  }, [isModalVisible]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        textAlign: "center",
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column",
        zIndex: 99999,
      }}
    >
      {isBannerVisible && (
        <div
          style={{
            marginBottom: "10px",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              cursor: "pointer",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            }}
            onClick={() => setIsBannerVisible(false)}
          >
            <CloseOutlined style={{ fontSize: "14px" }} />
          </div>
          <Text strong style={{ fontSize: "16px", color: "#333" }}>
            QR 코드를 스캔하고 로또 데이터를 관리하세요!
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px", color: "#666" }}>
            구매한 로또 번호를 기록하고 통계를 확인할 수 있습니다.
          </Text>
        </div>
      )}

      <Button
        type="primary"
        icon={<QrcodeOutlined />}
        onClick={handleOpenScanner}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#1890ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          marginTop: "10px",
        }}
        aria-label="QR 코드 스캔"
      />

      <Modal
        open={isModalVisible}
        title="QR 코드 스캔"
        onCancel={handleCloseScanner}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Text strong style={{ fontSize: "16px", color: "#333" }}>
            구매하신 로또 용지 상단의 QR 코드를 찍어보세요!
          </Text>
        </div>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          autoPlay
        />
      </Modal>

      {savePopupVisible && lottoData && (
        <SaveRecordPopup
          visible={savePopupVisible}
          data={{
            drawNumber: lottoData.drawNumber,
            combinations: lottoData.combinations,
            purchaseDate: new Date().toISOString().split("T")[0],
            transactionId: lottoData.transactionId,
            memo: "",
          }}
          onSave={handleSave}
          onCancel={() => {
            setSavePopupVisible(false);
            setLottoData(null);
          }}
        />
      )}
    </div>
  );
};

export default QRScanner;
