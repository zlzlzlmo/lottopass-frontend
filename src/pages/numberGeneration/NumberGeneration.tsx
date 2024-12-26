// NumberGeneration.tsx
import React, { useEffect } from "react";
// import styles from "./NumberGeneration.module.scss";
import Layout from "../../components/layout/Layout";
import OptionsGrid from "./optionsGrid/OptionsGrid";
import { useLottoNumber } from "../../context/lottoNumbers";

const NumberGeneration: React.FC = () => {
  const { resetNumbers } = useLottoNumber();

  useEffect(() => {
    resetNumbers();
  }, [resetNumbers]);

  return (
    <Layout>
      <OptionsGrid />
      {/* <div className={styles.container}>
        <OptionsGrid />
      </div> */}
    </Layout>
  );
};

export default NumberGeneration;
