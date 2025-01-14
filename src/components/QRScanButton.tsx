import React from "react";
import { Button, Tooltip } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";

const QRScanButton: React.FC = () => {
  const handleScan = () => {
    console.log("QR 코드 스캔 시작");
    // QR 스캔 로직 실행
  };

  return (
    <div
      style={{
        textAlign: "center",
        margin: "20px 0",
        position: "fixed",
        bottom: "20px",
        right: "0px",
      }}
    >
      <Tooltip title="QR 코드를 스캔하여 로또 번호를 추가하세요!">
        <Button
          type="primary"
          onClick={handleScan}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#1890ff",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <QrcodeOutlined style={{ fontSize: "40px", marginBottom: "8px" }} />
          스캔
        </Button>
      </Tooltip>
      {/* <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
        QR 코드를 스캔하여 번호를 쉽게 추가하세요.
      </div> */}
    </div>
  );
};

export default QRScanButton;
