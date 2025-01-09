import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Button, Card, Space, message, Popconfirm } from "antd";
import { DeleteOutlined, ShareAltOutlined } from "@ant-design/icons";
import NumberContainer from "@/components/common/number/NumberContainer";
import KakaoShareButton from "../result/KakaoButton";

const mockSavedCombinations = [
  [1, 8, 15, 22, 30, 44],
  [2, 7, 13, 28, 31, 42],
  [3, 9, 18, 27, 33, 45],
  [5, 11, 19, 26, 34, 40],
  [6, 10, 21, 25, 32, 39],
];

const SavedCombinationsPage: React.FC = () => {
  const [savedCombinations, setSavedCombinations] = useState<number[][]>(
    mockSavedCombinations
  );

  const handleDeleteCombination = (index: number) => {
    const updatedCombinations = savedCombinations.filter((_, i) => i !== index);
    setSavedCombinations(updatedCombinations);
    message.success("번호 조합이 삭제되었습니다.");
  };

  return (
    <Layout>
      <div style={{ padding: "16px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          저장된 번호 조합
        </h2>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {savedCombinations.map((numbers, index) => (
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
                <Popconfirm
                  title="번호를 삭제하시겠습니까?"
                  onConfirm={() => handleDeleteCombination(index)}
                  okText="네"
                  cancelText="아니오"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                  />
                </Popconfirm>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontWeight: "bold", marginRight: 8 }}>
                    📌 저장된 번호
                  </span>
                </div>

                <NumberContainer numbers={numbers} />

                <Space
                  size="small"
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <KakaoShareButton numbers={numbers} />
                </Space>
              </Card>
            </motion.div>
          ))}
        </Space>
      </div>
    </Layout>
  );
};

export default SavedCombinationsPage;
