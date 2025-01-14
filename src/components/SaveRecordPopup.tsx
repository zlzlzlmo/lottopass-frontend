import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  DatePicker,
  Card,
  message,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { CreateRecord } from "@/api/recordService";
import NumberContainer from "./common/number/NumberContainer";
import COLORS from "@/constants/colors";

interface SaveRecordPopupProps {
  visible: boolean;
  data: CreateRecord;
  onSave: (record: CreateRecord) => void;
  onCancel: () => void;
}

const SaveRecordPopup: React.FC<SaveRecordPopupProps> = ({
  visible,
  data,
  onSave,
  onCancel,
}) => {
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(
    dayjs(data.purchaseDate)
  );
  const [memo, setMemo] = useState<string>(data.memo || "");

  const handleSave = () => {
    if (!purchaseDate) {
      message.error("구매 날짜를 선택해주세요.");
      return;
    }

    const record: CreateRecord = {
      ...data,
      purchaseDate: purchaseDate.format("YYYY-MM-DD"),
      memo,
    };

    onSave(record);
  };

  return (
    <Modal
      visible={visible}
      title={`저장하기 - ${data.drawNumber}회`}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Typography.Title level={4}>로또 데이터 저장</Typography.Title>
        <Typography.Text>
          QR 코드로 스캔한 정보를 저장하고 통계를 확인하세요.
        </Typography.Text>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Card
          style={{
            background: COLORS.NEUTRAL_LIGHT,
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <strong>추첨 번호</strong>
          {data.combinations.map((combination, idx) => (
            <NumberContainer
              key={idx}
              numbers={combination}
              size={30}
              hasStatistic={true}
            />
          ))}
        </Card>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}
        >
          구매 날짜
        </label>
        <DatePicker
          value={purchaseDate}
          onChange={(date) => setPurchaseDate(date)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}
        >
          거래번호
        </label>
        <Input
          value={data.transactionId}
          readOnly
          style={{
            cursor: "not-allowed",
            backgroundColor: "#f5f5f5",
            borderColor: "#d9d9d9",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}
        >
          메모
        </label>
        <Input.TextArea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={4}
          placeholder="메모를 입력하세요 (선택)"
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          onClick={handleSave}
          style={{ marginRight: "10px" }}
        >
          저장하기
        </Button>
        <Button onClick={onCancel}>취소</Button>
      </div>
    </Modal>
  );
};

export default SaveRecordPopup;
