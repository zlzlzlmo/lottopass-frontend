import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./ResultPage.module.scss";
import Layout from "../../components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useSearchParams } from "react-router-dom";
import NumberContainer from "@/components/common/number/NumberContainer";
import { Button, Card, Space, message, Popconfirm } from "antd";
import {
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

import { numberService } from "@/api";

const ResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const minCount = searchParams.get("minCount") ?? 6;
  const requiredNumbers =
    searchParams.get("requiredNumbers")?.split(",").map(Number) ?? [];
  const maxResultsLen = 20;

  const generateNumbers = (): number[] => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const len = requiredNumbers.length;
    const randomIdx = getRandomNum(Math.min(Number(minCount), len), len);

    const availableNumbers = shuffle(requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
  };

  const [results, setResults] = useState<number[][]>(() =>
    Array.from({ length: 5 }, () => generateNumbers())
  );

  const handleAddResult = () => {
    if (results.length >= maxResultsLen) {
      message.warning(`최대 ${maxResultsLen}줄까지만 추가할 수 있습니다.`);
      return;
    }

    const newResult = generateNumbers();
    setResults([...results, newResult]);
  };

  const handleDeleteResult = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
    message.success("번호 조합이 삭제되었습니다.");
  };

  const handleSaveResult = async (numbers: number[]) => {
    // 사용자 번호 저장 API 호출 로직
    try {
      const res = await numberService.setNumberCombination(numbers);
      console.log("res : ", res);
      message.success("번호 조합이 저장되었습니다.");
    } catch (error) {
      console.error("error :", error);
    }
  };

  const handleRegenerate = (index: number) => {
    const updatedResults = results.map((numbers, i) =>
      i === index ? generateNumbers() : numbers
    );
    setResults(updatedResults);
    message.info("번호가 다시 생성되었습니다.");
  };

  const handleShare = (numbers: number[]) => {
    const shareUrl = `${window.location.origin}/shared?numbers=${numbers.join(
      ","
    )}`;
    navigator.clipboard.writeText(shareUrl);
    message.success("공유 링크가 복사되었습니다!");
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", padding: "0 16px" }}
        >
          {results.map((numbers, index) => (
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
                  onConfirm={() => handleDeleteResult(index)}
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
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => handleSaveResult(numbers)}
                    style={{ flex: 1, margin: "0 4px" }}
                  >
                    저장
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => handleRegenerate(index)}
                    style={{ flex: 1, margin: "0 4px" }}
                  >
                    다시 생성
                  </Button>
                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={() => handleShare(numbers)}
                    style={{ flex: 1, margin: "0 4px" }}
                  >
                    공유
                  </Button>
                </Space>
              </Card>
            </motion.div>
          ))}
        </Space>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={handleAddResult}
          >
            번호 추가
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage;
