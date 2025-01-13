import React, { useState } from "react";
import { Layout } from "antd";
import { Select, Pagination, Typography } from "antd";
import LuckyNumberCard from "@/components/common/card/LuckyNumberCard";

const { Title } = Typography;
const { Option } = Select;

const SavedNumbersPage: React.FC = () => {
  const [savedNumbers, setSavedNumbers] = useState([
    {
      id: 1,
      numbers: [4, 5, 9, 15, 26, 30],
      date: "2025-01-15",
      memo: "이번 주 행운의 번호",
      tag: "행운",
      stats: "최근 5주간 3회 당첨 번호 포함",
    },
    {
      id: 2,
      numbers: [3, 7, 14, 22, 28, 33],
      date: "2025-01-12",
      memo: "가족 추천 번호",
      tag: "추천",
      stats: "지난 1년간 출현 빈도 8회",
    },
    {
      id: 3,
      numbers: [1, 2, 8, 16, 25, 37],
      date: "2025-01-10",
      memo: "테스트 번호",
      tag: "기타",
      stats: "통계 정보 없음",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState("전체");
  const itemsPerPage = 6;

  const handleDelete = (index: number) => {
    setSavedNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegenerate = (index: number) => {
    console.log(`번호 재생성 (index: ${index})`);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    setCurrentPage(1);
  };

  const filteredNumbers = savedNumbers.filter(
    (item) => selectedTag === "전체" || item.tag === selectedTag
  );

  const paginatedNumbers = filteredNumbers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout style={{ padding: "20px" }}>
      <Title level={3}>저장한 번호</Title>

      {/* 필터 */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Select
          defaultValue="전체"
          style={{ width: 200 }}
          onChange={handleTagChange}
        >
          <Option value="전체">전체</Option>
          <Option value="행운">행운</Option>
          <Option value="추천">추천</Option>
          <Option value="기타">기타</Option>
        </Select>
      </div>

      {/* 번호 목록 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {paginatedNumbers.map((item, index) => (
          <LuckyNumberCard
            key={item.id}
            numbers={item.numbers}
            index={index}
            onDelete={handleDelete}
            onRegenerate={handleRegenerate}
            onViewStatistics={(i) =>
              console.log(`통계 보기 (index: ${i})`, item.stats)
            }
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Pagination
          current={currentPage}
          total={filteredNumbers.length}
          pageSize={itemsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Layout>
  );
};

export default SavedNumbersPage;
