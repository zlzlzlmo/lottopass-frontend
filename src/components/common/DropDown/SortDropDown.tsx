import React, { useState } from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import styles from "./SortDropdown.module.scss";

const { Text } = Typography;

interface SortDropdownProps {
  onSortChange: (sortKey: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
  const [selectedSort, setSelectedSort] = useState<string>("distance");
  const [isActive, setIsActive] = useState<boolean>(false); // 드롭다운 활성 상태

  const sortOptions = [
    { key: "distance", label: "거리순" },
    { key: "name", label: "이름순" },
    { key: "draw", label: "당첨회차순" },
  ];

  const menu = (
    <Menu
      onClick={(e) => {
        setSelectedSort(e.key); // 정렬 기준 업데이트
        onSortChange(e.key); // 부모로 콜백 전달
        setIsActive(false); // 드롭다운 닫힐 때 아이콘 복구
      }}
    >
      {sortOptions.map((option) => (
        <Menu.Item key={option.key}>{option.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      onVisibleChange={(visible) => setIsActive(visible)} // 드롭다운 열림/닫힘 상태 관리
    >
      <a onClick={(e) => e.preventDefault()} href="#" className={styles.link}>
        <Text type="secondary" className={styles.text}>
          {sortOptions.find((option) => option.key === selectedSort)?.label ||
            "정렬 기준 선택"}
        </Text>
        <DownOutlined
          className={`${styles.icon} ${isActive ? styles.iconActive : ""}`} // 활성 상태에 따른 스타일 변경
        />
      </a>
    </Dropdown>
  );
};

export default SortDropdown;
