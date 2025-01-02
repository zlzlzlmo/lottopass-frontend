import React from "react";
import styles from "./Loading.module.scss";

const Loading: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingLogo}>LOTTO PASS</div>
    </div>
  );
};

export default Loading;
