import React from "react";
import styles from "./Banner.module.scss";

const Banner = () => {
  return (
    <div className={styles.banner}>
      <p>
        로또 번호가 필요할 땐? <br />
        <span className={styles.highlight}>LOTTO PASS</span> 무료로 즐기세요.
      </p>
    </div>
  );
};

export default Banner;
