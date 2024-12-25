// NumberGeneration.tsx
import React from "react";
import styles from "./NumberGeneration.module.scss";
import Layout from "../../components/layout/Layout";
import OptionsGrid from "./optionsGrid/OptionsGrid";

const NumberGeneration: React.FC = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <OptionsGrid />
      </div>
    </Layout>
  );
};

export default NumberGeneration;
