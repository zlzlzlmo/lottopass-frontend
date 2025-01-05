import React, { useState } from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import styles from "./SortDropDown.module.scss";

const { Text } = Typography;

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (sortKey: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  currentSort,
  onSortChange,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const sortOptions = [
    { key: "distance", label: "거리순" },
    { key: "name", label: "이름순" },
    // { key: "draw", label: "당첨회차순" },
  ];

  const menu = (
    <Menu
      onClick={(e) => {
        onSortChange(e.key); // 부모에 정렬 기준 전달
        setIsActive(false);
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
      onVisibleChange={(visible) => setIsActive(visible)}
    >
      <a
        href="#"
        className={styles.link}
        onClick={(e) => e.preventDefault()} // 기본 동작 방지
      >
        <Text type="secondary" className={styles.text}>
          {sortOptions.find((option) => option.key === currentSort)?.label ||
            "정렬 기준 선택"}
        </Text>
        <DownOutlined
          className={`${styles.icon} ${isActive ? styles.iconActive : ""}`}
        />
      </a>
    </Dropdown>
  );
};

export default SortDropdown;
