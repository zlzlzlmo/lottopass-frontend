import { useAppDispatch } from "@/redux/hooks";
import Layout from "../../components/layout/Layout";
import { useEffect } from "react";
import { fetchAllDraws } from "@/features/draw/drawSlice";
import { NumberActionButtons } from "./components";

const NumberGenerationPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllDraws());
  }, []);
  return (
    <Layout>
      <NumberActionButtons />
    </Layout>
  );
};

export default NumberGenerationPage;
