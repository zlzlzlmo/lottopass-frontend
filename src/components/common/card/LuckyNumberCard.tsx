import React from "react";
import { Card, Button, Space } from "antd";
import {
  DeleteOutlined,
  BarChartOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import NumberContainer from "../number/NumberContainer";
import KakaoShareButton from "@/pages/result/KakaoButton";

interface LuckyNumberCardProps {
  numbers: number[];
  onDelete: (index: number) => void;
  onViewStatistics: (index: number) => void;
  onRegenerate: (index: number) => void;
  index: number;
}
const LuckyNumberCard: React.FC<LuckyNumberCardProps> = ({
  numbers,
  onDelete,
  onViewStatistics,
  onRegenerate,
  index,
}) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: 16,
          position: "relative",
        }}
        bodyStyle={{
          padding: "24px 16px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          danger
          onClick={() => onDelete(index)}
          icon={<DeleteOutlined />}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        />
        <Button
          type="text"
          icon={<BarChartOutlined />}
          onClick={() => onViewStatistics(index)}
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            color: "#1890ff",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <span style={{ fontWeight: "bold", marginRight: 8 }}>
            ✨ 이번 주 행운의 번호! ✨
          </span>
          <motion.div
            style={{
              background: "linear-gradient(45deg, #ff4d4f, #ffa39e)",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 12,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            🎱
          </motion.div>
        </div>

        <NumberContainer numbers={numbers} />

        <Space
          size="small"
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={() => onViewStatistics(index)}
            style={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            통계
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => onRegenerate(index)}
            style={{ flex: 1 }}
          >
            재생성
          </Button>

          <KakaoShareButton numbers={numbers} />
        </Space>
      </Card>
    </motion.div>
  );
};

export default LuckyNumberCard;
