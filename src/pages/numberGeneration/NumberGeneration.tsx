// NumberGeneration.tsx
import React, { useEffect } from "react";
import Layout from "../../components/layout/Layout";
import OptionsGrid from "./optionsGrid/OptionsGrid";
import { useLotto } from "../../context/lottoNumber/lottoNumberContext";
import { resetLottoNumber } from "../../context/lottoNumber/lottoNumberActions";

const NumberGeneration: React.FC = () => {
  const { dispatch } = useLotto();

  useEffect(() => {
    dispatch(resetLottoNumber());
  }, [dispatch]);

  return (
    <Layout>
      <OptionsGrid />
    </Layout>
  );
};

export default NumberGeneration;
