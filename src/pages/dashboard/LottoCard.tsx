import React from "react";
import { Card, Typography, Space, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import NumberContainer from "@/components/common/number/NumberContainer";

const { Text, Title } = Typography;

interface LottoCardProps {
  drawNumber: number;
  combinations: number[][];
  purchaseDate: string;
  memo: string;
  onDelete: () => void;
}

const LottoCard: React.FC<LottoCardProps> = ({
  drawNumber,
  combinations,
  purchaseDate,
  memo,
  onDelete,
}) => {
  return (
    <Card
      title={
        <Space direction="vertical" size={0}>
          <Text type="secondary">구매 날짜: {purchaseDate}</Text>
        </Space>
      }
      extra={
        <Space>
          <Popconfirm
            title="정말 삭제하시겠습니까?"
            onConfirm={onDelete}
            okText="삭제"
            cancelText="취소"
          >
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
            >
              삭제
            </Button>
          </Popconfirm>
        </Space>
      }
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        marginBottom: "16px",
        overflow: "hidden",
      }}
      bodyStyle={{
        padding: "16px",
      }}
    >
      {/* 로또 번호 */}
      <div style={{ marginBottom: "16px" }}>
        <Title level={5} style={{ marginBottom: "8px" }}>
          {drawNumber}회차 번호
        </Title>
        {combinations.map((combo, index) => (
          <NumberContainer
            key={index}
            numbers={combo}
            size={30}
            hasStatistic={true}
          />
        ))}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Title level={5} style={{ marginBottom: "8px" }}>
          메모
        </Title>
        <Text>{memo || "메모 없음"}</Text>
      </div>
    </Card>
  );
};

export default LottoCard;
