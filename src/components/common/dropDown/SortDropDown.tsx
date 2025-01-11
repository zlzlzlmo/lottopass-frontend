import React, { useState } from "react";
import { Dropdown, Menu, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./SortDropDown.module.scss";

const { Text } = Typography;

interface SortOption<T> {
  key: T;
  label: string;
}

interface SortDropdownProps<T> {
  currentSort: T;
  onSortChange: (sortKey: T) => void;
  sortOptions: SortOption<T>[];
}

const SortDropDown = <T extends string | number>({
  currentSort,
  onSortChange,
  sortOptions,
}: SortDropdownProps<T>) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const menu = (
    <Menu
      onClick={(e) => {
        const selectedKey = e.key as T;
        onSortChange(selectedKey);
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
      onOpenChange={(visible) => setIsActive(visible)}
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

export default SortDropDown;
