import React from "react";
import styles from "./LogoLoading.module.scss";

interface LogoLoadingProps {
  text: string;
}

const LogoLoading: React.FC<LogoLoadingProps> = ({ text }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingLogo}>LOTTO PASS</div>
      <div className={styles.loadingText}>{text}...</div>
    </div>
  );
};

export default LogoLoading;
