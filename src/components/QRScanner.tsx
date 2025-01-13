/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { BrowserQRCodeReader } from "@zxing/browser";
import SaveRecordPopup from "./SaveRecordPopup";
import { CreateRecord } from "@/api/recordService";
import { recordService } from "@/api";

interface LottoData {
  drawNumber: number;
  combinations: number[][];
  transactionId: string;
}

const QRScanner: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lottoData, setLottoData] = useState<LottoData | null>(null);
  const [savePopupVisible, setSavePopupVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const parseLottoNumber = (input: string): number[] => {
    const result =
      input.match(/.{1,2}/g)?.map((num) => parseInt(num, 10)) || [];
    return result.slice(0, 6);
  };

  const parseLottoQR = (qrResult: string): LottoData | null => {
    try {
      console.log("QR 코드 데이터:", qrResult);
      const params = new URLSearchParams(qrResult.split("?")[1]);
      const data = params.get("v")?.split("m");
      if (!data) return null;

      const drawNumber = Number(data[0]);
      const combinations = data.slice(1).map((v) => parseLottoNumber(v));
      const transactionId = data[data.length - 1].substring(12);
      console.log("transactionId : ", transactionId);
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
      message.success("데이터가 성공적으로 저장되었습니다!");
      setSavePopupVisible(false);
      setLottoData(null);
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
              setLottoData({
                drawNumber: parsed.drawNumber,
                combinations: parsed.combinations,
                transactionId: parsed.transactionId,
              });
              setSavePopupVisible(true); // 저장 팝업 열기
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
    <>
      {/* 하단 QR 코드 스캔 버튼 */}
      <Button
        type="primary"
        icon={<CameraOutlined />}
        onClick={handleOpenScanner}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#1890ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
        aria-label="QR 코드 스캔"
      />

      {/* QR 코드 스캔 모달 */}
      <Modal
        visible={isModalVisible}
        title="QR 코드 스캔"
        onCancel={handleCloseScanner}
        footer={null}
        centered
      >
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

      {/* 저장 팝업 */}
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
    </>
  );
};

export default QRScanner;
