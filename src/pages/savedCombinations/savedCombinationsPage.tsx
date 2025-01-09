import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Button, Card, Space, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import NumberContainer from "@/components/common/number/NumberContainer";
import KakaoShareButton from "../result/KakaoButton";
import { NumberService, LottoCombination } from "@/api/numberService";

const numberService = new NumberService();

const SavedCombinationsPage: React.FC = () => {
  const [savedCombinations, setSavedCombinations] = useState<
    LottoCombination[]
  >([]);

  useEffect(() => {
    const fetchSavedCombinations = async () => {
      try {
        const response = await numberService.getUserCombinations();
        setSavedCombinations(response);
      } catch (error) {
        console.error("번호 조합을 불러오는 중 오류가 발생했습니다:", error);
        message.error("번호 조합을 불러오는 데 실패했습니다.");
      }
    };

    fetchSavedCombinations();
  }, []);

  const handleDeleteCombination = async (id: string) => {
    try {
      await numberService.deleteCombination(id);
      setSavedCombinations((prev) => prev.filter((combo) => combo.id !== id));
      message.success("번호 조합이 삭제되었습니다.");
    } catch (error) {
      console.error("번호 조합 삭제 중 오류 발생:", error);
      message.error("번호 조합 삭제에 실패했습니다.");
    }
  };

  return (
    <Layout>
      <div style={{ padding: "16px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          저장된 번호 조합
        </h2>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {savedCombinations.map(({ id, combination }) => (
            <motion.div
              key={id}
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
                  onConfirm={() => handleDeleteCombination(id)}
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

                <NumberContainer numbers={combination} />

                <Space
                  size="small"
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <KakaoShareButton numbers={combination} />
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
