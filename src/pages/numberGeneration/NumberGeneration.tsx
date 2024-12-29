// NumberGeneration.tsx
import React, { useEffect } from "react";
// import styles from "./NumberGeneration.module.scss";
import Layout from "../../components/layout/Layout";
import OptionsGrid from "./optionsGrid/OptionsGrid";
import { useLottoNumber } from "../../context/lottoNumbers";
import NumberSelectPopup from "../../components/popup/NumberSelectPopup";
import PopupModal from "../../components/common/popup/PopupModal";

const NumberGeneration: React.FC = () => {
  const { dispatch } = useLottoNumber();

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [dispatch]);

  return (
    <Layout>
      <OptionsGrid />
      {/* <PopupModal onClose={() => {}} onConfirm={() => {}} /> */}
      {/* <NumberSelectPopup onClose={() => {}} onConfirm={() => {}} /> */}
      {/* <div className={styles.container}>
        <OptionsGrid />
      </div> */}
    </Layout>
  );
};

export default NumberGeneration;
