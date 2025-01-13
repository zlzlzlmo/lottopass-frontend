import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Typography } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { BrowserQRCodeReader } from "@zxing/browser";

const { Title, Text } = Typography;

const QRScanner: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const parseLottoNumber = (input: string) => {
    const result =
      input.match(/.{1,2}/g)?.map((num) => parseInt(num, 10)) || [];

    return result.slice(0, 6);
  };

  const parseLottoQR = (qrResult: string) => {
    // 쿼리 문자열에서 'v='와 'm='을 기준으로 값 분리
    if (!qrResult) return;
    const params = new URLSearchParams(qrResult.split("?")[1]);

    const data = params.get("v")?.split("m");
    if (!data) return;
    const drawNumber = Number(data[0]);
    const combinations = data?.slice(1).map((v) => parseLottoNumber(v));

    return {
      drawNumber,
      combinations,
    };
  };

  const handleOpenScanner = () => {
    setIsModalVisible(true);
  };

  const handleCloseScanner = () => {
    setIsModalVisible(false);
    setQrResult(null);

    // 카메라 스트림 해제
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
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
            setQrResult(result.getText());
            const parsed = parseLottoQR(result.getText());

            console.log("QR 코드 결과@@@:", result.getText());
            console.log("parsed : ", parsed);
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

      // 컴포넌트 언마운트 시 스트림 해제
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
      {/* 하단 고정된 QR 코드 스캔 버튼 */}
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
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        aria-label="QR 코드 스캔"
      />

      {/* QR 코드 스캔 모달 */}
      <Modal
        title="QR 코드 스캔"
        visible={isModalVisible}
        onCancel={handleCloseScanner}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <Title level={4}>카메라를 통해 QR 코드를 스캔하세요</Title>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            autoPlay
          />
          {qrResult && (
            <Text style={{ marginTop: "20px", display: "block" }}>
              스캔 결과: {qrResult}
            </Text>
          )}
        </div>
      </Modal>
    </>
  );
};

export default QRScanner;
