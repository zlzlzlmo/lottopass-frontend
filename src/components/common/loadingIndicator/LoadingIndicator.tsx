import React from "react";
import { Spin } from "antd";
import styles from "./LoadingIndicator.module.scss";

const LoadingIndicator: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <Spin size="large" />
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  );
};

export default LoadingIndicator;
