// NumberGeneration.tsx
import React, { useEffect } from "react";
import Layout from "../../components/layout/Layout";
import OptionsGrid from "./optionsGrid/OptionsGrid";
import { useLottoNumber } from "../../context/lottoNumbers";

const NumberGeneration: React.FC = () => {
  const { dispatch } = useLottoNumber();

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [dispatch]);

  return (
    <Layout>
      <OptionsGrid />
    </Layout>
  );
};

export default NumberGeneration;
