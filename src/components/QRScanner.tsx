/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { Button, Modal, message, Typography } from "antd";
import { CloseOutlined, QrcodeOutlined } from "@ant-design/icons";
import SaveRecordPopup from "./SaveRecordPopup";
import { CreateRecord } from "@/api/recordService";
import { recordService } from "@/api";
import { ROUTES } from "@/constants/routes";
import { useLocation, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

const { Text } = Typography;

interface LottoData {
  drawNumber: number;
  combinations: number[][];
  transactionId: string;
}

const QRScanner: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lottoData, setLottoData] = useState<LottoData | null>(null);
  const [savePopupVisible, setSavePopupVisible] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(() => {
    const storedDate = sessionStorage.getItem("bannerClosedDate");
    const today = new Date().toISOString().split("T")[0];
    return storedDate !== today;
  });
  const [hasPermission, setHasPermission] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const handleCloseBanner = () => {
    const today = new Date().toISOString().split("T")[0];
    sessionStorage.setItem("bannerClosedDate", today);
    setIsBannerVisible(false);
  };

  const parseLottoNumber = (input: string): number[] => {
    return (
      input.match(/.{1,2}/g)?.map((num) => parseInt(num, 10)) || []
    ).slice(0, 6);
  };

  const parseLottoQR = (qrResult: string): LottoData | null => {
    try {
      const params = new URLSearchParams(qrResult.split("?")[1]);
      const data = params.get("v")?.split(/[mq]/); // 'm' 또는 'q'로 구분
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

  const handleSave = async (record: CreateRecord) => {
    try {
      await recordService.createRecord(record);
      setSavePopupVisible(false);
      setLottoData(null);
      if (location.pathname === ROUTES.DASHBOARD.path) {
        message.success("저장 성공");
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
  const startScanner = async () => {
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length > 0) {
        console.log("Available cameras:", cameras); // 사용 가능한 카메라 출력
        setHasPermission(true);
        scannerRef.current = new Html5Qrcode("qr-reader");
        scannerRef.current.start(
          cameras[0].id, // 여기에서 원하는 카메라 ID를 선택
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            const parsed = parseLottoQR(decodedText);
            if (parsed) {
              setLottoData(parsed);
              setSavePopupVisible(true);
              stopScanner();
            } else {
              message.error("QR 코드 데이터가 유효하지 않습니다.");
            }
          },
          (errorMessage) => {
            console.error("QR 코드 스캔 에러:", errorMessage);
          }
        );
      } else {
        message.error("사용 가능한 카메라가 없습니다.");
        setHasPermission(false);
      }
    } catch (error) {
      console.error("카메라 권한 요청 실패:", error);
      setHasPermission(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
      });
    }
    setIsModalVisible(false);
  };

  const handleOpenScanner = () => {
    setIsModalVisible(true);
    startScanner();
  };

  const handleCloseScanner = () => {
    stopScanner();
  };

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
        zIndex: 1000,
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
            onClick={handleCloseBanner}
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
        {!hasPermission && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Text strong>
              카메라 권한을 허용해야 QR 코드를 스캔할 수 있습니다.
            </Text>
            <br />
            <Text type="secondary">
              브라우저 설정에서 카메라 권한을 확인해주세요.
            </Text>
          </div>
        )}
        {isModalVisible && <div id="qr-reader" style={{ width: "100%" }}></div>}
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
